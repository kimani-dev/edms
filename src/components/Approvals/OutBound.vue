<template>
  <div>
    <v-card width="100%">
      <v-card-title class="text-capitalize">Outbound for approval</v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <v-card width="100%">
          <v-card-text>
            <v-row>
              <v-col cols="3">
                <v-btn
                  color="primary"
                  outlined
                  block
                  @click="newApprovalDialog = true"
                >
                  <v-icon left>mdi-file-plus</v-icon> new approval</v-btn
                >
                <v-divider class="mt-2"></v-divider>
                <v-list>
                  <v-list-item-group mandatory>
                    <v-list-item link active-class="primary--text">
                      <v-list-item-icon>
                        <v-icon>mdi-circle-small</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title class="primary--text"
                        >Pending</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item link active-class="primary--text">
                      <v-list-item-icon>
                        <v-icon color="success">mdi-circle-small</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title class="success--text"
                        >Approved</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item link active-class="primary--text">
                      <v-list-item-icon>
                        <v-icon color="error">mdi-circle-small</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title class="error--text"
                        >Denied</v-list-item-title
                      >
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <p class="primary--text text-capitalize">
                  Filter approvals by date
                </p>
                <div class="d-flex">
                  <v-menu
                    v-model="fromDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="fromDate"
                        label="From Date"
                        prepend-inner-icon="mdi-calendar"
                        outlined
                        class="mr-2"
                        dense
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="fromDate"
                      @input="fromDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                  <v-menu
                    v-model="toDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="toDate"
                        label="To Date"
                        prepend-inner-icon="mdi-calendar"
                        outlined
                        dense
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="toDate"
                      @input="toDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </div>
                <v-data-table
                  :items="items"
                  :headers="headers"
                  class="elevation-10 text-capitalize"
                  no-data-text="There are no incoming documents to view"
                >
                  <template v-slot:[`item.actions`]>
                    <!-- download -->
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" icon v-bind="attrs" v-on="on">
                          <v-icon>mdi-cloud-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Download</span>
                    </v-tooltip>
                    <!-- comments -->
                    <v-btn icon color="primary" @click="commentsDialog = true">
                      <v-icon small>mdi-comment-multiple-outline</v-icon> 2
                    </v-btn>
                  </template>
                  <!-- icon for file -->
                  <template v-slot:[`item.file`]="{ item }">
                    <v-icon :color="getFileIconColor(item.file)">
                      {{ getFileIcon(item.file) }}
                    </v-icon>
                    {{ item.file }}
                  </template>
                  <!-- date formatting -->
                  <template v-slot:[`item.date`]="{ item }">
                    {{ item.date | moment("ddd, MMMM Do YYYY") }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
    <!-- new approval dialog -->
    <v-dialog v-model="newApprovalDialog" width="auto">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          new approval
          <v-spacer></v-spacer>
          <v-btn color="primary" icon @click="newApprovalDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-form v-model="form">
            <v-autocomplete
              label="Select recipient type"
              :items="['Department', 'Member']"
              outlined
              dense
              prepend-icon="mdi-account-group"
              :rules="[rules.required]"
              v-model="receipientType"
            ></v-autocomplete>
            <v-autocomplete
              label="Recipient"
              outlined
              dense
              prepend-icon="mdi-account"
              :rules="[rules.required]"
              v-model="recipient"
            ></v-autocomplete>
            <v-autocomplete
              label="Document"
              outlined
              dense
              prepend-icon="mdi-file-document"
              :rules="[rules.required]"
              v-model="file"
            ></v-autocomplete>
            <v-btn
              color="primary"
              outlined
              block
              :loading="sendLoader"
              :disabled="!form"
              @click="sendApproval"
              >send</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- comments dialog -->
    <v-dialog v-model="commentsDialog" width="auto">
      <v-card width="500" shaped>
        <v-card-title class="text-capitalize">
          3 comments
          <v-spacer></v-spacer>
          <v-btn icon color="primary" @click="commentsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-2">
          <v-list two-line>
            <v-list-item v-for="n in 3" :key="n" link>
              <v-list-item-avatar>
                <v-icon large color="primary">mdi-account-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-capitalize"
                  >abraham lincoln</v-list-item-title
                >
                <v-list-item-subtitle>
                  This is a very nice file
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon color="red darken-2">
                  22 <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-text-field
            dense
            prepend-inner-icon="mdi-message"
            append-icon="mdi-send"
            label="Enter your comment here"
            outlined
          ></v-text-field>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { myDocuments } from "@/stores/myDocuments";

export default {
  name: "OutForApproval",
  data: () => ({
    headers: [
      {
        text: "date sent",
        value: "date",
        class: "text-uppercase primary--text",
      },
      {
        text: "Sent to",
        value: "sender",
        class: "text-uppercase primary--text",
      },
      {
        text: "File name",
        value: "file",
        class: "text-uppercase primary--text",
      },
      {
        text: "actions",
        value: "actions",
        class: "text-uppercase primary--text",
      },
    ],
    fromDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    fromDateMenu: false,
    toDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    toDateMenu: false,
    items: [
      {
        date: "2022-09-30",
        sender: "David Kimani",
        department: "Sales and Marketing",
        file: "department notice.pdf",
      },
      {
        date: "2022-09-28",
        sender: "Samia Suluhu",
        department: "State Capture",
        file: "State finance.xlsx",
      },
      {
        date: "2022-09-29",
        sender: "Hamisi Sinia",
        department: "Speaker's Office",
        file: "New Document.docx",
      },
    ],
    newApprovalDialog: false,
    commentsDialog: false,
    // form
    form: false,
    rules: {
      required: (v) => !!v || "Required",
    },
    recipientType: "",
    recipient: "",
    file: "",
    sendLoader: false,
  }),
  computed: {
    ...mapState(myDocuments, ["outForApproval"]),
  },
  methods: {
    ...mapActions(myDocuments, ["getApprovals"]),
    getFileIcon(fileName) {
      let fileExtension = [];
      let start = false;
      Array.from(fileName).forEach((v) => {
        if (start) {
          fileExtension.push(v);
        }
        if (v == ".") {
          start = true;
        }
      });

      // switch to get color
      switch (fileExtension.join("")) {
        case "pdf":
          return "mdi-file-pdf-box";
        case "xlsx":
          return "mdi-microsoft-excel";
        case "docx":
          return "mdi-microsoft-excel";
        default:
          return "mdi-file-document";
      }
    },
    getFileIconColor(fileName) {
      let fileExtension = [];
      let start = false;
      Array.from(fileName).forEach((v) => {
        if (start) {
          fileExtension.push(v);
        }
        if (v == ".") {
          start = true;
        }
      });

      // switch to get color
      switch (fileExtension.join("")) {
        case "pdf":
          return "red darken-2";
        case "xlsx":
          return "green darken-4";
        case "docx":
          return "blue darken-4";
        default:
          return "primary";
      }
    },
    sendApproval() {},
  },
  created() {
    // this.getApprovals();
  },
};
</script>

<style></style>
