import { ActionTree, MutationTree, GetterTree } from "vuex";
import {
  UserProfile,
  UserPermissions,
  StaffStatus,
  userProfileFeedBack
} from "../types/user";
import firebase, { firestore } from "firebase";
import { IListOrder, IProductInOrders } from "../types/product";
import OrderServices from "../services/order.service";
import { getProductNameWithId } from "../services/order.service";
import { IsTypeQuery } from "../types/api";
import {
  StorageServices,
  AuthenticationServices,
  FirestoreServices
} from "../services/firestore";
import { NotificationType } from "~/enums/notification";
import { DocumentData } from "@google-cloud/firestore";
import { INotification } from "~/types/snackbar";

const FirestoreService = new FirestoreServices();
const AuthenticationService = new AuthenticationServices();
const StorageService = new StorageServices();

export type UserState = {
  userProfile: UserProfile | null;
  loggedIn: boolean;
  listUsers: [];
  listFavourite: [];
  notifications: INotification[];
  purchasedList: string[];
};

export type FeedBackState = {
  userProfileFeedBack: userProfileFeedBack;
  message: string;
};
export const state = (): UserState => ({
  userProfile: null,
  loggedIn: false,
  listUsers: [],
  listFavourite: [],
  notifications: [],
  purchasedList: []
});
export type RootState = ReturnType<typeof state>;

