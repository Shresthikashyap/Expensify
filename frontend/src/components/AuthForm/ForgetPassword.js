import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './ForgetPassword.module.css';
import axios from 'axios';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError(null);
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/password/forgotpassword',{email});
            console.log(response)
            navigate('/');

        } catch (error) {
            setIsLoading(false);
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className={classes.container}>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.formGroup}>
                    <label htmlFor="email">Email Address:</label>
                    <input type="email" id="email" value={email} onChange={handleInputChange} required/>
                </div>
                <button type="submit" className={classes.submitBtn} disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className={classes.actions}>
                    <p>Go back to signUp <a href="/signup">Create new account</a></p>
                </div>
            </form>
            {error && <p className={classes.errorMsg}>{error}</p>}
        </div>
    );
};

export default ForgetPassword;
