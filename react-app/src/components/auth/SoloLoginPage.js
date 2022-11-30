import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { login } from '../../store/session';
import '../CSS/LoginForm.css';

const SoloLoginPage = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    // console.log("ReactLoginForm_email_password:", email, password)
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/projects' />;
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
            <a href='https://github.com/yashayang' className="social-link" rel="noreferrer" target="_blank"><span><i className="fa-brands fa-github"></i></span></a>
            <a href='https://www.linkedin.com/in/yashayang/' className="social-link" rel="noreferrer" target="_blank"><span><i class="fa-brands fa-linkedin"></i></span></a>
          </div>
        </div>

      <div className="home-page-login-container">
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
        <NavLink to="/sign-up"><div className='sign-up-entry'>Sign up for FREE!</div></NavLink>
      </div>
      </div>
    </>
  );

};

export default SoloLoginPage;
