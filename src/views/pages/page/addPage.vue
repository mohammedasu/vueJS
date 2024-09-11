<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-page'">
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
              ref="page"
              @submit.prevent="
                $route.name == 'edit-page' ? updateData($route.params.id) : ''
              "
            >
              <b-form-group
                id="input-group-1"
                :class="{
                  'form-group--error': $v.form.title.$error,
                }"
              >
                <label for="input-1"
                  >Title <span style="color: red">*</span></label
                >
                <b-form-input
                  id="input-1"
                  v-model="form.title"
                  placeholder="Enter Title"
                  @input="delayTouch($v.form.title)"
                  :class="{
                    'is-invalid': submitted && $v.form.title.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.title.required"
                  class="invalid-feedback"
                >
                  Title is required.
                </div>
                <div class="error" v-if="!$v.form.title.maxLength">
                  Must have maximum
                  {{ $v.form.title.$params.maxLength.max }}
                  characters.
                </div>
              </b-form-group>
              <b-form-group id="input-group-2">
                <label for="input-1"
                  >Description <span style="color: red">*</span></label
                >
                <ckeditor
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
              </b-form-group>
              <b-form-group
                id="input-group-6"
                label="Image [Upload Max File Size : 2MB]"
                label-for="input-6"
              >
                <b-form-file
                  id="input-6"
                  accept="image/*"
                  placeholder="Choose a file or drop it here..."
                  @change="readFile($event, 'image_name')"
                  ref="image_name"
                ></b-form-file>
                <template
                  v-if="$route.name == 'edit-page' && edit.image_name_url"
                >
                  <img
                    :src="edit.image_name_url"
                    width="128px"
                    height="128px"
                    style="object-fit: contain"
                  />
                </template>
                <template v-if="image_name_url">
                  <img
                    :src="image_name_url"
                    width="128px"
                    height="128px"
                    ref="image_name_url"
                    style="object-fit: contain"
                  />
                </template>
              </b-form-group>
              <b-form-group
                id="input-group-3"
                label="Meta Title"
                label-for="input-3"
                :class="{
                  'form-group--error': $v.form.meta_title.$error,
                }"
              >
                <b-form-input
                  id="input-3"
                  v-model="form.meta_title"
                  placeholder="Enter Meta Title"
                  @input="delayTouch($v.form.meta_title)"
                ></b-form-input>
                <div class="error" v-if="!$v.form.meta_title.maxLength">
                  Must have maximum
                  {{ $v.form.meta_title.$params.maxLength.max }}
                  characters.
                </div>
              </b-form-group>
              <b-form-group
                id="input-group-4"
                label="Meta Description"
                label-for="input-4"
                :class="{
                  'form-group--error': $v.form.meta_description.$error,
                }"
              >
                <ckeditor
                  id="input-4"
                  v-model="form.meta_description"
                  :editor="editor"
                  @input="delayTouch($v.form.meta_description)"
                ></ckeditor>
                <div class="error" v-if="!$v.form.meta_description.maxLength">
                  Must have maximum
                  {{ $v.form.meta_description.$params.maxLength.max }}
                  characters.
                </div>
              </b-form-group>
              <b-form-group
                id="input-group-5"
                label="Meta Keywords"
                label-for="input-5"
                :class="{
                  'form-group--error': $v.form.meta_keywords.$error,
                }"
              >
                <b-form-input
                  id="input-5"
                  v-model="form.meta_keywords"
                  placeholder="Enter Meta Keywords"
                  @input="delayTouch($v.form.meta_keywords)"
                ></b-form-input>
                <div class="error" v-if="!$v.form.meta_keywords.maxLength">
                  Must have maximum
                  {{ $v.form.meta_keywords.$params.maxLength.max }}
                  characters.
                </div>
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-page'"
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
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
import pageMixin from "../../../mixins/ModuleJs/page";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { required, maxLength } from "vuelidate/lib/validators";

const touchMap = new WeakMap();

export default {
  data() {
    return {
      submitted: false,
      title1: "Add Page",
      title2: "Edit Page",
      items: [
        {
          text: "Back",
          href: "/page",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
    };
  },
  mixins: [MixinRequest, pageMixin],
  components: {
    Layout,
    PageHeader,
    ckeditor: CKEditor.component,
  },
  validations: {
    form: {
      title: { required, maxLength: maxLength(250) },
      description: { required },
      meta_title: { maxLength: maxLength(190) },
      meta_description: { maxLength: maxLength(400) },
      meta_keywords: { maxLength: maxLength(250) },
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
