import { useContext } from "react"
import { AppContext } from "."
import { InputBuy } from "../../types/InputBuy";
import { Actions } from "./types";

export const useInputBuyContext = () => {
  const { state, dispatch } = useContext(AppContext);

  return{
    ...state,
    setInputsBuy: (inputsBuy: InputBuy) => {
      dispatch({
        type: Actions.SET_INPUTBUY,
        payload: { inputsBuy }
      });
    }
  }
}