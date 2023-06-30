<template>
  <div class="py-3" style="max-width: 1200px; margin: 0 auto;">
    <div>
      <Breadcrumbs :items="item_breadcrumbs" />
    </div>
    <div v-if="isProduct">
      <v-row>
        <v-col cols="12" md="8">
          <v-row>
            <v-col cols="12" sm="6">
              <v-img class="img-box-product" :src="isProduct.image">
                <div class="disscount">
                  <p class="text-subtitle-2 red--text mb-0 pt-1">
                    20%
                  </p>
                </div>
              </v-img>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="d-flex justify-space-between">
                <div class="text-h5 font-weight-bold">
                  {{ isProduct.name }}
                </div>
                <v-icon
                  :class="
                    !!listFavourite
                      ? listFavourite.includes(idProduct)
                        ? 'red--text text-subtitle-1 text-sm-h5'
                        : 'gray--text text-subtitle-1 text-sm-h5'
                      : 'gray--text text-subtitle-1 text-sm-h5'
                  "
                >
                  mdi-heart
                </v-icon>
              </div>
              <v-row>
                <v-col cols="5" sm="5">
                  <div
                    class="d-block red--text font-weight-bold text-h5 subtitle-1"
                  >
                    {{ isProduct.price | formatCurrency }}
                  </div>
                  <div
                    class="d-block grey--text text-h6 text-decoration-line-through"
                  >
                    <p>{{ isProduct.oldPrice | formatCurrency }}</p>
                  </div>
                  <div>
                    <v-row align="center" class="pb-3 mx-0">
                      <v-rating
                        :value="isProduct.rate"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="14"
                      ></v-rating>

                      <div class="grey--text ml-1">(413)</div>
                    </v-row>
                  </div>
                  <!-- <div class="d-inline-block red--text subtitle-1 py-3">
                    <v-icon>mdi-car</v-icon>
                  </div> -->
                </v-col>
                <v-col cols="7" sm="7" class="gr-btn-left">
                  <v-btn
                    class="my-2 white--text float-right"
                    color="red"
                    width="170"
                    small
                    @click="onBuyNow()"
                  >
                    КУПИ СЕЙЧАС
                  </v-btn>
                  <v-btn
                    @click="addCart()"
                    class="my-2 bg-yellow white--text float-right"
                    width="170"
                    small
                  >
                    ДОБАВИТЬ В КОРЗИНУ
                  </v-btn>
                  <v-btn
                    class="my-2 float-right"
                    outlined
                    color="red"
                    width="170"
                    small
                    @click="
                      !!userProfile
                        ? favouriteProductAPI({
                            idProduct: idProduct,
                            type: 'plus',
                            uid: userProfile.id
                          })
                        : $router.push('/signin')
                    "
                    v-if="
                      !!userProfile ? !listFavourite.includes(idProduct) : true
                    "
                  >
                    <v-icon dense>mdi-plus</v-icon>
                    ИЗБРАННОЕ
                  </v-btn>
                  <v-btn
                    class="my-2 float-right"
                    outlined
                    color="red"
                    width="170"
                    small
                    @click="
                      !!userProfile
                        ? favouriteProductAPI({
                            idProduct: idProduct,
                            type: 'minus',
                            uid: userProfile.id
                          })
                        : ''
                    "
                    v-else
                  >
                    <v-icon dense>mdi-minus</v-icon>
                    ОТМЕНА ИЗБРАННОГО
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <!-- detail -->
          <div>
            <v-card>
              <v-tabs class="blue-grey lighten-5" v-model="tab">
                <v-tab v-for="item in items" :key="item.tab">
                  {{ item.tab }}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <div class="detail-product">
                        <v-row class="px-3">
                          <v-col
                            class="d-flex justify-center align-center border-box border-left-box"
                            cols="3"
                            sm="2"
                            md="2"
                          >
                            <p class="mb-0 font-weight-bold">
                              Название продукта
                            </p>
                          </v-col>
                          <v-col class="border-box" cols="9" sm="10" md="10">
                            {{ isProduct.name }}
                          </v-col>
                        </v-row>
                        <v-row class="px-3">
                          <v-col
                            class="d-flex justify-center align-center border-box border-left-box"
                            cols="3"
                            sm="2"
                            md="2"
                          >
                            <p class="font-weight-bold mb-0">Характ.</p>
                          </v-col>
                          <v-col class="border-box" cols="9" sm="10" md="10">
                            {{ isProduct.name }} сделано по особому рецепту.
                          </v-col>
                        </v-row>
                        <v-row class="px-3">
                          <v-col
                            class="d-flex justify-center border-left-box"
                            cols="3"
                            sm="2"
                            md="2"
                          >
                            <p class="font-weight-bold mb-0">
                              Ингредиент
                            </p>
                          </v-col>
                          <v-col cols="9" sm="10" md="10">
                            <ul class="pl-0">
                              <!-- <li>Thịt bò</li>
                              <li>Bột mì</li>
                              <li>Bơ</li>
                              <li>Bột Năng</li>
                              <li>Bột gia vị</li>
                              <li>Trứng gà</li>
                              <li>Sữa tươi không đường</li> -->
                              <!-- <li>Phô mai</li>
                              <li>Bột nêm</li>
                              <li>Bột tỏi</li> -->
                              <li>{{ isProduct.name }} Очень вкусно!!!</li>
                              <li>Должен попытаться</li>
                            </ul>
                          </v-col>
                        </v-row>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-row class="mt-2">
                      <v-col
                        cols="12"
                        sm="3"
                        class="pr-0 pl-sm-4 text-center d-flex justify-center align-center"
                      >
                        <div>
                          <h1 class="display-3 font-weight-bold">4.5</h1>
                          <div>
                            <v-rating
                              :value="5"
                              color="amber"
                              dense
                              readonly
                              size="20"
                            ></v-rating>
                            <p class="mb-0">
                              ( {{ listRate.length }} Оценщик )
                            </p>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="9" class="px-7">
                        <v-row>
                          <v-col class="py-0" cols="7" sm="8">
                            <div class="line-rate-box my-2 text-center">
                              <v-card
                                flat
                                width="69%"
                                height="12"
                                class="line-rate text-center"
                              >
                              </v-card>
                            </div>
                          </v-col>
                          <v-col
                            class="pl-0 pl-sm-3 py-0 d-flex align-center"
                            cols="5"
                            sm="4"
                          >
                            <div class="d-flex mb-n1">
                              <v-rating
                                class="d-flex justify-center"
                                :value="5"
                                color="amber"
                                dense
                                half-increments
                                readonly
                                size="14"
                              ></v-rating>
                              <span
                                class="ml-1 ml-sm-2 grey--text text--darken-3"
                                >69%</span
                              >
                            </div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="py-0" cols="7" sm="8">
                            <div class="line-rate-box my-2 text-center">
                              <v-card
                                flat
                                width="15%"
                                height="12"
                                class="line-rate text-center"
                              >
                              </v-card>
                            </div>
                          </v-col>
                          <v-col
                            class="pl-0 pl-sm-3 py-0 d-flex align-center"
                            cols="5"
                            sm="4"
                          >
                            <div class="d-flex mb-n1">
                              <v-rating
                                class="d-flex justify-center"
                                :value="4"
                                color="amber"
                                dense
                                half-increments
                                readonly
                                size="14"
                              ></v-rating>
                              <span
                                class="ml-1 ml-sm-2 grey--text text--darken-3"
                                >15%</span
                              >
                            </div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="py-0" cols="7" sm="8">
                            <div class="line-rate-box my-2 text-center">
                              <v-card
                                flat
                                width="11%"
                                height="12"
                                class="line-rate text-center"
                              >
                              </v-card>
                            </div>
                          </v-col>
                          <v-col
                            class="pl-0 pl-sm-3 py-0 d-flex align-center"
                            cols="5"
                            sm="4"
                          >
                            <div class="d-flex mb-n1">
                              <v-rating
                                class="d-flex justify-center"
                                :value="3"
                                color="amber"
                                dense
                                half-increments
                                readonly
                                size="14"
                              ></v-rating>
                              <span
                                class="ml-1 ml-sm-2 grey--text text--darken-3"
                                >03%</span
                              >
                            </div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="py-0" cols="7" sm="8">
                            <div class="line-rate-box my-2 text-center">
                              <v-card
                                flat
                                width="35%"
                                height="12"
                                class="line-rate text-center"
                              >
                              </v-card>
                            </div>
                          </v-col>
                          <v-col
                            class="pl-0 pl-sm-3 py-0 d-flex align-center"
                            cols="5"
                            sm="4"
                          >
                            <div class="d-flex mb-n1">
                              <v-rating
                                class="d-flex justify-center"
                                :value="2"
                                color="amber"
                                dense
                                half-increments
                                readonly
                                size="14"
                              ></v-rating>
                              <span
                                class="ml-1 ml-sm-2 grey--text text--darken-3"
                                >11%</span
                              >
                            </div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="py-0" cols="7" sm="8">
                            <div class="line-rate-box my-2 text-center">
                              <v-card
                                flat
                                width="07%"
                                height="12"
                                class="line-rate text-center"
                              >
                              </v-card>
                            </div>
                          </v-col>
                          <v-col
                            class="pl-0 pl-sm-3 py-0 d-flex align-center"
                            cols="5"
                            sm="4"
                          >
                            <div class="d-flex mb-n1">
                              <v-rating
                                class="d-flex justify-center"
                                :value="1"
                                color="amber"
                                dense
                                half-increments
                                readonly
                                size="14"
                              ></v-rating>
                              <span
                                class="ml-1 ml-sm-2 grey--text text--darken-3"
                                >02%</span
                              >
                            </div>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider class="grey mt-5 mx-4"></v-divider>
                    <div v-if="!!listRate.length">
                      <v-card-text
                        class="pb-0 pt-0"
                        v-for="item in listRate"
                        :key="item.id"
                      >
                        <AComment
                          :rate="item"
                          :isShowEdit="
                            userProfile ? item.uid === userProfile.id : false
                          "
                          :isEditComment="isEditComment"
                          @onEditComment="onEditComment"
                          @onCloseEditComment="onCloseEditComment"
                        />
                        <v-divider class="grey"></v-divider>
                      </v-card-text>
                    </div>
                    <div v-else>
                      <v-card-text class="py-3 text-center">
                        <h4>Еще нет отзывов</h4>
                      </v-card-text>
                    </div>
                    <div class="px-6 py-2" v-if="isCheckUser && isAllowComment">
                      <v-row>
                        <v-col cols="12" sm="9">
                          <v-text-field
                            v-model="comment"
                            dense
                            hide-details="auto"
                            outlined
                            label="Viết đánh giá ở đây !"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" class="text-center">
                          <v-btn
                            v-if="!isEditComment"
                            @click="onRating()"
                            class="bg-yellow white--text"
                            width="80%"
                          >
                            ОЦЕНКА
                          </v-btn>
                          <v-btn
                            v-else
                            @click="reRating()"
                            class="bg-yellow white--text"
                            width="80%"
                          >
                            ПРОДОЛЖИТЬ ОЦЕНКУ
                          </v-btn>
                        </v-col>
                        <v-col cols="12" class="d-flex">
                          <p class="mb-0">Звездный рейтинг *:</p>
                          <v-rating
                            v-model="rate"
                            class="ml-3"
                            color="amber"
                            dense
                            half-increments
                            size="20"
                          ></v-rating>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="red--text text-body-2 font-weight-bold">
            СПЕЦИАЛЬНОЕ КОМБО
          </div>
          <v-divider class="my-2"></v-divider>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="12"
              lg="12"
              class="pb-2"
              v-for="item in 4"
              :key="item.index"
            >
              <Short />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from "../../components/Breadcrumbs";
