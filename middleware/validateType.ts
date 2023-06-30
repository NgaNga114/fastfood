import { Middleware } from "@nuxt/types";

const middleware: Middleware = async context => {
  const typeInvalid = [
    "com",
    "garan",
    "burger",
    "promotional",
    "ponlan",
    "combo",
    "dessert"
  ];
  if (!typeInvalid.includes(context.params.type)) {
    context.redirect("/");
  }
};
export default middleware;
