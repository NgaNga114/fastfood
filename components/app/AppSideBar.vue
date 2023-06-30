<template>
  <v-navigation-drawer :value="visibleBar" :clipped="true" fixed app>
    <v-layout column fill-height>
      <v-list class="pt-0" dense>
        <template v-for="(item, i) in routes">
          <v-list-item
            v-if="!item.children"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            v-else
            :key="item.title"
            :prepend-icon="item.action"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="child in item.children"
              :key="child.title"
              :to="child.to"
              router
              exact
            >
              <v-list-item-content>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
      <v-spacer></v-spacer>
      <v-list>
        <v-list-item
          :to="logoutRoute.to"
          router
          exact
          style="background-color: #e6e8ea"
        >
          <v-list-item-action>
            <v-icon>{{ logoutRoute.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="logoutRoute.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    visibleBar: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      routes: [
        {
          icon: "mdi-apps",
          title: "ОБЗОР",
          to: "/user/dashboard"
        },
        {
          icon: "mdi-cart",
          title: "Заказ",
          children: [
            {
              icon: "mdi-cart",
              title: "Создать заказ",
              to: "/user/orders/create"
            },
            {
              icon: "mdi-cart",
              title: "Список заказов",
              to: "/user/orders/lists"
            },
            {
              icon: "mdi-cart",
              title: "Возврат заказа",
              to: "/user/orders/refund"
            }
          ]
        },
        {
          icon: "mdi-account",
          title: "ПЕРСОНАЛ",
          children: [
            {
              icon: "mdi-cart",
              title: "Создать заказ",
              to: "/user/orders/create"
            },
            {
              icon: "mdi-cart",
              title: "Список заказов",
              to: "/user/orders/lists"
            },
            {
              icon: "mdi-cart",
              title: "Возврат заказа",
              to: "/user/orders/refund"
            }
          ]
        },
        {
          icon: "mdi-gift",
          title: "ПРОДУКТЫ",
          children: [
            {
              icon: "mdi-cart",
              title: "Создать заказ",
              to: "/user/orders/create"
            },
            {
              icon: "mdi-cart",
              title: "Список заказов",
              to: "/user/orders/lists"
            },
            {
              icon: "mdi-cart",
              title: "Возврат заказа",
              to: "/user/orders/refund"
            }
          ]
        },
        {
          icon: "mdi-chart-bar",
          title: "ОТЧЕТ",
          to: "/user/reports"
        },
        {
          icon: "mdi-account-multiple",
          title: "ПОЛЬЗОВАТЕЛИ",
          children: [
            {
              icon: "mdi-cart",
              title: "Создать заказ",
              to: "/user/orders/create"
            },
            {
              icon: "mdi-cart",
              title: "Список заказов",
              to: "/user/orders/lists"
            },
            {
              icon: "mdi-cart",
              title: "Возврат заказа",
              to: "/user/orders/refund"
            }
          ]
        }
      ],
      logoutRoute: {
        fixed: true,
        icon: "mdi-logout",
        title: "Выйти",
        to: "/logout"
      }
    };
  }
};
</script>

<style scoped></style>
