<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-config'">
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
              ref="config"
              @submit.prevent="
                $route.name == 'edit-config'
                  ? updateData($route.params.id)
                  : $route.name == 'add-config'
                  ? submitData
                  : ''
              "
            >
              <b-form-group
                :class="{
                  'form-group--error': $v.form.config_name.$error,
                }"
              >
                <label for="input-1"
                  >Config Name <span style="color: red">*</span></label
                >
                <b-form-input
                  id="input-1"
                  v-model="form.config_name"
                  placeholder="Enter Config Name"
                  @input="delayTouch($v.form.config_name)"
                  :class="{
                    'is-invalid': submitted && $v.form.config_name.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.config_name.required"
                  class="invalid-feedback"
                >
                  Config Name is required.
                </div>
                <div class="error" v-if="!$v.form.config_name.maxLength">
                  Must have maximum
                  {{ $v.form.config_name.$params.maxLength.max }}
                  characters.
                </div>
              </b-form-group>
              <b-form-group
                :class="{
                  'form-group--error': $v.form.value.$error,
                }"
              >
                <label for="input-2"
                  >Value <span style="color: red">*</span></label
                >
                <b-form-input
                  id="input-2"
                  v-model="form.value"
                  placeholder="Enter Value"
                  @input="delayTouch($v.form.value)"
                  :class="{
                    'is-invalid': submitted && $v.form.value.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.value.required"
                  class="invalid-feedback"
                >
                  Value is required.
                </div>
                <div class="error" v-if="!$v.form.value.maxLength">
                  Must have maximum
                  {{ $v.form.value.$params.maxLength.max }}
                  characters.
                </div>
              </b-form-group>
              <b-form-group
                :class="{
                  'form-group--error': $v.form.description.$error,
                }"
              >
                <label for="input-4"
                  >Tell Us More About Config <span style="color: red">*</span></label
                >
                <ckeditor
                  @input="delayTouch($v.form.description)"
                  id="input-4"
                  :editor="editor"
                  v-model="form.description"
                  :class="{
                    'is-invalid': submitted && $v.form.description.$error,
                  }"
                ></ckeditor>
                <div
                  v-if="submitted && !$v.form.description.required"
                  class="invalid-feedback"
                >
                  Description is required.
                </div>
                <div class="error" v-if="!$v.form.description.maxLength">
                  Must have maximum
                  {{ $v.form.description.$params.maxLength.max }}
                  characters.
                </div>
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-config'"
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-config'"
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
import configMixin from "../../../mixins/ModuleJs/config";
import { required, maxLength } from "vuelidate/lib/validators";

import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const touchMap = new WeakMap();

export default {
  data() {
    return {
      submitted: false,
      title1: "Add Config",
      title2: "Edit Config",
      items: [
        {
          text: "List",
          href: "/config",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
    };
  },
  mixins: [MixinRequest, configMixin],
  components: {
    Layout,
    PageHeader,
    ckeditor: CKEditor.component,
  },
  validations: {
    form: {
      config_name: { required, maxLength: maxLength(250) },
      value: { required, maxLength: maxLength(250) },
      description: { required, maxLength: maxLength(250) },
    },
  },
  methods: {
    delayTouch($v) {
      $v.$reset();
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },
  },
};
</script>
