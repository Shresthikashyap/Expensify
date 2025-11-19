import React, { useEffect, useRef, useState } from 'react';
import classes from './CompleteAuthForm.module.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/AuthSlice';
import { useSelector } from 'react-redux';
import Card from '../UI/Card';

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
}

const CompleteAuthForm = () => {

    const idToken = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    console.log('idToken in complete profile form',idToken);
    
    const defaultPic = '/default_image.png';
    
    // Initialize photoUrl based on token immediately
    const getInitialPhotoUrl = () => {
        if (idToken) {
            const user = parseJwt(idToken);
            return user.photo || defaultPic;
        }
        return defaultPic;
    };
    
    const [photoUrl, setPhotoUrl] = useState(getInitialPhotoUrl());
    
    const fullnameInputRef = useRef();
    const photoInputRef = useRef();
    
    // Get user data for form defaults
    let user = '';
    if(idToken){
        user = parseJwt(idToken);
    }

    // Update photo when idToken changes
    useEffect(() => {
        if (idToken) {
            const user = parseJwt(idToken);
            setPhotoUrl(user.photo || defaultPic);
        } else {
            setPhotoUrl(defaultPic);
        }
    }, [idToken]);

    const onSubmitFormHandler = async(event) => {
        event.preventDefault();
        try {
            const enteredFullname = fullnameInputRef.current ? fullnameInputRef.current.value : '';
            const enteredPhoto = photoInputRef.current ? photoInputRef.current.files[0] : null;

            console.log(enteredFullname,enteredPhoto);
            const formData = new FormData();
            formData.append('photo', enteredPhoto);
            formData.append('name', enteredFullname);

            const response = await axios.post('http://localhost:3001/users/update-user', formData, {
                headers: {
                    'Authorization': idToken,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            const token = response.data.token;
            dispatch(loginSuccess({ token }));
            alert('you successfully updated your profile');
        } catch (err) {
            console.log(err);
            alert('Something went wrong');
        }
    }

    // Function to handle photo input change
    const handlePhotoInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            console.log('image url**********',imageUrl);
            setPhotoUrl(imageUrl);
        }
    }

    return(
        <Card>
        <section className={classes.auth}>
            <div className={classes.header}>
            <h1>Update Profile</h1>
            </div>
            <form onSubmit={onSubmitFormHandler}>
             
                <div className={classes.control}>
                    <label htmlFor="photo">Profile Photo:</label>
                    <img src={photoUrl} alt="Profile" className={classes.profileImage} />
                    <input type="file" id="photo" ref={photoInputRef} accept="image/*" onChange={handlePhotoInputChange} />
                </div>

                <div className={classes.control}>
                    <label htmlFor="fullname">FullName</label>
                    <input type="text" id="fullname" ref={fullnameInputRef} defaultValue={user.name ? user.name : ''} />
                </div>

                <div className={classes.actions}>
                    <button type='submit' className={classes.toggle}>
                        Complete Profile
                    </button>
                </div>
            
            </form>
        </section>
        </Card>
    )
}

export default CompleteAuthForm;