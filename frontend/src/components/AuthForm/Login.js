import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFail } from '../../store/AuthSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './Login.module.css';
import { activatePremium } from '../../store/PremiumSlice';

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
}

const Login = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmitFormHandler = async (event) => {
        event.preventDefault();
        try {
        
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        setIsLoading(true);
        setError(null);

        if(enteredEmail !== null && enteredPassword !== null){
            const response = await axios.post("http://localhost:3001/users/login", {
                email: enteredEmail,
                password: enteredPassword
            }); 

            const token = response.data.token;
            //localStorage.setItem('token', token);
            const decodedToken = parseJwt(token);

            if (decodedToken.isPremium) {
                dispatch(activatePremium());
            }

            dispatch(loginSuccess({ token }));
            navigate('/home');
        }
        } catch (error) {
            setError(error.response.data.error || 'Something went wrong');
            dispatch(loginFail({ error: error.response.data.error }));
            //navigate('/')
        } finally {
            setIsLoading(false);
        }
    }

    const forgetPasswordHandler = () => {
        navigate('/forgetpassword');
    }

    return (
        <section className={classes.container}>

            <h1>Login</h1>
            <form onSubmit={onSubmitFormHandler}>
                <div className={classes.input_group}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" ref={emailInputRef} required />
                </div>
                <div className={classes.input_group}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" ref={passwordInputRef} required />
                </div>
                <div className={classes.actions}>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login with existing account'}
                    </button>
                </div>
            </form>
            {error && <p className={classes.error}>{error}</p>}
            <div className={classes.forgot_password}>
                {/* <button type="button" onClick={forgetPasswordHandler}>Forget Password?</button> */}
                <a href='/forgetpassword'>Forget Password?</a>
            </div>
            <div className={classes.actions}>
                <p>Don't have an account? <a href="/signup">Create new account</a></p>
            </div>
        </section>
    )
}

export default Login;
