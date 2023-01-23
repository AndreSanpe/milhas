import { DataType, ActionType, Actions } from "./types"

export const reducer = (state: DataType, action: ActionType) => {
  switch(action.type) {
    case Actions.SET_USER:
      if(!action.payload.user) return { ...state, user: null, token: ''};
      return { ...state, user: action.payload.user};
      break;
    case Actions.SET_TOKEN:
      if(!action.payload.token) return { ...state, user: null, token: ''};
      return { ...state, token: action.payload.token};
      break;
    
    default: return state;
  }
}