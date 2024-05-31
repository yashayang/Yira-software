// Purpose: To create the session store and its actions and reducers.

// Constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const LOAD_ALL_USERS = 'session/ALL_USERS';

// Action creators
const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const allUsers = (users) => ({
  type: LOAD_ALL_USERS,
  users
});


// Thunks
export const authenticate = () => async (dispatch) => {
  const response = await fetch('/api/auth/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
};

export const login = (email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })


  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }
};

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    }
  })

  if (response.ok) {
    dispatch(removeUser());
  }
};


export const signUp = (firstName, lastName, email, administration, password) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      administration,
      password,
    }),
  })

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }
};

export const loadAllUsers = () => async (dispatch) => {
  const response = await fetch('/api/users/');

  if(response.ok) {
    const users = await response.json();
    dispatch(allUsers(users));
    return users;
  }
};

// Reducer
const initialState = { user: null };
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload }
    case REMOVE_USER:
      return { user: null }
    case LOAD_ALL_USERS:
      return { ...state, AllUsers: action.users } // To overwrite the AllUsers key and create a new state
    default:
      return state;
  }
};
