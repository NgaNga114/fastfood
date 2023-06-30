import { Middleware } from "@nuxt/types";
import "firebase/auth";
import firebase from "firebase";
import { shipperRoutes, userNotAuthRoutes } from "../config/default-routes";
import { UserPermissions } from "../types/user";

const middleware: Middleware = async ({ route, store, redirect }) => {
  const isAdminRoute = route.name?.split("-")[0];
  const user = store.state.user?.userProfile;

  // middleware for client
  if (isAdminRoute !== "admin") {
    if (!user) {
      if (userNotAuthRoutes.includes(route.name!)) {
        redirect("/signin");
      }
    }
  }

  // middleware for admin
  else {
    if (!user && route.name! !== "admin") {
      redirect("/admin");
    } else if (user && route.name! === "admin") {
      redirect("/admin/dashboard");
    } else {
      const role = user?.role;
      if (
        role === UserPermissions.SHIPPER &&
        !shipperRoutes.includes(route.name!)
      ) {
        redirect("/admin/dashboard");
      } else if (role === UserPermissions.USER) {
        redirect("/");
      }
    }
  }
};
export default middleware;
