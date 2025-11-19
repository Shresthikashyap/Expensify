import { useSelector, useDispatch } from 'react-redux';
//import { toggleTheme } from '../../store/ThemeSlice';
import axios from 'axios';
import useRazorpay from "react-razorpay";
import { activatePremium } from '../../store/PremiumSlice';
//import { useNavigate } from 'react-router-dom';
import classes from './Premium.module.css'

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
}


const Premium = () => {
    const isPremium = useSelector(state =>state.premium.isPremium);
    // const total = useSelector(state => state.expenses.total);
    // const isDarkTheme = useSelector(state => state.theme.isDarkTheme);
    const token = useSelector(state=>state.auth.token);
    const decodedToken = token ? parseJwt(token) : null;
    
    //const navigate = useNavigate();
    const dispatch = useDispatch();
    const [Razorpay] = useRazorpay();

    // const toggleThemeHandler = () => {
    //     dispatch(toggleTheme());
    // };

    const handleDownload = async () => {
        try {
            
            const response = await axios.get('http://localhost:3001/user/download', { 
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                } })
           
            if(response.status === 200){
                alert('You successfully downloaded the file');
            }
                
            // if(response.status === 201){
            //         //the backend is essentially sending a download link
            //         //  which if we open in browser, the file would download
            //     var a = document.createElement("a");
            //     a.href = response.data.fileUrl;
            //     a.download = 'myexpense.csv';
            //     a.click();
            // } 
            else {
                alert(response.data.message)
                throw new Error(response.data.message)
            }
        } catch (error) {
            alert(error)
            console.error('Error downloading expenses:', error);
        }
    };

    const handleActivatePremium = async() => {
        try {
            console.log('here')
            const response = await axios.get('http://localhost:3001/purchase/premium-membership',{ 
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                } });
            
            console.log('response data key ',response);
            console.log('response order id ',response.data.order.id);
            var options={
            "name": "Expensify Pvt Ltd",
            "key" : response.data.key_id,
            "order_id" :response.data.order.id,
            "handler" : async function(response){
                
            const res =  await axios.post('http://localhost:3001/purchase/update-transactionstatus',{
                    order_id : options.order_id,
                    payment_id : response.razorpay_payment_id,
                },{ 
                    headers: {
                        "Authorization":token,
                        'Content-Type': 'application/json'
                }});
                console.log(res.data);
                if(res.data.success===true){
                    alert('You are a Premium User');
                    dispatch(activatePremium());
                }
                // navigate('/leaderboard')
            },    
            "prefill": {
                "email": decodedToken ? decodedToken.email : '', 
                "contact": decodedToken ? decodedToken.phone : ''  
            },
            }

            const rzp1 = new Razorpay(options);
            rzp1.open();
            
        } catch (error) {
            console.error('Error activating premium membership:', error);
            alert('Failed to activate premium membership. Please try again later.');
        }
    };

    return (
        <div className={classes.premium}>
            {!isPremium &&
            <>
                <div className={classes.premiumPrompt}>
                    <div className={classes.premiumContent}>
                        <h2>Premium Feature</h2>
                        <p>Access the leaderboard and see how you compare with other users!</p>
                        <button
                            className={classes.premiumButton}
                            onClick={handleActivatePremium}
                        >
                            Upgrade to Premium
                        </button>
                    </div>
                </div>
                 {/* <h5>Would you like to activate the premium</h5>
                 <button onClick={handleActivatePremium}> Activate Premium </button> */}
            </>}
            {isPremium && 
                <button 
                className={classes.premiumButton}
                onClick={handleDownload}>
                    Download Expenses
                </button>      
            }
        </div>
    );
};

export default Premium;
