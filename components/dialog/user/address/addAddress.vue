<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="600">
      <v-card class="dialog-info pa-6">
        <v-card-title class="px-0 pb-0 d-flex justify-center align-center">
          <p
            class="text-h6 text-sm-h5 font-weight-bold red--text text--darken-1"
          >
            Thêm Địa Chỉ
          </p>
        </v-card-title>
        <v-card class="pa-6 mx-auto" width="100%">
          <v-form class="my-8 px-7" v-model="valid" ref="form" lazy-validation>
            <v-card-title class="pa-0 red--text text--darken-1">
              Thêm 1 Địa Chỉ Mới
            </v-card-title>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="diliveryAddress.name"
                  :rules="rules.nameRules"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-account"
                  label="Tên người dùng"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="number"
                  v-model="diliveryAddress.phoneNumber"
                  :rules="rules.phoneRule"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-phone"
                  label="Номер телефона"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="diliveryAddress.location.city"
                  @change="onChangeCity"
                  dense
                  :rules="rules.cityRule"
                  outlined
                  :items="resCities"
                  label="Tỉnh/Thành phố"
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="diliveryAddress.location.district"
                  :disabled="disableDistrict"
                  @change="onChangeDistrict"
                  :items="resDistricts"
                  :rules="rules.districtRule"
                  dense
                  outlined
                  label="Quận/Huyện"
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="diliveryAddress.location.ward"
                  :items="resWards"
                  :rules="rules.wardRule"
                  @change="onChangeWard"
                  :disabled="disableWard"
                  dense
                  outlined
                  label="Phường/Xã"
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="diliveryAddress.location.detailAddress"
                  :disabled="disableDetailAddress"
                  :rules="rules.detailAddressRule"
                  dense
                  hide-details="auto"
                  label="Tòa nhà, tên đường..."
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions class="justify-end d-flex">
            <v-btn outlined color="grey darken-4" @click="close()">Отмена</v-btn>
            <v-btn
              color="red darken-2"
              class="white--text"
              @click="submitAddAddress()"
              >Lưu</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      valid: true,
      cities: [],
      districts: [],
      wards: [],
      diliveryAddress: {
        location: {
          city: "",
          district: "",
          ward: "",
          detailAddress: ""
        },
        name: "",
        phoneNumber: null
      },
      disableDistrict: true,
      disableWard: true,
      disableDetailAddress: true,
      // TODO: need to handle the rule again (done)
      rules: {
        nameRules: [
          v =>
            (v.length <= 20 && v.length >= 1) ||
            "Tên phải nhiều hơn 1 ký tự và ít hơn 20 ký tự"
        ],
        phoneRule: [
          v =>
            /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(v) ||
            "Неверный номер телефона"
        ],
        cityRule: [v => !!v >= 1 || "Vui lòng chọn tỉnh/thành phố"],
        districtRule: [
          () =>
            this.diliveryAddress.location.city.length === 0 ||
            !!this.diliveryAddress.location.district ||
            "Vui lòng chọn quận/huyện"
        ],
        wardRule: [
          () =>
            this.diliveryAddress.location.district.length === 0 ||
            !!this.diliveryAddress.location.ward ||
            "Vui lòng chọn phường/xã"
        ],
        detailAddressRule: [
          v =>
            this.diliveryAddress.location.ward.length === 0 ||
            (!!this.diliveryAddress.location.detailAddress && v.length >= 5) ||
            "Địa chỉ không khả dụng"
        ]
      }
    };
  },
  async fetch() {
    const tempCities = await fetch(
      "https://provinces.open-api.vn/api/p"
    ).then(res => res.json());
    console.log(tempCities);
    this.cities = tempCities;
  },
  computed: {
    resCities() {
      return this.cities.map(x => {
        return {
          value: x.code,
          text: x.name
        };
      });
    },
    resDistricts() {
      return this.districts
        ? this.districts.map(x => {
            return {
              value: x.code,
              text: x.name
            };
          })
        : [];
    },
    resWards() {
      return this.wards.map(x => {
        return {
          value: x.code,
          text: x.name
        };
      });
    }
  },
  methods: {
    resetForm() {
      this.diliveryAddress = {
        location: {
          city: "",
          district: "",
          ward: "",
          detailAddress: ""
        },
        name: "",
        phoneNumber: null
      };
    },
    close() {
      this.$emit("onClose");
      this.resetForm();
    },
    async fetchDistrict(id) {
      const isDistricts = await fetch(
        `https://provinces.open-api.vn/api/p/${id}/?depth=2`
      ).then(res => res.json());
      this.districts = isDistricts.districts;
      console.log(this.districts);
    },
    async fetchWard(id) {
      const isWards = await fetch(
        `https://provinces.open-api.vn/api/d/${id}/?depth=2`
      ).then(res => res.json());
      this.wards = isWards.wards;
      console.log(this.wards);
    },
    onChangeCity() {
      const cityId = this.diliveryAddress.location.city;
      this.fetchDistrict(cityId);
      this.diliveryAddress.location.district = "";
      this.diliveryAddress.location.ward = "";
      this.diliveryAddress.location.detailAddress = "";
    },
    onChangeDistrict() {
      const districtId = this.diliveryAddress.location.district;
      this.fetchWard(districtId);
      this.diliveryAddress.location.ward = "";
      this.diliveryAddress.location.detailAddress = "";
    },
    onChangeWard() {
      this.diliveryAddress.location.detailAddress = "";
    },
    submitAddAddress() {
      this.$refs.form.validate();
      setTimeout(() => {
        if (this.valid === true) {
          const {
            city,
            district,
            ward,
            detailAddress
          } = this.diliveryAddress.location;
          const { name, phoneNumber } = this.diliveryAddress;
          const citySubmit = this.cities.find(x => {
            return x.code === city;
          });
          const districtSubmit = this.districts.find(x => {
            return x.code === district;
          });
          const wardSubmit = this.wards.find(x => {
            return x.code === ward;
          });
          this.$emit("onSubmitAddAddress", {
            location: {
              city: {
                title: citySubmit.name,
                id: citySubmit.code
              },
              district: {
                title: districtSubmit.name,
                id: districtSubmit.code
              },
              ward: {
                title: wardSubmit.name,
                id: wardSubmit.code
              },
              detailAddress
            },
            name,
            phoneNumber
          });
          this.resetForm();
        }
      });
    }
  },
  watch: {
    "diliveryAddress.location.city"() {
      if (this.diliveryAddress.location.city) {
        this.disableDistrict = false;
      } else this.disableDistrict = true;
    },
    "diliveryAddress.location.district"() {
      if (
        this.diliveryAddress.location.city &&
        this.diliveryAddress.location.district
      ) {
        this.disableWard = false;
      } else this.disableWard = true;
    },
    "diliveryAddress.location.ward"() {
      const { city, district, ward } = this.diliveryAddress.location;
      if (city && district && ward) {
        this.disableDetailAddress = false;
      } else {
        this.disableDetailAddress = true;
      }
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
