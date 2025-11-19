import React from 'react';
//import { useSelector } from 'react-redux';
import classes from './VerifyEmail.module.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

const VerifyEmailButton = () => {

    const token = useSelector(state => state.auth.token);

    const handleVerifyEmail = async () => {
        try {
            const response = await axios.post('http://localhost:3001/users/verifyemail',{},{ 
                headers: { 
                    'Authorization': token,
                    'Content-Type': 'application/json' 
                }})
            
            if (response.data.success === true) {
                alert('Verification email sent successfully. Please check your email inbox.');
            }
        } 
        catch (error) {
            console.log(error)
            alert('Email address not found.');
        }
    };

    return (
        <button className={classes.verify} onClick={handleVerifyEmail}>Verify Email</button>
    );
};

export default VerifyEmailButton;
