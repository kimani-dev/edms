<template>
  <v-layout align-center justify-center id="outer">
    <div>
      <v-snackbar
        v-model="snackbar"
        :color="snackbarData.success ? 'success' : 'error'"
      >
        <div class="text-capitalize">
          <v-list-item dense>
            <v-list-item-icon>
              <v-icon v-if="snackbarData.success">mdi-check</v-icon>
              <v-icon v-if="!snackbarData.success">mdi-cancel</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ snackbarData.text }}
            </v-list-item-title>
          </v-list-item>
        </div>
      </v-snackbar>
      <v-card width="400" class="rounded-lg">
        <v-card-title>
          <div class="mx-auto text-capitalize">
            <v-row class="justify-center">
              <v-col cols="9">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon large color="primary">mdi-file-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title
                    class="text-uppercase text-wrap text-break text-center text-caption"
                  >
                    Electronic document management system
                  </v-list-item-title>
                </v-list-item>
              </v-col>
            </v-row>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="mt-5">
          <v-form v-model="form" @submit.prevent="loginUser">
            <v-text-field
              label="Username"
              outlined
              dense
              prepend-icon="mdi-account"
              clearable
              type="text"
              v-model="username"
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              label="Password"
              outlined
              dense
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              clearable
              autocomplete="password"
              :type="showPassword ? 'visiblePassword' : 'password'"
              @click:append="showPassword = !showPassword"
              v-model="password"
              :rules="[rules.required]"
            ></v-text-field>

            <div class="d-flex">
              <v-checkbox
                label="Remember me"
                color="primary"
                v-model="rememberMe"
              ></v-checkbox>

              <v-spacer></v-spacer>

              <v-dialog width="500" v-model="forgotPasswordDialog">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    color="primary"
                    class="text-capitalize my-auto"
                    text
                  >
                    forgot password</v-btn
                  >
                </template>

                <v-card width="500" class="mx-auto">
                  <v-card-title class="text-center">
                    Forgotten your password? Enter your email to receive the
                    reset link.
                  </v-card-title>
                  <v-form v-model="resetForm" @submit.prevent="sendResetLink">
                    <v-card-text>
                      <v-text-field
                        label="E-mail"
                        prepend-icon="mdi-mail"
                        outlined
                        dense
                        v-model="forgotPasswordMail"
                        :rules="[rules.required, rules.email]"
                        clearable
                        type="email"
                      ></v-text-field>
                    </v-card-text>

                    <v-card-actions>
                      <v-btn
                        color="primary"
                        @click="forgotPasswordDialog = false"
                        >cancel</v-btn
                      >
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        type="submit"
                        :disabled="!resetForm"
                        >send reset link</v-btn
                      >
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
            </div>

            <div class="d-flex">
              <v-btn
                block
                color="primary"
                :loading="loginLoader"
                :disabled="!form"
                type="submit"
              >
                login
              </v-btn>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="primary">
          <div class="white--text mx-auto text-uppercase font-weight-bold">
            EDMS v 1.2.1
          </div>
        </v-card-actions>
      </v-card>

      <v-row class="justify-center mt-2 text-center">
        <v-col class="">
          {{ new Date().getFullYear() }} &copy; Suvence Technologies
        </v-col>
      </v-row>
    </div>
  </v-layout>
</template>

<script>
import { userStore } from "../stores/user";
import { mapActions, mapWritableState } from "pinia";

export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      rules: {
        required: (value) => !!value || "Required",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
      showPassword: false,
      form: false,
      rememberMe: true,
      loginLoader: false,
      forgotPasswordMail: "",
      forgotPasswordDialog: false,
      resetForm: false,
      snackbar: false,
      snackbarData: {
        success: null,
        text: "",
      },
    };
  },
  computed: {
    ...mapWritableState(userStore, ["user", "isLoggedIn"]),
  },
  methods: {
    ...mapActions(userStore, ["login"]),
    loginUser() {
      this.loginLoader = true;
      localStorage.setItem("token", "bearer token####");
      this.user = {
        name: "Admin",
        id: 1,
        email: "admin@edms.com",
        role: {
          name: "Admin",
        },
      };
      setTimeout(() => {
        this.loginLoader = false;
        this.showSnackbar(true, "Login success");
        this.$router.replace({ name: "Dashboard" });
        this.isLoggedIn = true;
      }, 4000);
      // this.login({
      //   username: this.username,
      //   password: this.password,
      // })
      //   .then(() => {
      //     this.showSnackbar(true, "Login success");
      //     this.$router.replace({ name: "Dashboard" });
      //   })
      //   .catch((error) => {
      //     this.showSnackbar(false, error.response.data.message);
      //   })
      //   .finally(() => {
      //     this.loginLoader = false;
      //   });
    },
    sendResetLink() {
      // send link
      this.forgotPasswordDialog = false;
      this.showSnackbar(true, `Reset link sent to ${this.forgotPasswordMail}`);
    },
    showSnackbar(success, text) {
      this.snackbar = true;
      this.snackbarData.success = success;
      this.snackbarData.text = text;
    },
  },
  beforeCreate() {
    if (localStorage.getItem("token")) {
      this.$router.replace({ name: "Dashboard" });
    }
  },
};
</script>

<style scoped>
#outer {
  height: 100%;
}
</style>
