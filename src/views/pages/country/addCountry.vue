<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-country'">
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
              ref="country"
              @submit.prevent="
                $route.name == 'edit-country'
                  ? updateData($route.params.id)
                  : $route.name == 'add-country'
                  ? submitData
                  : ''
              "
            >
              <b-form-group
                id="input-group-1"
              >
                <label for="input-1">Name <span style="color: red;">*</span></label>
                <b-form-input
                  id="input-1"
                  v-model="form.name"
                  placeholder="Enter Name"
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
              >
               <label for="input-2">Sortname <span style="color: red;">*</span></label>
                <b-form-input
                  id="input-2"
                  v-model="form.sortname"
                  placeholder="Enter Sortname"
                  :class="{
                    'is-invalid': submitted && $v.form.sortname.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.sortname.required"
                  class="invalid-feedback"
                >
                  Sortname is required.
                </div>
              </b-form-group>
              <b-form-group
                id="input-group-3"
              >
                <label for="input-3">Phone Code <span style="color: red;">*</span></label>
                <b-form-input
                  id="input-3"
                  v-model="form.phonecode"
                  placeholder="Enter Phone Code"
                  :class="{
                    'is-invalid': submitted && $v.form.phonecode.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && $v.form.phonecode.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.form.phonecode.required"
                    >Phonecode is required.</span
                  >
                  <span v-if="!$v.form.phonecode.numeric"
                    >This value should be a valid number...</span
                  >
                </div>
              </b-form-group>
              <!-- <b-form-group
                id="input-group-4"
                label="Flag"
                label-for="input-4"
              >
                <b-form-input
                  id="input-4"
                  v-model="form.flag"
                  placeholder="Enter Flag"
                ></b-form-input>
              </b-form-group> -->
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-country'"
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-country'"
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
import countryMixin from "../../../mixins/ModuleJs/country";
import { required, numeric } from "vuelidate/lib/validators";

export default {
  mixins: [MixinRequest, countryMixin],
  data() {
    return {
      submitted: false,
      title1: "Add Country",
      title2: 'Edit Country',
      items: [
        {
          text: "List",
          href: "/country",
        },
        {
          text: "Data",
        },
      ],
    };
  },
  components: {
    Layout,
    PageHeader,
  },
  validations: {
    form: {
      name: { required },
      sortname: { required },
      phonecode: { required, numeric },
    },
  },
};
</script>