import Short from "../../components/Short";
import AComment from "../../components/AComment";

import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {
    Breadcrumbs,
    Short,
    AComment
  },
  data() {
    return {
      tab: null,
      items: [{ tab: "ПРОДУКТ" }, { tab: "ОЦЕНКА" }],
      idProduct: this.$route.params.id,
      disableButton: false,
      comment: "",
      rate: 0,
      isEditComment: false,
      commentId: ""
    };
  },
  computed: {
    ...mapState("products", ["products", "listRate", "listFavourite"]),
    ...mapState("user", ["userProfile", "purchasedList"]),
    ...mapGetters("user", ["isCheckUser", "getUser"]),
    isAllowComment() {
      return (
        (this.purchasedList.includes(this.idProduct) &&
          !this.listRate.find(item => item.uid === this.userProfile.id)) ||
        this.isEditComment
      );
    },
    isProduct() {
      const id = this.$route.params.id;
      return this.products.find(x => {
        return x.id === id;
      });
    },
    item_breadcrumbs() {
      return [
        {
          text: "Главная страница",
          disabled: false,
          href: "/"
        },
        {
          text: "Подробности о блюде",
          disabled: false,
          href: "/",
          disabled: true
        }
      ];
    }
  },
  mounted() {
    this.getListRate(this.idProduct);
    this.getPurchasedList();
    if (!!this.userProfile) {
      this.favouriteProductAPI({
        idProduct: this.idProduct,
        uid: this.userProfile.id
      });
    }
  },
  methods: {
    ...mapActions("products", [
      "addToCart",
      "buyNow",
      "ratingProduct",
      "getListRate",
      "updateRatingProduct",
      "favouriteProductAPI"
    ]),
    ...mapActions("user", ["getPurchasedList"]),
    reRating() {
      if (this.commentId) {
        this.updateRatingProduct({
          id: this.commentId,
          comment: this.comment,
          rate: this.rate
        });
        this.comment = "";
        this.rate = 0;
        this.isEditComment = false;
      }
    },
    onEditComment(id) {
      this.commentId = id;
      this.isEditComment = true;
      const commentEdit = this.listRate.find(
        item => item.id === this.commentId
      );
      this.comment = commentEdit.comment || "";
      this.rate = commentEdit.rate || 0;
    },
    onCloseEditComment() {
      this.comment = "";
      this.rate = 0;
      this.isEditComment = false;
    },
    resetRating() {
      this.rate = 0;
      this.comment = "";
    },
    onRating() {
      if (this.rate && this.comment) {
        const payload = {
          rate: this.rate,
          comment: this.comment,
          uid: this.userProfile.id,
          date: new Date(),
          productId: this.idProduct,
          isEdited: false
        };
        this.ratingProduct(payload);
        this.resetRating();
      }
    },
    addCart() {
      if (this.isCheckUser) {
        this.addToCart({
          id: this.isProduct.id,
          quantity: 1,
          pick: true
        });
      } else {
        this.$router.push("/signin");
      }
    },
    onBuyNow() {
      if (this.isCheckUser) {
        this.buyNow({
          id: this.isProduct.id,
          quantity: 1,
          pick: true
        });
        this.$router.push("/checkout-page");
      } else {
        this.$store.commit("SET_SNACKBAR", {
          show: true,
          text: "Вам необходимо войти",
          color: "error"
        });
        this.$router.push("/signin");
      }
    }
  },
  created() {}
};
</script>

<style scoped>
ul {
  list-style: none;
}
.detail-product {
  border: 3px solid #d5d4d5;
}
.bg-yellow {
  background-color: #c79f30 !important;
}
.img-box-product {
  position: relative;
  border-radius: 8px;
}
.border-box {
  border-bottom: 3px solid #d5d4d5;
}
.border-left-box {
  border-right: 3px solid #d5d4d5;
}
.disscount {
  height: 27px;
  width: 45px;
  background-color: #f2e92a;
  text-align: center;
  display: flex;
  justify-content: center;
  position: absolute;
  border-radius: 5px;
  right: 10px;
  top: 7px;
  /* border-bottom: 10px solid #f0f0f0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent; */
}
.tabs-product-detail {
  background-color: red !important;
}
.line-rate-box {
  border-radius: 20px;
  height: 13px;
  background-color: #d8d8d8;
}
.line-rate {
  background-color: #c79f30 !important;
  border-radius: 20px;
}
/* @media screen and (max-width: 600px) {
  .gr-btn-left {
    display: grid;
  }
} */
</style>
