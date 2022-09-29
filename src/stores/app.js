import { defineStore } from "pinia";

export const appStore = defineStore("app-store", {
  state: () => ({
    drawer: true,
    department: null,
  }),
});
