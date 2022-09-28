import { defineStore } from "pinia";
import Api from "../services/Api";

export const userStore = defineStore("user", {
  state: () => {
    return {
      user: {},
      isLoggedIn: true,
    };
  },
  actions: {
    login(data) {
      return Api.login(data)
        .then((result) => {
          this.user = result.data.user;
          localStorage.setItem("token", result.data.token.access_token);
          this.isLoggedIn = true;
        })
        .catch((error) => {
          throw error;
        });
    },
    logout() {
      return Api.logout()
        .then(() => {
          localStorage.removeItem("token");
          this.isLoggedIn = false;
        })
        .catch((error) => {
          throw error;
        });
    },
  },
});
