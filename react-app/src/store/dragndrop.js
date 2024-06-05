// actions.js
export const SET_ACTIVE_CARD = 'SET_ACTIVE_CARD';

export const setActiveCard = (index, card) => ({
  type: SET_ACTIVE_CARD,
  index,
  card,
});

// reducer.js
const initialState = {
  activeCard: null,
  // other state...
};

const dragndrop = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_CARD:
      return {
        ...state,
        index: action.index,
        activeCard: action.card,
      };
    default:
      return state;
  }
};

export default dragndrop;
