import { useContext } from "react"
import { AppContext } from "."
import { Trainee } from "../../types/Trainee";
import { Actions } from "./types";

export const useTraineesContext = () => {
  const { state, dispatch } = useContext(AppContext);

  return{
    ...state,
    setTrainees: (trainees: Trainee[]) => {
      dispatch({
        type: Actions.SET_TRAINEES,
        payload: { trainees }
      });
    }
  }
}