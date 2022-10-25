<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize">Outbound documents</v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <!-- date filters -->
        <v-row class="mb-n6 mt-2 ml-1">
          <div class="d-flex flex-column">
            <p class="text-uppercase font-weight-medium primary--text">
              Recently sent documents
            </p>
            <p class="primary--text text-capitalize text-caption">
              Filter documents by date
            </p>
          </div>
        </v-row>
        <v-row>
          <v-col>
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
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fromDate"
                @input="fromDateMenu = false"
              ></v-date-picker> </v-menu
          ></v-col>
          <v-col>
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
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="toDate"
                @input="toDateMenu = false"
              ></v-date-picker> </v-menu
          ></v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-btn color="primary" outlined @click="sendDialog = true">
              <v-icon left>mdi-file-move</v-icon>
              send new</v-btn
            >
            <v-data-table
              :items="items"
              :headers="headers"
              class="elevation-10 text-capitalize"
              no-data-text="There are no outbound documents to view"
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
    <!-- send new document dialog -->
    <v-dialog width="auto" v-model="sendDialog">
      <v-card width="500">
        <v-card-title class="text-uppercase">
          send document
          <v-spacer></v-spacer>
          <v-btn color="primary" icon @click="sendDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-autocomplete
            label="Select document"
            outlined
            dense
            v-model="documentToSend"
            prepend-icon="mdi-file-document"
          ></v-autocomplete>
          <v-autocomplete
            outlined
            dense
            label="Select recipient"
            v-model="recipient"
            prepend-icon="mdi-account"
          ></v-autocomplete>
          <v-btn
            block
            outlined
            color="primary"
            :loading="sendLoader"
            :disabled="documentToSend == '' || recipient == ''"
            @click="sendDocument"
            >send</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- comments dialog -->
    <v-dialog v-model="commentsDialog" width="auto">
      <v-card width="500" shaped>
        <v-card-title class="text-capitalize">
          3 comments
          <v-spacer></v-spacer>
          <v-btn icon @click="commentsDialog = false">
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
  name: "OutBoundDocuments",
  data: () => ({
    headers: [
      {
        text: "Sent date",
        value: "date",
        class: "text-uppercase primary--text",
      },
      {
        text: "Sent to",
        value: "sender",
        class: "text-uppercase primary--text",
      },
      {
        text: "receipient",
        value: "department",
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
        sender: "Individual",
        department: "Samia Suluhu",
        file: "department notice.pdf",
      },
      {
        date: "2022-09-28",
        sender: "Department",
        department: "Speaker's office",
        file: "State finance.xlsx",
      },
      {
        date: "2022-09-29",
        sender: "Individual",
        department: "David Kimani",
        file: "New Document.docx",
      },
    ],
    sendDialog: false,
    documentToSend: "",
    recipient: "",
    sendLoader: false,
    commentsDialog: false,
  }),
  computed: {
    ...mapState(myDocuments, ["outgoingDocuments"]),
  },
  methods: {
    ...mapActions(myDocuments, ["getOutgoingDocuments"]),
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
    // send document
    sendDocument() {},
  },
  created() {
    // this.getOutgoingDocuments();
  },
};
</script>

<style></style>
