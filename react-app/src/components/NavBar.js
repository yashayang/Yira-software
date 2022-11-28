import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector} from 'react-redux';
import LogoutButton from './auth/LogoutButton';
// import SignUpForm from './auth/SigUpForm.js';
import logo from './Images/logo.svg';
import './CSS/NavBar.css';

const NavBar = () => {
  const curr_user = useSelector(state => state.session.user);

  return (
    <nav className='navbar-main-container'>
        <NavLink to='/' exact={true} activeClassName='active' style={{textDecoration: "none"}}>
          <div className='navbar-left-container'>
            <div className="logo"><img src={logo} alt="logo"/></div>
            <div className='logo-name'>Yira Software</div>
            <div className='navbar-left-seletion'>
              {curr_user && <div className='navbar-project'>Projects</div>}
            </div>
          </div>
        </NavLink>
        {/* <div>
          <NavLink to='/login' exact={true} activeClassName='active' style={{textDecoration: "none"}}>
            Login
          </NavLink>
        </div>
        <div>
          <NavLink to='/sign-up' exact={true} activeClassName='active' style={{textDecoration: "none"}}>
            Sign Up
          </NavLink>
        </div> */}
        {/* <div>
          <divLink to='/users' exact={true} activeClassName='active'>
            Users
          </divLink>
        </div> */}
        <div className='navbar-right-container'>
          {curr_user && <LogoutButton />}
          {!curr_user && <NavLink to='/sign-up' exact={true} style={{textDecoration: "none"}}><div className = "navBar-signup-entry">
            Sign up for free
            </div></NavLink>}
        </div>
    </nav>
  );
}

export default NavBar;
