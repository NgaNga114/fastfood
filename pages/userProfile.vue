<template>
  <div class="py-3" style="max-width: 1200px; margin: 0 auto;">
    <div>
      <Breadcrumbs :items="item_breadcrumbs" />
    </div>
    <div>
      <v-row>
        <v-col cols="12" sm="4" md="3" lg="4">
          <div class="block-image">
            <div class="block-change-avt pr-1 pb-1">
              <v-btn
                :loading="isSelecting"
                small
                outlined
                color="grey"
                class="btn-change-avt"
                @click="onChangeAvatar()"
              >
                <v-icon color="grey">
                  mdi-camera
                </v-icon>
              </v-btn>
            </div>
            <v-img v-if="!getUser" class="avt-img" height="300"></v-img>
            <v-img
              v-if="getUser"
              class="avt-img"
              height="300"
              :src="getUser.avatarUrl"
            ></v-img>
          </div>
          <input
            ref="uploader"
            class="d-none"
            type="file"
            accept="image/*"
            @change="onFileChanged"
          />

          <div class="my-5">
            <v-btn
              :class="{ 'btn-active': step === 1 }"
              @click="step = 1"
              class="mb-4"
              color="grey darken-3"
              width="100%"
              outlined
            >
              Личная информация
            </v-btn>
            <v-btn
              :class="{ 'btn-active': step === 2 }"
              @click="step = 2"
              class="mb-4"
              color="grey darken-3"
              width="100%"
              outlined
            >
              Список избранного
            </v-btn>
            <v-btn
              :class="{ 'btn-active': step === 3 }"
              @click="step = 3"
              class="mb-4"
              color="grey darken-3"
              width="100%"
              outlined
            >
              История покупки
            </v-btn>
            <v-btn
              :class="{ 'btn-active': step === 4 }"
              @click="dialog_reset = !dialog_reset"
              class="mb-4"
              color="grey darken-3"
              width="100%"
              outlined
            >
              Сменить пароль
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="8" md="9" lg="8">
          <v-window v-model="step">
            <v-window-item :value="1">
              <div>
                <h4 class="d-inline red--text">Личная информация</h4>
                <a class="d-inline float-right" @click="openInfoEdit()"
                  >Изменить</a
                >
              </div>
              <v-divider class="my-3"></v-divider>
              <v-skeleton-loader
                class="mb-3 mt-4"
                v-if="!getUser"
                type="article"
              ></v-skeleton-loader>
              <div v-if="getUser">
                <v-row>
                  <v-col class="py-0" cols="5" sm="5" md="3">
                    <p class="mb-0 font-weight-bold">Фамилия и имя</p>
                  </v-col>
                  <v-col class="py-0" cols="5">
                    <p>: {{ getUser.name }}</p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="py-0" cols="5" sm="5" md="3">
                    <p class="mb-0 font-weight-bold">Пол</p>
                  </v-col>
                  <v-col class="py-0" cols="5">
                    <p v-if="getUser.sex">: {{ getUser.sex }}</p>
                    <p v-if="!getUser.sex">: none</p>
                  </v-col>
                </v-row>
                <v-row class="py-0">
                  <v-col class="py-0" cols="5" sm="5" md="3">
                    <p class="mb-0 font-weight-bold">Номер телефона</p>
                  </v-col>
                  <v-col class="py-0" cols="5">
                    <p v-if="getUser.phoneNumber">
                      : {{ getUser.phoneNumber }}
                    </p>
                    <p v-if="!getUser.phoneNumber">: none</p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="py-0" cols="5" sm="5" md="3">
                    <p class="mb-0 font-weight-bold">Эл.адрес</p>
                  </v-col>
                  <v-col class="py-0" cols="7">
                    <p>: {{ getUser.email }}</p>
                  </v-col>
                </v-row>
              </div>
              <div>
                <h4 class="d-inline red--text">Информация о доставке</h4>
                <a class="d-inline float-right" @click="openDialogAddAddress()"
                  >Более</a
                >
              </div>
              <v-divider class="my-3"></v-divider>
              <div class="address" v-if="getUser">
                <div
                  class="my-5"
                  v-for="(address, index) in getUser.diliveryAddress"
                  :key="address.index"
                >
                  <BoxAddress
                    :address="address"
                    :indexAddress="index"
                    @onSubmitEditAddress="onSubmitEditAddress"
                    @onRemoveAddress="onRemoveAddress"
                  />
                </div>
              </div>
            </v-window-item>

            <v-window-item :value="2">
              <div>
                <h4 class="d-inline red--text">ИЗБРАННОЕ</h4>
              </div>
              <v-divider class="my-3"></v-divider>
              <v-progress-linear
                color="#F44336"
                indeterminate
                reverse
                v-if="loadingFavourite"
              ></v-progress-linear>
              <p
                class="py-5 text-center"
                v-if="listFavourite == 0 && loadingFavourite"
              >
                загружается.....
              </p>
              <h3
                class="py-5 text-center"
                v-if="listFavourite.length <= 0 && loadingFavourite == false"
              >
                У вас еще нет любимого продукта
              </h3>
              <v-row v-for="(item, index) in listFavourite" :key="item" v-else>
                <v-col cols="12">
                  <BoxFavourite :data="item" @loadList="loadList" />
                </v-col>
              </v-row>
              <!-- pagination -->
              <v-pagination
                v-if="listFavourite.length > 0"
                v-model="pageFavourite"
                :length="5"
                color="#F44336"
              ></v-pagination>
            </v-window-item>

            <v-window-item :value="3">
              <div>
                <h4 class="d-inline red--text">ИСТОРИЯ ПОКУПОК</h4>
              </div>
              <v-divider class="my-3"></v-divider>
              <v-card>
                <v-tabs v-model="tab" align-with-title grow>
                  <v-tabs-slider color="#F44336"></v-tabs-slider>
                  <v-tab
                    v-for="item in purchase_history_items"
                    :key="item"
                    class="ml-0"
                  >
                    <span class="red--text">{{ item }}</span>
                  </v-tab>
                </v-tabs>
              </v-card>
              <v-tabs-items v-model="tab">
                <v-divider class="my-3"></v-divider>
                <!-- title -->
                <!-- <v-card> -->
                <v-row class="d-none d-md-flex">
                  <v-col
                    class="text-body-2 font-weight-bold pl-6 py-1"
                    cols="5"
                  >
                    ЗАКАЗ
                  </v-col>
                  <v-col
                    cols="4"
                    class="text-body-2 font-weight-bold text-center py-1"
                  >
                    ДЕНЬ ЗАКАЗА
                  </v-col>
                  <v-col class="text-body-2 font-weight-bold py-1" cols="3">
                    ИТОГО
                  </v-col>
                </v-row>
                <!-- for mobile -->
                <v-row class="d-flex d-md-none">
                  <v-col class="text-body-2 font-weight-bold pl-6" cols="6">
                    ЗАКАЗ
                  </v-col>
                  <v-col cols="6">
                    <p
                      class="mb-0 float-right mr-3 text-body-2 font-weight-bold"
                    >
                      ПОДРОБНОСТИ
                    </p>
                  </v-col>
                </v-row>
                <!-- </v-card> -->
                <!-- item 1 -->
                <v-progress-linear
                  color="#F44336"
                  indeterminate
                  reverse
                  v-if="isOrderLoading"
                ></v-progress-linear>
                <v-tab-item>
                  <h3
                    class="py-5 text-center"
                    v-if="dataListOrderSuccessful.length <= 0"
                  >
                    Пока нет заказов
                  </h3>
                  <v-row
                    v-else
                    v-for="item in dataListOrderSuccessful"
                    :key="item.index"
                  >
                    <v-col cols="12">
                      <BoxHistory :data="item" />
                    </v-col>
                  </v-row>
                  <!-- pagination -->
                  <v-pagination
                    v-if="dataListOrderSuccessful.length > 0"
                    v-model="pageHistory"
                    :length="5"
                    color="#F44336"
                  ></v-pagination>
                </v-tab-item>
                <!-- item 2 -->
                <v-tab-item>
                  <h3
                    class="py-5 text-center"
                    v-if="dataListOrderCancel.length <= 0"
                  >
                    Пока нет заказов
                  </h3>
                  <v-row
                    v-for="item in dataListOrderCancel"
                    :key="item.index"
                    v-else
                  >
                    <v-col cols="12">
                      <BoxHistory :data="item" />
                    </v-col>
                  </v-row>
                  <!-- pagination -->
                  <v-pagination
                    v-if="dataListOrderCancel.length > 0"
                    v-model="pageHistory"
                    :length="5"
                    color="#F44336"
                  ></v-pagination>
                </v-tab-item>
              </v-tabs-items>
            </v-window-item>
            <v-dialog v-model="dialog_reset" max-width="400">
              <v-card>
                <v-progress-linear
                  v-if="loading"
                  indeterminate
                  color="teal"
                ></v-progress-linear>
                <v-card-title>Введите почту</v-card-title>
                <v-overlay absolute :value="loading" opacity="0.1"> </v-overlay>

                <v-text-field
                  :disabled="loading"
                  v-model="email_reset"
                  class="px-5"
                  label="Эл.адрес"
                  prepend-icon="mdi-email"
                ></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey darken-1"
                    text
                    @click="(dialog_reset = !dialog_reset), (step = 1)"
                  >
                    Отмена
                  </v-btn>

                  <v-btn color="red darken-1" text @click="resetPass()">
                    Забыли пароль
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-window>
        </v-col>
      </v-row>
    </div>
    <InfoEdit
      v-if="getUser"
      :dialog="dialogInfoEdit"
      :userInfo="getUser"
      @onSubmit="onUpdateUserInfo"
      @onClose="closeDialogInfoEdit"
    />
    <AddAddress
      :dialog="dialogAddAddress"
      @onClose="closeDialogAddAddress"
      @onSubmitAddAddress="onSubmitAddAddress"
    />
  </div>
