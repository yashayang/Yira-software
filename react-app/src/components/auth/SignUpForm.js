import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import LoginForm from './LoginForm';
import '../CSS/SignupForm.css';

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [administration, setAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showSignin, setShowSignin] = useState(false);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(firstName, lastName, email, administration, password));
      if (data) {
        setErrors(data)
      }
    }
  };

  const updateFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const updateLastName = (e) => {
    setLastName(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updateAdmin = (e) => {
    setAdmin(true);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  const handleShowSignin = () => {
    setShowSignin(true)
  }

  return (
    <>
    {!showSignin && <div className='home-page-signup-container'>
      <div className='signup-title'>Sign up is required!</div>
      <form className="signup-form" onSubmit={onSignUp}>
        <div className="create-issue-validation-errors">{errors.map((error, ind) => (<div key={ind}>{error.slice(error.indexOf(':') + 1, error.length)}</div>))}</div>
        <div className="signup-form-input-outer">
          <label className="signup-form-label">First Name</label>
          <input
            type='text'
            name='firstName'
            onChange={updateFirstName}
            value={firstName}
            className="signup-form-input"
          ></input>
        </div>
        <div className="signup-form-input-outer">
          <label className="signup-form-label">Last Name</label>
          <input
            type='text'
            name='lastName'
            onChange={updateLastName}
            value={lastName}
            className="signup-form-input"
          ></input>
        </div>
        <div className="signup-form-input-outer">
          <label className="signup-form-label">Email</label>
          <input
            type='text'
            name='email'
            onChange={updateEmail}
            value={email}
            className="signup-form-input"
          ></input>
        </div>
        <div className="signup-form-input-outer">
          <label className="signup-form-label">Administration</label>
          <select
            name='administration'
            onChange={updateAdmin}
            value={administration}
            className="signup-form-select-input"
          >
            <option>—————————YES——————————</option>
          </select>
        </div>
        <div className="signup-form-input-outer">
          <label className="signup-form-label">Password</label>
          <input
            type='password'
            name='password'
            onChange={updatePassword}
            value={password}
            className="signup-form-input"
          ></input>
        </div>
        <div className="signup-form-input-outer">
          <label className="signup-form-label">Repeat Password</label>
          <input
            type='password'
            name='repeat_password'
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
            className="signup-form-input"
          ></input>
        </div>
        <button className="signup-button" type='submit'>Sign Up</button>
      </form>
      <div className='signIn-account-message'>
        Already have an account? {" "}
        <span className='login-entry' onClick={handleShowSignin}> Sign in</span>
      </div>
    </div>}
    {showSignin && <LoginForm/>}
    </>
  );
};

export default SignUpForm;
