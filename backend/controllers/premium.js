const User = require('../models/user')

const leaderBoard = async(req,res) => {
      console.log('here---------')
      const page = parseInt(req.query.page)|| 1; // Get page number from query params, default to 1
      const limit = parseInt(req.query.limit)|| parseInt(req.query.pageSize); // Get limit from query params, default to 10
      const offset = (page - 1) * limit; // Calculate offset based on page and limit

    try{
     
      const leaderboardofuser = await User.find({})
      //.select('email totalExpense')
      .select('name email isPremium totalExpense')
      .sort({ totalExpense: -1 }) //users will be sorted in descending order
      .skip(offset) 
      .limit(limit);

      console.log('leaderboard ******',leaderboardofuser)
      const totalExpenseSum  = await User.aggregate([
        { $group: { _id: null, totalExpenseSum: { $sum: '$totalExpense' } }}
      ])

      console.log('total  ',totalExpenseSum)

      //   attributes: [
      //     '_id',
      //     'name','email','isPremium', 'totalExpense',
      //     [sequelize.literal('(SELECT SUM(totalExpense) FROM users)'), 'totalExpenseSum']],

      //   order:[['totalExpense','DESC']],
      //   limit,
      //   offset
        
      // }); 
      const totalUser = await User.countDocuments({});
      console.log('************** total user ',totalUser)

      res.status(200).json({leaderboardofuser, totalExpenseSum, totalUser, success: true});
    }
    catch(err){

      console.log(err);
      res.status(500).json({error:err});
    }
  }

  
  module.exports = {
    leaderBoard
  }