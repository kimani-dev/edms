<template>
  <div>
    <!-- app bar -->
    <v-app-bar app clipped-left flat>
      <!-- <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon> -->
      <div class="d-flex" id="nav-content">
        <v-icon color="primary" left>mdi-file-check</v-icon>
        <p class="text-uppercase primary--text my-auto">
          Electronic document management system
        </p>
        <v-spacer></v-spacer>
        <p class="my-auto mr-3">Hello {{ user.name }}!</p>
        <v-icon color="primary" size="25" class="mr-2">mdi-bell</v-icon>
        <v-icon color="primary" size="27">mdi-account-circle</v-icon>
      </div>
    </v-app-bar>

    <!-- navigation drawer -->
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list nav dense class="text-capitalize">
        <v-subheader class="text-uppercase font-weight-bold primary--text">
          navigation
        </v-subheader>

        <v-list-item active-class="primary--text" :to="{ name: 'Dashboard' }">
          <v-list-item-icon>
            <v-icon> mdi-home </v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <!-- my documents group -->
        <v-list-group
          prepend-icon="mdi-file-document"
          active-class="primary--text"
        >
          <template v-slot:activator>
            <v-list-item-title class="text-wrap"
              >My Documents</v-list-item-title
            >
          </template>

          <v-list>
            <v-list-item
              active-class="primary--text"
              :to="{ name: 'PersonalDocuments' }"
            >
              <v-list-item-icon>
                <v-icon> mdi-circle-small </v-icon>
              </v-list-item-icon>
              <v-list-item-title>Personal Documents</v-list-item-title>
            </v-list-item>
            <v-list-item
              active-class="primary--text"
              :to="{ name: 'IncomingDocuments' }"
            >
              <v-list-item-icon>
                <v-icon> mdi-circle-small </v-icon>
              </v-list-item-icon>
              <v-list-item-title>Incoming Documents</v-list-item-title>
            </v-list-item>
            <v-list-item
              active-class="primary--text"
              :to="{ name: 'OutBoundDocuments' }"
            >
              <v-list-item-icon>
                <v-icon> mdi-circle-small </v-icon>
              </v-list-item-icon>
              <v-list-item-title>Outbound Documents</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-group>

        <!-- approvals -->
        <v-list-group
          prepend-icon="mdi-file-document-check"
          active-class="primary--text"
        >
          <template v-slot:activator>
            <v-list-item-title class="text-wrap">Approvals</v-list-item-title>
          </template>

          <v-list>
            <v-list-item
              active-class="primary--text"
              :to="{ name: 'ApprovalOutbound' }"
            >
              <v-list-item-icon>
                <v-icon> mdi-circle-small </v-icon>
              </v-list-item-icon>
              <v-list-item-title>Outbound for approval</v-list-item-title>
            </v-list-item>
            <v-list-item
              active-class="primary--text"
              :to="{ name: 'MyApprovals' }"
            >
              <v-list-item-icon>
                <v-icon> mdi-circle-small </v-icon>
              </v-list-item-icon>
              <v-list-item-title>for my approval</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-group>

        <!-- workflow -->
        <v-list-item active-class="primary--text" :to="{ name: 'WorkFlow' }">
          <v-list-item-icon>
            <v-icon> mdi-sitemap </v-icon>
          </v-list-item-icon>
          <v-list-item-title>workflow</v-list-item-title>
        </v-list-item>

        <!-- departments -->
        <v-list-group
          prepend-icon="mdi-account-group"
          active-class="primary--text"
        >
          <template v-slot:activator>
            <v-list-item-title class="text-wrap">Departments</v-list-item-title>
          </template>

          <v-list>
            <!-- my department -->
            <v-list-group
              active-class="primary--text"
              sub-group
              v-model="myDepartmentGroup"
            >
              <template v-slot:activator>
                <v-list-item-title class="text-wrap"
                  >My department</v-list-item-title
                >
              </template>

              <v-list>
                <v-list-item-group mandatory v-model="myDepartmentList">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon x-small>mdi-square-medium</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title> Documents </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon x-small>mdi-square-medium</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title> Approvals </v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-list-group>
            <!-- other departments -->
            <v-list-group
              active-class="primary--text"
              sub-group
              v-model="otherDepartmentGroup"
            >
              <template v-slot:activator>
                <v-list-item-title class="text-wrap"
                  >Other departments</v-list-item-title
                >
              </template>

              <v-list>
                <v-list-item-group mandatory v-model="otherDepartmentList">
                  <v-list-item
                    v-for="department in departments"
                    :key="department.name"
                  >
                    <v-list-item-icon>
                      <v-icon x-small>mdi-square-medium</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ department.name }}</v-list-item-title
                    >
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-list-group>
          </v-list>
        </v-list-group>

        <!-- cabinets -->
        <v-list-item active-class="primary--text" :to="{ name: 'Cabinet' }">
          <v-list-item-icon>
            <v-icon> mdi-file-cabinet </v-icon>
          </v-list-item-icon>
          <v-list-item-title>cabinet</v-list-item-title>
        </v-list-item>

        <!-- indexes -->
        <v-list-item active-class="primary--text" :to="{ name: 'Index' }">
          <v-list-item-icon>
            <v-icon> mdi-text-box-search </v-icon>
          </v-list-item-icon>
          <v-list-item-title>indexes</v-list-item-title>
        </v-list-item>

        <v-subheader class="text-uppercase font-weight-bold primary--text"
          >admin</v-subheader
        >

        <!-- manage members -->
        <v-list-item
          active-class="primary--text"
          :to="{ name: 'UsersManagement' }"
        >
          <v-list-item-icon>
            <v-icon> mdi-account-plus </v-icon>
          </v-list-item-icon>
          <v-list-item-title>users</v-list-item-title>
        </v-list-item>

        <!-- manage departments -->
        <v-list-item
          active-class="primary--text"
          :to="{ name: 'DepartmentsManagement' }"
        >
          <v-list-item-icon>
            <v-icon> mdi-account-multiple-plus </v-icon>
          </v-list-item-icon>
          <v-list-item-title>departments</v-list-item-title>
        </v-list-item>

        <!-- manage announcements -->
        <v-list-item
          active-class="primary--text"
          :to="{ name: 'AnnouncementsManagement' }"
        >
          <v-list-item-icon>
            <v-icon> mdi-bell-cog </v-icon>
          </v-list-item-icon>
          <v-list-item-title>announcements</v-list-item-title>
        </v-list-item>

        <!-- manage chat rooms -->
        <v-list-item
          active-class="primary--text"
          :to="{ name: 'ChatRoomsManagement' }"
        >
          <v-list-item-icon>
            <v-icon> mdi-message-cog </v-icon>
          </v-list-item-icon>
          <v-list-item-title>chat rooms</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- chat -->
    <v-btn fab bottom right fixed color="primary" @click="chatDialog = true">
      <v-icon>mdi-message</v-icon>
    </v-btn>
    <!-- chat dialog -->
    <v-dialog v-model="chatDialog" width="auto">
      <Chat :currentUser="user" @close="closeChat" />
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { appStore } from "../stores/app.js";
import { userStore } from "../stores/user.js";
import Chat from "../components/Chat.vue";

