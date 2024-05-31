// Purpose: This file contains the redux store for the issues.
//          It contains the action creators, thunks, and reducer for the issues.

// Constants
const LOAD_ALL_PHASES_ISSUES = 'issues/LOAD_ALL_PHASES_ISSUES';
const LOAD_ONE_ISSUE = 'issues/LOAD_ONE_ISSUE'
const CREATE_ISSUE = 'issues/CREATE_ISSUE';
const UPDATE_ISSUE = 'issues/UPDATE_ISSUE';
const DELETE_ISSUE = 'issues/DELETE_ISSUE';
const RESET_PROJECT = 'issues/RESET_PROJECT'
const DELETE_PHASE = 'issues/DELETE_PHASE';

// Action creators
export const cleanState = () => {
  return {
    type: RESET_PROJECT
  }
};

export const allPhasesIssues = (phasesIssues) => {
  return {
    type: LOAD_ALL_PHASES_ISSUES,
    phasesIssues
  }
};

export const loadOneIssue = (issue) => {
  return {
    type: LOAD_ONE_ISSUE,
    issue
  }
};

export const createOneIssue = (issue, phaseId) => {
  return {
    type: CREATE_ISSUE,
    issue,
    phaseId
  }
};

export const updateOneIssue = (issue, phaseId) => {
  return {
    type: UPDATE_ISSUE,
    issue,
    phaseId
  }
};

export const removeOneIssue = (issueId, phaseId) => {
  return {
    type: DELETE_ISSUE,
    issueId,
    phaseId
  }
};

export const removePhase = (phaseId) =>{
  return {
    type: DELETE_PHASE,
    phaseId
  }
};

// Thunks
export const thunkGetAllPhasesIssues = () => async (dispatch) => {
  const response = await fetch('/api/phases/');

  if (response.ok) {
    const phasesIssues = await response.json();
    dispatch(allPhasesIssues(phasesIssues));
    return phasesIssues;
  }
};

export const thunkGetOneIssue = (issueId) => async (dispatch) => {
  const response = await fetch(`/api/issues/${issueId}`)

  if (response.ok) {
    const issue = await response.json()
    dispatch(loadOneIssue(issue))
    return issue
  }
};


export const thunkCreateIssue = (phaseId, issue, attachment) => async (dispatch) => {
  if (attachment) {
    try {
      const response = await fetch(`/api/issues/${phaseId}/new`, {
        method: "POST",
        body: issue
      })

      if (!response.ok) {
        let error;
        if (response.status === 401 || 400) {
          error = await response.json();
          return error;
        } else {
          let errorJSON;
          error = await response.text();
          try {
            errorJSON = JSON.parse(error);
          } catch {
            throw new Error(error);
          }
          throw new Error(`${errorJSON.title}: ${errorJSON.message}`)
        }
      }

      const newIssue = await response.json();
      dispatch(createOneIssue(newIssue, phaseId));
      return newIssue

    } catch(error) {
      throw error
    }
  }

  try {
    const response = await fetch(`/api/issues/${phaseId}/new`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify(issue)
    })

    if (!response.ok) {
      let error;
      if (response.status === 401 || 400) {
        error = await response.json();
        return error;
      } else {
        let errorJSON;
        error = await response.text();
        try {
          errorJSON = JSON.parse(error);
        } catch {
          throw new Error(error);
        }
        throw new Error(`${errorJSON.title}: ${errorJSON.message}`)
      }
    }

    const newIssue = await response.json();
    dispatch(createOneIssue(newIssue, phaseId));
    return newIssue

  } catch(error) {
    throw error
  }

};


export const thunkUpdateIssue = (issueId, issue, phaseId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/issues/${issueId}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify(issue)
    });
    if (!response.ok) {
      let error;
      if (response.status === 401) {
        error = await response.json();
        return error;
      } else {
        let errorJSON;
        error = await response.text();
        try {
          errorJSON = JSON.parse(error);
        } catch {
          throw new Error(error);
        }
        throw new Error(`${errorJSON.title}: ${errorJSON.message}`)
      }
    }

    const updatedIssue = await response.json();
    dispatch(updateOneIssue(updatedIssue, phaseId));
    return updatedIssue

  } catch (error) {
    throw error
  }
};

export const thunkDeleteIssue = (issueId, phaseId) => async (dispatch) => {
  const response = await fetch(`/api/issues/${issueId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    dispatch(removeOneIssue(issueId, phaseId));
    return response
  }
};

// Reducer
const initialState = {
  AllPhases: {},
  NewIssue: {},
  SingleIssue: {}
};

const issues = (state = initialState, action) => {
  let newState
  switch(action.type) {
    case LOAD_ALL_PHASES_ISSUES:
      newState = { ...state, SingleIssue: {...state.SingleIssue}, AllPhases: {...state.AllPhases}}
      action.phasesIssues.AllPhases.forEach(phase => {
        newState.AllPhases[phase.id] = phase
      })
      return newState;

    case CREATE_ISSUE:
      newState = { ...state, SingleIssue: {...state.SingleIssue}, AllPhases: {...state.AllPhases}}
      newState.NewIssue = action.issue
      newState.AllPhases[action.phaseId].Issues[action.issue.issueId] = action.issue
      return newState

    case LOAD_ONE_ISSUE:
      newState = { ...state, SingleIssue: {...state.SingleIssue}, AllPhases: {...state.AllPhases}}
      newState.SingleIssue = action.issue
      return newState

    case UPDATE_ISSUE:
      newState = { ...state, SingleIssue: {...state.SingleIssue}, AllPhases: {...state.AllPhases}}
      newState.SingleIssue = action.issue
      newState.AllPhases[action.issue.phaseId].Issues[action.issue.issueId] = action.issue
      return newState

    case DELETE_ISSUE:
      newState = { ...state, SingleIssue: {...state.SingleIssue}, AllPhases: {...state.AllPhases}}
      delete newState.AllPhases[action.phaseId].Issues[action.issueId]
      delete newState.SingleIssue
      delete newState.NewIssue
      return newState

    case RESET_PROJECT:
      newState = { ...state, SingleIssue: {...state.SingleIssue}, AllPhases: {...state.AllPhases}}
      newState.SingleIssue = {}
      newState.NewIssue = {}
      return newState

    case DELETE_PHASE:
      newState = { ...state, SingleIssue: {...state.SingleIssue}, AllPhases: {...state.AllPhases}}
      delete newState.AllPhases[action.phaseId]
      return newState

    default:
      return state;
  }
};

export default issues;
