<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-form
              enctype="multipart/form-data"
              ref="certificate"
              @submit.prevent="
                $route.name == 'edit-certificate'
                  ? updateData($route.params.id)
                  : $route.name == 'add-certificate'
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
              <b-form-group
                label="Template *"
                label-for="input-2"
                id="input-group-2"
              >
                <b-form-textarea
                  id="input-2"
                  placeholder="Type here..."
                  rows="6"
                  v-model="form.template"
                  :class="{
                    'is-invalid': submitted && $v.form.template.$error,
                  }"
                ></b-form-textarea>
                <div
                  v-if="submitted && !$v.form.template.required"
                  class="invalid-feedback"
                >
                  Template Name is required.
                </div>
              </b-form-group>
              <b-form-group label-for="input-3" label="Points *">
                <b-form-input
                  id="input-3"
                  type="number"
                  v-model="form.points"
                  placeholder="Enter Points"
                  :class="{
                    'is-invalid': submitted && $v.form.points.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.points.required"
                  class="invalid-feedback"
                >
                  Points is required.
                </div>
              </b-form-group>
              <h6>Add Image</h6>
              <div
                class="row"
                v-for="(val, index) in form.image_fillers"
                :key="index"
              >
                <div class="col-md-4">
                  <b-form-group :label="`Image File. Index: ${index + 1}`">
                    <b-form-file
                      id="input-4"
                      accept="image/*"
                      placeholder="Choose a file or drop it here... [Upload Max File Size : 2MB]"
                      @change="readFile($event, 'file')"
                    ></b-form-file>
                    <template
                      v-if="
                        $route.name == 'edit-certificate' && edit.filler_img_url
                      "
                    >
                      <img
                        :src="edit.filler_img_url"
                        width="128px"
                        height="128px"
                      />
                    </template>
                  </b-form-group>
                </div>
                <div class="col-lg-4">
                  <b-form-group label="Image Filler Name">
                    <b-form-input
                      id="input-1"
                      placeholder="Enter Image Filler Name"
                      v-model="val.filler"
                    ></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-lg-4" style="margin-top: 30px">
                  <b-button
                    variant="success"
                    class="mr-4"
                    @click="addImage(index)"
                    >Add Image</b-button
                  >
                  <b-button variant="danger" @click="removeImage(index)"
                    >Remove Image</b-button
                  >
                </div>
              </div>

              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="
                  $route.name == 'edit-certificate'
                "
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="
                  $route.name == 'add-certificate'
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
import certificateMixin from "../../../mixins/ModuleJs/certificate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [MixinRequest, certificateMixin],
  data() {
    return {
      submitted: false,
      title: "Certificate",
      items: [
        {
          text: "Back",
          href: "/certificate",
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
      template_name: { required },
      template: { required },
      points: { required },
    },
  },
};
</script>
