import firebase from "firebase";
import { IListOrder } from "../types/product";
import { FirestoreServices } from "../services/firestore";
import { OrderStatus } from "~/enums/order";

const FirestoreService = new FirestoreServices();

class OrderServices {
  public async findAll() {
    return await firebase
      .firestore()
      .collection("orders")
      .get();
  }
  public async findOrderByUserId(userId: string) {
    return await firebase
      .firestore()
      .collection("orders")
      .where("userId", "==", userId)
      .get();
  }
  public cancelOrderByUserId(order: IListOrder) {
    const path = `orders/${order.id}`;
    return FirestoreService.update({
      path,
      data: { status: OrderStatus.Cancel }
    });
  }
}
export const getProductNameWithId = async (productId: string) => {
  const productRef = firebase
    .firestore()
    .collection("products")
    .doc(productId);
  const productSnapShot = await productRef.get();
  return {
    name: productSnapShot.data()?.name || "",
    price: productSnapShot.data()?.price || null,
    image: productSnapShot.data()?.image || ""
  };
};

export default new OrderServices();
