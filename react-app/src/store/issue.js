const LOAD_ONE_ISSUE = 'issues/LOAD_ONE_ISSUE'
const CREATE_ISSUE = 'issues/CREATE_ISSUE';
const UPDATE_ISSUE = 'issues/UPDATE_ISSUE';
const DELETE_ISSUE = 'issues/DELETE_ISSUE';
const LOAD_ALL_PHASES_ISSUES = 'phases/LOAD_ALL_PHASES_ISSUES';
const RESET_PROJECT = 'issues/RESET_PROJECT'

export const cleanState = () => {
  return {
    type: RESET_PROJECT
  }
}

export const allPhasesIssues = (phasesIssues) => {
  return {
    type: LOAD_ALL_PHASES_ISSUES,
    phasesIssues
  }
}

export const loadOneIssue = (issue) => {
  return {
    type: LOAD_ONE_ISSUE,
    issue
  }
}

export const createOneIssue = (issue) => {
  return {
    type: CREATE_ISSUE,
    issue
  }
}

export const updateOneIssue = (issue) => {
  return {
    type: UPDATE_ISSUE,
    issue
  }
}

export const removeOneIssue = (issueId, phaseId) => {
  return {
    type: DELETE_ISSUE,
    issueId,
    phaseId
  }
}

export const thunkGetAllPhasesIssues = () => async (dispatch) => {
  const response = await fetch('/api/projects/');

  if (response.ok) {
    const phasesIssues = await response.json();
    dispatch(allPhasesIssues(phasesIssues));
    return phasesIssues;
  }
}

export const thunkGetOneIssue = (issueId) => async (dispatch) => {
  const response = await fetch(`/api/projects/issues/${issueId}`)

  if (response.ok) {
    const issue = await response.json()
    dispatch(loadOneIssue(issue))
    return issue
  }
}


export const thunkCreateIssue = (phaseId, issue) => async (dispatch) => {
  // console.log("CREATE ISSUES THUNK_issue:", issue)
  const { summary, description, phaseId, assigneeId } = issue
  // console.log("CREATE ISSUES THUNK_issue:", summary, description, phaseId, assigneeId)
  try {
    const response = await fetch(`/api/projects/phases/${phaseId}/issues`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify({summary, description, phase_id: parseInt(phaseId), owner_id: parseInt(assigneeId)})
    })
    // console.log("CREATE ISSUES THUNK_response:", response)
    if (!response.ok) {
      let error;
      if (response.status === 401) {
        error = await response.json();
        // console.log("CREATE ISSUES THUNK_error:", error)
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
    dispatch(createOneIssue(newIssue));
    return newIssue

  } catch(error) {
    throw error
  }
}

export const thunkUpdateIssue = (issueId, issue) => async (dispatch) => {
  const { summary, description, phaseId, assigneeId } = issue
  // console.log("UPDATE ISSUES THUNK_issue:", issueId, summary, description, phaseId, assigneeId)
  try {
    const response = await fetch(`/api/projects/issues/${issueId}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify({summary, description, phase_id: parseInt(phaseId), owner_id: parseInt(assigneeId)})
    });
    if (!response.ok) {
      let error;
      if (response.status === 401) {
        error = await response.json();
        // console.log("UPDATE ISSUES THUNK_error:", error)
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
    dispatch(updateOneIssue(updatedIssue));
    return updatedIssue

  } catch (error) {
    throw error
  }
}

export const thunkDeleteIssue = (issueId, phaseId) => async (dispatch) => {
  console.log("DELETE ISSUES THUNK_issueId_phaseId:", issueId, phaseId)
  const response = await fetch(`/api/projects/issues/${issueId}`, {
    method: "DELETE"
  })
  console.log("DELETE ISSUES_response:", response)
  if (response.ok) {
    dispatch(removeOneIssue(issueId, phaseId));
    return response
  }
}

const initialState = {
  AllPhases:{},
  newIssue: {},
  singleIssue: {}
}

const issues = (state = initialState, action) => {
  let newState
  switch(action.type) {

    case LOAD_ALL_PHASES_ISSUES:
      newState = { ...state, ...state.singleIssue, AllPhases: {...state.AllPhases}}
      action.phasesIssues.AllPhases.forEach(phase => {
        newState.AllPhases[phase.id] = phase
      })
      return newState;

    case CREATE_ISSUE:
      newState = {...state, ...state.AllPhases, ...state.singleIssue}
      newState.newIssue = action.issue
      newState.AllPhases[action.issue.issueId] = action.issue
      return newState

    case LOAD_ONE_ISSUE:
      return { ...state, ...state.AllPhases, singleIssue: { ...state.singleIssue, ...action.issue }};

    case UPDATE_ISSUE:
      newState = {...state, ...state.AllPhases, ...state.singleIssue}
      newState.singleIssue = action.issue
      newState.AllPhases[action.issue.issueId] = action.issue
      return newState

    case DELETE_ISSUE:
      newState = { ...state, ...state.AllPhases, singleIssue: { ...state.singleIssue } }
        delete newState.AllPhases[action.phaseId].Issues[action.issueId]
        delete newState.singleIssue
      return newState

    case RESET_PROJECT:
      newState = {...state}
      newState.allPhases = {}
      newState.singleIssue = {}
      newState.newIssue = {}
      return newState

    default:
      return state;
  }
}

export default issues;
