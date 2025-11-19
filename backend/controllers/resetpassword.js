const uuid = require('uuid');
const axios = require('axios');
const validator = require('validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        
        const { email } = req.body;

        // Validate email
        if (!email || !validator.isEmail(email.toLowerCase())) {
            return res.status(400).json({ 
                error: 'Invalid email address', 
                success: false 
            });
        }

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(404).json({ 
                message: "User doesn't exist", 
                success: false 
            });
        }

        // Create forgot password record
        const forgotpasswordid = uuid.v4();
        const forgetpasswordcreated = new Forgotpassword({ 
            id: forgotpasswordid, 
            userId: user._id, 
            active: true 
        });
        await forgetpasswordcreated.save();
        console.log('Forgot password record created:', forgetpasswordcreated);

        // Prepare email payload
        const emailPayload = {
            sender: {
                email: 'shresthikashyap7@gmail.com',
                name: 'Expensify Team'
            },
            to: [
                {
                    email: email.toLowerCase()
                }
            ],
            subject: 'Password Reset Request - Expensify',
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset the password for your account.</p>
                    <p>Click the button below to reset your password:</p>
                    <p style="margin: 30px 0;">
                        <a href="http://localhost:3001/password/resetpassword/${forgotpasswordid}" 
                           style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 4px; display: inline-block;">
                            Reset Password
                        </a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">
                        http://localhost:3001/password/resetpassword/${forgotpasswordid}
                    </p>
                    <p style="color: #666; margin-top: 30px;">
                        If you did not request this password reset, please ignore this email 
                        and contact us immediately.
                    </p>
                    <p>Thank you,<br>The Expensify Team</p>
                </div>
            `,
            textContent: 'We received a request to reset the password for your account. Click the link to reset your password.'
        };

        console.log('Sending email via Brevo API...');
        console.log('To:', email);
        console.log('API Key:', process.env.API_KEY ? 'Present' : 'Missing');

        // Make direct API call to Brevo
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            emailPayload,
            {
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.API_KEY,
                    'content-type': 'application/json'
                }
            }
        );

        console.log('✅ Email sent successfully!');
        console.log('Brevo Response:', response.data);
        
        return res.status(200).json({ 
            message: 'Password reset link has been sent to your email', 
            success: true,
            messageId: response.data.messageId
        });

    } catch(err) {
        console.error('Error occurred:');
        
        if (err.response) {
            console.error('Brevo API Error:', err.response.data);
            console.error('Status Code:', err.response.status);
            
            return res.status(err.response.status).json({ 
                message: err.response.data.message || 'Failed to send email',
                error: err.response.data,
                success: false 
            });
        } else if (err.request) {
            // Request was made but no response received
            console.error('No response from Brevo:', err.request);
            return res.status(500).json({ 
                message: 'No response from email service',
                success: false 
            });
        } else {
            // Something else happened
            console.error('Error:', err.message);
            return res.status(500).json({ 
                message: err.message || 'Failed to process password reset request', 
                success: false 
            });
        }
    }
};

const resetpassword = async(req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const forgotpasswordrequest = await Forgotpassword.findOneAndUpdate({ id: id }, { active: false });
    if (forgotpasswordrequest) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password - Expensify</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              background-color: #d4a574;
              align-items: center;
              min-height: 100vh;
              padding: 20px;
            }
            
            .header {
              font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
              font-size: 230%;
              font-weight: 800;
              color: #0e3774;
              margin: 10vh 15vh;
              text-shadow: 0 0 5px rgba(217, 222, 234, 0.112);
            }
            
            .container {
              background-color: #0a1928;
              padding: 50px 60px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 460px;
              margin: 10vh 72vh;
            }
            
            h1 {
              color: white;
              text-align: center;
              margin-bottom: 40px;
              font-size: 28px;
              font-weight: normal;
            }
            
            .form-group {
              margin-bottom: 30px;
            }
            
            label {
              display: block;
              color: white;
              margin-bottom: 10px;
              font-size: 16px;
              font-weight: 500;
            }
            
            input[type="password"] {
              width: 100%;
              padding: 12px 15px;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              background-color: white;
              outline: none;
            }
            
            input[type="password"]:focus {
              box-shadow: 0 0 0 2px #5b8dc9;
            }
            
            button {
              width: 100%;
              padding: 12px;
              background-color: #5b8dc9;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.3s;
              margin-top: 10px;
            }
            
            button:hover {
              background-color: #4a7ab8;
            }
            
            .footer-link {
              text-align: center;
              margin-top: 25px;
              color: white;
              font-size: 14px;
            }
            
            .footer-link a {
              color: #5b8dc9;
              text-decoration: none;
            }
            
            .footer-link a:hover {
              text-decoration: underline;
            }

            .success-message {
              background-color: #4CAF50;
              color: white;
              padding: 12px;
              border-radius: 4px;
              margin-bottom: 20px;
              text-align: center;
              display: none;
            }

            .error-message {
              background-color: #f44336;
              color: white;
              padding: 12px;
              border-radius: 4px;
              margin-bottom: 20px;
              text-align: center;
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="header">Expensify</div>
          
          <div class="container">
            <h1>Reset Password</h1>
            
            <div id="successMessage" class="success-message"></div>
            <div id="errorMessage" class="error-message"></div>
            
            <form id="resetForm" action="/password/updatepassword/${id}" method="get">
              <div class="form-group">
                <label for="newpassword">New Password:</label>
                <input 
                  name="newpassword" 
                  id="newpassword"
                  type="password" 
                  placeholder="Enter your new password"
                  required
                  minlength="6"
                />
              </div>
              
              <div class="form-group">
                <label for="confirmpassword">Confirm Password:</label>
                <input 
                  name="confirmpassword" 
                  id="confirmpassword"
                  type="password" 
                  placeholder="Confirm your new password"
                  required
                  minlength="6"
                />
              </div>
              
              <button type="submit">Reset Password</button>
            </form>
            
            <div class="footer-link">
              Remember your password? <a href="http://localhost:3000/">Sign In</a>
            </div>
          </div>

          <script>
            const form = document.getElementById('resetForm');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            const newPassword = document.getElementById('newpassword');
            const confirmPassword = document.getElementById('confirmpassword');

            form.addEventListener('submit', function(e) {
              e.preventDefault();
              
              // Clear previous messages
              successMessage.style.display = 'none';
              errorMessage.style.display = 'none';
              
              // Validate passwords match
              if (newPassword.value !== confirmPassword.value) {
                errorMessage.textContent = 'Passwords do not match!';
                errorMessage.style.display = 'block';
                return;
              }
              
              // Validate password length
              if (newPassword.value.length < 6) {
                errorMessage.textContent = 'Password must be at least 6 characters long!';
                errorMessage.style.display = 'block';
                return;
              }
              
              // Submit the form
              window.location.href = form.action + '?newpassword=' + encodeURIComponent(newPassword.value);
            });
          </script>
        </body>
        </html>
      `);
    } else {
      return res.status(404).json({ error: 'Password reset request not found', success: false });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error!!!', success: false });
  }
};

const updatepassword = async(req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    console.log(newpassword,resetpasswordid)
  
    await Forgotpassword.findOne({ id: resetpasswordid }).exec().then(resetpasswordrequest => {
      console.log('reset ',resetpasswordrequest)
      const userId = resetpasswordrequest.userId;
      User.findOne({ _id: userId }).exec().then(user => {
        if (user) {
          // encrypt the password
          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) {
              throw new Error(err);
            }
            bcrypt.hash(newpassword, salt, function(err, hash) {
              if (err) {
                throw new Error(err);
              }
              user.password = hash; // Update the user's password field
              user.save().then(() => {
                res.status(201).json({ message: 'Successfully updated the new password' });
              });
            });
          });
        } else {
          return res.status(404).json({ error: 'No user exists', success: false });
        }
      });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', success: false });
  }
}

module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}