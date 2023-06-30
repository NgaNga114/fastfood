export enum OrderStatus {
  Cancel = 0,
  Waiting = 1,
  Pending = 2,
  Success = 3
}

export const OrderTypes = [
  { name: "Все", value: null },
  { name: "Заказ на обработку", value: "1" },
  { name: "Выполняется доставка", value: "2" },
  { name: "Успешный заказ", value: "3" },
  { name: "Заказ возвращен", value: "0" }
];
