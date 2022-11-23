const LOAD_ALL_PHASES_ISSUES = 'project/LOAD_ALL_PHASES_ISSUES';

export const allPhasesIssues = (phasesIssues) => {
  return {
    type: LOAD_ALL_PHASES_ISSUES,
    phasesIssues
  }
}

export const getAllPhasesIssues = () => async (dispatch) => {
  const response = await fetch('/api/projects');

  if (response.ok) {
    const phasesIssues = await response.json();
    dispatch(allPhasesIssues(phasesIssues));
    return phasesIssues;
  }
}

const initialState ={
  AllPhases:{}
}

const phases = (state = initialState, action) => {
  let newState
  switch(action.type) {
    case LOAD_ALL_PHASES_ISSUES:
      newState = { ...state, AllPhases: {...state.AllPhases}}
      action.phasesIssues.AllPhases.forEach(phase => {
        newState.AllPhases[phase.id] = phase
      })
      return newState
    default:
      return state
  }
}

export default phases;
