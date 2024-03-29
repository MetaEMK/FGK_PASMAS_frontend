import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap-icons/font/bootstrap-icons.css";
import "primeflex/primeflex.css";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import "./assets/main.scss";

import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
    // Report to log service
    console.log("Handling error globally:");
    
    console.log(err);
    console.log(instance);
    console.log(info);
}

app.use(createPinia());
app.use(router);
app.use(ToastService);
app.use(PrimeVue, {
    locale: {
        startsWith: "Beginnt mit",
        contains: "Enthält",
        notContains: "Enthält nicht",
        endsWith: "Endet mit",
        equals: "Ist gleich",
        notEquals: "Ist nicht gleich",
        noFilter: "Kein Filter"
    }
});

app
    .component("PrimeButton", Button)
    .component("PrimeColumn", Column)
    .component("PrimeDataTable", DataTable)
    .component("PrimeDivider", Divider)
    .component("PrimeDropdown", Dropdown)
    .component("PrimeInputNumber", InputNumber)
    .component("PrimeInputText", InputText);

app.mount("#app");
