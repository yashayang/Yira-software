import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authenticate } from './store/session';
import SoloLoginPage from './components/auth/SoloLoginPage';
import SoloSignUpPage from './components/auth/SoloSignUpPage';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import Phases from './components/Phases';
import CreateIssuePage from './components/Issues/CreateIssuePage';
import UpdateIssue from './components/Issues/UpdateIssue';
import HomePage from './components/SplashPage';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/login' exact={true}>
          <SoloLoginPage />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SoloSignUpPage />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>
        <ProtectedRoute path='/projects' exact={true} >
          <Phases />
        </ProtectedRoute>
        <ProtectedRoute path='/issues' exact={true} >
          <CreateIssuePage />
        </ProtectedRoute>
        <ProtectedRoute path='/issues/:issueId' exact={true} >
          <UpdateIssue />
        </ProtectedRoute>
        <Route path='/' exact={true} >
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
