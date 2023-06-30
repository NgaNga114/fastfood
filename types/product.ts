export interface Product {
  id: string;
  name: string;
  rate: number;
  price: number;
  oldPrice: number;
  type: Object;
  link: string;
  image: Blob | Uint8Array | ArrayBuffer;
}
export interface IAllLoadingProduct {
  loadingOrder?: boolean;
  loadingProduct?: boolean;
}

export interface Cart {
  id: string;
  quantity: number;
  pick: boolean;
}
export interface IListOrder {
  id: string;
  products: {
    products: IProductInOrders[];
    totalPrice: number;
  };
  pickUpInfo: {
    location: {
      city: {
        id: number;
        detailAddress: string;
      };
      district: {
        id: number;
        detailAddress: string;
      };
      ward: {
        id: number;
        detailAddress: string;
      };
    };
  };
  timestamp: string;
  userId: string;
  note: string;
  status: number;
}
export type IProductInOrders = {
  url?: string;
  price?: number;
  name: string;
  quantity: number;
  id: string;
};
export interface IFavouriteProduct {
  id: string,
  listFavourite: object
}
