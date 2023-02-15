import { useContext } from "react"
import { AppContext } from "."
import { Account } from "../../types/Account";
import { Actions } from "./types";

export const useAccountsContext = () => {
  const { state, dispatch } = useContext(AppContext);

  return{
    ...state,
    setAccounts: (accounts: Account[]) => {
      dispatch({
        type: Actions.SET_ACCOUNTS,
        payload: { accounts }
      });
    }
  }
}