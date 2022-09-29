import { defineStore } from "pinia";
// import Api from "../services/Api";

export const memberStore = defineStore("member-store", {
  state: () => ({
    members: [],
    member: null,
  }),
  getters: {
    memberNames: (state) => {
      return state.members;
    },
  },
  actions: {
    getMembers() {},
  },
});
