import { defineStore } from "pinia";
import Api from "../services/Api";

export const chatRoomStore = defineStore("chatroom", {
  state: () => ({
    rooms: [],
  }),
  actions: {
    getRooms() {
      return Api.getRooms()
        .then((res) => {
          this.rooms = res.data;
        })
        .catch((err) => {
          throw err;
        });
    },
    createTalkUser(userId, data) {
      return Api.createTalkUser(userId, data)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
    createRoom(id, data) {
      return Api.createRoom(id, data)
        .then((res) => {
          Api.sendAddedAlert(res.conversation_id);
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
    deleteRoom(id) {
      return Api.deleteRoom(id)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
});
