// all APIs
import axios from "axios";

const apiClient = new axios.create({
  baseURL: "https://eparliamentapi.suvence.com/",
  credentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const fileClient = new axios.create({
  baseURL: "https://eparliamentapi.suvence.com/",
  credentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const chatClient = new axios.create({
  baseURL: "https://api.talkjs.com/",
  credentials: true,
  headers: {
    Authorization: `Bearer sk_test_PPywBg42i18j59BOcAddNAGlZZeDw7LX
    `,
    "Content-Type": "application/json",
  },
});

// interceptors for normal client
apiClient.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptors for file client
fileClient.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  // authentication
  login(data) {
    return apiClient.post("login", data);
  },
  logout() {
    return apiClient.post("logout");
  },
  // member creation
  createUser(data) {
    return apiClient.post("user", data);
  },
  getUsers() {
    return apiClient.get("user");
  },
  updateUser(id, data) {
    return apiClient.put(`user/${id}`, data);
  },
  deleteUser(id) {
    return apiClient.delete(`user/${id}`);
  },
  //   upload files
  uploadFile(data) {
    return fileClient.post("files", data);
  },
  getSpecificFileType(name) {
    return apiClient.post("files-type", { type: name });
  },
  getFiles(type) {
    return apiClient.get(`files/${type}`);
  },
  getFileCount() {
    return apiClient.post(`files-type-count`);
  },
  getFile(id) {
    return apiClient.get(`files/${id}`);
  },
  updateFile(id) {
    return fileClient.post(`file/${id}`);
  },
  deleteFile(id) {
    return apiClient.delete(`files/${id}`);
  },
  // talks js
  createTalkUser(userId, data) {
    return chatClient.put(`v1/t1DlROik/users/${userId}`, data);
  },
  createRoom(id, data) {
    return chatClient.put(`v1/t1DlROik/conversations/${id}`, data);
  },
  getRooms() {
    return chatClient.get(`v1/t1DlROik/conversations/`);
  },
  deleteRoom(id) {
    return chatClient.delete(`v1/t1DlROik/conversations/${id}`);
  },
  sendAddedAlert(conversationId) {
    return chatClient.post(
      `v1/t1DlROik/conversations/${conversationId}/messages`,
      [{ text: "You have been added", type: "SystemMessage" }]
    );
  },
  addUserToRoom(userId, conversationId) {
    return chatClient.put(
      `v1/t1DlROik/conversations/${conversationId}/participants/${userId}`
    );
  },
  removeUserFromRoom(userId, conversationId) {
    return chatClient.delete(
      `v1/t1DlROik/conversations/${conversationId}/participants/${userId}`
    );
  },
};
