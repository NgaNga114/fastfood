import { ActionTree, MutationTree, GetterTree } from "vuex";
import { Product } from "../types/product";
import { StaffStatus } from "../types/user";
import { IsTypeQuery } from "../types/api";
import OrderServices from "../services/order.service";
import {
  IListOrder,
  IProductInOrders,
  IAllLoadingProduct
} from "../types/product";
import firebase from "firebase";
import { RootState } from "./index";
import { getProductNameWithId } from "../services/order.service";
import {
  StorageServices,
  AuthenticationServices,
  FirestoreServices
} from "../services/firestore";
import { OrderStatus } from "~/enums/order";
import { UserPermissions } from "../types/user";
import { DocumentData } from "@google-cloud/firestore";
import { NotificationType } from "~/enums/notification";

const FirestoreService = new FirestoreServices();
const AuthenticationService = new AuthenticationServices();
const StorageService = new StorageServices();

type OrderState = {
  loader: boolean;
  listOrder: IListOrder[];
  isOrderLoading: Boolean;
  order_pending: IListOrder | null;
  orderPendingList: IListOrder[] | [];
  listOrderNotDetail: IListOrder[] | [];
};

export const state = (): OrderState => ({
  order_pending: null,
  loader: false,
  listOrder: [],
  isOrderLoading: false,
  orderPendingList: [],
  listOrderNotDetail: []
});

