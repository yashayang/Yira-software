const LOAD_ALL_PHASES_ISSUES = 'issues/LOAD_ALL_PHASES_ISSUES';
const LOAD_ONE_ISSUE = 'issues/LOAD_ONE_ISSUE'
const CREATE_ISSUE = 'issues/CREATE_ISSUE';
const UPDATE_ISSUE = 'issues/UPDATE_ISSUE';
const DELETE_ISSUE = 'issues/DELETE_ISSUE';
const RESET_PROJECT = 'issues/RESET_PROJECT'
const DELETE_PHASE = 'issues/DELETE_PHASE';

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

export const createOneIssue = (issue, phaseId) => {
  return {
    type: CREATE_ISSUE,
    issue,
    phaseId
  }
}

export const updateOneIssue = (issue, phaseId) => {
  return {
    type: UPDATE_ISSUE,
    issue,
    phaseId
  }
}

export const removeOneIssue = (issueId, phaseId) => {
  return {
    type: DELETE_ISSUE,
    issueId,
    phaseId
  }
}

export const removePhase = (phaseId) =>{
  return {
    type: DELETE_PHASE,
    phaseId
  }
}

export const thunkGetAllPhasesIssues = () => async (dispatch) => {
  const response = await fetch('/api/phases/');

  if (response.ok) {
    const phasesIssues = await response.json();
    dispatch(allPhasesIssues(phasesIssues));
    return phasesIssues;
  }
}

export const thunkGetOneIssue = (issueId) => async (dispatch) => {
  const response = await fetch(`/api/issues/${issueId}`)

  if (response.ok) {
    const issue = await response.json()
    dispatch(loadOneIssue(issue))
    return issue
  }
}


export const thunkCreateIssue = (phaseId, issue, attachment) => async (dispatch) => {
  // console.log("CREATE ISSUES - phaseId/THUNK_issue:", phaseId, issue)
  if (attachment) {
    // console.log("CREATE ISSUES THUNK_issue.attachment:", issue.attachment)
    try {
      const response = await fetch(`/api/issues/${phaseId}/new`, {
        method: "POST",
        body: issue
      })
      // console.log("CREATE ISSUES THUNK_response:", response)
      if (!response.ok) {
        let error;
        if (response.status === 401 || 400) {
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
      dispatch(createOneIssue(newIssue, phaseId));
      return newIssue

    } catch(error) {
      throw error
    }
  }

  // console.log("CREATE ISSUES THUNK_withoutImage_JSON.stringify(issue):", JSON.stringify(issue))

  try {
    const response = await fetch(`/api/issues/${phaseId}/new`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify(issue)
    })
    // console.log("CREATE ISSUES THUNK_without image_response:", response)
    if (!response.ok) {
      let error;
      if (response.status === 401 || 400) {
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
    dispatch(createOneIssue(newIssue, phaseId));
    return newIssue

  } catch(error) {
    throw error
  }


}


export const thunkUpdateIssue = (issueId, issue, phaseId, attachment) => async (dispatch) => {
  const { summary, description, phaseId, assigneeId } = issue
  // console.log("UPDATE ISSUES THUNK_issue:", issue)
  // console.log("UPDATE ISSUES THUNK_attachment:", attachment)
  console.log("thunkUpdateIssue ---- issueId", issueId)
  try {
    const response = await fetch(`/api/issues/${issueId}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json'
          },
      // body: JSON.stringify({summary, description, phase_id: parseInt(phaseId), owner_id: parseInt(assigneeId)})
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
    // console.log("UPDATE ISSUES THUNK_NO ATTACH_updatedIssue:", updatedIssue)
    return updatedIssue

  } catch (error) {
    throw error
  }
}

export const thunkDeleteIssue = (issueId, phaseId) => async (dispatch) => {
  // console.log("DELETE ISSUES THUNK_issueId_phaseId:", issueId, phaseId)
  const response = await fetch(`/api/issues/${issueId}`, {
    method: "DELETE"
  })
  // console.log("DELETE ISSUES_response:", response)
  if (response.ok) {
    dispatch(removeOneIssue(issueId, phaseId));
    return response
  }
}

const initialState = {
  AllPhases:{},
  NewIssue: {},
  SingleIssue: {}
}

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
      // return { ...state, ...state.AllPhases, singleIssue: { ...state.singleIssue, ...action.issue }};

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
      // newState.AllPhases = {}
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
}

export default issues;
