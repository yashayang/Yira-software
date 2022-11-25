const LOAD_ONE_ISSUE = 'issues/LOAD_ONE_ISSUE'
const CREATE_ISSUE = 'issues/CREATE_ISSUE';
const UPDATE_ISSUE = 'issues/UPDATE_ISSUE';
const DELETE_ISSUE = 'issues/DELETE_ISSUE';

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

export const removeOneIssue = (issueId) => {
  return {
    type: DELETE_ISSUE,
    issueId
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


export const createIssue = (phaseId, issue) => async (dispatch) => {
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
  // console.log("UPDATE ISSUES THUNK_issue:", summary, description, phaseId, assigneeId)
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

export const thunkDeleteIssue = (issueId) => async (dispatch) => {
  const response = await fetch(`/api/projects/issues/${issueId}`, {
    method: "DELETE"
  })
  if (response.ok) {
    dispatch(removeOneIssue(issueId));
  }
}

const initialState = {
  newIssue: {},
  singleIssue: {}
}

const issues = (state = initialState, action) => {
  let newState
  switch(action.type) {
    case CREATE_ISSUE:
      newState = {...state}
      newState.newIssue = action.issue
      return newState
    case LOAD_ONE_ISSUE:
      return { ...state, singleIssue: { ...action.issue }};
    case UPDATE_ISSUE:
      return { ...state, ...state.singleIssue, singleIssue: { ...action.issue }};
    case DELETE_ISSUE:
      newState = { ...state, singleIssue: { ...state.singleIssue } }
      if (newState.singleIssue.issueId === action.issueId) {
        delete newState.singleIssue
      }
      return newState
    default:
      return state;
  }
}

export default issues;
