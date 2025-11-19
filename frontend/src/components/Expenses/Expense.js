import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Premium from "../Premium/Premium";
import classes from './Expense.module.css';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList'
import { setExpenses, setTotal, addExpense, deleteExpense, updateExpense } from '../../store/ExpenseSlice';
import Card from '../UI/Card';

const Expense = () => {
  const [editedExpense,setEditedExpense] = useState({});
  const dispatch = useDispatch();
  const expenses = useSelector(state => state.expenses.expenses);
  const token = useSelector(state => state.auth.token);
  const [expenseForm,setExpenseForm] = useState(false);
  const Total = useSelector(state => state.expenses.total);
  const isPremium = useSelector(state => state.premium.isPremium);
  const navigate = useNavigate();

  const handlePremiumNavigation = () => {
      if (!isPremium) {
        navigate('/premium');
      }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        console.log('*******************',token)
        const response = await axios.get('http://localhost:3001/expense/get-expenses', {                 
          headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
      } });
        console.log('total ',response.data)
        dispatch(setExpenses(response.data.expenses));
        dispatch(setTotal(response.data.total));
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [token, dispatch]);

  const deleteExpenseHandler = async id => {
    try {
      const response = await axios.delete(`http://localhost:3001/expense/delete-expense/${id.toString()}`, { 
        headers: { 
          'Authorization': token,
          'Content-Type': 'application/json' } });
      dispatch(deleteExpense(id));
      dispatch(setTotal(response.data.total))
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

 const deleteAllExpenseHandler = async (ids) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/expense/delete-expenses-bulk',
        { expenseIds: Array.from(ids) },
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Bulk delete response:', response.data);
      
      // Remove all deleted expenses from Redux store
      ids.forEach(id => dispatch(deleteExpense(id)));
      dispatch(setTotal(response.data.total));
      
    } catch (error) {
      console.error('Error deleting expenses:', error);
      alert('Failed to delete expenses. Please try again.');
    }
  };

  const handleEdit = id => {
    try {
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id)
      );

      const editExpense = expenses.find((expense) => expense._id === id);
      console.log(editExpense)
      const total = expenses
      .filter(expense => expense._id !== id)
      .reduce((total, expense) => total + expense.amount, 0);
      console.log(total)
      dispatch(setTotal(total))

      setEditedExpense(editExpense);
      setExpenseForm(true); // Open modal when editing
    } catch (error) {
      console.error("Error editing expense:", error);
    }
  };

  const handleSubmitExpense = async (expense) => {
    try {
      let response = null;
      if (Object.keys(editedExpense).length !== 0) {
        response = await axios.post(`http://localhost:3001/expense/update-expense/${editedExpense._id}`, expense, { 
          headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
          } });
        dispatch(updateExpense({ id: editedExpense._id, updatedExpense: response.data.expense }));
      } else {
        response = await axios.post('http://localhost:3001/expense/add-expense', expense, { 
          headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
          } });
        dispatch(addExpense(response.data.expense));
      }
      dispatch(setTotal(response.data.total));
      console.log('Expense added successfully:', response.data.expense);
      setExpenseForm(false); // Close modal after submit
      setEditedExpense({}); // Reset edited expense
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const closeModal = () => {
    setExpenseForm(false);
    setEditedExpense({});
  };

  return (
    <Card>
      <section className={classes.form_box}>
        <div className={classes.header}>
          <div className={classes.heading}>Expenses</div>
          <div className={classes.header_buttons}>
            <div className={classes.header_section}>
              {(Total >= 1000 && !isPremium) && (
                <button className={classes.premium_btn} onClick={handlePremiumNavigation}>
                  Buy Premium
                </button>
              )}
              {isPremium && <Premium/>}
            </div>
            <div
              className={classes.button}
              onClick={() => setExpenseForm(true)}
            >
              Add Expenses
            </div>
          </div>
        </div>
        
        {expenseForm && (
          <div className={classes.modal_overlay} onClick={closeModal}>
            <div className={classes.modal_content} onClick={(e) => e.stopPropagation()}>
              <div className={classes.modal_header}>
                <h2>{Object.keys(editedExpense).length !== 0 ? 'Edit Expense' : 'Add New Expense'}</h2>
                <button className={classes.close_btn} onClick={closeModal}>&times;</button>
              </div>
              <ExpenseForm onSubmit={handleSubmitExpense} editedExpense={editedExpense} />
            </div>
          </div>
        )}
        
        <ExpenseList expenses={expenses} onDelete={deleteExpenseHandler} onDeleteAll={deleteAllExpenseHandler} onEdit={handleEdit} />
      </section>
    </Card>
  );
};

export default Expense;