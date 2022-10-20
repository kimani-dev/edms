<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-breadcrumbs
            :items="[{ text: 'Home' }, { text: 'Dashboard' }]"
            divider="/"
            class="primary--text mt-n2"
          ></v-breadcrumbs>
        </v-col>
        <v-col cols="7">
          <v-text-field
            label="Search document"
            outlined
            dense
            v-model="search"
            append-icon="mdi-magnify"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card elevation="10" class="pa-3">
            <v-card-text>
              <p class="text-h4 primary--text">
                {{ incomingDocumentsCount }}
              </p>
              <div class="d-flex">
                <v-icon left color="primary">mdi-file-undo</v-icon>
                <p class="my-auto text-uppercase font-weight-medium">
                  Incoming Documents
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="10" class="pa-3">
            <v-card-text>
              <p class="text-h4 primary--text">
                {{ outboundDocumentsCount }}
              </p>
              <div class="d-flex">
                <v-icon left color="primary">mdi-file-export</v-icon>
                <p class="my-auto text-uppercase font-weight-medium">
                  Outbound Documents
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="10" class="pa-3">
            <v-card-text>
              <p class="text-h4 primary--text">
                {{ inForApprovalDocumentsCount }}
              </p>
              <div class="d-flex">
                <v-icon left color="primary">mdi-file-check</v-icon>
                <p class="my-auto text-uppercase font-weight-medium">
                  For my approval
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <!-- recent activity overview -->
        <v-col>
          <v-card>
            <v-card-title class="text-capitalize">
              recent activity
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-list two-line dense>
                <p class="text-capitalize" v-if="!recentActivity.length > 0">
                  No recent activity
                </p>
                <v-list-item
                  v-else
                  v-for="n in recentActivity"
                  :key="n.id"
                  class="my-n4"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-circle-small</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ n.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ n.time }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon color="primary">mdi-file-replace</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- my documents overview -->
        <v-col>
          <v-card>
            <v-card-title class="text-capitalize">
              my documents <v-spacer></v-spacer>
              <v-btn
                color="primary"
                small
                outlined
                :to="{ name: 'PersonalDocuments' }"
              >
                <v-icon left>mdi-file-import</v-icon> view all</v-btn
              >
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-list two-line dense>
                <p class="text-capitalize" v-if="!myDocuments.length > 0">
                  You have not uploaded any documents
                </p>
                <v-list-item
                  v-else
                  v-for="n in myDocuments"
                  :key="n.id"
                  class="my-n4"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-circle-small</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ n.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ n.size }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon color="primary">mdi-file-replace</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- annpuncements -->
      <v-row>
        <v-col>
          <v-card>
            <v-card-title class="text-capitalize">
              <v-icon left color="primary">mdi-bullhorn-variant</v-icon>
              announcements
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <pdf-viewer :pdf="'/Announcement.pdf'" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PdfViewer from "@/components/PdfViewer.vue";
import { mapState, mapActions } from "pinia";
import { myDocuments } from "../stores/myDocuments";
import Api from "@/services/Api";

export default {
  components: { PdfViewer },
  name: "HomeView",
  data: () => ({
    search: "",
    announcement: null,
  }),
  computed: {
    ...mapState(myDocuments, [
      "myDocuments",
      "incomingDocumentsCount",
      "outboundDocumentsCount",
      "inForApprovalDocumentsCount",
      "recentActivity",
    ]),
  },
  methods: {
    ...mapActions(myDocuments, ["getAllDocuments"]),
  },
  created() {
    // get all documents
    this.getAllDocuments();
    // get announcements
    Api.getSpecificFileType("announcements")
      .then((res) => {
        this.announcement = res;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
