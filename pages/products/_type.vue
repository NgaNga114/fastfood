<template>
  <div style="max-width: 1200px; margin: 0 auto;">
    <div class="my-3">
      <Breadcrumbs :items="item_breadcrumbs" />
    </div>
    <v-row>
      <v-col cols="12" lg="8" md="12" sm="12">
        <div class="red--text text-body-2 font-weight-bold">
          АКЦИИ
        </div>
        <v-divider class="my-2"></v-divider>

        <v-row>
          <v-col cols="12" class="pb-0">
            <v-row>
              <v-col class="pb-0 pr-3 pr-sm-1" cols="12" lg="4" md="4" sm="4">
                <div class="box-sale pb-3">
                  <BoxSale @buyNow="onBuyNow" />
                </div>
              </v-col>
              <v-col class="pb-0 pl-2" cols="12" lg="8" md="8" sm="8">
                <v-row v-if="products.length >= 0" class="pl-3">
                  <v-col
                    class="pt-0 pl-0"
                    v-for="item in products_4"
                    :key="item.index"
                    cols="6"
                  >
                    <v-card height="100%">
                      <BoxProduct :item="item" />
                    </v-card>
                  </v-col>
                </v-row>
                <v-row class="pl-3" v-if="products.length <= 0">
                  <v-col
                    class="pt-0 pl-0"
                    v-for="item in 4"
                    :key="item.index"
                    cols="6"
                  >
                    <v-card height="100%">
                      <v-skeleton-loader
                        class="mx-auto"
                        max-width="300"
                        type="card"
                      ></v-skeleton-loader>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12 pt-0">
            <v-row v-if="products.length >= 0" class="pl-3">
              <v-col
                class="pt-0 pl-0"
                v-for="item in products_3"
                :key="item.index"
                cols="6"
                xl="4"
                lg="4"
                md="4"
                sm="4"
              >
                <v-card max-width="350" height="100%">
                  <BoxProduct :item="item" />
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="products.length <= 0" class="pl-3">
              <v-col
                class="pt-0 pl-0"
                v-for="item in 3"
                :key="item.index"
                cols="6"
                xl="4"
                lg="4"
                md="4"
                sm="4"
              >
                <v-card max-width="350" height="100%">
                  <v-skeleton-loader
                    class="mx-auto"
                    max-width="300"
                    type="card"
                  ></v-skeleton-loader>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-pagination
          color="yellow darken-3"
          class="float-right mt-n3"
          v-model="page"
          :length="4"
        ></v-pagination>
      </v-col>
      <v-col cols="12" lg="4" md="12" sm="12">
        <div class="red--text text-body-2 font-weight-bold">
          СПЕЦИАЛЬНОЕ КОМБО
        </div>
        <v-divider class="my-2 mb-5"></v-divider>
        <v-row>
          <v-col
            class="pb-2 pl-0"
            cols="12"
            sm="6"
            md="6"
            lg="12"
            v-for="item in 4"
            :key="item.index"
          >
            <Short />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BoxProduct from "../../components/BoxProduct";
import Short from "../../components/Short";
import Breadcrumbs from "../../components/Breadcrumbs";
import BoxSale from "../../components/BoxSale";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  middleware: "validateType",
  components: {
    BoxProduct,
    Short,
    Breadcrumbs,
    BoxSale
  },
  // async middleware(context) {
  //   console.log(context);
  //   const type = await context.store.state.products.products.map(x => {
  //     return x.type.value;
  //   });
  //   console.log(type);
  //   const validate_params = type.includes(context.params.type);
  //   if (!validate_params) context.redirect("/");
  // },
  data() {
    return {
      page: 1
    };
  },
  computed: {
    ...mapGetters("user", ["isCheckUser", "getUser"]),
    ...mapState("products", ["products"]),
    products_4() {
      // console.log(this.$route.params.type);
      const items = this.products.filter(x => {
        return x.type.value === this.$route.params.type;
      });

      return items.slice(0, 4);
    },
    products_3() {
      // console.log(this.$route.params.type);
      const items = this.products.filter(x => {
        return x.type.value === this.$route.params.type;
      });

      return items.slice(0, 3);
    },
    item_breadcrumbs() {
      if (this.$route.params.type === "garan") {
        return [
          {
            text: "Главная страница",
            disabled: false,
            href: "/"
          },
          {
            text: "Жареная курочка",
            disabled: true,
            href: "products/garan"
          }
        ];
      } else if (this.$route.params.type === "promotional") {
        return [
          {
            text: "Главная страница",
            disabled: true,
            href: "/"
          },
          {
            text: "Акция",
            disabled: false,
            href: "products/promotional"
          }
        ];
      } else if (this.$route.params.type === "com") {
        return [
          {
            text: "Главная страница",
            disabled: true,
            href: "/"
          },
          {
            text: "Рис",
            disabled: false,
            href: "products/com"
          }
        ];
      } else if (this.$route.params.type === "burger") {
        return [
          {
            text: "Главная страница",
            disabled: true,
            href: "/"
          },
          {
            text: "Бургер",
            disabled: false,
            href: "products/burger"
          }
        ];
      } else if (this.$route.params.type === "ponlan") {
        return [
          {
            text: "Главная страница",
            disabled: true,
            href: "/"
          },
          {
            text: "Что мы едим сегодня ?",
            disabled: false,
            href: "products/ponlan"
          }
        ];
      } else if (this.$route.params.type === "combo") {
        return [
          {
            text: "Главная страница",
            disabled: true,
            href: "/"
          },
          {
            text: "Специальное комбо",
            disabled: false,
            href: "products/combo"
          }
        ];
      }
    }
  },
  methods: {
    ...mapActions("products", ["buyNow"]),
    onBuyNow() {
      if (this.isCheckUser) {
        this.buyNow({
          id: "especially1",
          pick: true,
          quantity: 1
        });
        this.$router.push("/checkout-page");
      } else {
        this.$router.push("/signin");
      }
    }
  }
};
</script>

<style scoped>
.box-sale {
  border-radius: 7px;
  height: 100%;
}
</style>
