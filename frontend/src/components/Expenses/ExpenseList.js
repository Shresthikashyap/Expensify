import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from './ExpenseList.module.css';
import { Edit, Trash2 } from 'lucide-react';

const ExpenseList = ({ expenses, onDelete, onDeleteAll, onEdit }) => {
  const [selectedExpenses, setSelectedExpenses] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const Total = useSelector(state => state.expenses.total);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(currentExpenses.map(exp => exp._id));
      setSelectedExpenses(allIds);
    } else {
      setSelectedExpenses(new Set());
    }
  };

  const handleSelectExpense = (id) => {
    setSelectedExpenses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedExpenses.size} expense(s)?`)) {
      onDeleteAll(selectedExpenses);
      setSelectedExpenses(new Set());
    }
  };
  const handleDelete = (expenseId) => {
    if (window.confirm(`Are you sure you want to delete this expense?`)) {
      onDelete(expenseId);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = expenses.slice(startIndex, endIndex);

  return (
    <div className={classes.container}>

      {/* Bulk Actions Bar */}
      {selectedExpenses.size > 0 && (
        <div className={classes.bulk_actions_bar}>
          <div className={classes.bulk_actions_content}>
            <div className={classes.bulk_selection_info}>
              <span className={classes.bulk_selection_text}>
                {selectedExpenses.size} expense{selectedExpenses.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className={classes.bulk_action_buttons}>
              <button
                onClick={handleBulkDelete}
                className={classes.bulk_btn_delete}
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedExpenses(new Set())}
                className={classes.bulk_btn_clear}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={classes.content_wrapper}>
        {expenses.length === 0 ? (
          <div className={classes.empty_state}>
            <p className={classes.empty_title}>No expenses found</p>
            <p className={classes.empty_subtitle}>
              Click "Add Expenses" to get started!
            </p>
          </div>
        ) : (
          <div className={classes.table_wrapper}>
            <table className={classes.expense_table}>
              <thead className={classes.table_head}>
                <tr>
                  <th className={classes.th_checkbox}>
                    <input
                      type="checkbox"
                      checked={selectedExpenses.size === currentExpenses.length && currentExpenses.length > 0}
                      onChange={handleSelectAll}
                      className={classes.checkbox}
                    />
                  </th>
                  <th className={classes.th_amount}>Amount</th>
                  <th className={classes.th_description}>Description</th>
                  <th className={classes.th_category}>Category</th>
                  <th className={classes.th_actions}>Actions</th>
                </tr>
              </thead>
              <tbody className={classes.table_body}>
                {currentExpenses.map((expense) => (
                  <tr key={expense._id} className={classes.table_row}>
                    <td className={classes.td_checkbox}>
                      <input
                        type="checkbox"
                        checked={selectedExpenses.has(expense._id)}
                        onChange={() => handleSelectExpense(expense._id)}
                        onClick={(e) => e.stopPropagation()}
                        className={classes.checkbox}
                      />
                    </td>
                    <td className={classes.td_amount}>
                      ₹{parseFloat(expense.amount).toLocaleString()}
                    </td>
                    <td className={classes.td_description}>
                      {expense.description}
                    </td>
                    <td className={classes.td_category}>
                      <span className={`${classes.category_badge} ${classes[`category_${expense.category?.toLowerCase()}`]}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className={classes.td_actions}>
                      <button 
                        className={classes.view_btn} 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(expense._id);
                        }}
                      >
                        <Edit size={20}/>
                      </button>
                      <button 
                        className={classes.view_btn} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(expense._id);
                        }}
                      >
                        <Trash2 size={20}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={classes.pagination_container}>
          <div className={classes.pagination_content}>
            <div className={classes.pagination_info}>
              Showing {startIndex + 1} to {Math.min(endIndex, expenses.length)} of {expenses.length} expenses
            </div>

            <div className={classes.pagination_controls}>
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className={classes.pagination_btn}
              >
                Previous
              </button>

              <span className={classes.pagination_page}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                className={classes.pagination_btn}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className={classes.summary_footer}>
        <div className={classes.summary_content}>
          <span className={classes.summary_label}>Total Expenses:</span>
          <span className={classes.summary_amount}>₹{Total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;