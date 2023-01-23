import { DataType, ActionType, Actions } from "./types"

export const reducer = (state: DataType, action: ActionType) => {
  switch(action.type) {
    case Actions.SET_TRAINEES:
      return { ...state, trainees: action.payload.trainees};
      break;
      default: return state;
  }
}