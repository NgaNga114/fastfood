import Vue from "vue";

Vue.filter("formatCurrency", function(value) {
    if (!value) return 0 + " ₽";
    value = value.toString();
    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " ₽";
});
Vue.filter("formatDate", function(value) {
    if (value) {
        return moment(String(value)).format("MM/DD/YYYY hh:mm");
    }
});
