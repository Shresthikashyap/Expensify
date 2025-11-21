import React, { useRef } from 'react';
import classes from './SignUp.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordRef = useRef();
    const navigate = useNavigate();

    const switchAuthModeHandler = () =>{
        navigate('/');
    }

    const onSubmitFormHandler = async(event) => {
        event.preventDefault();
        try{        
            const enteredEmail = emailInputRef.current ? emailInputRef.current.value : '';
            const enteredPassword = passwordInputRef.current ? passwordInputRef.current.value : ''; 
            const confirmPassword = confirmPasswordRef.current ? confirmPasswordRef.current.value : '';   
            
            if (!enteredEmail.endsWith('@gmail.com')) {
                alert('Only @gmail.com emails are allowed');
            }

            if(enteredPassword === confirmPassword){

                const userObj ={
                    email : enteredEmail,
                    password : enteredPassword
                }

                let response = await axios.post("https://expensify-j424.onrender.com/users/signup",userObj);
                console.log(response.data.token)
                if(response.data.token){
                    alert('You successfully signed in')
                }
                
                emailInputRef.current.value = '';
                passwordInputRef.current.value = ''; 
                confirmPasswordRef.current.value = ''; 
            }else{
                alert('Check your password')
            }
        }
        catch(error){
            console.log(error);
            alert (error.response.data.error)
        }
    }

    return(
        
        <section className={classes.container}>
            <h1>Sign Up</h1>
            <form onSubmit={onSubmitFormHandler}>
                <div className={classes.control}>
                    <label>Email:</label>
                    <input type="email" ref={emailInputRef}/>
                </div>

                <div className={classes.control}>
                    <label>Password:</label>
                    <input type="password" ref={passwordInputRef}/>
                </div>

                <div className={classes.control}>
                    <label>Confirm Password:</label>
                    <input type="password" ref={confirmPasswordRef}/>
                </div>                

                <div className={classes.action}>
                    <button className={classes.signUpButton}>Create new account</button>
                </div>

                <div className={classes.actions}>
                    <span onClick={switchAuthModeHandler} className={classes.toggle}>
                        Login with existing account
                    </span>
                </div>
            </form>
        </section>
    )
}

export default SignUp;
