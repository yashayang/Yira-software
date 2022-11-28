import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';

const Logoutdiv = () => {
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    await dispatch(logout());
  };

  return (
    <div className='logout-container'>
      <div onClick={onLogout}>Log out <i className="fa-sharp fa-solid fa-right-from-bracket"></i></div>
    </div>
  );
};

export default Logoutdiv;