export const actions: ActionTree<OrderState, RootState> = {
  async getOrderPendingByUserId({ commit, state }) {
    const user = firebase.auth().currentUser;
    if (user) {
      // let orderByUserId: any;
      const userId = user?.uid;
      firebase
        .firestore()
        .collection("orders")
        .where("userId", "==", userId)
        .where("status", "not-in", [0, 3])
        .onSnapshot(
          async snapshot => {
            const listPending: any[] = [];
            snapshot.forEach(doc => {
              listPending.push({
                id: doc.id,
                ...doc.data()
              });
            });

            console.log("listPending", listPending);

            const convertPendingList = await Promise.all(
              listPending.map(async orderByUserId => {
                let isShipper: any = {};
                if (orderByUserId?.shipper) {
                  console.log("testt");
                  isShipper = await FirestoreService.get({
                    path: `userProfile/${orderByUserId.shipper}`,
                    type: IsTypeQuery.document
                  });
                }
                if (orderByUserId?.products) {
                  await Promise.all(
                    orderByUserId.products.products.map(
                      async (product: IProductInOrders, index: number) => {
                        const { name } = await getProductNameWithId(product.id);
                        orderByUserId.products.products[index] = {
                          name,
                          quantity:
                            orderByUserId.products.products[index].quantity,
                          id: product.id
                        };
                      }
                    )
                  );
                }
                console.log("orderByUserId", orderByUserId);

                return {
                  ...orderByUserId,
                  shipper: isShipper.id
                    ? {
                        id: isShipper.id,
                        ...isShipper.data
                      }
                    : null
                };
              })
            );
            console.log("convertPendingList", convertPendingList);

            commit("SET_ORDER_PENDING_LIST", convertPendingList || []);
            // if (!orderByUserId) {
            //   commit("SET_ORDER_PENDING", null);
            // }
          },
          error => {
            console.log(error);
          }
        );
    } else {
      alert("no user");
    }
  },
  async cancelOrder({ rootState }, order) {
    try {
      const { shipper, id } = order;
      const result = await (this as any).$api.$post("cancelOrder", {
        shipperId: shipper ? shipper.id : null,
        shipperStatus: StaffStatus.FREE,
        orderId: id,
        orderStatus: OrderStatus.Cancel
      });
      // add notification
      await (this as any).$api.$post("addNotification", {
        type: NotificationType.ORDER,
        content: ` ${rootState.user.userProfile?.name} отменил(a/и) заказ`,
        idType: id,
        isRead: false,
        date: new Date()
      });
      return result;
    } catch (error) {
      console.log("error", error);
    }
  },
  async setStaffStatus({ commit }, data) {
    try {
      const bodyUpdateStaffStatus = {
        path: `userProfile/${data.shipper}`,
        data: {
          status: data.status
        }
      };
      const response = await FirestoreService.update(bodyUpdateStaffStatus);
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  async updateOrderById({ dispatch, rootState }, payload) {
    const { shipper, id, ...data } = payload;
    console.log("payload order", payload);

    try {
      if (!shipper) {
        await (this as any).$api.$post("updateOrder", {
          ...data,
          status: OrderStatus.Waiting,
          orderId: id,
          shipper: null
        });
      } else {
        await (this as any).$api.$post("updateOrder", {
          ...data,
          orderId: id,
          shipper
        });
      }
      // add notification
      await (this as any).$api.$post("addNotification", {
        type: NotificationType.ORDER,
        content: `Заказ обновлен ${rootState.user.userProfile?.name}`,
        idType: id,
        isRead: false,
        date: new Date()
      });

      dispatch(
        "setSnackBar",
        {
          show: true,
          text: "Обновление заказа успешно !",
          color: "success"
        },
        { root: true }
      );
    } catch (error) {
      dispatch(
        "setSnackBar",
        {
          show: true,
          text: "Ошибка обновления заказа. Повторите попытку!",
          color: "error"
        },
        { root: true }
      );
    }
  },
  async getListOrder({ commit }, payload) {
    try {
      commit("SET_ORDER_LOADING", true);
      const { role, id } = payload;
      let ref: DocumentData = firebase.firestore().collection("orders");

      if (role && role === UserPermissions.SHIPPER) {
        ref = firebase
          .firestore()
          .collection("orders")
          .where("shipper", "==", id);
      } else if (role && role === UserPermissions.USER) {
        ref = firebase
          .firestore()
          .collection("orders")
          .where("userId", "==", id);
      }

      await ref.onSnapshot(async (querySnapshot: any[]) => {
        let data: any = [];
        let listOrders: IListOrder[] = [];
        querySnapshot.forEach((doc: { id: string; data: () => IListOrder }) => {
          data.push({
            id: doc.id,
            data: doc.data()
          });
        });
        console.log("onSnapshot", data.length);
        const orderListPretty = data.map(
          (item: { data: IListOrder; id: number }) => {
            return {
              ...item.data,
              id: item.id
            };
          }
        );

        commit("SET_LIST_ORDER_NOT_DETAIL", orderListPretty);

        try {
          listOrders = await (this as any).$api.$post("getListOrder", { data });
          console.log("listOrders", listOrders);

          commit("SET_LIST_ORDERS", listOrders);
          commit("SET_ORDER_LOADING", false);
        } catch (error) {
          console.error(error);
          commit("SET_ORDER_LOADING", false);
        }
      });
    } catch (error) {
      console.error("error", error);

      commit("SET_ORDER_LOADING", false);
    }
  }
};

export const mutations: MutationTree<OrderState> = {
  SET_ORDER_PENDING_LIST(state: OrderState, payload) {
    state.orderPendingList = payload;
  },
  SET_LIST_ORDER_NOT_DETAIL(state: OrderState, payload) {
    state.listOrderNotDetail = payload;
    console.log("state.listOrderNotDetail", state.listOrderNotDetail);
  },
  SET_ORDER_PENDING(state: OrderState, payload) {
    console.log("order_pending", payload);
    state.order_pending = payload;
  },
  SET_ORDER_LOADING(state: OrderState, payload) {
    state.isOrderLoading = payload;
  },
  SET_LIST_ORDERS(state: OrderState, payload) {
    state.listOrder = payload;
  },
  LOADER(state, loader) {
    state.loader = loader;
  }
};

export const getters: GetterTree<OrderState, RootState> = {
  totalRevenue(state: OrderState) {
    let totalPrice = 0;
    state.listOrderNotDetail.forEach((item: IListOrder) => {
      if (item.status === OrderStatus.Success) {
        totalPrice += item.products.totalPrice;
      }
    });
    return totalPrice;
  },
  totalOrderPending(state: OrderState) {
    return state.listOrderNotDetail.filter(
      order => order?.status === OrderStatus.Pending
    ).length;
  },
  totalOrderWaiting(state: OrderState) {
    return state.listOrderNotDetail.filter(
      order => order?.status === OrderStatus.Waiting
    ).length;
  },
  totalOrderSuccess(state: OrderState) {
    return state.listOrderNotDetail.filter(
      order => order?.status === OrderStatus.Success
    ).length;
  },
  totalOrderCancel(state: OrderState) {
    return state.listOrderNotDetail.filter(
      order => order?.status === OrderStatus.Cancel
    ).length;
  },
  loader(state: OrderState) {
    return state.loader;
  },
  isOrderById(state: OrderState) {
    return state.order_pending;
  },
  getOrderFromUserId(state: OrderState) {}
};
