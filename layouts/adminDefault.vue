<template>
  <v-app class="adminDefault">
    <v-snackbar
      v-if="snackBar.color === 'error'"
      color="red"
      top
      v-model="snackBar.show"
    >
      <p class="mb-0" style="color: #eeebdd !important">
        {{ snackBar.text }}
      </p>

      <template v-slot:action="{ attrs }">
        <v-btn
          style="color: #eeebdd !important"
          text
          v-bind="attrs"
          @click="closeSnackBar()"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-if="snackBar.color === 'success'"
      color="blue"
      top
      v-model="snackBar.show"
    >
      <p class="mb-0" style="color: #eff3c6 !important">
        {{ snackBar.text }}
      </p>

      <template v-slot:action="{ attrs }">
        <v-btn
          style="color: #eff3c6 !important"
          text
          v-bind="attrs"
          @click="closeSnackBar()"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
    <v-navigation-drawer
      v-if="userProfile"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-layout column fill-height>
        <v-list>
          <template v-for="(item, i) in isActiveRoutes">
            <v-list-item
              class="font-weight-medium"
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
              class="font-weight-medium"
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
            style="background-color:  #fce59f"
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
    <v-app-bar class="bar-admin" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon class="d-inline" @click.stop="drawer = !drawer" />
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn> -->
      <v-toolbar-title class="title-bar d-flex align-center pl-0">
        <div>
          <v-img
            height="70"
            width="70"
            contain
            class="logo-img"
            :src="require('../assets/images/LOGO.png')"
            alt=""
          />
        </div>
        <p
          class="d-none d-sm-inline ml-4 font-weight-bold mb-0 text-h5 red--text text--darken-2"
        >
          AdminFastFood
        </p>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu transition="slide-y-transition" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="openRingNoti()"
            icon
            v-bind="attrs"
            v-on="on"
            class="mx-3"
          >
            <v-badge
              v-if="userProfile"
              class="mx-8"
              :value="listOrderNotRead"
              :content="listOrderNotRead"
              color="red"
              overlap
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
                :class="'text-h4 ' + (ringNotfi ? 'bell' : '')"
                @click="ringNotfi = false"
              >
                mdi-bell-outline
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-list class="listNotifi">
          <v-list-item
            v-for="item in notiData"
            :key="item.id"
            style="max-width: 300px"
            class="listItem"
            @click="onNoti(item)"
          >
            <v-list-item-content>
              <v-list-item-title class="detailNotifiContent">
                <v-row>
                  <v-col cols="2">
                    <v-icon class="mx-2" color="#fe3b36">
                      {{
                        item.type === notificationType.ORDER
                          ? "mdi-golf-cart"
                          : "mdi-new-box"
                      }}
                    </v-icon>
                  </v-col>
                  <v-col cols="8">
                    <span :style="!item.isRead ? 'font-weight: 600' : ''">
                      {{ item.content }}
                    </span>
                  </v-col>
                  <v-col cols="2" class="text-center" v-if="!item.isRead">
                    <v-icon color="#005cb4" size="10">mdi-circle</v-icon>
                  </v-col>
                </v-row>
              </v-list-item-title>
              <v-list-item-subtitle class="text-right text-caption">
                {{ item.date }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu
        v-if="userProfile"
        transition="slide-y-transition"
        offset-y
        :max-width="300"
        :nudge-bottom="10"
        :nudge-width="200"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="pr-3" icon color="yellow" v-bind="attrs" v-on="on">
            <v-avatar color="orange">
              <span class="white--text">AD</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar size="36" color="orange">
                <span class="white--text">CD</span>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-if="userProfile != null">
                {{ userProfile.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon> mdi-account </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title @click="dialogInfo = !dialogInfo">
                Информация аккаунтa
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon> mdi-key-change </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Изменить пароль </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon> mdi-logout-variant </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title @click="logOut()">
                Выйти
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <div class="ma-5">
        <nuxt />
      </div>
    </v-main>
    <v-footer class="footer-admin" :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <InfoAdmin @onClose="onClose" :dialogInfo="dialogInfo" />
    <!-- <audio
      ref="audio"
      src="file:///Users/quangcao/Downloads/notifi%20(1).mp3"
      controls
    ></audio> -->
  </v-app>
</template>

<script>
import InfoAdmin from "../components/dialog/InfoAdmin";
import { mapState, mapGetters, mapActions } from "vuex";
import { NotificationType } from "~/enums/notification";
import { timeDifference } from "~/utils";

export default {
  component: {
    InfoAdmin
  },
  created() {
    this.$store.dispatch("products/listProducts");
  },
  data() {
    return {
      dialogInfo: false,
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: "mdi-apps",
          title: "ПАНЕЛЬ ПРИБОРОВ",
          to: "/admin/dashboard"
        },
        {
          icon: "mdi-cart",
          title: "ЗАКАЗ",
          children: [
            {
              icon: "mdi-cart",
              title: "Создать заказ",
              to: "/admin/createorder"
            },
            {
              icon: "mdi-cart",
              title: "Список заказов",
              to: "/admin/listorder"
            },
            {
              icon: "mdi-cart",
              title: "Возврат заказов",
              to: "/admin/refund"
            }
          ]
        },
        {
          icon: "mdi-account",
          title: "ПЕРСОНАЛ",
          children: [
            {
              title: "Список сотрудников",
              to: "/admin/staffs"
            }
          ]
        },
        {
          icon: "mdi-gift",
          title: "ПРОДУКТ",
          children: [
            {
              title: "Список продуктов",
              to: "/admin/listproducts"
            }
          ]
        },
        {
          icon: "mdi-account-multiple",
          title: "ПОЛЬЗОВАТЕЛЬ",
          children: [
            {
              icon: "mdi-cart",
              title: "Список пользователей",
              to: "/admin/listusers"
            }
          ]
        },
        {
          icon: "mdi-chart-bar",
          title: "ОТЧЕТ",
          to: "/admin/detailreport"
        }
      ],
      logoutRoute: {
        fixed: true,
        icon: "mdi-logout",
        title: "Выйти",
        to: "/logout"
      },
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
      ringNotfi: false,
      notifiList: [
        {
          orderType: 2,
          content: "Выполняется 1 заказ",
          read: true
        },
        {
          orderType: 3,
          content: "1 заказ успешно доставлен",
          read: false
        },
        {
          orderType: 0,
          content: "1 заказ был отменен",
          read: true
        },
        {
          orderType: 1,
          content: "В наличии 1 новый заказ",
          read: true
        },
        {
          orderType: 1,
          content: "В наличии 1 новый заказ",
          read: false
        },
        {
          orderType: 1,
          content: "В наличии 1 новый заказ"
        },
        {
          orderType: 1,
          content: "В наличии 1 новый заказ",
          read: true
        },
        {
          icon: "mdi-new-box",
          content: "В наличии 1 новый заказ",
          read: false
        },
        {
          orderType: 1,
          content: "В наличии 1 новый заказ",
          read: true
        },
        {
          orderType: 1,
          content: "В наличии 1 новый заказ",
          read: false
        },
        {
          orderType: 1,
          content: "В наличии 1 новый заказ",
          read: true
        },
        {
          orderType: 1,
          content: "В наличии 1 новый заказ",
          read: false
        }
      ],
      isOnceMounted: false,
      notiData: []
    };
  },
  mounted() {
    this.listNotification();
  },
  computed: {
    ...mapState("user", ["userProfile", "notifications"]),
    ...mapGetters("sidebar", ["isActiveRoutes"]),
    ...mapState(["snackBar"]),
    listOrderNotRead() {
      return this.notiData.filter(noti => !noti.isRead).length || 0;
    },
    notificationType() {
      return NotificationType;
    }
  },
  methods: {
    ...mapActions("user", ["listNotification", "onReadNoti"]),
    ...mapActions(["setSnackBar"]),
    openRingNoti() {
      this.listNotification();
    },
    convertDateToHourAgo(date) {
      return timeDifference(new Date(), new Date(date));
    },
    onNoti(item) {
      if (item.type === this.notificationType.ORDER) {
        this.$router.push({
          path: "/admin/listorder",
          query: { id: item.idType }
        });
      } else if (item.type === this.notificationType.FEED_BACK) {
        this.$router.push({
          path: "/admin/feedback",
          query: { id: item.idType }
        });
      }
      this.onReadNoti({ isRead: true, id: item.id });
    },
    closeSnackBar() {
      this.$store.commit("SET_SNACKBAR", {
        show: false,
        color: "",
        text: ""
      });
    },
    logOut() {
      this.$router.push("/logout");
    },
    onClose() {
      this.dialogInfo = false;
    }
  },
  watch: {
    notifications(newVal, oldVal) {
      console.log("newVal, oldVal", newVal, oldVal);
      this.notiData = this.notifications.map(item => {
        const { date, ...data } = item;
        return {
          ...data,
          date: this.convertDateToHourAgo(date)
        };
      });
      if (oldVal.length < newVal.length && this.isOnceMounted) {
        this.ringNotfi = true;
        this.setSnackBar({
          show: true,
          text: `${this.notifications[0].content}`,
          color: "success"
        });
        const audio = new Audio(
          "http://soundbible.com/mp3/Elevator Ding-SoundBible.com-685385892.mp3"
        );
        audio.play();
        return;
      }
      this.isOnceMounted = true;
    },
    snackBar() {
      if (this.snackBar.show === true) {
        setTimeout(() => {
          this.closeSnackBar();
        }, 4000);
      }
    }
  }
};
</script>

<style>
.adminDefault {
  background-color: #e9eaec !important;
}
.bar-admin {
  background-color: #fce59f !important;
}
.v-data-table__wrapper tbody tr {
  height: 60px;
}
.table-create .v-data-table-header {
  background-color: #ede8e8;
}
.footer-admin {
  background-color: #fce59f !important;
}
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr:last-child
  > th {
  white-space: nowrap;
}
.detailNotifiContent {
  font-size: 14px;
  text-overflow: unset !important;
  white-space: unset !important;
  overflow: unset !important;
  line-break: auto;
}
.listNotifi {
  max-height: 80vh;
  overflow: scroll;
  padding: 0;
}

.listItem:hover {
  cursor: pointer;
  background-color: #e0e0e0;
}

.bell {
  -webkit-animation: ring 4s 0.7s ease-in-out infinite;
  -webkit-transform-origin: 50% 4px;
  -moz-animation: ring 4s 0.7s ease-in-out infinite;
  -moz-transform-origin: 50% 4px;
  animation: ring 4s 0.7s ease-in-out infinite;
  transform-origin: 50% 4px;
}

@-webkit-keyframes ring {
  0% {
    -webkit-transform: rotateZ(0);
  }
  1% {
    -webkit-transform: rotateZ(30deg);
  }
  3% {
    -webkit-transform: rotateZ(-28deg);
  }
  5% {
    -webkit-transform: rotateZ(34deg);
  }
  7% {
    -webkit-transform: rotateZ(-32deg);
  }
  9% {
    -webkit-transform: rotateZ(30deg);
  }
  11% {
    -webkit-transform: rotateZ(-28deg);
  }
  13% {
    -webkit-transform: rotateZ(26deg);
  }
  15% {
    -webkit-transform: rotateZ(-24deg);
  }
  17% {
    -webkit-transform: rotateZ(22deg);
  }
  19% {
    -webkit-transform: rotateZ(-20deg);
  }
  21% {
    -webkit-transform: rotateZ(18deg);
  }
  23% {
    -webkit-transform: rotateZ(-16deg);
  }
  25% {
    -webkit-transform: rotateZ(14deg);
  }
  27% {
    -webkit-transform: rotateZ(-12deg);
  }
  29% {
    -webkit-transform: rotateZ(10deg);
  }
  31% {
    -webkit-transform: rotateZ(-8deg);
  }
  33% {
    -webkit-transform: rotateZ(6deg);
  }
  35% {
    -webkit-transform: rotateZ(-4deg);
  }
  37% {
    -webkit-transform: rotateZ(2deg);
  }
  39% {
    -webkit-transform: rotateZ(-1deg);
  }
  41% {
    -webkit-transform: rotateZ(1deg);
  }
  43% {
    -webkit-transform: rotateZ(0);
  }
  100% {
    -webkit-transform: rotateZ(0);
  }
}

@-moz-keyframes ring {
  0% {
    -moz-transform: rotate(0);
  }
  1% {
    -moz-transform: rotate(30deg);
  }
  3% {
    -moz-transform: rotate(-28deg);
  }
  5% {
    -moz-transform: rotate(34deg);
  }
  7% {
    -moz-transform: rotate(-32deg);
  }
  9% {
    -moz-transform: rotate(30deg);
  }
  11% {
    -moz-transform: rotate(-28deg);
  }
  13% {
    -moz-transform: rotate(26deg);
  }
  15% {
    -moz-transform: rotate(-24deg);
  }
  17% {
    -moz-transform: rotate(22deg);
  }
  19% {
    -moz-transform: rotate(-20deg);
  }
  21% {
    -moz-transform: rotate(18deg);
  }
  23% {
    -moz-transform: rotate(-16deg);
  }
  25% {
    -moz-transform: rotate(14deg);
  }
  27% {
    -moz-transform: rotate(-12deg);
  }
  29% {
    -moz-transform: rotate(10deg);
  }
  31% {
    -moz-transform: rotate(-8deg);
  }
  33% {
    -moz-transform: rotate(6deg);
  }
  35% {
    -moz-transform: rotate(-4deg);
  }
  37% {
    -moz-transform: rotate(2deg);
  }
  39% {
    -moz-transform: rotate(-1deg);
  }
  41% {
    -moz-transform: rotate(1deg);
  }
  43% {
    -moz-transform: rotate(0);
  }
  100% {
    -moz-transform: rotate(0);
  }
}

@keyframes ring {
  0% {
    transform: rotate(0);
  }
  1% {
    transform: rotate(30deg);
  }
  3% {
    transform: rotate(-28deg);
  }
  5% {
    transform: rotate(34deg);
  }
  7% {
    transform: rotate(-32deg);
  }
  9% {
    transform: rotate(30deg);
  }
  11% {
    transform: rotate(-28deg);
  }
  13% {
    transform: rotate(26deg);
  }
  15% {
    transform: rotate(-24deg);
  }
  17% {
    transform: rotate(22deg);
  }
  19% {
    transform: rotate(-20deg);
  }
  21% {
    transform: rotate(18deg);
  }
  23% {
    transform: rotate(-16deg);
  }
  25% {
    transform: rotate(14deg);
  }
  27% {
    transform: rotate(-12deg);
  }
  29% {
    transform: rotate(10deg);
  }
  31% {
    transform: rotate(-8deg);
  }
  33% {
    transform: rotate(6deg);
  }
  35% {
    transform: rotate(-4deg);
  }
  37% {
    transform: rotate(2deg);
  }
  39% {
    transform: rotate(-1deg);
  }
  41% {
    transform: rotate(1deg);
  }
  43% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(0);
  }
}
</style>
