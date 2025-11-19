const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const multer = require('multer')
//const morgan = require('morgan');
//const helmet = require('helmet')

//const errorController = require('./controllers/error');

const userRoutes = require('./routes/user');
const premiumUser = require('./routes/premium');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase'); 
const resetPasswordRoutes =  require('./routes/resetpassword');
const downloadRoutes = require('./routes/expense');
const allDownloadedFiles = require('./routes/allDownloads');

const app = express();
const upload = multer();
require('dotenv').config({ path: './.env' });
// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname,'access.log'),
//     {flag : 'a'}
// )

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({ origin: '*' })); 
//app.use(helmet());
app.use(compression());
//app.use(morgan('combined',{stream : accessLogStream}));
// app.use(express.static('public', { 
//     dotfiles: 'ignore', 
//     index: false,
//     extensions: ['html', 'htm'] 
//   }));
console.log('here ****')

app.use('/expense',expenseRoutes);
app.use('/users',upload.fields([{ name: 'photo' }, { name: 'name' }]),userRoutes);
app.use('/user',expenseRoutes)
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumUser);
app.use('/password',resetPasswordRoutes);
app.use('/download',downloadRoutes);
app.use('/downloadedFiles',allDownloadedFiles);

//app.use('/*', errorController.get404);

app.use((req,res) => {
    console.log('Request url ',req.url);
    console.log('request is successful')
    //res.sendFile(path.join(_dirname,`public/${req.url}`));
})

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log('here')
    app.listen(port,()=>{
        console.log('server is listening',port);
    })
})
.catch(err=>{
    console.log(err);
})
