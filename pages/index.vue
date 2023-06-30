<template>
  <div class="home-page">
    <div>
      <v-row>
        <div class="d-none d-sm-block d-lg-none branner-ipad px-3">
          <v-img :src="require('../assets/images/banner-ipad.jpg')"></v-img>
        </div>

        <div class="d-block d-sm-none branner-ipad px-3">
          <v-img :src="require('../assets/images/banner-mobile.jpg')"></v-img>
        </div>

        <v-col cols="12" sm="3" md="3" lg="2" class="pr-0 d-none d-sm-flex">
          <v-card class="mx-auto" tile>
            <v-navigation-drawer permanent>
              <v-list class="py-0 list-item-content">
                <v-list-item link>
                  <v-list-item-content class="py-0">
                    <v-list-item-title
                      class="font-weight-bold red--text text-subtitle-1"
                    >
                    КАТЕГОРИЯ
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <v-list nav dense>
                <v-list-item-group v-model="selectedItem" color="primary">
                  <v-list-item
                    class="mb-1"
                    v-for="(item, i) in itemsBar"
                    :key="i"
                  >
                    <v-list-item-content class="py-1">
                      <v-list-item-title
                        class="text-body-2"
                        @click="barLeft(item.path)"
                        v-text="item.text"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-navigation-drawer>
          </v-card>
        </v-col>
        <!-- middle -->
        <v-col cols="12" sm="9" md="9" lg="8">
          <div class="d-flex justify-space-between align-center">
            <h3
              class="custom-color-black text-sm-h6 text-body-2 font-weight-bold"
            >
              АКЦИИ
            </h3>
            <a
              @click="$router.push('/products/promotional')"
              style="color: #BDAC86"
              class="text-caption d-none d-sm-flex text-sm-body-1"
            >Подробнее >></a
            >
            <a
              style="color: #BDAC86"
              class="text-caption d-flex d-sm-none text-sm-body-1"
            >Подробнее >></a
            >
          </div>
          <v-divider class="my-2"></v-divider>
          <v-row class="text-center pl-3">
            <v-col
              class="pb-0 pl-0"
              v-for="item in product_sale"
              :key="item.index"
              cols="6"
            >
              <v-card
                max-width="380"
                height="100%"
                class="mx-auto card-box-product"
              >
                <BoxProduct v-if="product_sale" :item="item"/>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="products.length <= 0" class="text-center pl-3">
            <v-col
              class="pb-0 pl-0"
              v-for="item in 4"
              :key="item.index"
              cols="6"
            >
              <v-card
                max-width="380"
                height="100%"
                class="mx-auto card-box-product"
              >
                <v-skeleton-loader
                  class="mx-auto"
                  max-width="300"
                  type="card"
                ></v-skeleton-loader>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <!-- banner right -->
        <v-col cols="12" sm="2" class="pl-0 d-none d-lg-flex">
          <v-img :src="require('../assets/images/Special_Banner.png')">
          </v-img>
        </v-col>
      </v-row>
    </div>
    <!-- bottom -->
    <div>
      <div class="d-flex justify-space-between align-center">
        <h3 class="custom-color-black text-sm-h6 text-body-2 font-weight-bold" style="margin-top: 30px;">
          СПЕЦИАЛЬНОЕ КОМБО
        </h3>
        <a
          @click="$router.push('/products/combo')"
          style="color: #BDAC86"
          class="text-caption d-none d-sm-flex text-sm-body-1"
        >Подробнее >></a
        >
        <a
          style="color: #BDAC86"
          class="text-caption d-flex d-sm-none text-sm-body-1"
        >Подробнее >></a
        >
      </div>
      <v-divider class="my-2"></v-divider>
      <v-row class="text-center pl-3">
        <v-col
          class="pl-0 pb-0"
          v-for="item in product_especially"
          :key="item.index"
          cols="6"
          md="3"
        >
          <v-card
            max-width="100%"
            height="100%"
            class="mx-auto card-box-product"
          >
            <BoxProduct :item="item"/>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="products.length <= 0" class="text-center pl-3">
        <v-col
          class="pl-0 pb-0"
          v-for="item in 4"
          :key="item.index"
          cols="6"
          md="3"
        >
          <v-card
            max-width="100%"
            height="100%"
            class="mx-auto card-box-product"
          >
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div>
      <div class="mt-3 d-flex justify-space-between align-center">
        <h3 class="custom-color-black text-sm-h6 text-body-2 font-weight-bold" style="margin-top: 30px;">
          ЧТО МЫ ЕДИМ СЕГОДНЯ ?
        </h3>
        <a
          @click="$router.push('/products/ponlan')"
          style="color: #BDAC86"
          class="text-caption d-none d-sm-flex text-sm-body-1"
        >Подробнее >></a
        >
        <a
          style="color: #BDAC86"
          class="text-caption d-flex d-sm-none text-sm-body-1"
        >Подробности >></a
        >
      </div>
      <v-divider class="my-2"></v-divider>
      <v-row class="text-center pl-3">
        <v-col
          class="pl-0 pb-0"
          v-for="item in product_random"
          :key="item.index"
          cols="6"
          md="3"
        >
          <v-card
            max-width="100%"
            height="100%"
            class="mx-auto card-box-product"
          >
            <BoxProduct :item="item"/>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="products.length <= 0" class="text-center pl-3">
        <v-col
          class="pl-0 pb-0"
          v-for="item in 4"
          :key="item.index"
          cols="6"
          md="3"
        >
          <v-card
            max-width="100%"
            height="100%"
            class="mx-auto card-box-product"
          >
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!--dialog-->
    <v-dialog
      v-model="isPopup"
      width="1000"
    >
      <v-card
        flat
        tile
      >
        <v-window
          v-model="onboarding"
          reverse
        >
          <v-window-item
            v-for="(n, index) in length"
            :key="`card-${n}`"
          >
            <v-img
              height="auto"
              :lazy-src="require('../assets/images/white_full.png')"
              class="white--text align-end relative"
              :src="require(`../assets/images/${image[n-1]}`)"
            >
              <v-card-actions style="position: absolute; top: 10px; right:10px; z-index: 1;">
                <v-btn icon color="#cc1f29" @click="isPopup = false" style="background-color: #fff">
                  <v-icon>
                    mdi-close-thick
                  </v-icon>
                </v-btn>
              </v-card-actions>
              <!-- <v-card-actions>
                <div class="main-content">
                  <div class="item button-jittery" style="--bg-color: #f1c40f;">
                    <button
                      class="px-2 py-1 px-md-4 py-md-3 text-caption text-md-body-2"
                      style="position: absolute; bottom: 10%; left: 10%"
                      @click="$router.push('/products/promotional')"
                    >
                      <span
                        class="text-caption text-md-body-2"
                      >
                        BUY NOW!
                      </span>
                    </button>
                  </div>
                </div>
              </v-card-actions> -->
              <v-card-actions>
                <v-item-group
                  v-model="onboarding"
                  class="text-center m-auto"
                  style="margin: auto"
                  mandatory
                >
                  <v-item
                    v-for="n in length"
                    :key="`btn-${n}`"
                    v-slot="{ active, toggle }"
                    class="m-auto"
                  >
                    <v-btn
                      :color="index + 1 == n ? 'red': '#fff'"
                      :input-value="active"
                      icon
                      @click="toggle"
                      style="font-size: 10px"
                    >
                      <v-icon>mdi-record</v-icon>
                    </v-btn>
                  </v-item>
                </v-item-group>
              </v-card-actions>
            </v-img>
          </v-window-item>
        </v-window>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BoxProduct from "../components/BoxProduct";
