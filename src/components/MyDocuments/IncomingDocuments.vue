<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="text-capitalize">Incoming documents</v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <!-- date filters -->
        <v-row class="mb-n6 mt-2 ml-1">
          <p class="primary--text text-capitalize">Filter documents by date</p>
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
                    <v-btn
                      color="primary"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="downloadFile(item)"
                    >
                      <v-icon>mdi-cloud-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Download</span>
                </v-tooltip>
                <!-- save -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="saveToMyDocuments(item)"
                    >
                      <v-icon>mdi-file-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Save to my documents</span>
                </v-tooltip>
                <!-- comments -->
                <v-btn icon color="primary" @click="commentsDialog = true">
                  <v-icon small>mdi-comment-multiple-outline</v-icon> 2
                </v-btn>
              </template>
              <!-- icon for file -->
              <template v-slot:[`item.file`]="{ item }">
                <div @click="pdfDialog = true">
                  <v-icon :color="getFileIconColor(item.file)">
                    {{ getFileIcon(item.file) }}
                  </v-icon>
                  {{ item.file }}
                </div>
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
    <!-- pdf dialog -->
    <v-dialog v-model="pdfDialog" width="80%">
      <pdf-viewer :pdf="'/Test.pdf'" />
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
import PdfViewer from "../PdfViewer.vue";
import { mapState, mapActions } from "pinia";
import { myDocuments } from "@/stores/myDocuments";

export default {
  name: "IncomingDocuments",
  data: () => ({
    headers: [
      {
        text: "Incoming date",
        value: "date",
        class: "text-uppercase primary--text",
      },
      {
        text: "Sent in by",
        value: "sender",
        class: "text-uppercase primary--text",
      },
      {
        text: "Sender department",
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
    pdfDialog: false,
    commentsDialog: false,
  }),
  components: {
    PdfViewer,
  },
  computed: {
    ...mapState(myDocuments, ["incomingDocuments"]),
  },
  methods: {
    ...mapActions(myDocuments, ["getIncomingDocuments"]),
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
    // download selected file
    downloadFile(file) {
      console.log(file);
    },
    // save selected file to my documents
    saveToMyDocuments(file) {
      console.log(file);
    },
    addReply() {},
  },
  created() {
    // this.getIncomingDocuments().then((res)=>{
    //   this.items = res;
    // });
  },
};
</script>

<style></style>
