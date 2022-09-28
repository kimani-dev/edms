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
        <p class="my-auto mr-3">Hello Kimani!</p>
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
            <v-list-item active-class="primary--text">
              <v-list-item-icon>
                <v-icon> mdi-circle-small </v-icon>
              </v-list-item-icon>
              <v-list-item-title>Incoming Documents</v-list-item-title>
            </v-list-item>
            <v-list-item active-class="primary--text">
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
            <v-list-item active-class="primary--text">
              <v-list-item-icon>
                <v-icon> mdi-circle-small </v-icon>
              </v-list-item-icon>
              <v-list-item-title>Outbound for approval</v-list-item-title>
            </v-list-item>
            <v-list-item active-class="primary--text">
              <v-list-item-icon>
                <v-icon> mdi-circle-small </v-icon>
              </v-list-item-icon>
              <v-list-item-title>for my approval</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-group>

        <!-- workflow -->
        <v-list-item active-class="primary--text">
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
            <v-list-item active-class="primary--text">
              <v-list-item-icon>
                <v-icon> mdi-circle-small </v-icon>
              </v-list-item-icon>
              <v-list-item-title>speaker's office</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-group>

        <!-- cabinets -->
        <v-list-item active-class="primary--text">
          <v-list-item-icon>
            <v-icon> mdi-file-cabinet </v-icon>
          </v-list-item-icon>
          <v-list-item-title>cabinet</v-list-item-title>
        </v-list-item>

        <!-- indexes -->
        <v-list-item active-class="primary--text">
          <v-list-item-icon>
            <v-icon> mdi-text-box-search </v-icon>
          </v-list-item-icon>
          <v-list-item-title>indexes</v-list-item-title>
        </v-list-item>

        <v-subheader class="text-uppercase font-weight-bold primary--text"
          >admin</v-subheader
        >

        <!-- manage members -->
        <v-list-item active-class="primary--text">
          <v-list-item-icon>
            <v-icon> mdi-account-plus </v-icon>
          </v-list-item-icon>
          <v-list-item-title>members</v-list-item-title>
        </v-list-item>

        <!-- manage departments -->
        <v-list-item active-class="primary--text">
          <v-list-item-icon>
            <v-icon> mdi-account-multiple-plus </v-icon>
          </v-list-item-icon>
          <v-list-item-title>departments</v-list-item-title>
        </v-list-item>

        <!-- manage announcements -->
        <v-list-item active-class="primary--text">
          <v-list-item-icon>
            <v-icon> mdi-bell-cog </v-icon>
          </v-list-item-icon>
          <v-list-item-title>announcements</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "NavigationComponent",
  data: () => ({
    drawer: true,
  }),
};
</script>

<style scoped>
#nav-content {
  width: 100%;
}
</style>
