<template>
  <div>
    <v-card>
      <v-card-title class="pt-10 d-flex align-center justify-center">
        ТЕКУЩИЙ ЗАКАЗ
      </v-card-title>
      <div class="pt-3 px-3 py-sm-10 pb-5 pb-sm-5 px-sm-10">
        <v-row>
          <v-col
            v-if="userProfile.role === userPermissions.ADMIN"
            cols="6"
            md="3"
          >
            <v-card height="100%" class="pa-3 pa-sm-10 box-over">
              <div class="d-flex justify-center align-center">
                <div class="text-center">
                  <v-icon class="display-1 text-sm-h3" color="red">
                    mdi-new-box
                  </v-icon>
                  <p
                    class="mt-3 mb-0 font-weight-bold text-caption text-sm-body-1"
                  >
                    Обработка : 
                    <!-- ĐANG XỬ LÝ -->
                    <span class="red--text"> {{ totalOrderWaiting }}</span>
                  </p>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col
            cols="6"
            :md="userProfile.role === userPermissions.ADMIN ? 3 : 6"
          >
            <v-card height="100%" class="pa-3 pa-sm-10 box-over">
              <div class="d-flex justify-center align-center">
                <div class="text-center">
                  <v-icon class="display-1 text-sm-h3" color="red">
                    mdi-golf-cart
                  </v-icon>
                  <p
                    class="mt-3 mb-0 font-weight-bold text-caption text-sm-body-1"
                  >
                    Доставка:
                    <span class="red--text"> {{ totalOrderPending }}</span>
                  </p>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col
            cols="6"
            :md="userProfile.role === userPermissions.ADMIN ? 3 : 6"
          >
            <v-card height="100%" class="pa-3 pa-sm-10 box-over">
              <div class="d-flex justify-center align-center">
                <div class="text-center">
                  <v-icon class="display-1 text-sm-h3" color="red">
                    mdi-checkbox-multiple-marked
                  </v-icon>
                  <p
                    class="mt-3 mb-0 font-weight-bold text-caption text-sm-body-1"
                  >
                    Успех:
                    <span class="red--text"> {{ totalOrderSuccess }}</span>
                  </p>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col
            v-if="userProfile.role === userPermissions.ADMIN"
            cols="6"
            md="3"
          >
            <v-card height="100%" class="pa-3 pa-sm-10 box-over">
              <div class="d-flex justify-center align-center">
                <div class="text-center">
                  <v-icon class="display-1 text-sm-h3" color="red">
                    mdi-cancel
                  </v-icon>
                  <p
                    class="mt-3 mb-0 font-weight-bold text-caption text-sm-body-1"
                  >
                    Заказ отменен:
                    <span class="red--text"> {{ totalOrderCancel }}</span>
                  </p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <v-divider class="mx-3"></v-divider>
      <v-card-title class="red--text d-flex justify-center">
        СЕГОДНЯ
      </v-card-title>
      <v-row>
        <v-col class="text-center" cols="12" sm="6">
          <h2 class="grey--text text--darken-2">
            ВСЕГО ЗАКАЗА
          </h2>
          <p class="text-h4 yellow--text text--darken-4">
            {{ listOrderNotDetail.length }}
          </p>
        </v-col>
        <v-col class="text-center" cols="12" sm="6">
          <h2 class="grey--text text--darken-2">
            ОБЩАЯ ВЫРУЧКА
          </h2>
          <p class="text-h4 red--text text--darken-2">
            {{ totalRevenue | formatCurrency }}
          </p>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { UserPermissions } from "~/types/user";

export default {
  layout: "adminDefault",
  methods: {
    ...mapActions("order", ["getListOrder"])
  },
  created() {
    this.getListOrder({
      role: this.userProfile.role,
      id: this.userProfile.id
    });
  },
  computed: {
    ...mapState("user", ["userProfile"]),
    ...mapState("order", ["listOrderNotDetail"]),
    ...mapGetters("order", [
      "totalOrderPending",
      "totalOrderWaiting",
      "totalOrderSuccess",
      "totalOrderCancel",
      "totalRevenue"
    ]),
    userPermissions() {
      return UserPermissions;
    }
  }
};
</script>

<style scoped>
.box-over {
  background-color: #eaeaec !important;
}
</style>
