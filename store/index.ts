import { ActionTree, MutationTree, GetterTree } from "vuex";
import firebase, { auth } from "firebase";
import { UserState } from "./user";
import { ProduceState } from "./products";
import { ISnackBar } from "../types/snackbar";

export type RootState = {
  user: UserState;
  product: ProduceState;
};
export type AppState = {
  snackBar: ISnackBar;
};

export const state = (): AppState => ({
  snackBar: {
    show: false,
    text: "",
    color: ""
  }
});

export const actions: ActionTree<RootState, AppState> = {
  async onAuthStateChangedAction({ dispatch }) {
    await dispatch("user/getUserProfile", null, { root: false });
  },
  setSnackBar({ commit }, payload) {
    commit("SET_SNACKBAR", payload);
  }
};
export const mutations: MutationTree<AppState> = {
  ON_AUTH_STATE_CHANGED_MUTATION(state: AppState, { authUser, claims }) {
    // console.log("test mutations");
    // console.log(authUser);
    // if (authUser) {
    //   const { uid, email, displayName } = authUser;
    //   state.user.userProfile = {
    //     id: uid,
    //     email,
    //     name: displayName
    //   };
    // }
    // console.log(state.user.userProfile, "test mutation");
  },
  SET_SNACKBAR(state: AppState, payload) {
    state.snackBar = payload;
    console.log(state.snackBar);
  }
};
