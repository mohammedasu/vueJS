<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-form
              enctype="multipart/form-data"
              ref="sms"
              @submit.prevent="
                $route.name == 'edit-registration'
                  ? updateData($route.params.id)
                  : $route.name == 'add-registration'
                  ? submitData
                  : ''
              "
            >
              <b-form-group
                id="input-group-1"
                label="Template Name *"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  placeholder="Enter Template Name"
                  v-model="form.template_name"
                  :class="{
                    'is-invalid': submitted && $v.form.template_name.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.template_name.required"
                  class="invalid-feedback"
                >
                  Template Name is required.
                </div>
              </b-form-group>
              <b-form-group label="User Types *" label-for="input-2">
                <multiselect
                  id="comm"
                  v-model="form.user_types"
                  :options="usertypes"
                  :multiple="true"
                  track-by="value"
                  label="name"
                  :class="{
                    'is-invalid': submitted && $v.form.user_types.$error,
                  }"
                >
                </multiselect>
                <div
                  v-if="submitted && !$v.form.user_types.required"
                  class="invalid-feedback"
                >
                  User Type is required.
                </div>
              </b-form-group>

              <b-button
                type="button"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-registration'"
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="button"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-registration'"
                @click.prevent="submitData"
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
import registrationMixin from "../../../mixins/ModuleJs/registration";
import { required } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  mixins: [MixinRequest, registrationMixin],
  data() {
    return {
      submitted: false,
      title: "Registration",
      items: [
        {
          text: "Back",
          href: "/registration",
        },
        {
          text: "Data",
        },
      ],
    };
  },
  validations: {
    form: {
      template_name: { required },
      user_types: { required },
    },
  },
};
</script>