import {mapState, mapActions, mapGetters} from "vuex";

export default {
  components: {
    BoxProduct
  },
  data() {
    return {
      selectedItem: 0,
      image: [
        'backgroundBanner1.png',
        'backgroundFood.jpeg',
        'backgroundBanner2.png',
        'backgroundBanner3.png',
        'backgroundBanner2.png'
      ],
      isPopup: true,
      length: 5,
      onboarding: 0,
      intervalPopUp: 0,
      itemsBar: [
        {text: "Главная страница", path: "/"},
        {text: "Пицца", path: "/products/promotional"},
        {text: "Специальное комбо", path: "/products/combo"},
        {text: "Жареная курочка", path: "/products/garan"},
        {text: "Бургер", path: "/products/burger"},
        {text: "Рис", path: "/products/com"},
        {text: "Кекс", path: "/products/ponlan"},
        {text: "Десерт", path: "/products/dessert"}
      ]
    };
  },
  computed: {
    ...mapState("products", ["products"]),
    product_sale() {
      let promotional = this.products.filter(x => {
        return x.type?.value === "promotional";
      });
      // console.log(promotional.slice(0, 4));
      const test = promotional.slice(0, 4);
      // return promotional.slice(0, 4);
      return test;
      // return promotional;
    },
    product_especially() {
      let combo = this.products.filter(x => {
        return x.type.value === "combo";
      });
      return combo.slice(0, 4);
    },
    product_random() {
      let ponlan = this.products.filter(x => {
        return x.type.value === "ponlan";
      });
      return ponlan.slice(0, 4);
    }
  },
  methods: {
    barLeft(path) {
      this.$router.push(path);
    }
  },
  created() {
    this.intervalPopUp = setInterval(() => {
      if (this.onboarding < this.length) {
        this.onboarding = this.onboarding + 1
      } else {
        this.onboarding = 0
      }
    }, 5000)
  },
  watch: {
    isPopup(newVal) {
      if(!newVal){
        clearInterval(this.intervalPopUp)
      }
    }
  }
};
</script>
<style lang="scss">
.bar-search .v-input__append-inner {
  display: none;
}

