<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-admin'">
      <PageHeader :title="title1" :items="items"></PageHeader>
    </template>
    <template v-else>
      <PageHeader :title="title2" :items="items"></PageHeader>
    </template>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-form
              enctype="multipart/form-data"
              ref="admin"
              @submit.prevent="
                $route.name == 'edit-admin'
                  ? updateAdmin($route.params.id)
                  : $route.name == 'add-admin'
                  ? addAdmin
                  : ''
              "
            >
              <b-form-group>
                <label for="input-1"
                  >Username <span style="color: red">*</span></label
                >
                <b-form-input
                  id="input-1"
                  v-model="form.username"
                  placeholder="Enter Username"
                  :class="{
                    'is-invalid': submitted && $v.form.username.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.username.required"
                  class="invalid-feedback"
                >
                  Username is required.
                </div>
              </b-form-group>
              <b-form-group>
                <label for="input-2"
                  >Email <span style="color: red">*</span></label
                >
                <b-form-input
                  id="input-2"
                  v-model="form.email"
                  placeholder="Enter Email"
                  :class="{ 'is-invalid': submitted && $v.form.email.$error }"
                ></b-form-input>
                <div class="error" v-if="!$v.form.email.email">
                  <span>
                      Please Enter Valid Email.
                  </span>
                </div>
                <div
                  v-if="submitted && $v.form.email.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.form.email.required">Email is required.</span>
                </div>
              </b-form-group>
              <template>
                <b-form-group
                  :style="$route.name != 'add-admin' ? 'display:none' : ''"
                >
                  <label for="input-3"
                    >Password <span style="color: red">*</span></label
                  >
                  <b-form-input
                    id="input-3"
                    type="password"
                    v-model="form.password"
                    placeholder="Enter Password"
                    :class="{
                      'is-invalid': submitted && $v.form.password.$error,
                    }"
                  ></b-form-input>
                  <div
                    v-if="submitted && !$v.form.password.required"
                    class="invalid-feedback"
                  >
                    Password is required.
                  </div>
                </b-form-group>
                <b-form-group
                  :style="$route.name != 'add-admin' ? 'display:none' : ''"
                >
                  <label for="input-4"
                    >Confirm Password <span style="color: red">*</span></label
                  >
                  <b-form-input
                    id="input-4"
                    type="password"
                    v-model="form.confirm_password"
                    placeholder="Enter Confirm Password"
                    :class="{
                      'is-invalid':
                        submitted && $v.form.confirm_password.$error,
                    }"
                  ></b-form-input>
                  <div
                    v-if="submitted && $v.form.confirm_password.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.form.confirm_password.required"
                      >Confirm Password is required.</span
                    >
                    <span v-else-if="!$v.form.confirm_password.sameAsPassword"
                      >Confirm Password should be the same as Password.</span
                    >
                  </div>
                </b-form-group>
              </template>
              <b-form-group>
                <label for="input-role"
                  >Role <span style="color: red">*</span></label
                >
                <!-- <b-form-select
                  id="input-role"
                  v-model="form.role"
                  :options="roles"
                  value-field="value"
                  text-field="text"
                  :class="{
                    'is-invalid':
                      submitted && $v.form.role.$error,
                  }"
                >
                </b-form-select> -->
                
                 <b-form-select
                  v-model="form.role"
                  id="input-8"
                  :class="{
                    'is-invalid': submitted && $v.form.role.$error,
                  }"
                >
                  <b-form-select-option
                    v-for="role in roles"
                    :key="role.id"
                    :value="role.id"
                    >{{ role.name }}
                  </b-form-select-option>
                </b-form-select>
                <div
                  v-if="submitted && !$v.form.role.required"
                  class="invalid-feedback"
                >
                  Role is required.
                </div>
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-admin'"
                @click.prevent="updateAdmin($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-admin'"
                @click.prevent="addAdmin"
                >Save Data</b-button
              >
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import MixinRequest from "../../../mixins/request";
import adminMixin from "../../../mixins/ModuleJs/admin-user";
import { required, email, sameAs } from "vuelidate/lib/validators";

export default {
  mixins: [MixinRequest, adminMixin],
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title1: "Add Admin",
      title2: "Edit Admin",
      items: [
        {
          text: "List",
          href: "/admin-user",
        },
        {
          text: "Data",
        },
      ],
      submitted: false,
    };
  },
  validations: {
    form: {
      username: { required },
      email: { required, email },
      password: { required },
      confirm_password: { required, sameAsPassword: sameAs("password") },
      role: { required },
    },
  },
};
</script>
