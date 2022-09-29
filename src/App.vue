<template>
  <v-app>
    <Navigation v-if="isLoggedIn" />
    <v-main>
      <v-card flat color="" height="100%" class="mx-2 rounded-lg">
        <v-card-title v-if="isLoggedIn">
          <v-icon @click="drawer = !drawer">mdi-menu</v-icon>
          <v-spacer></v-spacer>
          <p class="text-subtitle-1">
            {{ time }}
            {{ new Date() | moment("A") }}
          </p>
        </v-card-title>
        <v-divider v-if="isLoggedIn"></v-divider>
        <v-card-text :class="isLoggedIn ? '' : 'main'">
          <router-view />
        </v-card-text>
      </v-card>
    </v-main>
    <Footer v-if="isLoggedIn" />
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import Footer from "./components/Footer.vue";

import { mapState, mapWritableState } from "pinia";
import { userStore } from "./stores/user";
import { appStore } from "./stores/app";

export default {
  name: "App",

  data: () => ({
    time: null,
  }),
  computed: {
    ...mapState(userStore, ["isLoggedIn"]),
    ...mapWritableState(appStore, ["drawer"]),
  },
  components: {
    Navigation,
    Footer,
  },
  methods: {
    showTime() {
      setInterval(() => {
        var week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        var cd = new Date();
        this.time =
          this.zeroPadding(cd.getHours(), 2) +
          ":" +
          this.zeroPadding(cd.getMinutes(), 2) +
          ":" +
          this.zeroPadding(cd.getSeconds(), 2);
        this.date = this.zeroPadding(cd.getDate(), 2) + " " + week[cd.getDay()];
      }, 1000);
    },
    zeroPadding(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
  },
  mounted() {
    this.showTime();
  },
};
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap'); */
#app {
  background-color: aliceblue;
}
#outer {
  background-color: aliceblue;
  height: 100%;
}
.main {
  height: 100%;
}
</style>