export default {
  name: "NavigationComponent",
  components: {
    Chat,
  },
  data: () => ({
    myDepartmentList: "",
    otherDepartmentList: "",
    myDocumentsGroup: false,
    myDepartmentGroup: false,
    otherDepartmentGroup: false,
    departments: [
      {
        name: "Reception",
      },
      {
        name: "Speaker's Office",
      },
      {
        name: "Clerk's Office",
      },
      {
        name: "Finance",
      },
      {
        name: "Supply Chain",
      },
      {
        name: "Research and records",
      },
      {
        name: "Hansard",
      },
      {
        name: "ICT",
      },
      {
        name: "Clerks at Table",
      },
      {
        name: "Sergeant at Arms",
      },
    ],
    chatDialog: false,
  }),
  computed: {
    ...mapWritableState(appStore, ["drawer", "department"]),
    ...mapState(userStore, ["user"]),
  },
  watch: {
    myDepartmentList(newValue) {
      if (newValue == 0) {
        if (this.$route.name !== "DepartmentDocuments")
          this.$router.push({ name: "DepartmentDocuments" });
      } else {
        if (this.$route.name !== "DepartmentApprovals")
          this.$router.push({ name: "DepartmentApprovals" });
      }
    },
    otherDepartmentList(newValue) {
      if (this.$route.name !== "OtherDepartments")
        this.$router.push({ name: "OtherDepartments" });
      // assign department
      this.department = this.departments[newValue];
    },
    myDepartmentGroup(newValue) {
      if (newValue) this.otherDepartmentGroup = false;
    },
    otherDepartmentGroup(newValue) {
      if (newValue) this.myDepartmentGroup = false;
    },
  },
  methods: {
    closeChat() {
      this.chatDialog = false;
    },
  },
};
</script>

<style scoped>
#nav-content {
  width: 100%;
}
</style>
