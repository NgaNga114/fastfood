<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="600">
      <v-card class="dialog-info pa-6">
        <v-card-title class="px-0 pb-0 d-flex justify-center align-center">
          <p
            class="text-h6 text-sm-h5 font-weight-bold red--text text--darken-1"
          >
            Chọn Địa Chỉ Giao Hàng
          </p>
        </v-card-title>
        <v-card class="pa-6 mx-auto" width="100%">
          <v-radio-group v-model="addressSelect" class="mt-0 mb-5">
            <v-radio
              v-for="address in diliveryAddress"
              :key="address.index"
              :value="address"
            >
              <template v-slot:label>
                <div class="my-3">
                  <strong>{{ address.name }}</strong
                  >, <span>{{ address.phoneNumber }}</span
                  >, <span>{{ address.location.detailAddress }}</span
                  >, <span>{{ address.location.ward.title }}</span
                  >, <span>{{ address.location.district.title }}</span
                  >, <span>{{ address.location.city.title }}</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
          <v-card-actions class="justify-end d-flex">
            <v-btn color="red darken-2" class="white--text" @click="submit()"
              >Lưu</v-btn
            >
            <v-btn @click="close()" outlined color="grey darken-4">Отмена</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      require: false
    },
    diliveryAddress: {
      type: Array
    }
  },
  data() {
    const addressSelect = this.diliveryAddress[0] || "test";
    return {
      addressSelect
    };
  },
  computed: {},
  methods: {
    close() {
      this.$emit("onClose");
    },
    submit() {
      this.$emit("onSubmitAddressSelect", {
        ...this.addressSelect
      });
    }
  }
};
</script>

<style scoped>
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
