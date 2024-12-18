/* eslint-disable react-hooks/exhaustive-deps */
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import User from '../../models/user.js';
import authenticationService from '../../services/authentication-service';
import { setCurrentUser } from "../../store/actions/user-actions.js";

const LoginPage = () => {

    const [user, setUser] = useState(new User('', '', ''));

    const [loading, setLoading] = useState(false);
    
    const [submitted, setSubmitted] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const currentUser = useSelector(state => state.user);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    /* Invoke only once since array of deps is empty */
    useEffect(() => {
        if (currentUser?.id) {
            navigate('profile');
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevState) => {
            return {
                ...prevState,
                [name]: value
            };
        });
    };

    const handleLogin = (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!user.username || !user.password) {
            return; 
        }
        setLoading(true);
        authenticationService.login(user).then((response) => {
            dispatch(setCurrentUser(response.data));
            navigate('/profile');
        }).catch((error)=> {
            console.log(error);
            setErrorMessage('Username or password is not valid.');
            setLoading(false);
        });
    };

    return (
        <div className="container mt-5">
            <div className="card ms-auto me-auto p-3 shadow-lg custom-card">
                <FontAwesomeIcon icon={faUserCircle} className="ms-auto me-auto user-icon" />
                { errorMessage && <div className="alert alert-danger">{errorMessage}</div> }
                <form 
                    onSubmit={handleLogin} 
                    noValidate 
                    className={submitted ? 'was-validated' : ''}
                >
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input 
                            type="text" 
                            name="username" 
                            className="form-control"
                            placeholder="username"
                            value={user.username}
                            onChange={handleChange}
                            required
                        />
                        <div className="invalid-feedback">Username is required</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control"
                            placeholder="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="invalid-feedback">Password is required</div>
                    </div>
                    <button className="btn btn-info w-100 mt-3" disabled={loading}>Log In</button>
                </form>
                <Link to="/register" className="btn btn-link" style={{ color: 'darkgray' }}>Create new account!</Link>
            </div>
        </div>
    );
}

export { LoginPage };