.card-box-product {
  border-radius: 8px !important;
}
.v-card__actions{
  padding-top: 0px !important;
}
.custom-color-black {
  color: #525254;
}

/* v-list-item__content */
.list-item-content .v-list-item__content {
  margin-top: -8px;
}

.list-item-content {
  height: 39px !important;
}

.branner-ipad {
  width: 100%;
}

.v-skeleton-loader__image {
  margin-top: 12px !important;
  border-radius: 7px !important;
}
</style>
<style scoped lang="scss">

.home-page {
  max-width: 1200px;
  margin: 0 auto;
}


.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
.item {
  display: grid;
  grid-template-rows: 1fr min-content;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
&:not(.footer) {
   padding-top: 1rem;
 }
}
}

.button-jittery button {
  background: var(--bg-color);
  color: #fff;
  border: 3px solid #fff;
  border-radius: 50px;
  // padding: 0.8rem 2rem;
  // font: 14px "Margarine", sans-serif;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: 0.2s ease-in-out;
  letter-spacing: 2px;
}

.button-jittery button {
  animation: jittery 4s infinite;
&:hover {
   animation: heartbeat 0.2s infinite;
 }
}

@keyframes jittery {
  5%,
  50% {
    transform: scale(1);
  }
  10% {
    transform: scale(0.9);
  }
  15% {
    transform: scale(1.15);
  }
  20% {
    transform: scale(1.15) rotate(-5deg);
  }
  25% {
    transform: scale(1.15) rotate(5deg);
  }
  30% {
    transform: scale(1.15) rotate(-3deg);
  }
  35% {
    transform: scale(1.15) rotate(2deg);
  }
  40% {
    transform: scale(1.15) rotate(0);
  }
}

@keyframes heartbeat {
  50% {
    transform: scale(1.1);
  }
}
</style>
