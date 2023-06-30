<template>
  <div style="max-width: 1200px; margin: 0 auto;">
    <div class="my-3">
      <Breadcrumbs :items="item_breadcrumbs" />
    </div>
    <div>
      <v-card style="max-width: 1000px; margin: 0 auto;">
        <div class="pa-2">
          <div class="d-flex">
            <v-img
              max-height="80"
              max-width="80"
              class="col-4 mr-1"
              :src="require('~/assets/images/combo.jpg')"
            ></v-img>
            <p class="mb-0">
              Kê lót tay bàn phím - bằng gỗ thiết kế chất lượng cao Fullsize/
              TKL / Compact / Keychon [Có làm theo yêu cầu]
            </p>
          </div>
        </div>
        <div>
          <span>
            Phân loại hàng: Cơm
          </span>
          <div>
            <span>x 1</span>
            <span>₽860</span>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from "../../components/Breadcrumbs";

export default {
  components: {
    Breadcrumbs
  },
  computed: {
    item_breadcrumbs() {
      return [
        {
          text: "Главная страница",
          disabled: false,
          href: "/"
        },
        {
          text: "Danh sách đơn hàng",
          disabled: true,
          href: "/purchase/list"
        }
      ];
    }
  }
};
</script>

<style scoped></style>
