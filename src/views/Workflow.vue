<template>
  <div>
    <v-card flat width="100%">
      <v-card-title class="primary--text text-capitalize">
        Worflow
      </v-card-title>
      <v-divider inset></v-divider>
      <v-card-text>
        <v-card width="100%">
          <v-row>
            <v-col cols="4">
              <v-card>
                <v-card-title>
                  <v-text-field
                    outlined
                    dense
                    label="Search file"
                    append-icon="mdi-magnify"
                  />
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-list two-line class="text-capitalize" dense>
                    <v-list-item-group mandatory>
                      <v-list-item v-for="n in 5" :key="n">
                        <v-list-item-icon>
                          <v-icon color="red darken-4">mdi-file-pdf-box</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            speaker comments.pdf
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ "2022-09-30" | moment("Do MMM YYYY") }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-timeline>
                <v-timeline-item
                  v-for="n in workflow"
                  :key="n.user"
                  color="primary"
                >
                  <template v-slot:opposite>
                    <span>{{ n.date | moment("Do MMM YYYY") }}</span>
                  </template>
                  <v-card class="elevation-4">
                    <v-card-title>
                      <div>
                        <p class="text-h6">
                          {{ n.user }}
                        </p>
                        <p class="text-caption text-uppercase mt-n4">
                          {{ n.role }}
                        </p>
                      </div>
                    </v-card-title>
                    <v-card-text class="black--text">
                      {{ n.comments }}
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "WorkFlow",
  data: () => ({
    workflow: [
      {
        user: "David Kimani",
        role: "Member",
        comments: "Sent file to speaker's office for approval",
        date: "2022-09-26",
      },
      {
        user: "Amos Mwikali",
        role: "Speaker",
        comments: "Approved file from Member David Kimani",
        date: "2022-09-28",
      },
      {
        user: "Kivuti kivuti",
        role: "Clerk",
        comments: "Shared file as announcement to all members",
        date: "2022-10-01",
      },
    ],
  }),
};
</script>

<style></style>