</template>

<script>
import Breadcrumbs from "../components/Breadcrumbs";
import BoxAddress from "../components/BoxAddress";
import BoxFavourite from "../components/BoxFavourite";
import BoxHistory from "../components/BoxHistory";
import InfoEdit from "../components/dialog/user/infoEdit";
import AddAddress from "../components/dialog/user/address/addAddress";

import { mapGetters, mapActions, mapState } from "vuex";
export default {
  components: {
    Breadcrumbs,
    BoxAddress,
    BoxFavourite,
    BoxHistory,
    InfoEdit,
    AddAddress
  },
  data() {
    return {
      step: this.$route.query.step ? Number(this.$route.query.step) : 1,
      info: true,
      favoritesList: [],
      purchaseHistory: false,
      changePassword: false,
      dialogInfoEdit: false,
      dialogAddAddress: false,
      isSelecting: false,
      isAvatar: null,
      tab: null,
      loadingFavourite: true,
      purchase_history_items: ["Заказ доставлен", "Заявка отменена"],
      dataListOrderSuccessful: [],
      dataListOrderCancel: [],
      pageHistory: 1,
      pageFavourite: 1,
      dialog_reset: false,
      email_reset: "",
      loading: false
    };
  },
  computed: {
    ...mapGetters("user", ["getUser"]),
    ...mapState("user", ["userProfile"]),
    ...mapState("order", ["listOrder", "isOrderLoading"]),
    ...mapState("products", ["listFavourite"]),
    ...mapGetters("products", ["loader"]),
    isLoader() {
      return this.loader;
    },
    item_breadcrumbs() {
      return [
        {
          text: "Главная страница",
          disabled: false,
          href: "/"
        },
        {
          text: "Личная информация",
          disabled: false,
          href: "/userProfile"
        }
      ];
    }
  },
  methods: {
    ...mapActions("user", [
      "setUserProfile",
      "setUserAvatar",
      "setDeliveryAddress",
      "editDiliveryAddress",
      "getFavouriteProduct"
    ]),
    ...mapActions("order", ["getListOrder"]),
    ...mapActions("products", ["resetPassword", "favouriteProductAPI"]),
    loadList() {
      this.loadingFavourite = true;
      const result = this.favouriteProductAPI({ uid: this.userProfile.id });
    },
    openInfoEdit() {
      this.dialogInfoEdit = true;
    },
    closeDialogInfoEdit() {
      this.dialogInfoEdit = false;
    },
    onUpdateUserInfo(payload) {
      console.log(payload);
      this.dialogInfoEdit = false;
      this.setUserProfile({
        ...payload
      });
    },
    onChangeAvatar() {
      this.isSelecting = true;
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );
      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      console.log("trigger");
      this.isAvatar = e.target.files[0];
      // console.log(this.isAvatar.size);
      if (this.isAvatar.size > 1024 * 1024) {
        alert("File too big (> 1MB)");
        return;
      } else {
        this.setUserAvatar({
          isAvatar: this.isAvatar
        });
      }
    },
    openDialogAddAddress() {
      this.dialogAddAddress = true;
    },
    closeDialogAddAddress() {
      this.dialogAddAddress = false;
    },
    onSubmitAddAddress(payload) {
      // console.log(payload);
      if (this.getUser) {
        let checkExistAddress = false;
        if (this.getUser.diliveryAddress) {
          checkExistAddress = true;
        }
        this.setDeliveryAddress({
          ...payload,
          checkExistAddress: checkExistAddress
        });
        this.dialogAddAddress = false;
      } else {
        alert("wait dm -_-");
      }
    },
    onSubmitEditAddress(payload) {
      const { index, ...address } = payload;
      let addressSubmit = [...this.getUser.diliveryAddress];
      addressSubmit[index] = address;
      this.editDiliveryAddress(addressSubmit);
    },
    onRemoveAddress(index) {
      let addressSubmit = [...this.getUser.diliveryAddress];
      addressSubmit.splice(index, 1);
      console.log(addressSubmit);
      this.editDiliveryAddress(addressSubmit);
    },
    getDataInfo() {
      this.getListOrder({
        role: this.getUser.role,
        id: this.getUser.id
      });
    },
    resetPass() {
      // validate email
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let check = re.test(String(this.email_reset).toLowerCase());
      if (check) {
        this.resetPassword(this.email_reset);
        this.email_reset = "";
        this.loading = true;
      } else {
        (this.regis_email = ""), alert("wrong email");
      }
    }
  },
  async created() {
    this.getDataInfo();
    const data = await this.favouriteProductAPI({
      uid: this.userProfile.id,
      type: null,
      idProduct: null
    });
    if (data) {
      this.loadingFavourite = false;
    }
  },
  watch: {
    isLoader() {
      if (!this.loader) {
        this.loading = false;
        this.dialog_reset = false;
        this.step = 1;
      }
    },
    listOrder() {
      if (this.listOrder && !this.listOrder.length <= 0) {
        this.dataListOrderSuccessful = this.listOrder.filter(item => {
          return item.status == 3;
        });
        this.dataListOrderCancel = this.listOrder.filter(item => {
          return item.status == 0;
        });
      }
      // this.favoritesList = [];
      // this.listOrder[0]?.user.favouriteProduct.map(id => {
      //   this.favoritesList.push(id);
      // });
    },
    favoritesList(newVal) {
      if (newVal.length !== 0) {
        this.loadingFavourite = false;
      }
    },
    listFavourite(newVal){
      if (newVal) {
        this.loadingFavourite = false;
      }
    }
  }
};
</script>

<style scoped>
a {
  color: #bcad72 !important;
}
.avt-img {
  border-radius: 10px;
  border: 1px solid red;
}
.btn-active {
  background-color: #fce59f;
  border: 1px solid red;
}
.block-image {
  position: relative;
}
.block-change-avt {
  position: absolute;
  z-index: 2;
  bottom: 0;
  right: 0;
}
.block-image:hover .btn-change-avt {
  background-color: #96969669 !important;
}
</style>
