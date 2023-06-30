import { ActionTree, MutationTree, GetterTree } from "vuex";
import { UserProfile, UserPermissions, StaffStatus } from "../types/user";
import { ISidebarItem, IChildren } from "../types/sidebar";

import { UserState } from "./user";

export type SidebarState = {
  routes: ISidebarItem[];
};

type RootState = {
  user: UserState;
};

export const state = (): SidebarState => ({
  routes: [
    {
      permissions: [UserPermissions.ADMIN, UserPermissions.SHIPPER],
      icon: "mdi-apps",
      title: "ПАНЕЛЬ ПРИБОРОВ",
      to: "/admin/dashboard"
    },
    {
      permissions: [UserPermissions.ADMIN, UserPermissions.SHIPPER],
      icon: "mdi-cart",
      title: "ЗАКАЗ",
      children: [
        {
          // permissions: [UserPermissions.ADMIN],
          title: "Создать заказ",
          to: "/admin/createorder"
        },
        {
          // permissions: [UserPermissions.ADMIN, UserPermissions.SHIPPER],
          title: "Список заказов",
          to: "/admin/listorder"
        },
        {
          // permissions: [UserPermissions.ADMIN, UserPermissions.SHIPPER],
          title: "Возвратные заказы",
          to: "/admin/refund"
        }
      ]
    },
    {
      permissions: [UserPermissions.ADMIN],
      icon: "mdi-account",
      title: "ПЕРСОНАЛ",
      children: [
        {
          // permissions: [UserPermissions.ADMIN],
          title: "Список сотрудников",
          to: "/admin/staffs"
        }
      ]
    },
    {
      permissions: [UserPermissions.ADMIN, UserPermissions.SHIPPER],
      icon: "mdi-gift",
      title: "ПРОДУКТЫ",
      children: [
        {
          // permissions: [UserPermissions.ADMIN, UserPermissions.SHIPPER],
          title: "Список продуктов",
          to: "/admin/listproducts"
        }
      ]
    },
    {
      permissions: [UserPermissions.ADMIN],
      icon: "mdi-account-multiple",
      title: "ПОЛЬЗОВАТЕЛЬ",
      children: [
        {
          // permissions: [UserPermissions.ADMIN],
          title: "Список пользователей",
          to: "/admin/listusers"
        }
      ]
    },
    {
      permissions: [UserPermissions.ADMIN, UserPermissions.SHIPPER],
      icon: "mdi-chart-bar",
      title: "ОТЧЕТ",
      to: "/admin/detailreport"
    },
    {
      permissions: [UserPermissions.ADMIN, UserPermissions.ADMIN],
      icon: "mdi-comment-text-multiple",
      title: "КОММЕНТАРИИ",
      to: "/admin/feedback"
    }
  ]
});

export const actions: ActionTree<SidebarState, SidebarState> = {};

export const mutations: MutationTree<SidebarState> = {};

export const getters: GetterTree<SidebarState, RootState> = {
  isActiveRoutes(state: SidebarState, getters, rootState: RootState) {
    const role = rootState.user.userProfile?.role;
    // console.log("role", role);
    if (role) {
      return state.routes.filter((route: ISidebarItem) => {
        return route.permissions?.includes(role);
      });
    }
  }
};
