<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="600">
      <v-card class="dialog-info pa-6">
        <v-card-title class="px-0 pb-0 d-flex justify-center align-center">
          <p
            class="text-h6 text-sm-h5 font-weight-bold red--text text--darken-1"
          >
            Изменить адрес
          </p>
        </v-card-title>
        <v-card class="pa-6 mx-auto" width="100%">
          <v-form class="my-8 px-7" v-model="valid" ref="form" lazy-validation>
            <!-- <v-card-title class="pa-0 red--text text--darken-1">
              Sửa 1 địa chỉ
            </v-card-title> -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="diliveryAddress.name"
                  :rules="rules.nameRules"
                  dense
                  hide-details="auto"
                  prepend-inner-icon="mdi-account"
                  label="Имя пользователя"
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
                  label="Провинция/город"
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  :disabled="disableDistrict"
                  @change="onChangeDistrict"
                  :items="resDistricts"
                  :rules="rules.districtRule"
                  v-model="diliveryAddress.location.district"
                  dense
                  outlined
                  label="Район"
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="resWards"
                  :rules="rules.wardRule"
                  @change="onChangeWard"
                  v-model="diliveryAddress.location.ward"
                  :disabled="disableWard"
                  dense
                  outlined
                  label="Названия улиц"
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
                  label="№ квартиры"
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
              @click="submitEditAddress()"
              >Сохранять</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const initiaAddressData = {
  location: {
    city: "",
    district: "",
    ward: "",
    detailAddress: ""
  },
  name: "",
  phoneNumber: null
};

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    address: {
      type: Object,
      required: true
    }
  },
  data() {
    const { city, district, ward, detailAddress } = initiaAddressData;
    const diliveryAddress = {
      location: {
        city: this.address.location.city.id || city,
        district: this.address.location.district.id || district,
        ward: this.address.location.ward.id || ward,
        detailAddress: this.address.location.detailAddress || detailAddress
      },
      name: this.address.name || initiaAddressData.name,
      phoneNumber: this.address.phoneNumber || initiaAddressData.phoneNumber
    };
    return {
      valid: true,
      cities: [],
      districts: [],
      wards: [],
      diliveryAddress,
      disableDistrict: false,
      disableWard: false,
      disableDetailAddress: false,
      // TODO: need to handle the rule again (done)
      rules: {
        nameRules: [
          v =>
            (v.length <= 20 && v.length >= 1) ||
            "Имя должно быть больше 1 символа и меньше 20 символов"
        ],
        phoneRule: [
          v =>
            /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(v) ||
            "Неверный номер телефона"
        ],
        cityRule: [v => !!v >= 1 || "Пожалуйста, выберите область/город"],
        districtRule: [
          () =>
            this.diliveryAddress.location.city.length === 0 ||
            !!this.diliveryAddress.location.district ||
            "Пожалуйста, выберите район"
        ],
        wardRule: [
          () =>
            this.diliveryAddress.location.district.length === 0 ||
            !!this.diliveryAddress.location.ward ||
            "Пожалуйста, выберите название улицы"
        ],
        detailAddressRule: [
          v =>
            this.diliveryAddress.location.ward.length === 0 ||
            (!!this.diliveryAddress.location.detailAddress && v.length >= 5) ||
            "Адрес недоступен"
        ]
      }
    };
  },
  async fetch() {
    const tempCities = await fetch(
      "https://provinces.open-api.vn/api/p"
    ).then(res => res.json());
    this.cities = tempCities;
    this.fetchDistrict(this.address.location.city.id);
    this.fetchWard(this.address.location.district.id);
  },
  computed: {
    resCities() {
      return this.cities
        ? this.cities.map(x => {
            return {
              value: x.code,
              text: x.name
            };
          })
        : [];
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
    close() {
      this.$emit("onClose");
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
    submitEditAddress() {
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
          this.$emit("onSubmitEditAddress", {
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
