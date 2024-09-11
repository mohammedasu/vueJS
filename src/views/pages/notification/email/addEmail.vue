<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-form
              enctype="multipart/form-data"
              ref="email"
              @submit.prevent="
                $route.name == 'edit-email-notification'
                  ? updateData($route.params.id)
                  : $route.name == 'add-email-notification'
                  ? submitData
                  : ''
              "
            >
              <b-form-group
                id="input-group-1"
                label="Name *"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  placeholder="Enter Name"
                  v-model="form.name"
                  :class="{
                    'is-invalid': submitted && $v.form.name.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.name.required"
                  class="invalid-feedback"
                >
                  Name is required.
                </div>
              </b-form-group>
              <b-form-group
                id="input-group-2"
                label="Subject *"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  placeholder="Enter Subject"
                  v-model="form.subject"
                  :class="{
                    'is-invalid': submitted && $v.form.subject.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.subject.required"
                  class="invalid-feedback"
                >
                  Subject is required.
                </div>
              </b-form-group>
              <b-form-group
                id="input-group-3"
                label="Content *"
                label-for="input-3"
              >
                <b-form-textarea
                  id="input-3"
                  rows="3"
                  max-rows="6"
                  v-model="form.content"
                  placeholder="Enter Content"
                  :class="{
                    'is-invalid': submitted && $v.form.content.$error,
                  }"
                >
                </b-form-textarea>
                <div
                  v-if="submitted && !$v.form.content.required"
                  class="invalid-feedback"
                >
                  Content is required.
                </div>
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-email-notification'"
                @click.prevent="updateData($route.params.template_ref_no)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-email-notification'"
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
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import MixinRequest from "../../../../mixins/request";
import notificationEmail from "../../../../mixins/ModuleJs/notification-email";
import { required } from "vuelidate/lib/validators";

export default {
  components: {
    Layout,
    PageHeader,
  },
  mixins: [MixinRequest, notificationEmail],
  data() {
    return {
      submitted: false,
      title: "Email",
      items: [
        {
          text: "Back",
          href: "/email-notification",
        },
        {
          text: "Data",
        },
      ],
    };
  },
  validations: {
    form: {
      name: { required },
      subject: { required },
      content: { required },
    },
  },
};
</script>
