import { type Dispatch, type SetStateAction, createContext } from "react";

export type NavState = {
  objID: number;
}

export type NavContextType = {
  navState: NavState;
  setNavState: Dispatch<SetStateAction<NavState>>;
}

export const defaultState = {
  objID: 0,
}

export const NavContext = createContext<NavContextType>({navState: defaultState, setNavState: ()=>{}});
