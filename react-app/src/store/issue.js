const CREATE_ISSUE = 'issues/CREATE_ISSUE';
const UPDATE_ISSUE = 'issues/UPDATE_ISSUE';
const DELETE_ISSUE = 'issues/DELETE_ISSUE';

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


export const createIssue = (phaseId, issue) => async (dispatch) => {
  console.log("CREATE ISSUES THUNK_issue:", issue)
  const { summary, description, phaseId, assigneeId } = issue
  console.log("CREATE ISSUES THUNK_issue:", summary, description, phaseId, assigneeId)
  try {
    const response = await fetch(`/api/projects/phases/${phaseId}/issues`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify({summary, description, phase_id: parseInt(phaseId), owner_id: parseInt(assigneeId)})
    })
    console.log("CREATE ISSUES THUNK_response:", response)
    if (!response.ok) {
      let error;
      if (response.status === 401) {
        error = await response.json();
        console.log("CREATE ISSUES THUNK_error:", error)
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

const initialState = {
  newIssue: {}
}

const issues = (state = initialState, action) => {
  let newState
  switch(action.type) {
    case CREATE_ISSUE:
      newState = {...state}
      newState.newIssue = action.issue
      return newState
    default:
      return state;
  }
}

export default issues;
