const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { uploadToCloudinary } = require('../services/CloudinaryService');
// const S3Service = require('../services/S3services')
const Sib = require('sib-api-v3-sdk');
const validator = require('validator');

const addUser = async(req, res) => {

  try{
      console.log(req.body);

      const { email, password }= req.body;

      if (!email.endsWith('@gmail.com')) {
        return res.status(400).json({ error: 'Only @gmail.com emails are allowed' });
      }

      const user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({ error: 'Email already exists' });
      }  

      if(email!==undefined && password !== undefined){

        const hashedPassword = await bcrypt.hash(password, 10); 
      
      const newUser = new User({email: email, password: hashedPassword});
      newUser.save();

      const user = {_id: newUser._id.toString(),name:'', email: email,photo:'', password: hashedPassword}
      
      console.log(user);
      const payload = user;
      const token = jwt.sign(payload,process.env.TOKEN_SECRET)
      
      res.status(201).send({ token: token });      
      }

  }
  catch(err){
    res.status(500).json({ error: 'Something went wrong' });  
  }
}

const getLogin = async(req, res) =>{

    try{
    
    const { email, password } = req.body;
   
    if (email=='undefined' || password == 'undefined') {
      console.log('user is missing');
      return res.status(400).json({ error: 'User not found' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }  
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('password ',passwordMatch)
    if(!passwordMatch){
      return res.status(401).json({error: 'User not authorized'});
    }
    
    // Making our payload
    const loggedUser = {
      _id: user._id.toString(), name: user.name?user.name:'', email: user.email,
      password: user.password, photo: user.photo, isPremium: user.isPremium, totalExpense: user.totalExpense,
    };

    const payload = loggedUser;
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);

    const oldUser = User.findOne({email: email});
    const total = oldUser.totalExpense;
    
    res.status(200).send({ token: token,total: total});
     
    }
    catch (err) {
    
    res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateUser = async (req, res) => {
  try {
    // Assuming req.user.id is available
    console.log(req.user.id);

    console.log('update ********** ', req.files.photo[0].buffer);
    console.log('filename ********** ', req.files.photo[0]);
    console.log('update ********** ', req.body.name);

    const photoBuffer = req.files.photo[0].buffer; // Access the photo file buffer
    const name = req.body.name;
    const fileName = req.files.photo[0].originalname;
    const mimetype = req.files.photo[0].mimetype;
    
    const fileUrl = await uploadToCloudinary(photoBuffer, fileName, mimetype);
    // const fileUrl = await S3Service.uploadToS3(photoBuffer, fileName);
    console.log('file url ', fileUrl)
    const user = await User.findOne({ _id: req.user.id }); // Find user by their ID
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user's information
    user.name = name;
    user.photo = fileUrl;
    await user.save();

    
    // Making our payload
    const loggedUser = {
      _id: user._id.toString(), name: user.name, email: user.email, password: user.password, 
      photo: fileUrl,isPremium: user.isPremium, totalExpense: user.totalExpense,
    };

    const payload = loggedUser;
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);

    res.status(200).send({ token,fileUrl:fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyUser = async(req,res) => {
  try {
          
    console.log('id',req.user.id)
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;
    const transEmailApi = new Sib.TransactionalEmailsApi();
 
    const user = await User.findOne({ _id:req.user.id })
    
    if(user){  
        const email = user.email;
      
        if (!validator.isEmail(email.toLowerCase())) {
                return res.status(400).json({ error: 'Invalid email address' });
        }
        
        const sender = {email:'anjaliradcliffe7@gmail.com'};
        const receiver = [{ email }];
        console.log('id',req.user.id)
        const msg = {
            sender,
            to: receiver,
            subject: 'Email verification',
            textContent: 'We received a request to verify your email. Dear customer your email has been verified.',
        }

        await transEmailApi.sendTransacEmail(msg)
        .then((response) => {
            console.log('response ',response)
            return res.status(200).json({ message: 'Link to reset password sent to your mail', success: true });
            //return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true});
        })
        .catch((error) => {
            throw new Error(error);
        })

    }else {
        throw new Error(`User doesn't exist`)
    }
} catch(err){
    //console.error(err)
    return res.json({ message: err, success: false });
}
}

module.exports={
  addUser,getLogin,
  updateUser, verifyUser
}