<template>
  <div>
    <v-card>
      <v-breadcrumbs :items="items" class="py-2 pl-2 breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item class="text-breadcrumbs" :to="item.href" :disabled="item.disabled">
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    }
  },
  data() {
    return {
      // items: [
      //   {
      //     text: "Dashboard",
      //     disabled: false,
      //     href: "breadcrumbs_dashboard"
      //   },
      //   {
      //     text: "Link 1",
      //     disabled: false,
      //     href: "breadcrumbs_link_1"
      //   }
      // ]
    };
  }
};
</script>

<style>
.breadcrumbs {
  background-color: #fbf7f0 !important;
}
.v-breadcrumbs__item {
  color: grey !important;
  font-size: 16px;
}
</style>
