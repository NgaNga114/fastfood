<template>
  <div class="box-address">
    <v-card class="px-4 py-2">
      <v-row>
        <v-col col="9" sm="9">
          <v-row>
            <v-col>
              <div class="d-flex">
                <v-icon class="d-block red--text">mdi-location-enter</v-icon>
                <div>
                  <v-card-subtitle class="py-0">
                    {{ address.name }}
                  </v-card-subtitle>
                  <v-card-subtitle class="py-0">
                    <span>{{ address.location.detailAddress }},</span>
                    <span>{{ address.location.ward.title }},</span>
                    <span>{{ address.location.district.title }},</span>
                    <span>{{ address.location.city.title }}</span>
                  </v-card-subtitle>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="d-flex">
                <v-icon class="red--text">mdi-phone</v-icon>
                <div>
                  <v-card-subtitle class="py-0">
                    {{ address.phoneNumber }}
                  </v-card-subtitle>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" sm="3">
          <a class="float-right" @click="openEditAddress()">Исправить</a>
          <br />
          <a class="float-right mt-4" @click="openRemoveDialog()">Удалить</a>
        </v-col>
      </v-row>
    </v-card>
    <EditAddress
      :dialog="dialogEditAddress"
      :address="address"
      @onClose="closeDialogEditAddress"
      @onSubmitEditAddress="submitEditAddress"
    />
    <DeleteDialog
      :title="titleDialog"
      :dialog="dialogRemove"
      @onClose="onClose"
      @onDialog="onDelete"
    />
  </div>
</template>

<script>
import EditAddress from "../components/dialog/user/address/editAddress";
import DeleteDialog from "../components/dialog/DeleteDialog";

export default {
  props: {
    address: {
      type: Object,
      require: true,
      default() {
        return {};
      }
    },
    indexAddress: {
      type: Number,
      required: true
    }
  },
  components: {
    EditAddress,
    DeleteDialog
  },
  data() {
    return {
      dialogEditAddress: false,
      titleDialog: {
        title: "Удалить адрес",
        subTitle: "Вы уверены, что хотите удалить этот адрес?"
      },
      dialogRemove: false
    };
  },
  methods: {
    submitEditAddress(payload) {
      this.$emit("onSubmitEditAddress", {
        ...payload,
        index: this.indexAddress
      });
      this.dialogEditAddress = false;
    },
    closeDialogEditAddress() {
      this.dialogEditAddress = false;
    },
    openEditAddress() {
      this.dialogEditAddress = true;
    },
    openRemoveDialog() {
      this.dialogRemove = true;
    },
    onClose() {
      this.dialogRemove = false;
    },
    onDelete() {
      console.log('onRemoveAddress');
      this.$emit("onRemoveAddress", this.indexAddress);
      this.dialogRemove = false;
    }
  }
};
</script>

<style scoped>
a {
  color: #bcad72 !important;
}
</style>
