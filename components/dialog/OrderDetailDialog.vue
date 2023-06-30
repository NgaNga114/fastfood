<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="800">
      <v-card class="dialog-info pa-6">
        <v-card-title class="px-0 pb-0 d-flex justify-center align-center">
          <p
            class="text-h6 text-sm-h5 font-weight-bold red--text text--darken-1"
          >
            Детали заказа
          </p>
        </v-card-title>
        <v-card class="pa-6 mx-auto" width="100%">
          <!-- <v-card-title class="pa-0 red--text text--darken-1">
            Thông tin đăng ký
          </v-card-title> -->
          <div>
            <v-row>
              <v-col cols="12" md="6">
                <div class="d-flex justify-center">
                  <v-card-title class="pa-0 red--text text--darken-1">
                    Информация пользователя
                  </v-card-title>
                </div>
                <div class="my-3">
                  <v-img
                    class="avt-img mx-auto"
                    :src="avtUser"
                    height="150"
                    width="150"
                  ></v-img>
                </div>
                <div class="mt-6">
                  <p class="mb-2">
                    Имя заказчика
                  </p>
                  <v-text-field
                    :value="isOrderDetail.personCreate.name"
                    readonly
                    outlined
                    hide-details="auto"
                    dense
                  ></v-text-field>
                </div>
                <div class="mt-6">
                  <p class="mb-2">
                    Номер телефона
                  </p>
                  <v-text-field
                    :value="isOrderDetail.personCreate.phoneNumber"
                    readonly
                    outlined
                    hide-details="auto"
                    dense
                  ></v-text-field>
                </div>
                <div class="mt-6">
                  <p class="mb-2">
                    Эл.адрес
                  </p>
                  <v-text-field
                    :value="isOrderDetail.personCreate.email"
                    readonly
                    outlined
                    hide-details="auto"
                    dense
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="d-flex justify-center">
                  <v-card-title class="pa-0 red--text text--darken-1">
                    Сведения о доставке
                  </v-card-title>
                </div>
                <div class="mt-6">
                  <p class="mb-2">
                    Получатель
                  </p>
                  <v-text-field
                    :value="isOrderDetail.location.name"
                    readonly
                    outlined
                    hide-details="auto"
                    dense
                  ></v-text-field>
                </div>
                <div class="mt-6">
                  <p class="mb-2">
                    Номер телефона
                  </p>
                  <v-text-field
                    :value="isOrderDetail.location.phoneNumber"
                    readonly
                    outlined
                    hide-details="auto"
                    dense
                  ></v-text-field>
                </div>

                <div class="mt-3 mb-6">
                  <p class="mb-2">
                    Адрес доставки
                  </p>
                  <v-textarea
                    :value="addressDelivery"
                    readonly
                    outlined
                    hide-details="auto"
                    filled
                    rows="3"
                    row-height="20"
                  ></v-textarea>
                </div>
                <div class="mt-3 mb-6">
                  <p class="mb-2">
                    Заметка
                  </p>
                  <v-textarea
                    :value="isOrderDetail.note"
                    readonly
                    outlined
                    hide-details="auto"
                    filled
                    rows="4"
                    row-height="20"
                  ></v-textarea>
                </div>
                <div class="mt-3 mb-6">
                  <div
                    v-if="
                      isOrderDetail.status === orderStatus.Cancel ||
                        isOrderDetail.status === orderStatus.Success ||
                        userProfile.role === userPermissions.SHIPPER
                    "
                  >
                    <p class="mb-2">
                      Курьер
                    </p>
                    <v-text-field
                      v-if="isOrderDetail.shipper"
                      :value="isOrderDetail.shipper.name"
                      readonly
                      outlined
                      hide-details="auto"
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-else
                      value="Không có người giao hàng"
                      readonly
                      outlined
                      hide-details="auto"
                      dense
                    ></v-text-field>
                  </div>
                  <div v-else>
                    <p class="mb-2">
                      Выберите курьера
                    </p>
                    <!-- @change="onChange" -->
                    <v-autocomplete
                      v-model="idStaff"
                      :items="isListAssign"
                      item-text="name"
                      value=""
                      item-value="id"
                      dense
                      hide-details="auto"
                      chips
                      outlined
                    >
                      <template v-slot:selection="data">
                        <v-chip>
                          <v-avatar left>
                            <v-img
                              :src="data.item.avatarUrl"
                              class="avt-img mx-auto"
                              height="20"
                              width="20"
                            ></v-img>
                          </v-avatar>
                          {{ data.item.name }}
                        </v-chip>
                      </template>

                      <template v-slot:item="data">
                        <template>
                          <v-list-item-avatar>
                            <v-img
                              :src="data.item.avatarUrl"
                              class="avt-img mx-auto"
                              height="30"
                              width="30"
                            ></v-img>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              v-html="data.item.name"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
          <!-- <div class="mt-7">
            <div class="d-flex justify-center">
              <v-card-title class="pa-0 red--text text--darken-1 text-center">
                Thông tin sản phẩm
              </v-card-title>
            </div>
            <v-row>
              <v-col cols="12" md="6"></v-col>
              <v-col cols="12" md="6"></v-col>
            </v-row>
          </div> -->
          <v-card-actions
            class="d-block"
            :class="[
              isOrderDetail.status !== orderStatus.Cancel &&
              isOrderDetail.status !== orderStatus.Success
                ? 'justify-space-between'
                : 'justify-end'
            ]"
          >
            <div class="d-flex justify-space-between align-center">
              <div
                v-if="
                  isOrderDetail.status === orderStatus.Waiting ||
                    isOrderDetail.status === orderStatus.Pending
                "
              >
                <v-btn
                  color="red darken-2"
                  class="white--text"
                  @click="orderCancel()"
                  >Отменить заказ</v-btn
                >
              </div>
              <div class="d-flex">
                <v-btn
                  class=" mr-4"
                  @click="close()"
                  outlined
                  color="grey darken-4"
                  >Закрыть</v-btn
                >
                <v-btn
                  v-if="
                    isOrderDetail.status === orderStatus.Waiting ||
                      isOrderDetail.status === orderStatus.Pending
                  "
                  color="red darken-2"
                  class="white--text d-block"
                  @click="submitOrderChange()"
                  >Сохранить</v-btn
                >
              </div>
            </div>
            <div
              v-if="isOrderDetail.status === orderStatus.Pending"
              class="mt-5"
            >
              <v-btn
                @click="isDialogSubmitOrder = true"
                width="100%"
                color="red darken-2"
                class="white--text"
                >Доставка выполнена</v-btn
              >
            </div>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <DeleteDialog
      @onClose="closeDelete"
      @onDialog="onSubmit"
      :dialog="isDialogSubmitOrder"
      :title="titleDialog"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import DeleteDialog from "~/components/dialog/DeleteDialog";
