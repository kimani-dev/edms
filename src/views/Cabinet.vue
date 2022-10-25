<template>
  <div>
    <Layout :title="'My Cabinet'" :fileEdits="false" :files="myDocuments" />
  </div>
</template>

<script>
import Layout from "../components/Layout.vue";
import { mapState, mapActions } from "pinia";
import { myDocuments } from "@/stores/myDocuments";

export default {
  name: "CabinetView",
  components: {
    Layout,
  },
  computed: {
    ...mapState(myDocuments, ["myDocuments", "cabinet"]),
  },
  methods: {
    ...mapActions(myDocuments, ["getCabinet"]),
  },
  created() {
    // this.getCabinet();
  },
};
</script>

<style></style>