export const actions: ActionTree<UserState, UserState> = {
  async getPurchasedList({ commit, state }) {
    try {
      if (state.userProfile) {
        const purchasedList = await FirestoreService.get({
          path: `purchasedList/${state.userProfile.id}`,
          type: IsTypeQuery.document
        });
        commit("SET_PURCHASED_LIST", purchasedList?.data?.purchasedList || []);
      }
    } catch (error) {
      console.log("error notification", error);
    }
  },
  async onReadNoti({}, payload) {
    try {
      await (this as any).$api.$post("updateNotification", payload);
    } catch (error) {}
  },
  async listNotification({ commit }) {
    try {
      let ref: DocumentData = firebase.firestore().collection("notifications");
      await ref.onSnapshot(async (querySnapshot: any[]) => {
        let notifications: any = [];
        querySnapshot.forEach(
          (doc: { id: string; data: () => INotification[] }) => {
            notifications.push({
              id: doc.id,
              ...doc.data()
            });
          }
        );
        console.log("notifications", notifications);

        const listNotiArranged = notifications.sort(
          (a: INotification, b: INotification) => {
            return (new Date(b.date) as any) - (new Date(a.date) as any);
          }
        );
        commit("SET_LIST_NOTIFICATION", listNotiArranged);
      });
    } catch (error) {
      console.log("error notification", error);
    }
  },
  async editDiliveryAddress({ dispatch }, payload) {
    const user = await firebase.auth().currentUser;
    if (user) {
      const deliveryRef = firebase
        .firestore()
        .collection("userProfile")
        .doc(user.uid);
      deliveryRef
        .update({
          diliveryAddress: firebase.firestore.FieldValue.delete()
        })
        .then(() => {
          deliveryRef
            .set(
              {
                diliveryAddress: [...payload]
              },
              {
                merge: true
              }
            )
            .then(() => {
              console.log("edited");
              dispatch("getUserProfile");
            });
          console.log("removed");
        });
    }
  },
  async setDeliveryAddress({ dispatch }, payload) {
    console.log(payload);
    const user = await firebase.auth().currentUser;
    if (user) {
      firebase
        .firestore()
        .collection("userProfile")
        .doc(user.uid)
        .update({
          diliveryAddress: firebase.firestore.FieldValue.arrayUnion({
            name: payload.name,
            phoneNumber: payload.phoneNumber,
            location: {
              ...payload.location
            }
          })
        })
        .then(() => {
          console.log("updated");
          dispatch("getUserProfile");
        })
        .catch(e => {
          alert(e);
        });
    }
  },
  async setUserAvatar({ dispatch }, payload) {
    console.log("this is action set user avatar");
    // console.log(payload.isAvatar);
    const user = await firebase.auth().currentUser;
    if (user) {
      const storageRef = firebase
        .storage()
        .ref()
        .child(`user_profile/${user.uid}`);
      storageRef.put(payload.isAvatar).then(log => {
        firebase
          .storage()
          .ref()
          .child(`user_profile/${user.uid}`)
          .getDownloadURL()
          .then(url => {
            firebase
              .firestore()
              .collection("userProfile")
              .doc(user.uid)
              .set(
                {
                  avatarUrl: url
                },
                { merge: true }
              )
              .then(() => {
                console.log("uploaded");
                dispatch("getUserProfile");
              });
          });
      });
    }
  },
  async getUserProfile({ commit }) {
    const user = await firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const result = await firebase
        .firestore()
        .collection("userProfile")
        .doc(userId)
        .get()
        .then(docRef => {
          const userData: any = {
            id: docRef.id,
            ...docRef.data()
          };
          if (!userData?.avatarUrl && userData?.sex) {
            commit("SET_CURRENT_USER", {
              ...userData,
              avatarUrl:
                userData?.sex == "male"
                  ? `https://firebasestorage.googleapis.com/v0/b/projectfoodfast.appspot.com/o/sex_default%2Fmale.png?alt=media&token=e6f99ca9-7f0d-4a4b-ae55-a240e4cef1ae`
                  : `https://firebasestorage.googleapis.com/v0/b/projectfoodfast.appspot.com/o/sex_default%2Ffemale.png?alt=media&token=2e0743c7-8d69-4a8b-a5bd-ede232ce4b61`
            });
          } else if (!userData?.avatarUrl && !userData?.sex) {
            commit("SET_CURRENT_USER", {
              ...userData,
              avatarUrl: `https://firebasestorage.googleapis.com/v0/b/projectfoodfast.appspot.com/o/sex_default%2Fhacker.png?alt=media&token=d14a7100-61ea-43b4-bc8b-a036e31ac651`
            });
          } else {
            commit("SET_CURRENT_USER", {
              ...userData
            });
          }
        });
      return result;
    }
  },
  async setUserProfile({ dispatch }, payload) {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      await (this as any).$api.$post("setUserProfile", { userId, ...payload });
      dispatch("getUserProfile");
    }
  },
  async signUp({ commit, dispatch }, payload) {
    commit("SET_LOGGED_IN", true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(
        payload.userProfile.email,
        payload.password
      )
      .then(() => {
        const user = firebase.auth().currentUser;
        user!
          .sendEmailVerification()
          .then(() => {
            commit(
              "SET_SNACKBAR",
              {
                show: true,
                text: "Успешная регистрация, пожалуйста, проверьте вашу электронную почту",
                color: "success"
              },
              { root: true }
            );
            dispatch("setUserProfile", {
              ...payload.userProfile,
              role: UserPermissions.USER
            });
            this.$router.push("/");
            commit("SET_LOGGED_IN", false);
          })
          .catch(error => {
            commit(
              "SET_SNACKBAR",
              {
                show: true,
                text: error.code,
                color: "error"
              },
              { root: true }
            );
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
        commit("SET_LOGGED_IN", false);
        if (error.code === "auth/email-already-in-use") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Tài Khoản Đã Tồn Tại",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/invalid-email") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Email Không Đúng Định Dạng",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/operation-not-allowed") {
          alert("Sai Mật Khẩu Tài Khoản");
        } else {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Mật Khẩu Yếu",
              color: "error"
            },
            { root: true }
          );
        }
      });
  },
  async signIn({ commit, dispatch }, payload) {
    commit("SET_LOGGED_IN", true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(() => {
        commit(
          "SET_SNACKBAR",
          {
            show: true,
            text: "Войти успешно",
            color: "success"
          },
          { root: true }
        );
        console.log("sign success !");
        const user = firebase.auth().currentUser;
        dispatch("getUserProfile");
        commit("SET_LOGGED_IN", false);
        if (payload.type) {
          this.$router.push({ name: "admin-dashboard" });
        } else {
          this.$router.push("/");
        }
      })
      .catch(error => {
        console.log(error);
        commit("SET_LOGGED_IN", false);
        if (error.code === "auth/email-already-in-use") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Aккаунт уже существует",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/invalid-email") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Неверный формат электронной почты",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/operation-not-allowed") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Không được phép",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/wrong-password") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Sai mật khẩu hoặc tài khoản",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/too-many-requests") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text:
                "Tài khoản bị vô hiệu hóa, đổi mật khẩu hoặc đợi ít phút để tiếp tục",
              color: "error"
            },
            { root: true }
          );
        }
      });
  },
  async adminSignIn({ commit, dispatch }, payload) {
    commit("SET_LOGGED_IN", true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(async () => {
        commit(
          "SET_SNACKBAR",
          {
            show: true,
            text: "Войти успешно",
            color: "success"
          },
          { root: true }
        );
        console.log("sign success !");
        await dispatch("getUserProfile");
        commit("SET_LOGGED_IN", false);
        this.$router.push("/admin/dashboard");
      })
      .catch(error => {
        console.log(error);
        commit("SET_LOGGED_IN", false);
        if (error.code === "auth/email-already-in-use") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Aккаунт уже существует",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/invalid-email") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Электронная почта недействительна",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/operation-not-allowed") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Неавторизованный",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/wrong-password") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Неправильный пароль или аккаунт",
              color: "error"
            },
            { root: true }
          );
        } else if (error.code === "auth/too-many-requests") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text:
                "Аккаунт отключен, смените пароль или подождите несколько минут, чтобы продолжить",
              color: "error"
            },
            { root: true }
          );
        }
      });
  },
  async logout({ commit }) {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        commit("SET_CURRENT_USER", null);
        commit(
          "SET_SNACKBAR",
          {
            show: true,
            text: "",
            color: "success"
          },
          { root: true }
        );
      })
      .catch(error => {
        commit(
          "SET_SNACKBAR",
          {
            show: true,
            text: error.message,
            color: "error"
          },
          { root: true }
        );
      });
  },
  async getListUser({ commit }, roleGet) {
    console.log(roleGet);
    const result = await firebase
      .firestore()
      .collection("userProfile")
      .onSnapshot(async querySnapshot => {
        let data: any = [];
        // let listOrders: any = [];
        querySnapshot.forEach(doc => {
          data.push({
            id: doc.id,
            data: doc.data()
          });
        });
        console.log(data);
        const profiles: any = [];
        for (const profile of data) {
          if (profile.data.role === roleGet) {
            const { avatarUrl, ...data } = profile.data;
            if (!avatarUrl && data?.sex) {
              profiles.push({
                id: profile.id,
                ...data,
                avatarUrl:
                  data?.sex == "male"
                    ? `https://firebasestorage.googleapis.com/v0/b/projectfoodfast.appspot.com/o/sex_default%2Fmale.png?alt=media&token=e6f99ca9-7f0d-4a4b-ae55-a240e4cef1ae`
                    : `https://firebasestorage.googleapis.com/v0/b/projectfoodfast.appspot.com/o/sex_default%2Ffemale.png?alt=media&token=2e0743c7-8d69-4a8b-a5bd-ede232ce4b61`
              });
            } else if (!avatarUrl && !data?.sex) {
              profiles.push({
                id: profile.id,
                ...data,
                avatarUrl: `https://firebasestorage.googleapis.com/v0/b/projectfoodfast.appspot.com/o/sex_default%2Fhacker.png?alt=media&token=d14a7100-61ea-43b4-bc8b-a036e31ac651`
              });
            } else {
              profiles.push({
                id: profile.id,
                ...profile.data
              });
            }
          }
        }
        commit("SET_LIST_USERS", profiles);
        console.log(profiles);
      });
  },
  async setUserToStaff({ dispatch }, payload) {
    console.log("payload", payload);

    const { id, ...dataChange } = payload;
    const body = {
      path: `userProfile/${id}`,
      data: {
        ...dataChange
      }
    };
    try {
      await FirestoreService.update(body);
      dispatch(
        "setSnackBar",
        {
          show: true,
          text: "Данные успешно изменены !",
          color: "success"
        },
        { root: true }
      );
    } catch (error) {
      console.log("error", error);

      dispatch(
        "setSnackBar",
        {
          show: true,
          text: "Не удалось изменить информацию. Повторите попытку. !",
          color: "error"
        },
        { root: true }
      );
    }
  },
  async setFavourite({ commit }, payload) {
    const user = await firebase.auth().currentUser;
    if (user) {
      try {
        let data = {};
        payload.type == "plus"
          ? (data = {
              favouriteProduct: FirestoreService.addArrayFirestore(payload.id)
            })
          : (data = {
              favouriteProduct: FirestoreService.deleteElementArrayFirestore(
                payload.id
              )
            });
        const response = await FirestoreService.update({
          path: `userProfile/${user.uid}`,
          data: data
        });
        return true;
      } catch (e) {
        return false;
      }
    }
  },
  async getFavouriteProduct({ commit }) {
    console.log("asdsadasasasdsadsa");

    const user = await firebase.auth().currentUser;
    if (user) {
      const response = await FirestoreService.get({
        path: `userProfile/${user.uid}`,
        type: IsTypeQuery.document
      });
      if (response.data?.favouriteProduct.length == 0) {
        return false;
      } else {
        commit("GET_FAVOURITE_PRODUCT", response.data.favouriteProduct);
        return response.data.favouriteProduct;
      }
    }
  },
  async setFeedBack({ commit, state }, payload) {
    try {
      const result = await FirestoreService.add({
        path: "feedback",
        data: payload
      });
      // add notification
      await (this as any).$api.$post("addNotification", {
        type: NotificationType.FEED_BACK,
        content: `Có góp ý mới từ ${state.userProfile?.name}`,
        idType: result.id,
        isRead: false,
        date: new Date()
      });
      return true;
    } catch (e) {
      return false;
    }
  },
  async getFeedBack() {
    try {
      const path = "feedback";
      const type = IsTypeQuery.collection;
      const response = await FirestoreService.get({ path, type });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
};

export const mutations: MutationTree<UserState> = {
  SET_PURCHASED_LIST(state: UserState, payload) {
    state.purchasedList = payload;
  },
  SET_LIST_NOTIFICATION(state: UserState, payload) {
    state.notifications = payload;
  },
  SET_LIST_USERS(state: UserState, payload) {
    state.listUsers = payload;
  },
  SET_LOGGED_IN(state: UserState, payload) {
    state.loggedIn = payload;
  },

  SET_CURRENT_USER(state: UserState, payload) {
    // console.log(payload);
    state.userProfile = payload;
  },

  GET_FAVOURITE_PRODUCT(state: UserState, payload) {
    state.listFavourite = payload;
  }
};

export const getters: GetterTree<UserState, UserState> = {
  isLoggedIn(state: UserState) {
    return state.loggedIn;
  },
  isCheckUser(state: UserState) {
    if (state.userProfile === null) return false;
    else return true;
  },
  getUser(state: UserState) {
    return state.userProfile;
  }
};