import { OrderStatus } from "~/enums/order";
import { UserPermissions } from "~/types/user";
export default {
  components: {
    DeleteDialog
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    isOrderDetail: {
      type: Object,
      required: true,
      default: {}
    },
    listAssign: {
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      idStaff: "",
      titleDialog: {
        title: "ПОДТВЕРЖДЕНИЕ ЗАКАЗА",
        subTitle: "Вы уверены, что хотите выполнить этот заказ? ?"
      },
      isDialogSubmitOrder: false
    };
  },
  created() {
    if (this.isOrderDetail) {
      this.idStaff = this.isOrderDetail.shipper;
    }
  },
  computed: {
    ...mapState("user", ["userProfile"]),
    userPermissions() {
      return UserPermissions;
    },
    orderStatus() {
      return OrderStatus;
    },
    isListAssign() {
      const list = [...this.listAssign];
      return list.map(x => {
        return {
          avatarUrl: x.avatarUrl,
          id: x.id,
          name: x.name
        };
      });
    },
    avtUser() {
      return this.isOrderDetail.personCreate?.avatarUrl
        ? this.isOrderDetail.personCreate.avatarUrl
        : null;
    },
    addressDelivery() {
      const {
        city,
        district,
        ward,
        detailAddress
      } = this.isOrderDetail.location.location;
      const address = this.isOrderDetail.location.location
        ? `${detailAddress}, ${ward.title}, ${district.title}, ${city.title}`
        : "";
      return address;
    }
  },
  methods: {
    closeDelete() {
      this.isDialogSubmitOrder = false;
    },
    onSubmit() {
      this.isDialogSubmitOrder = false;
      this.$emit("onChangeUpdateOrder", {
        oldShipperId: this.isOrderDetail.shipper
          ? this.isOrderDetail.shipper.id
          : null,
        id: this.isOrderDetail.id,
        shipper: this.idStaff?.id || this.idStaff,
        status: OrderStatus.Success,
        purchasedId: this.isOrderDetail.items.map(item => item.id),
        userId: this.isOrderDetail.personCreate.id
      });
    },
    orderCancel() {
      this.$emit("onOrderCancel", this.isOrderDetail);
    },
    submitOrderChange() {
      this.$emit("onChangeUpdateOrder", {
        oldShipperId: this.isOrderDetail.shipper
          ? this.isOrderDetail.shipper.id
          : null,
        id: this.isOrderDetail.id,
        shipper: this.idStaff?.id || this.idStaff,
        status: OrderStatus.Pending
      });
    },
    onChange(value) {
      this.idStaff = value;
    },
    close() {
      this.$emit("onClose");
    }
  }
};
</script>

<style scoped>
.avt-img {
  border-radius: 10px;
  border: 1px solid red;
}
.dialog-info {
  background-color: #dfdfdf !important;
}
.btn-change-password {
  background-color: #c3a12f !important;
}
.btn-edit {
  background-color: #f0293c !important;
}
.box-actions {
  text-align: -webkit-right;
}
.icon-close {
  position: absolute;
  right: 3px;
  top: 3px;
}
</style>
