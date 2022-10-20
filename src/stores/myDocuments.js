import { defineStore } from "pinia";
// import Api from "../services/Api";

export const myDocuments = defineStore("mydocuments", {
  state: () => ({
    myDocuments: [
      {
        id: 1,
        name: "A nice file.pdf",
        size: "10 Kb",
        time: "10 hours ago",
        folder: "approvals",
        subfolder: "speaker",
      },
      {
        id: 2,
        name: "Speaker approval.pdf",
        size: "10 Kb",
        time: "4 hours ago",
        folder: "approvals",
        subfolder: "speaker",
      },
      {
        id: 3,
        name: "Clerk approval.pdf",
        size: "10 Kb",
        time: "4 hours ago",
        folder: "approvals",
        subfolder: null,
      },
      {
        id: 4,
        name: "Clerk benevfo.pdf",
        size: "10 Kb",
        time: "4 hours ago",
        folder: "clerk",
        subfolder: null,
      },
      {
        id: 5,
        name: "A nice file.docx",
        size: "10 Kb",
        time: "10 hours ago",
        folder: "approvals",
        subfolder: "nonesense",
      },
      {
        id: 6,
        name: "Speaker speaks.xlsx",
        size: "10 Kb",
        time: "4 hours ago",
        folder: "approvals",
        subfolder: "nonesense",
      },
    ],
    incomingDocuments: [],
    outgoingDocuments: [],
    outForApproval: [],
    inForApproval: [],
  }),
  getters: {
    incomingDocumentsCount: (state) => {
      return state.incomingDocuments.length;
    },
    outboundDocumentsCount: (state) => {
      return state.outgoingDocuments.length;
    },
    inForApprovalDocumentsCount: (state) => {
      return state.inForApproval.length;
    },
    recentActivity: (state) => {
      return state.myDocuments;
    },
  },
  actions: {
    getMyDocuments() {},
    getIncomingDocuments() {},
    getOutgoingDocuments() {},
    getApprovals() {},
    // get all documents pertaining a user
    getAllDocuments() {
      this.getMyDocuments();
      this.getIncomingDocuments();
      this.getOutgoingDocuments();
      this.getApprovals();
    },
  },
});
