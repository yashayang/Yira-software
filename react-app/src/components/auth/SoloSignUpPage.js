import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { signUp } from '../../store/session';
import '../CSS/SignupForm.css';

const SoloSignUpPage = () => {
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


  return (
    <>
      <div className="home-page-main-container">
        <div className="home-page-left-container">
          <div className="home-page-title">The #1 software</div>
          <div className="home-page-title">development tool</div>
          <div className="home-page-title">used by agile teams</div>
          <ul className="home-page-subTitle">
            <li><i className="fa-sharp fa-solid fa-check" id="home-page-checkmark"></i>{" "}Collaborate, manage projects, and reach new productivity peaks.</li>
            <li><i className="fa-sharp fa-solid fa-check" id="home-page-checkmark"></i>{" "}From high rises to the home office.</li>
            <li><i className="fa-sharp fa-solid fa-check" id="home-page-checkmark"></i>{" "}Is always free, no credit card needed</li>
          </ul>
          <div className="social-container">Created By <span className="my-name">Yasha Yang</span>
          <a href='https://github.com/yashayang' className="social-link" target="_blank"><span><i className="fa-brands fa-github"></i></span></a>
          <a href='https://www.linkedin.com/in/yashayang/' className="social-link" target="_blank"><span><i class="fa-brands fa-linkedin"></i></span></a>
        </div>
      </div>

      <div className='home-page-signup-container'>
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
          <NavLink to="/login"><span className='login-entry'> Sign in</span></NavLink>
        </div>
      </div>
      </div>
    </>
  )
}

export default SoloSignUpPage;
