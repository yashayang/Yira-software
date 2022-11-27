const LOAD_ALL_PHASES_ISSUES = 'phases/LOAD_ALL_PHASES_ISSUES';
const CREATE_PHASE = 'phases/CREATE_PHASE';
const UPDATE_PHASE = 'phases/UPDATE_PHASE';
const DELETE_PHASE = 'phases/DELETE_PHASE';

export const allPhasesIssues = (phasesIssues) => {
  return {
    type: LOAD_ALL_PHASES_ISSUES,
    phasesIssues
  }
}

export const createOnePhase = (phase) => {
  return {
    type: CREATE_PHASE,
    phase
  }
}

export const updateOnePhase = (phase) => {
  return {
    type: UPDATE_PHASE,
    phase
  }
}

export const removeOnePhase = (phaseId) => {
  return {
    type: DELETE_PHASE,
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

export const thunkCreatePhase = (projectId, phase) => async (dispatch) => {
  // console.log("CREATE ISSUES THUNK_issue:", issue)
  // console.log("CREATE ISSUES THUNK_issue:", summary, description, phaseId, assigneeId)
  try {
    const response = await fetch(`/api/projects/${projectId}/phases`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify(phase)
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

    const newPhase = await response.json();
    dispatch(createOnePhase(newPhase));
    return newPhase

  } catch(error) {
    throw error
  }
}

export const thunkUpdatePhase = (phaseId, phase) => async (dispatch) => {
  // const { summary, description, phaseId, assigneeId } = issue
  // console.log("UPDATE ISSUES THUNK_issue:", issueId, summary, description, phaseId, assigneeId)
  try {
    const response = await fetch(`/api/projects/phases/${phaseId}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify(phase)
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

    const updatedPhase = await response.json();
    dispatch(updateOnePhase(updatedPhase));
    return updatedPhase

  } catch (error) {
    throw error
  }
}

export const thunkDeletePhase = (phaseId) => async (dispatch) => {
  // console.log("DELETE ISSUES THUNK_issueId_phaseId:", phaseId)
  const response = await fetch(`/api/projects/phases/${phaseId}`, {
    method: "DELETE"
  })
  console.log("DELETE ISSUES_response:", response)
  if (response.ok) {
    dispatch(removeOnePhase(phaseId));
    return response
  }
}

const initialState ={
  AllPhases:{}
}

const phases = (state = initialState, action) => {
  let newState
  switch(action.type) {
    case LOAD_ALL_PHASES_ISSUES:
      newState = { ...state, ...state.singleIssue, AllPhases: {...state.AllPhases}}
      action.phasesIssues.AllPhases.forEach(phase => {
        newState.AllPhases[phase.id] = phase
      })
      return newState

    case CREATE_PHASE:
      newState = { ...state, ...state.AllPhases }
      newState.AllPhases[action.phase.id] = action.phase
      return newState

    case UPDATE_PHASE:
      newState = { ...state, ...state.AllPhases }
      newState.AllPhases[action.phase.id] = action.phase
      return newState

    case DELETE_PHASE:
      newState = { ...state, ...state.AllPhases }
      delete newState.AllPhases[action.phaseId]
      return newState

    default:
      return state
  }
}

export default phases;
