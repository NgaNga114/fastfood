import { ActionTree, MutationTree, GetterTree } from "vuex";
import { Product } from "../types/product";
import { StaffStatus } from "../types/user";
import { IsTypeQuery } from "../types/api";
import { Cart } from "../types/product";
import firebase from "firebase";
import admin from "firebase-admin";
import { RootState } from "./index";
import OrderServices from "../services/order.service";
import { getProductNameWithId } from "../services/order.service";
import {
  StorageServices,
  AuthenticationServices,
  FirestoreServices
} from "../services/firestore";
import { NotificationType } from "~/enums/notification";
import { IRating } from "~/types/rating";

import { OrderStatus } from "../enums/order";

const FirestoreService = new FirestoreServices();
const AuthenticationService = new AuthenticationServices();
const StorageService = new StorageServices();

export type ProduceState = {
  cart: Cart[];
  loader: boolean;
  products: Product[];
  listRate: IRating[];
  listFavourite: []
};

export const state = (): ProduceState => ({
  cart: [],
  loader: false,
  products: [],
  listRate: [],
  listFavourite: []
});

export const actions: ActionTree<ProduceState, RootState> = {
  async getListRate({ commit }, productId: string) {
    try {
      console.log("productId", productId);

      firebase
        .firestore()
        .collection("reviews")
        .where("productId", "==", productId)
        .onSnapshot(async snapshot => {
          const rates: any[] = [];
          snapshot.forEach(doc => {
            rates.push({
              id: doc.id,
              ...doc.data()
            });
          });
          console.log("rates", rates);
          const response = await (this as any).$api.$post("rateDetail", rates);
          commit("SET_LIST_RATE", response);
        });
    } catch (error) {
      console.log("error", error);
    }
  },
  async updateRatingProduct({}, payload: IRating) {
    try {
      const response = await (this as any).$api.$post(
        "updateRatingProduct",
        payload
      );
      return response;
    } catch (error) {
      console.log("error", error);
    }
  },
  async ratingProduct({}, payload: IRating) {
    try {
      console.log("payload rating product", payload);

      const response = await (this as any).$api.$post("ratingProduct", payload);
      return response;
    } catch (error) {
      console.log("error", error);
    }
  },
  buyNow({ commit }, payload) {
    commit("BUY_NOW", payload);
  },
  async listProducts({ commit, state }, payload) {
    commit("EMPTY_PRODUCTS");
    try {
      const path = "products";
      const type = IsTypeQuery.collection;
      const response = await FirestoreService.get({ path, type });
      console.log("products response", response);
      response.forEach((e: any) => {
        commit("SET_PRODUCTS", {
          id: e.id,
          ...e.data
        });
        commit("LOADER", false);
      });
    } catch (error) {
      console.log(error);
    }
    // firebase
    //   .firestore()
    //   .collection("products")
    //   .get()
    //   .then(result => {
    //     result.forEach(doc => {
    //       const id = doc.id;
    //       const { name, price, oldPrice, type } = doc.data();
    //       // get product image
    //       firebase
    //         .storage()
    //         .ref()
    //         .child(`product_images/${id}`)
    //         .getDownloadURL()
    //         .then(url => {
    //           commit("SET_PRODUCTS", {
    //             id,
    //             name,
    //             price,
    //             oldPrice,
    //             type,
    //             image: url
    //           });
    //         });
    //     });
    //   });
  },
  editProduct({ dispatch, commit }, payload: Product) {
    commit("LOADER", true);
    const { image, ...temProduct } = payload;
    firebase
      .firestore()
      .collection("products")
      .doc(payload.id)
      .update({
        ...temProduct
      })
      .then(result => {
        if (typeof image == "string") {
          firebase
            .firestore()
            .collection("products")
            .doc(payload.id)
            .update({
              image
            });
        } else if (payload.image) {
          firebase
            .storage()
            .ref()
            .child(`product_images/${payload.id}`)
            .delete()
            .then(() => {
              firebase
                .storage()
                .ref()
                .child(`product_images/${payload.id}`)
                .put(payload.image)
                .then(log => {
                  firebase
                    .storage()
                    .ref()
                    .child(`product_images/${payload.id}`)
                    .getDownloadURL()
                    .then(url => {
                      console.log("url", typeof url);
                      dispatch("editProduct", { id: payload.id, image: url });
                      dispatch("listProducts", "redispatch-listProducts");
                    });
                });
            });
        } else {
          dispatch("listProducts", "redispatch-listProducts");
        }
      });
  },
  deleteProduct({ dispatch, commit }, id) {
    commit("LOADER", true);
    firebase
      .firestore()
      .collection("products")
      .doc(id)
      .delete()
      .then(() => {
        firebase
          .storage()
          .ref()
          .child(`product_images/${id}`)
          .delete()
          .then(() => {
            dispatch("listProducts", "redispatch-listProducts");
          });
      });
  },
  async buyProducts({ commit, dispatch, rootState }, payload) {
    const user = firebase.auth().currentUser;
    if (user) {
      const timestamp = getDateAndTime();
      const { userName, ...order } = payload;
      commit("LOADER", true);
      firebase
        .firestore()
        .collection("orders")
        .add({
          userId: user.uid,
          ...order,
          timestamp,
          status: OrderStatus.Waiting
        })
        .then(async result => {
          commit("LOADER", false);
          this.$router.push("/checkorder");
          const listIdCarts = payload.products.products.map((product: Cart) => {
            return product.id;
          });
          // add notification
          await (this as any).$api.$post("addNotification", {
            type: NotificationType.ORDER,
            content: `Пришел новый заказ от ${rootState.user.userProfile?.name}`,
            idType: result.id,
            isRead: false,
            date: new Date()
          });
          commit("REMOVE_PRODUCT_PICK", listIdCarts);
        })
        .catch(error => {
          commit("LOADER", false);
          alert(error);
        });
    }
  },
  addToCart({ commit }, payload) {
    commit("ADD_TO_CART", payload);
  },
  changePick({ commit }, payload) {
    commit("CHANGE_PICK", payload);
  },
  changeAllPick({ commit }, payload) {
    commit("CHANGE_ALL_PICK", payload);
  },
  augment({ commit }, payload) {
    commit("AUGMENT", payload);
  },
  abate({ commit }, payload) {
    commit("ABATE", payload);
  },
  remove({ commit }) {
    commit("REMOVE");
  },
  resetPassword({ commit }, email) {
    commit("LOADER", true);
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        commit("LOADER", false);
        commit(
          "SET_SNACKBAR",
          {
            show: true,
            text: "Пожалуйста, проверьте свою электронную почту",
            color: "success"
          },
          { root: true }
        );
      })
      .catch(e => {
        commit("LOADER", false);
        console.log(e);
        if (e.code === "auth/user-not-found") {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Tài khoản không tồn tại, thử lại",
              color: "error"
            },
            { root: true }
          );
        } else {
          commit(
            "SET_SNACKBAR",
            {
              show: true,
              text: "Thử lại",
              color: "error"
            },
            { root: true }
          );
        }
      });
  },
  async getOnceFavouriteProduct({ commit }, payload) {
    try {
      const response = await FirestoreService.get({
        path: `products/${payload}`,
        type: IsTypeQuery.document
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
  async favouriteProductAPI({ commit }, payload) {
    try {
      const response = await (this as any).$api.$post("favouriteProductAPI", payload);
      commit("SET_LIST_FAVOURITE", response)
      return "ok"
    } catch (e) {
      console.log(e);
    }
  },

  async createProduct({ dispatch, commit }, payload) {
    try {
      commit("LOADER", true);
      const { image, ...data } = payload;
      const response = await FirestoreService.add({
        path: "products",
        data: data
      });
      const fullPath = await StorageService.storagePut({
        path: `product_images/${response.id}`,
        data: image
      });

      const url = await StorageService.storageGetDownloadUrl(
        fullPath.metadata.fullPath
      );
      const path = `products/${response.id}`;
      const newProduct = await FirestoreService.update({
        path,
        data: { image: url }
      });
      dispatch("listProducts", "redispatch-listProducts");
    } catch (e) {
      console.log(e);
    }
  }
};

export const mutations: MutationTree<ProduceState> = {
  SET_LIST_FAVOURITE(state, payload){
    state.listFavourite = payload
  },
  SET_LIST_RATE(state: ProduceState, payload: IRating[]) {
    state.listRate = payload;
  },
  SET_PRODUCTS(state: ProduceState, payload) {
    state.products.push(payload);
  },
  EMPTY_PRODUCTS(state: ProduceState) {
    state.products = [];
  },
  ADD_TO_CART(state: ProduceState, payload) {
    const listId = state.cart.map(x => {
      return x.id;
    });
    const alreadyExist = listId.includes(payload.id);
    if (alreadyExist) {
      const index = state.cart.findIndex(product => {
        return product.id === payload.id;
      });
      state.cart[index].quantity++;
    } else {
      state.cart.push(payload);
    }
  },
  REMOVE_PRODUCT_PICK(state: ProduceState, listId) {
    const listIndexs: number[] = [];
    listId.forEach((id: string) => {
      const index = state.cart.findIndex(product => {
        return product.id === id;
      });
      listIndexs.push(index);
    });
    for (let i = listIndexs.length - 1; i >= 0; i--) {
      state.cart.splice(listIndexs[i], 1);
    }
  },
  BUY_NOW(state: ProduceState, payload) {
    state.cart = [];
    state.cart.push(payload);
  },
  CHANGE_PICK(state: ProduceState, payload) {
    const index = state.cart.findIndex(product => {
      return product.id === payload.id;
    });
    state.cart[index].pick = payload.pick;
  },
  CHANGE_ALL_PICK(state: ProduceState, payload) {
    state.cart.forEach(x => (x.pick = payload.allPick));
  },
  AUGMENT(state: ProduceState, payload) {
    const index = state.cart.findIndex(x => {
      return x.id === payload.id;
    });
    if (payload.quantity < 20) {
      state.cart[index].quantity++;
    } else {
      alert("max 20");
    }
  },
  ABATE(state: ProduceState, payload) {
    const index = state.cart.findIndex(x => {
      return x.id === payload.id;
    });
    if (payload.quantity !== 1) {
      state.cart[index].quantity--;
    } else {
      alert("Min 1");
    }
  },
  REMOVE(state: ProduceState) {
    const tmp = state.cart.filter(x => {
      return x.pick === false;
    });
    state.cart = tmp;
  },
  LOADER(state, loader) {
    state.loader = loader;
  }
};

export const getters: GetterTree<ProduceState, RootState> = {
  getLengthCart(state: ProduceState) {
    return state.cart.length;
  },
  getProductInCart(state: ProduceState) {
    return state.cart.map(product => {
      let found_product = state.products.find(x => {
        return product.id === x.id;
      });
      return {
        ...found_product!,
        quantity: product.quantity,
        pick: product.pick
      };
    });
  },
  loader(state: ProduceState) {
    return state.loader;
  }
};

const getDateAndTime = function() {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
};
