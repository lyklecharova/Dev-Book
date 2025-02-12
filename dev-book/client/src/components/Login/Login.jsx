import { useState, useContext } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { EMAIL_PATERN } from '../../constants/constants';
import { AuthContext } from '../../contexts/authContext';
import * as userService from '../../../service/userService';
import style from './Login.module.css';

export const Login = () => {
    const { isLog, isAuthenticated } = useContext(AuthContext);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [changePassword, setChangePassword] = useState(true);
    const navigate = useNavigate();

    if (isLog) {
        //  navigate('/');
        return <Navigate to="/" />
    }

    const [login, setLogin] = useState({
        email: '',
        password: ''
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setLogin((prevLogin) => ({
            ...prevLogin,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setChangePassword(!changePassword);
    };
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Checking if the email and password fields are empty
        if (login.email.trim() === "" || login.password.trim() === "") {
            // Setting an error message if either field is empty
            setErrorMessage('Please fill in all fields.');
            return;
        }

        // Email validation using regular expression
        if (!EMAIL_PATERN.test(login.email)) {
            setErrorMessage('Invalid email format');
            return;
        }

        try {
            const loginInformation = await userService.login(login);
            // Assuming loginInformation indicates successful login
            if (loginInformation) {
                localStorage.setItem("UserInfo", JSON.stringify(loginInformation));
                // Update authentication state
                isAuthenticated(loginInformation);
                console.log("Login successful:", loginInformation);
                // Redirect to homepage after successful login
                navigate('/');
            } else {
                // If loginInformation is null or false, indicating unsuccessful login
                setError(true);
                setErrorMessage('Invalid email or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(true);
            setErrorMessage('Login failed. Please try again.');
        }
    };

    return (
        <div className={style['login-container']}>
            <form onSubmit={onSubmitHandler} method="post" className={style['login-form']}>
                <h1 className={style['login-heading']}>Login</h1>
                <div className={style['form-group']}>
                    <label className={style['form-label']} htmlFor="email">
                        Email:
                    </label>
                    <input
                        className={style['form-input']}
                        type="email"
                        id="email"
                        name="email"
                        onChange={onChangeHandler}
                        value={login.email}
                        required={true}
                        autoComplete="email"
                        placeholder="Email..."
                    />
                </div>

                <div className={style['form-group']}>
                    <label className={style['form-label']} htmlFor="password">
                        Password:
                    </label>
                    <input
                        className={style['form-input']}
                        type={changePassword ? "password" : "text"}
                        id="password"
                        onChange={onChangeHandler}
                        name="password"
                        value={login.password}
                        placeholder="Password..."
                        required={true}
                        autoComplete="password"
                    />
                    <span
                        className={style['password-toggle']}
                        onClick={togglePasswordVisibility}
                    >
                        <FontAwesomeIcon icon={changePassword ? faEye : faEyeSlash} />
                    </span>
                </div>
                {error && <p className={style['error']}>Invalid email or password</p>}

                <input type="submit" defaultValue="Login" className={style['form-button']} />

                <div>
                    Do not have an account?
                    <br />
                    <p className={style['register-link']}>
                        <NavLink to="/register">Register now!</NavLink>
                    </p>
                </div>
            </form>
        </div>
    );
};
