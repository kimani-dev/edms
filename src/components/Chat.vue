<template>
  <v-card class="pa-5 mx-auto" width="850">
    <div class="d-flex">
      <v-dialog width="auto" v-model="newChatDialog">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" class="mb-3" rounded v-on="on" v-bind="attrs">
            <v-icon left>mdi-message</v-icon> start conversation</v-btn
          >
        </template>
        <v-card width="500" class="mx-auto">
          <v-card-title>
            <p class="mx-auto text-uppercase">new chat</p>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="form">
              <v-autocomplete
                outlined
                dense
                v-model="selectedUsers"
                multiple
                chips
                deletable-chips
                label="Select user(s)"
                :items="memberNames"
              />
              <v-btn
                block
                color="primary"
                :disabled="selectedUsers.length == 0"
                @click="startChat"
              >
                start chat with {{ selectedUsers.length }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-btn color="primary" icon @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div ref="talkjs" style="width: 800px; height: 500px">
      <i>Loading chat...</i>
    </div>
  </v-card>
</template>

<script>
import Talk from "talkjs";
import { mapState, mapActions } from "pinia";
import { memberStore } from "../stores/members";
import { userStore } from "../stores/user";

export default {
  name: "InboxComponent",
  data: () => ({
    selectedUsers: [],
    newChatDialog: false,
    talkSession: null,
    inbox: null,
  }),
  computed: {
    ...mapState(memberStore, ["memberNames", "members"]),
    ...mapState(userStore, {
      currentUser: "user",
    }),
    me() {
      return new Talk.User({
        id: this.currentUser.id,
        name: this.currentUser.name,
        email: this.currentUser.email,
        role: this.currentUser.role.name,
      });
    },
  },
  methods: {
    ...mapActions(memberStore, ["getMembers"]),
    startChat() {
      // get the member objects
      let users = [];
      for (let name of this.selectedUsers) {
        for (let member of this.members) {
          if (member.name == name) users.push(member);
        }
      }

      // check if conversation is one on one
      if (this.selectedUsers.length <= 1) {
        // create other user
        let other = new Talk.User({
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
          role: users[0].role.name,
        });
        // create a conversation
        let conversation = this.talkSession.getOrCreateConversation(
          Talk.oneOnOneId(this.me, other)
        );
        // set participants
        conversation.setParticipant(this.me);
        conversation.setParticipant(other);
        // set conversation in inbox
        this.inbox.select(conversation);
      } else {
        // create group conversation
        let conversation =
          this.talkSession.getOrCreateConversation("demo-group");
        conversation.setAttributes({
          subject: "Group chat",
        });
        conversation.setParticipant(this.me);
        for (let user of users) {
          // create a talk user
          let talkUser = new Talk.User({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name,
          });
          // add talk user to the conversation
          conversation.setParticipant(talkUser);
          // select conversation in the inbox
          this.inbox.select(conversation);
        }
      }

      this.newChatDialog = false;
    },
    closeDialog() {
      this.$emit("close");
    },
  },
  created() {
    this.getMembers();
  },
  async mounted() {
    await Talk.ready;
    // create talk session
    this.talkSession = new Talk.Session({
      appId: "t1DlROik",
      me: this.me,
    });

    this.inbox = this.talkSession.createInbox();
    this.inbox.mount(this.$refs.talkjs);
  },
};
</script>
