import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './Home.module.css';
import { toggleTheme } from '../../store/ThemeSlice';
import VerifyEmail from '../AuthForm/VerifyEmail';
import Card from '../UI/Card';

const Home = () => {
    const isPremium = useSelector(state => state.premium.isPremium);
    const isDarkTheme = useSelector(state => state.theme.isDarkTheme);
    const dispatch = useDispatch();

    const toggleThemeHandler = () => {
        dispatch(toggleTheme());
    };

  return (
    <Card>
      <div className={classes.home}>
        <h1>Welcome to Expense Tracker</h1>
        <div>
          <p>This is a simple expense tracker application.
            You can manage your expenses by adding, editing, and deleting them.</p>
        </div>
       
        {isPremium && (
          <div> 
            <p>Would you like to change the mode?</p>
            {/* Toggle Switch */}
            <label className={classes.switch}>
              <input type="checkbox" checked={isDarkTheme} onChange={toggleThemeHandler} />
              <span className={classes.slider}></span>
            </label>
          </div>
        )} 
        {isPremium && 
          <div>
            <p>Verify your email</p>
            <VerifyEmail/>
          </div>
        }
      </div>
    </Card>
  );
};

export default Home;
