<script>
import { required } from "vuelidate/lib/validators";
import MixinRequest from "../../../mixins/request";
import { login } from "../../../js/path";
var CryptoJS = require("crypto-js");
// import {
//   authMethods,
//   authFackMethods,
//   notificationMethods
// } from "@/state/helpers";

export default {
  mixins: [MixinRequest],
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  validations: {
    email: { required },
    password: { required },
  },
  methods: {
    async login() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return false;
      }
      this.$store.commit("loader/updateStatus", true);
      await this.postRequest(login, {
        username: this.email,
        password: this.password,
      })
        .then((data) => {
          if (data.response.token) {
            let res = {'token':data.response.token, 'permissions':data.response.permissions, 'role': data.response.role}
            let encJson = CryptoJS.AES.encrypt(JSON.stringify(res), process.env.VUE_APP_ENCRYPTION_KEY).toString();
            localStorage.setItem("token", encJson);
            this.$router.push({ name: "dashboard" });
          }
        
        })
        .catch(() => {
          return false;
        });
      this.$store.commit("loader/updateStatus", false);
    },
  },
};
</script>

<template>
  <div>
    <div class="home-btn d-none d-sm-block">
      <a href="/">
        <i class="mdi mdi-home-variant h2 text-white"></i>
      </a>
    </div>
    <div>
      <div class="container-fluid p-0" id="admin-login">
        <div class="row no-gutters">
          <div class="col-lg-4">
            <div
              class="authentication-page-content p-4 d-flex align-items-center min-vh-100"
            >
              <div class="w-100">
                <div class="row justify-content-center">
                  <div class="col-lg-9">
                    <div>
                      <div class="text-center">
                        <div>
                          <a href="/" class="logo">
                            <img
                              src="@/assets/images/logo.svg"
                              height="100"
                              alt="logo"
                            />
                          </a>
                        </div>

                        <h4 class="font-size-18 mt-4">Welcome to Admin Panel !</h4>
                        <p class="text-muted">
                          Sign in to continue to Medisage Admin.
                        </p>
                      </div>

                      <b-alert
                        variant="danger"
                        class="mt-3"
                        v-if="notification.message"
                        show
                        dismissible
                        >{{ notification.message }}</b-alert
                      >

                      <div class="p-2 mt-5">
                        <form class="form-horizontal" @submit.prevent="login">
                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-mail-line auti-custom-input-icon"></i>
                            <label for="email">Username</label>
                            <input
                              type="text"
                              v-model="email"
                              class="form-control"
                              id="email"
                              placeholder="Enter Email"
                              :class="{
                                'is-invalid': submitted && $v.email.$error,
                              }"
                            />
                            <div
                              v-if="submitted && $v.email.$error"
                              class="invalid-feedback"
                            >
                              <span v-if="!$v.email.required" class="mr-1"
                                >Username is required.</span
                              >
                              <span v-if="!$v.email.email"
                                >Please Enter Valid Username.</span
                              >
                            </div>
                          </div>

                          <div class="form-group auth-form-group-custom mb-4">
                            <i
                              class="ri-lock-2-line auti-custom-input-icon"
                            ></i>
                            <label for="userpassword">Password</label>
                            <input
                              v-model="password"
                              type="password"
                              class="form-control"
                              id="userpassword"
                              placeholder="Enter Password"
                              :class="{
                                'is-invalid': submitted && $v.password.$error,
                              }"
                            />
                            <div
                              v-if="submitted && !$v.password.required"
                              class="invalid-feedback"
                            >
                              Password is required.
                            </div>
                          </div>

                          <div class="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              class="custom-control-input"
                              id="customControlInline"
                            />
                            <label
                              class="custom-control-label"
                              for="customControlInline"
                              >Remember me</label
                            >
                          </div>

                          <div class="mt-4 text-center">
                            <button
                              class="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                            >
                              Log In
                            </button>
                          </div>

                          <!-- <div class="mt-4 text-center">
                            <router-link
                              tag="a"
                              to="/forgot-password"
                              class="text-muted"
                            >
                              <i class="mdi mdi-lock mr-1"></i> Forgot your
                              password?
                            </router-link>
                          </div> -->
                        </form>
                      </div>
                      <!-- <div class="mt-2 text-center">
                        <p>
                          Don't have an account ?
                          <router-link
                            tag="a"
                            to="/register"
                            class="font-weight-medium text-primary"
                          >Register</router-link>
                        </p>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="authentication-bg">
              <div class="bg-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
