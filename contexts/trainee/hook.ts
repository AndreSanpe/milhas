import { useContext } from "react"
import { AppContext } from "."
import { Trainee } from "../../types/Trainee";
import { Actions } from "./types";

export const useTraineeContext = () => {
  const { state, dispatch } = useContext(AppContext);

  return{
    ...state,
    setTrainee: (trainee: Trainee) => {
      dispatch({
        type: Actions.SET_TRAINEE,
        payload: { trainee }
      });
    }
  }
}