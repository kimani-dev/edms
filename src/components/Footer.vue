<template>
  <v-footer app color="transparent" absolute>
    <v-col class="pa-3">
      <v-row class="justify-center align-center"> </v-row>
      <v-row class="justify-center">
        <div>
          Suvence Technologies Limited &copy; {{ new Date().getFullYear() }}
        </div>
      </v-row>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: "FooterComponent",
  data() {
    return {};
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm;
    },
  },
};
</script>

<style></style>
