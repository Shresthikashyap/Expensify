import React, { useRef } from "react";
import classes from "./ExpenseForm.module.css";

const ExpenseForm = ({ onSubmit, editedExpense }) => {
  debugger;
  const amountInputRef = useRef();
  const descriptionInputRef = useRef();
  const categoryInputRef = useRef();

  console.log('edited ', editedExpense);

  const handleSubmit = (event) => {
    event.preventDefault();

    const expense = {
      amount: amountInputRef.current.value,
      description: descriptionInputRef.current.value,
      category: categoryInputRef.current.value,
    };
    
    onSubmit(expense);

    // Clear input fields after adding expense
    amountInputRef.current.value = "";
    descriptionInputRef.current.value = "";
    categoryInputRef.current.value = "";
  };

  return (
    <section className={classes.formbox}>
      <form onSubmit={handleSubmit}>
        <div className={classes.formGrid}>
          <div className={classes.formGroup}>
            <label htmlFor="amount">Amount</label>
            <input 
              type="number" 
              id="amount"
              ref={amountInputRef} 
              defaultValue={editedExpense !== undefined ? editedExpense.amount : ''}
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="category">Category</label>
            <select 
              name="category" 
              id="category" 
              ref={categoryInputRef}
              defaultValue={editedExpense !== undefined ? editedExpense.category : ''}
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="food">Food</option>
              <option value="petrol">Petrol</option>
              <option value="salary">Salary</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea 
              row={2}
              id="description"
              ref={descriptionInputRef} 
              defaultValue={editedExpense !== undefined ? editedExpense.description : ''}
              required
            />
          </div>
        </div>

        <div className={classes.buttonContainer}>
          <button type="submit">
            {Object.keys(editedExpense).length !== 0  ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>   
    </section>
  );
};

export default ExpenseForm;