<template>
  <div>
    <client-only>
      <div class="py-3 box-search-header d-block d-md-none">
        <v-text-field
          append-icon="mdi-magnify"
          label="Tìm kiếm Fashfood"
          class="white col-9 mx-auto"
          dense
          hide-details="auto"
          outlined
        >
        </v-text-field>
      </div>
      <div class="py-0 box-info d-none d-lg-block">
        <div
          class="box-info-item container py-0 align-center d-flex justify-space-between"
        >
          <v-btn @click="$router.push('/')" text class="btn-signup"
            >ГЛАВНАЯ СТРАНИЦА</v-btn
          >
          <v-btn
            @click="$router.push('/checkorder')"
            text
            class="grey--text text--darken-1"
            >ЗАКАЗ</v-btn
          >
          <v-btn
            @click="$router.push('/contact')"
            text
            class="grey--text text--darken-1"
            >ИНФОРМАЦИЯ О FASTFOOD</v-btn
          >
          <v-btn
            @click="$router.push('/contact')"
            text
            class="grey--text text--darken-1"
            >ОБСЛУЖИВАНИЕ КЛИЕНТОВ</v-btn
          >
        </div>
      </div>
      <v-card flat>
        <v-toolbar flat class="bar container">
          <v-app-bar-nav-icon
            small
            class="hidden-sm-and-up"
            @click="sideNav = !sideNav"
          >
          </v-app-bar-nav-icon>
          <v-toolbar-title class="title-bar">
            <router-link
              class="bar-title"
              to="/"
              tag="span"
              style="cursor: pointer"
            >
              <img class="logo-img" src="../assets/images/LOGO.png" alt="" />
            </router-link>
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <div class="content-bar d-none d-md-inline">
            <v-scroll-x-transition>
              <v-autocomplete
                cache-items
                class="justify-center ml-0 box-search align-center mx-4"
                flat
                hide-no-data
                hide-details
                label="Искать продукты на FASTFOOD - супер дешево"
                solo-inverted
                append-icon="mdi-magnify"
              >
                <!-- <div class="box-icon-search ma-0" slot="append-outer">
                <v-icon class="white--text text-h4" style="cursor: pointer">
                  mdi-magnify
                </v-icon>
              </div> -->
              </v-autocomplete>
            </v-scroll-x-transition>
            <v-toolbar-items
              class="bttom-content hidden-xs-only justify-lg-space-between pt-4"
            >
              <v-menu open-on-hover offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="pl-2 custom-color-black bar-items text-caption text-md-subtitle-2"
                    text
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left dark>
                      mdi-chevron-down
                    </v-icon>
                    Главная страница
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    dense
                    v-for="(item, index) in items"
                    :key="index"
                  >
                    <v-list-item-title>
                      <v-btn :to="item.path" text small class="black--text">
                        {{ item.title }}
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn
                class="custom-color-black bar-title bar-items text-caption text-md-subtitle-2"
                text
                v-for="item in menuItems1"
                :key="item.title"
                :to="item.path"
              >
                <v-icon color="red" left dark>{{ item.icon }}</v-icon>
                {{ item.title }}
              </v-btn>
            </v-toolbar-items>
          </div>
          <!-- // user -->
          <div
            class="title-content2 d-none d-sm-flex"
            v-if="userProfile != null"
          >
            <span class="text-h4 d-inline-block mr-4">
              <!-- <v-icon class="hover-item">mdi-cart</v-icon> -->
              <v-badge
                :value="cartTotal"
                :content="cartTotal"
                color="yellow darken-2"
                overlap
              >
                <v-icon large class="cart" @click="goToCart()">
                  mdi-cart
                </v-icon>
              </v-badge>
              <!-- <v-icon
              v-if="cartTotal === 0"
              large
              class="cart"
              @click="goToCart()"
            >
              mdi-cart
            </v-icon> -->
            </span>
            <v-toolbar-items class="hidden-xs-only d-inline">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="btn-account bar-title bar-items"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon
                      class="yellow--text text--darken-2 text-h4"
                      left
                      dark
                      >mdi-account</v-icon
                    >
                    {{ userProfile.name }}
                    <v-icon class="text-h4" right dark>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    dense
                    class="hover-item"
                    v-for="(item, index) in barUser"
                    :key="index"
                    :to="item.path"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar-items>
          </div>
          <v-toolbar-items
            class="d-flex align-center"
            v-if="userProfile === null"
          >
            <v-btn
              class="text-caption text-sm-body-2 btn-bar red--text text--darken-1"
              text
              to="/signin"
            >
              Войти
            </v-btn>
            <span class="mx-1">
              /
            </span>
            <v-btn
              class="btn-signup pl-0 text-caption text-sm-body-2 btn-bar"
              text
              to="/signup"
            >
              Регистр
            </v-btn>
          </v-toolbar-items>
          <!-- user for mobile -->
          <v-toolbar-items
            class="d-inline d-sm-none title-xs"
            v-if="userProfile"
          >
            <span class="d-inline-block mr-4">
              <!-- <v-icon class="text-h5 hover-item">mdi-cart</v-icon> -->
              <v-badge
                :content="cartTotal"
                :value="cartTotal"
                color="green"
                overlap
              >
                <v-icon large class="cart" @click="goToCart()">
                  mdi-cart
                </v-icon>
              </v-badge>
            </span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  class="btn-account title-xs-btn bar-items text-caption"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="text-h5 yellow--text text--darken-3" left dark
                    >mdi-account</v-icon
                  >
                  {{ userProfile.name }}
                  <v-icon class="text-h5" right dark>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  dense
                  class="hover-item"
                  v-for="(item, index) in barUser"
                  :key="index"
                  :to="item.path"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar-items>
        </v-toolbar>
      </v-card>

      <!-- menu mobile -->

      <v-navigation-drawer
        temporary
        absolute
        v-model="sideNav"
        class="navigation-bar-mobile"
      >
        <v-list v-if="userProfile">
          <v-list-item>
            <v-list-item-avatar>
              <!-- <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img> -->
              <v-icon class="text-h2">mdi-account</v-icon>
            </v-list-item-avatar>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="title">
                {{ userProfile.name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{
                userProfile.email
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <br />
            <v-list-item-action>
              <v-icon>mdi-menu-down</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list class="" v-if="userProfile === null">
          <v-btn text to="/signin" class="red--text text--darken-1">
            Войти
          </v-btn>
          <v-btn text to="/signup" class="grey--text">
            Регистр
          </v-btn>
        </v-list>
        <v-divider></v-divider>
        <v-list nav dense>
          <v-list-item-group color="primary">
            <v-badge
              v-if="userProfile != null"
              :content="cartTotal"
              :value="cartTotal"
              color="green"
              overlap
            >
              <v-btn
                outlined
                @click="goToCart()"
                class="px-10 black--text"
                color="error"
                depressed
              >
                Корзина
              </v-btn>
            </v-badge>
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-list-item-content>
                <v-list-item-title
                  @click="redirect(item.path)"
                  class="black--text"
                  v-text="item.title"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </client-only>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  props: {},
  components: {
    Logo
  },
  data() {
    return {
      sideNav: false,
      menuItems1: [
        { title: "Акция", path: "/products/promotional", icon: "mdi-sale" },
        { title: "Избранное", path: "/userprofile?step=2",  icon: "mdi-heart" }
      ],
      menuItems2: [{ title: "Cao Duc Duong", path: "", icon: "mdi-account" }],
      items: [
        { title: "Главная страница", path: "/" },
        { title: "Пицца", path: "/products/promotional" },
        { title: "Специальное комбо", path: "/products/especially" },
        { title: "Жареная курочка", path: "/products/garan" },
        { title: "Бургер", path: "/products/burger" },
        { title: "Рис", path: "/products/com" },
        { title: "Что сегодня едим?", path: "/products/random" },
        { title: "Закуски" },
        { title: "Десерт" },
        { title: "Напитки" },
        { title: "Новости" }
      ],
      barUser: [
        { title: "Личная информация", path: "/userprofile" },
        { title: "Проверьте свой заказ", path: "/checkorder" },
        { title: "Выйти", path: "/logout" }
      ]
      // user: ""
    };
  },
  computed: {
    ...mapGetters("user", ["getUser"]),
    ...mapGetters("products", ["getLengthCart"]),
    ...mapState("user", ["userProfile"]),
    cartTotal() {
      return this.getLengthCart;
    }
  },
  methods: {
    redirect(path) {
      this.$router.push(path);
    },
    goToCart() {
      this.$router.push("/cart");
    }
  }
};
</script>
<style scoped>
.custom-color-black {
  color: #525254;
}
desserts .box-icon-search {
  background-color: #d56165 !important;
  margin: 0 !important;
  height: 48px;
  width: 48px;
  justify-content: center !important;
  display: flex;
}
.hover-item {
  cursor: pointer;
}

.bar {
  height: 120px !important;
  max-width: 1200px;
  margin: 0 auto;
}
.bar-title {
  color: #555555;
}
.bar-items:hover {
  background-color: #cdc9c3;
  border-radius: 5px;
}
.title-bar {
  height: 80%;
  width: 130px;
}
.title-bar img {
  height: 100%;
  width: 100%;
}
.content-bar {
  position: absolute;
  left: 20%;
  width: 550px;
}
.title-content2 {
  width: auto;
  position: absolute;
  top: 15%;
  right: 71px;
  justify-content: space-between;
  text-align: center;
  display: flex;
}
.title-xs-btn {
  height: 55px !important;
}
.title-xs {
  height: fit-content;
}
.box-search {
  border: 1px solid grey !important;
}
.btn-signup {
  color: #b7a47a;
}
.box-info-item {
  max-width: 1200px;
  margin: 0 auto;
  width: 60%;
}
.box-info {
  background-color: #f2f3f7;
}
.btn-account {
  border: 1px solid #969696;
  border-radius: 7px;
}
.navigation-bar-mobile {
  background-color: #f2e929 !important;
}
.box-search-header {
  background-color: #f2f3f7;
}
@media screen and (max-width: 1260px) {
  .content-bar {
    width: 400px;
  }
  .title-content2 {
    right: 38px;
  }
  .title-bar {
    height: 60%;
  }
}
.btn-bar {
  height: 37px !important;
  width: 90px !important;
  border-radius: 5px;
}
.cart {
  cursor: pointer;
}
@media screen and (max-width: 960px) {
  .content-bar {
    width: 300px;
  }
  .title-content2 {
    top: 30%;
    right: 0;
  }
  .title-bar {
    height: 60%;
    padding-right: 20px;
  }
}
@media screen and (max-width: 600px) {
  .content-bar {
    width: 270px;
  }
  .title-content2 {
    width: 170px !important;
    justify-content: center !important;
    text-align: center;
  }
  .title-bar {
    height: 60%;
  }
  .title-bar {
    padding-right: 5px;
    padding-left: 5px !important;
  }
  .bttom-content {
    width: 427px;
    display: flex;
    justify-content: center;
    text-align: center;
  }
}

@media screen and (max-width: 650px) {
  .content-bar {
    width: 250px;
  }
}
@media screen and (max-width: 450px) {
  .title-xs span {
    display: none !important;
  }
}
@media screen and (max-width: 330px) {
  .title-bar {
    display: none;
  }
}
</style>
