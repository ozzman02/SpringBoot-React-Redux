import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import productService from "../../services/product-service";
import Purchase from '../../models/purchase';
import purchaseService from "../../services/purchase-service";
import './home-page.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {

    const [productList, setProductList] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');

    const [infoMessage, setInfoMessage] = useState('');

    const currentUser = useSelector(state => state.user);

    useEffect(() => {
        productService.getAllProducts().then((response) => {
            setProductList(response.data);
        }).catch((error) => {
           console.log(error); 
        });
    }, []);

    const purchase = (product) => {
        if (!currentUser?.id) {
            setErrorMessage('You should login to buy a product.');
            return;
        }
        const purchase = new Purchase(currentUser.id, product.id, product.price);
        purchaseService.savePurchase(purchase).then(() => {
            setInfoMessage('Purchase is completed.');
        }).catch(error => {
            setErrorMessage('Unexpected error occurred.');
            console.log(error);
        });
    }

    return (
        <div className="container p-3">
            { errorMessage && <div className="alert alert-danger">{errorMessage}</div> }
            { infoMessage && <div className="alert alert-success">{infoMessage}</div> }
            <div className="d-flex flex-wrap">
                {
                    productList.map((item, index) => 
                        <div key={item.id} className="card m-3 home-card">
                            <div className="card-body">
                                <div className="card-title text-uppercase">{item.name}</div>
                                <div className="card-subtitle text-muted">{item.description}</div>
                            </div>
                            <FontAwesomeIcon icon={faCartPlus} className="ms-auto me-auto product-icon" />
                            <div className="row mt p-3">
                                <div className="col-6 mt-2 ps-4">
                                    {`$ ${item.price}`}
                                </div>
                                <div className="col-6">
                                    <button className="btn btn-outline-success w-100" onClick={() => purchase(item)}>Buy</button>
                                </div>
                            </div>  
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export { HomePage };