<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-form
              enctype="multipart/form-data"
              ref="notification-master"
              @submit.prevent="
                $route.name == 'edit-master-notification'
                  ? updateData($route.params.id)
                  : $route.name == 'add-master-notification'
                  ? submitData
                  : ''
              "
            >
              <b-form-group
                id="input-group-1"
                label="Event Name:"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  placeholder="Enter Event Name"
                  v-model="form.event_name"
                  :class="{
                    'is-invalid': submitted && $v.form.event_name.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.event_name.required"
                  class="invalid-feedback"
                >
                  Event Name is required.
                </div>
              </b-form-group>
              <b-form-group
                id="input-group-email"
                label-for="input-email"
                label="Email Template Name.:"
              >
                <b-form-select
                  id="input-email"
                  v-model="form.email_template_ref_no"
                  :options="email"
                  value-field="template_ref_no"
                  text-field="name"
                >
                </b-form-select>
              </b-form-group>
              <b-form-group
                id="input-group-sms"
                label-for="input-sms"
                label="SMS Template Name.:"
              >
                <b-form-select
                  id="input-sms"
                  v-model="form.sms_template_ref_no"
                  :options="sms"
                  value-field="template_ref_no"
                  text-field="name"
                >
                </b-form-select>
              </b-form-group>
              <b-form-group
                id="input-group-push"
                label-for="input-push"
                label="Push Notification Template Name:"
              >
                <b-form-select
                  id="input-push"
                  v-model="form.push_notification_template_ref_no"
                  :options="push"
                  value-field="template_ref_no"
                  text-field="name"
                >
                </b-form-select>
              </b-form-group>
              <b-form-group
                id="input-group-page"
                label-for="input-page"
                label="Page Notification Template Name.:"
              >
                <b-form-select
                  id="input-page"
                  v-model="form.page_notification_template_ref_no"
                  :options="page"
                  value-field="template_ref_no"
                  text-field="name"
                >
                </b-form-select>
              </b-form-group>
              <b-button
                type="button"
                variant="primary"
                class="mr-2"
                v-if="
                  $route.name == 'edit-master-notification'
                "
                @click.prevent="
                  updateData($route.params.notification_master_ref_no)
                "
                >Update Data</b-button
              >
              <b-button
                type="button"
                variant="primary"
                class="mr-2"
                v-else-if="
                  $route.name == 'add-master-notification'
                "
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
import NotificationMasterMixin from "../../../mixins/ModuleJs/notification-master";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [MixinRequest, NotificationMasterMixin],
  data() {
    return {
      submitted: false,
      title: "Notification Master",
      items: [
        {
          text: "Back",
          href: "/master-notification",
        },
        {
          text: "Data",
        },
      ],
    };
  },
  components: {
    PageHeader,
    Layout,
  },
  validations: {
    form: {
      event_name: { required },
    },
  },
};
</script>
