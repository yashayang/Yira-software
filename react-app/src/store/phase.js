// Purpose: Redux store for phases.
//          It contains the action creators, thunks, and reducer for the phases.

// Constants
const LOAD_ALL_PHASES_ISSUES = 'phases/LOAD_ALL_PHASES_ISSUES';
const CREATE_PHASE = 'phases/CREATE_PHASE';
const UPDATE_PHASE = 'phases/UPDATE_PHASE';
const DELETE_PHASE = 'phases/DELETE_PHASE';

// Action creators
export const allPhasesIssues = (phasesIssues) => {
  return {
    type: LOAD_ALL_PHASES_ISSUES,
    phasesIssues
  }
};

export const createOnePhase = (phase) => {
  return {
    type: CREATE_PHASE,
    phase
  }
};

export const updateOnePhase = (phase) => {
  return {
    type: UPDATE_PHASE,
    phase
  }
};

export const removeOnePhase = (phaseId) => {
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

export const thunkCreatePhase = (projectId, phase) => async (dispatch) => {
  try {
    const response = await fetch(`/api/phases/${projectId}/new`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify(phase)
    })

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

    const newPhase = await response.json();
    dispatch(createOnePhase(newPhase));
    return newPhase

  } catch(error) {
    throw error
  }
};

export const thunkUpdatePhase = (phaseId, phase) => async (dispatch) => {
  try {
    const response = await fetch(`/api/phases/${phaseId}`, {
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
};

export const thunkDeletePhase = (phaseId) => async (dispatch) => {
  const response = await fetch(`/api/phases/${phaseId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    dispatch(removeOnePhase(phaseId));
    return response
  }
};

// Reducer
const initialState ={ AllPhases:{} };
const phases = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case LOAD_ALL_PHASES_ISSUES:
      newState = { ...state, ...state.singleIssue, AllPhases: { ...state.AllPhases } }
      action.phasesIssues.AllPhases.forEach(phase => {
        newState.AllPhases[phase.id] = phase
      })
      return newState

    case CREATE_PHASE:
      newState = { ...state, AllPhases: { ...state.AllPhases } }
      newState.AllPhases[action.phase.id] = action.phase
      return newState

    case UPDATE_PHASE:
      newState = { ...state, AllPhases: { ...state.AllPhases } }
      newState.AllPhases[action.phase.id] = action.phase
      return newState

    case DELETE_PHASE:
      newState = { ...state, AllPhases: { ...state.AllPhases } }
      delete newState.AllPhases[action.phaseId]
      return newState

    default:
      return state
  }
};

export default phases;
