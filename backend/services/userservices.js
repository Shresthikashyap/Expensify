const getExpenses=(req,where)=>{
    console.log('here***********')
    return req.user.getExpenses({where})
}

module.exports={
    getExpenses

}