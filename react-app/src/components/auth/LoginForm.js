import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import SignUpForm from './SignUpForm'
import '../CSS/LoginForm.css';

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignup] = useState(false);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    // console.log("ReactLoginForm_email_password:", email, password)
    let errors = []
    if (!email) errors.push("Email: this field is required.")
    if (!password) errors.push("Password: this field is required.")
    const data = await dispatch(login(email, password));
    // console.log(data)
    if (data) {
      if (data.filter(error => error.includes("Password was incorrect.") || error.includes("Email provided not found."))){
        errors.push("The credentials are invalid.")
        setErrors(errors)
      } else {
        setErrors(["The credentials are invalid."]);
      }
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/boards' />;
  }

  const DemoUser = (e) => {
    e.preventDefault();
    setErrors([]);
    const demoEmail = "yasha@gmail.com";
    const demoPassword = "password";
    return dispatch(login(demoEmail, demoPassword)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      })
  }

  const handleShowSignUp = () => {
    setShowSignup(true)
  }

  return (
    <>
      {!showSignUp && <div className="home-page-login-container">
        <div className='login-title'>Get started</div>
        <form className="login-form" onSubmit={onLogin}>
          <div className="create-issue-validation-errors">
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div className="login-form-input-outer">
            <label className="login-form-label" htmlFor='email'>Email</label>
            <input
              name='email'
              type='text'
              placeholder='Email'
              value={email}
              onChange={updateEmail}
              className="login-form-input"
            />
          </div>
          <div className="login-form-input-outer">
            <label className="login-form-label" htmlFor='password'>Password</label>
            <input
              name='password'
              type='password'
              placeholder='Password'
              value={password}
              onChange={updatePassword}
              className="login-form-input"
            />
            <button className="login-button" type='submit'>Login</button>
            <button className='login-button' onClick={DemoUser}>Demo User</button>
          </div>
        </form>
        <div className='or'>————————— or —————————</div>
        <div className='sign-up-entry' onClick={handleShowSignUp}>Sign up for FREE!</div>
      </div>}
      {showSignUp && <SignUpForm />}
    </>
  );
};

export default LoginForm;
