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
  try {
    const response = await fetch(`/api/projects/phases/${phaseId}/issues`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify(issue)
    })

    if (response.ok) {
      const newIssue = await response.json();
      dispatch(createOneIssue(newIssue));
      return newIssue
    }

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
