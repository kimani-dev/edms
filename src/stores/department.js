import { defineStore } from "pinia";
import Api from "../services/Api";

export const departmentStore = defineStore("department", {
  state: () => ({
    departments: [],
  }),
  actions: {
    getDepartments() {
      return Api.getDepartments()
        .then((res) => {
          this.departments = res.data.data;
        })
        .catch((err) => {
          throw err;
        });
    },
    createDepartment(data) {
      return Api.createDepartment(data)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
    editDepartment(id, data) {
      return Api.editDepartment(id, data)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
    deleteDepartment(id) {
      return Api.deleteDeparment(id)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
});
