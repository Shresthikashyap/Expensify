const User = require('../models/user')
const Expense = require('../models/Expense');
const downloadedFile = require('../models/downloadedFile');
//const S3Service = require('../services/S3services');
const { uploadToCloudinary } = require('../services/CloudinaryService');
//const UserServices = require('../services/userservices')


/************   Add Expense   **********/
const addExpense = async(req, res) => {
   
  try {
    console.log('here')
    console.log(req.body)
    const {amount, description, category } = req.body;

    if(amount == undefined || amount.length === 0){
       return res.status(400).json({success:false, message:'parameter missing'})
    }
   
    console.log(req.user);
    let expense = new Expense({ amount: amount, description: description, category: category, userId: req.user._id});
    expense.save();

    const total = Number(req.user.totalExpense) + Number(amount);    console.log(total);
    
    await User.findOneAndUpdate({_id: req.user._id},{totalExpense: total});

    res.status(201).json({ expense, total, success:true });
  } 
  catch (err) { 
    console.log(err);
    res.status(500).json({ error: err });
  }
};

/**************  get all expenses of database  *************/
const getExpenses = async(req, res) => {
  
    try {
    console.log('***** ',req.user._id) //id or _id
    const expenses = await Expense.find({ userId: req.user._id });
    //console.log(expenses) 
    
    const user = await User.findOne({_id: req.user._id});
    console.log('total  ',user)

    res.status(200).send({ expenses, total:user.totalExpense, success: true });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

/******************   download expenses **********************/
const downloadExpenses = async(req,res) => {
  try{
    
    console.log('****************',req.user._id)
    //const expenses = await UserServices.getExpenses(req);
    const expenses = await Expense.find({userId:req.user._id})
     
    console.log('****************',expenses)
    const stringifiedExpenses = JSON.stringify(expenses);
console.log('**************** stringify',stringifiedExpenses)
    const userId = req.user._id;
console.log('****************',userId)
    const fileName = `Expense${userId}/${new Date()}.txt`;   
    const mimetype = 'txt';
    console.log("File Name:", mimetype);

    // Upload to Cloudinary
    const fileUrl = await uploadToCloudinary(stringifiedExpenses, fileName, mimetype);

    console.log("Cloudinary File URL:", fileUrl);

    // const fileUrl = await S3Service.uploadToS3(stringifiedExpenses, fileName);
    
    const file = new downloadedFile({ url: fileUrl, userId: userId});
    file.save();

    res.status(200).json({fileUrl, success: true});
  }
  catch(err){
    res.status(500).json({fileUrl:'',success:false,err:err})
  } 
}

/************Update expense *************/
const updateExpense = async(req,res) =>{
  
  try {

    let userId = req.params.id;
    if (userId == 'undefined'){
      return res.status(400).json({ err: 'Id is missing' });
    }

    const expense = await Expense.findById(userId);
    console.log('expense id ',expense._id);
    const {amount, description, category } = req.body; 
    console.log('body*************', req.body)
    
    const updatedTotal = Number(req.user.totalExpense) - Number(expense.amount);
    const total = Number(updatedTotal) + Number(amount);
    if(total<0){
      await User.findOneAndUpdate({_id: req.user._id},{totalExpense:0});
    }else{
      await User.findOneAndUpdate({_id: req.user._id},{totalExpense:total});
    }

    const updatedExpenseDetail = await Expense.findOneAndUpdate({_id: expense._id},{ amount:amount, description:description, category:category},{ new: true }); 

    console.log('****************** update ',updatedExpenseDetail)
    res.status(201).json({ expense : updatedExpenseDetail,total: total});

  } catch (err) {
    res.status(500).json({ error: err });
  }
}

/***************     delete the expenses  ******************/
const deleteExpense = async(req, res) => {

  try {
   
    const expenseId = req.params.id;
    //const {cost} = req.body; 
   console.log('******** ',expenseId)
    if (expenseId=='undefined') {
      console.log('ID is missing');
      return res.status(400).json({ err: 'Id is missing' });
    }

    const expense = await Expense.findById(expenseId);
    console.log('***********',expense.amount);
   
    if (!expense) {  
      return res.status(404).json({ err: 'Expense not found' });  
    }  
    
    const deletedExpense = await Expense.deleteOne({_id: expenseId});
    console.log(deletedExpense);
    
    const totalExpense = Number(req.user.totalExpense) - Number(expense.amount);
    
    if(totalExpense<0){
      await User.findOneAndUpdate({_id: req.user._id},{totalExpense:0});
    }else{
      await User.findOneAndUpdate({_id: req.user._id},{totalExpense:totalExpense});
    }

    res.status(200).json({total:totalExpense, success:true });
  } 
  catch (err) {
  
    res.status(500).json({ error: err });
  }
};

const deleteExpensesBulk = async (req, res) => {
  debugger;
  try {
    const { expenseIds } = req.body;
    console.log('Bulk delete IDs:', expenseIds);

    if (!expenseIds || !Array.isArray(expenseIds) || expenseIds.length === 0) {
      return res.status(400).json({ err: 'Expense IDs array is required' });
    }

    // Find all expenses to calculate total amount to subtract
    const expenses = await Expense.find({
      _id: { $in: expenseIds },
      userId: req.user._id
    });

    if (expenses.length === 0) {
      return res.status(404).json({ err: 'No expenses found' });
    }

    // Calculate total amount to subtract
    const totalAmountToSubtract = expenses.reduce((sum, expense) => {
      return sum + Number(expense.amount);
    }, 0);

    // Delete all expenses
    const deleteResult = await Expense.deleteMany({
      _id: { $in: expenseIds },
      userId: req.user._id
    });

    console.log(`Deleted ${deleteResult.deletedCount} expenses`);

    // Update user's total expense
    const newTotalExpense = Math.max(0, Number(req.user.totalExpense) - totalAmountToSubtract);
    
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { totalExpense: newTotalExpense }
    );

    res.status(200).json({
      total: newTotalExpense,
      deletedCount: deleteResult.deletedCount,
      success: true
    });
  } catch (err) {
    console.error('Error in bulk delete:', err);
    res.status(500).json({ error: err.message });
  }
};


module.exports={
  addExpense, getExpenses, downloadExpenses, updateExpense, deleteExpense, deleteExpensesBulk
}