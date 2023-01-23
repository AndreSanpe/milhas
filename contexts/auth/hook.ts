import { useContext } from "react"
import { AppContext } from "."
import { User } from "../../types/User";
import { Actions } from "./types";

export const useAuthContext = () => {
  const { state, dispatch } = useContext(AppContext);

  return{
    ...state,
    setUser: (user: User) => {
      dispatch({
        type: Actions.SET_USER,
        payload: { user }
      })},
    setToken: (token: string) => {
      dispatch({
        type:Actions.SET_TOKEN,
        payload: { token }
      })
    }

  }
}