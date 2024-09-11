<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-partner'">
      <PageHeader :title="title1" :items="items"></PageHeader>
    </template>
    <template v-else>
      <PageHeader :title="title2" :items="items"></PageHeader>
    </template>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <!-- <b-form
              class="needs-validation"
              enctype="multipart/form-data"
              ref="partner"
              @submit.prevent="
                $route.name == 'edit-partner'
                  ? updateData($route.params.id)
                  : $route.name == 'add-partner'
                  ? submitData
                  : ''
              "
            > -->
            <form-wizard
              @on-complete="submitData"
              color="#556ee6"
              enctype="multipart/form-data"
              ref="podcast"
              :finishButtonText="this.$route.name == 'add-partner' ? 'Save Data' : 'Update Data'"
              back-button-text="Go Back!" 
              next-button-text="Go Next!"
              >
              <tab-content title="Partner Details" icon="mdi mdi-account-details" :before-change="() => validateFormOne()">
                <div class="row">
                  <b-form-group
                    class="col-6"
                    id="input-group-1"
                    :class="{ 'form-group--error': $v.form.title.$error }"
                  >
                    <label for="input-1"
                      >Partner Name <span style="color: red">*</span></label
                    >
                    <b-form-input
                      id="input-1"
                      v-model="form.title"
                      placeholder="Enter Partner Name"
                      @keyup.prevent="slugify"
                      @input="delayTouch($v.form.title)"
                      :class="{
                        'is-invalid': submitted && $v.form.title.$invalid,
                      }"
                    ></b-form-input>
                    <div
                      v-if="submitted && !$v.form.title.required"
                      class="invalid-feedback"
                    >
                      Partner Name is required.
                    </div>
                    <div class="error" v-if="!$v.form.title.maxLength">
                      Must have maximum
                      {{ $v.form.title.$params.maxLength.max }} characters.
                    </div>
                  </b-form-group>
                  <b-form-group id="input-group-2" class="col-6">
                    <label for="input-1"
                      >Link Name <span style="color: red">*</span></label
                    >
                    <b-form-input
                      id="input-2"
                      v-model="form.link_name"
                      placeholder="Enter Link Name"
                      :class="{
                        'is-invalid': submitted && $v.form.link_name.$invalid,
                      }"
                    ></b-form-input>
                    <div
                      v-if="submitted && !$v.form.link_name.required"
                      class="invalid-feedback"
                    >
                      Link Name is required.
                    </div>
                  </b-form-group>
                </div>
                <b-form-group
                  id="input-group-3"
                  label="Tell Us More About Partner"
                  label-for="input-3"
                  :class="{ 'form-group--error': $v.form.description.$error }"
                >
                  <ckeditor
                    id="input-3"
                    v-model="form.description"
                    @input="delayTouch($v.form.description)"
                    :editor="editor"
                  ></ckeditor>
                  <div class="error" v-if="!$v.form.description.maxLength">
                    Must have maximum
                    {{ $v.form.description.$params.maxLength.max }} characters.
                  </div>
                </b-form-group>

                <div class="row">
                  <b-form-group
                    id="input-group-4"
                    label="Website Banner [Upload Max File Size : 2MB]"
                    label-for="input-4"
                    class="col-6"
                  >
                    <b-form-file
                      id="input-4"
                      accept="image/*"
                      placeholder="Choose a file or drop it here... "
                      @change="readFile($event, 'website_banner_image')"
                      ref="website_banner_image"
                    ></b-form-file>
                    <template
                      v-if="
                        $route.name == 'edit-partner' &&
                        edit.website_banner_image_url
                      "
                    >
                      <img
                        :src="edit.website_banner_image_url"
                        width="128px"
                        height="128px"
                        ref="website_banner_image_url"
                        style="object-fit: contain"
                      />
                    </template>
                    <template v-if="website_banner_image_url">
                      <img
                        :src="website_banner_image_url"
                        width="128px"
                        height="128px"
                        ref="website_banner_image_url"
                        style="object-fit: contain"
                      />
                    </template>
                  </b-form-group>
                  <b-form-group
                    id="input-group-5"
                    label="App Banner [Upload Max File Size : 2MB]"
                    label-for="input-5"
                    class="col-6"
                  >
                    <b-form-file
                      id="input-5"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'app_banner_image')"
                      ref="app_banner_image"
                    ></b-form-file>
                    <template
                      v-if="
                        $route.name == 'edit-partner' && edit.app_banner_image_url
                      "
                    >
                      <img
                        :src="edit.app_banner_image_url"
                        width="128px"
                        height="128px"
                        style="object-fit: contain"
                      />
                    </template>
                    <template v-if="app_banner_image_url">
                      <img
                        :src="app_banner_image_url"
                        width="128px"
                        height="128px"
                        ref="app_banner_image_url"
                        style="object-fit: contain"
                      />
                    </template>
                  </b-form-group>
                </div>
                <div class="row">
                  <b-form-group
                    id="input-group-9"
                    label="App Logo [Upload Max File Size : 2MB]"
                    label-for="input-9"
                    class="col-4"
                  >
                    <b-form-file
                      id="input-9"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'app_logo_image')"
                      ref="app_logo_image"
                    ></b-form-file>
                    <template
                      v-if="
                        $route.name == 'edit-partner' && edit.app_logo_image_url
                      "
                    >
                      <img
                        :src="edit.app_logo_image_url"
                        width="128px"
                        height="128px"
                        style="object-fit: contain"
                      />
                    </template>
                    <template v-if="app_logo_image_url">
                      <img
                        :src="app_logo_image_url"
                        width="128px"
                        height="128px"
                        ref="app_logo_image_url"
                        style="object-fit: contain"
                      />
                    </template>
                  </b-form-group>
                  <b-form-group
                    id="input-group-10"
                    label="Open Page Register [Upload Max File Size : 2MB]"
                    label-for="input-10"
                    class="col-4"
                  >
                    <b-form-file
                      id="input-10"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'open_page_register_image')"
                      ref="open_page_register_image"
                    ></b-form-file>
                    <template
                      v-if="
                        $route.name == 'edit-partner' &&
                        edit.open_page_register_image_url
                      "
                    >
                      <img
                        :src="edit.open_page_register_image_url"
                        width="128px"
                        height="128px"
                        style="object-fit: contain"
                      />
                    </template>
                    <template v-if="open_page_register_image_url">
                      <img
                        :src="open_page_register_image_url"
                        width="128px"
                        height="128px"
                        ref="open_page_register_image_url"
                        style="object-fit: contain"
                      />
                    </template>
                  </b-form-group>
                  <b-form-group
                    class="col-4"
                    id="input-group-11"
                    label="Open Page Banner [Upload Max File Size : 2MB]"
                    label-for="input-11"
                  >
                    <b-form-file
                      id="input-11"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'open_page_banner_img')"
                      ref="open_page_banner_img"
                    ></b-form-file>
                    <template
                      v-if="
                        $route.name == 'edit-partner' &&
                        edit.open_page_banner_img_url
                      "
                    >
                      <img
                        :src="edit.open_page_banner_img_url"
                        width="128px"
                        height="128px"
                        style="object-fit: contain"
                      />
                    </template>
                    <template v-if="open_page_banner_img_url">
                      <img
                        :src="open_page_banner_img_url"
                        width="128px"
                        height="128px"
                        ref="open_page_banner_img_url"
                        style="object-fit: contain"
                      />
                    </template>
                  </b-form-group>
                </div>          
              </tab-content>

              <tab-content title="Add Tags" icon="fa fa-tag">
                <div class="row">
                  <b-form-group
                    class="col-6"
                    id="input-group-6"
                    label="Meta Title"
                    label-for="input-6"
                    :class="{ 'form-group--error': $v.form.meta_title.$error }"
                  >
                    <b-form-input
                      id="input-6"
                      v-model="form.meta_title"
                      placeholder="Enter Meta Title"
                      @input="delayTouch($v.form.meta_title)"
                    ></b-form-input>
                    <div class="error" v-if="!$v.form.meta_title.maxLength">
                      Must have maximum
                      {{ $v.form.meta_title.$params.maxLength.max }} characters.
                    </div>
                  </b-form-group>
                  <b-form-group
                    class="col-6"
                    id="input-group-8"
                    label="Meta Keywords"
                    label-for="input-8"
                    :class="{
                      'form-group--error': $v.form.meta_keywords.$error,
                    }"
                  >
                    <b-form-input
                      id="input-8"
                      v-model="form.meta_keywords"
                      placeholder="Enter Meta Keywords"
                      @input="delayTouch($v.form.meta_keywords)"
                    ></b-form-input>
                    <div class="error" v-if="!$v.form.meta_keywords.maxLength">
                      Must have maximum
                      {{
                        $v.form.meta_keywords.$params.maxLength.max
                      }}
                      characters.
                    </div>
                  </b-form-group>
                </div>
               
                <b-form-group
                  id="input-group-9"
                  label="Meta Description"
                  label-for="input-9"
                  :class="{
                    'form-group--error': $v.form.meta_description.$error,
                  }"
                >
                  <ckeditor
                    id="input-9"
                    v-model="form.meta_description"
                    :editor="editor"
                    @input="delayTouch($v.form.meta_description)"
                  ></ckeditor>
                  <div class="error" v-if="!$v.form.meta_description.maxLength">
                    Must have maximum
                    {{
                      $v.form.meta_description.$params.maxLength.max
                    }}
                    characters.
                  </div>
                </b-form-group>
              
                <template v-if="$route.name == 'edit-partner'">
                  <h6 class="mb-3">Tabs Listed:</h6>
                  <div v-for="(data, i) in forum_tabs" :key="i">
                    <h6>Label for {{ data.label }} :</h6>
                    <div class="row">
                      <div class="col-md-4">
                        <b-form-group label-for="case">
                          <b-form-input
                            id="case"
                            type="number"
                            v-model="data.index"
                            placeholder="Index"
                          ></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-4">
                        <b-form-group
                          id="input-group-1"
                          label-for="input-1"
                          class="mb-0"
                        >
                          <b-form-input
                            id="input-1"
                            v-model="data.label"
                            placeholder="Enter Label"
                          ></b-form-input>
                        </b-form-group>
                      </div>
                      <div
                        class="col-md-4"
                        style="
                          display: flex;
                          align-items: start;
                          padding-top: 10px;
                        "
                      >
                        <div style="display: flex; gap: 10px">
                          <b-form-checkbox v-model="data.active"
                            >Active</b-form-checkbox
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <b-form-group id="input-group-13">
                  <b-form-checkbox v-model="form.is_visible_in_home"
                    >Show in home page</b-form-checkbox
                  >
                </b-form-group>
               </tab-content>

              <!-- <tab-content title="Preview" icon="dripicons-preview">
                <div class="d-flex justify-content-center">
                  <div class="card preview">
                    <div class="card-header bg-transparent">
                      <img
                        :src="`${website_banner_image_url}`"
                        v-if="this.$route.name == 'add-partner'"
                        alt="Partner Thumbnail"
                        class="preview-img"
                      />
                      <img
                        :src="`${edit.website_banner_image_url}`"
                        v-else-if="this.$route.name == 'edit-partner'"
                        alt="Partner Thumbnail"
                        class="preview-img"
                      />
                    </div>
                    <div class="card-body pt-0">
                      <h6 class="text-center">{{ form.title }}</h6>
                      <div class="text-center" v-html="form.description"></div>
                    </div>
                    <div class="card-footer">
                      <div class="like-share-comment">
                        <div class="like-share-comment-inner">
                          <i class="mdi mdi-thumb-up"></i>
                          <span>Like</span>
                        </div>
                        <div class="like-share-comment-inner">
                          <i class="fa fa-share"></i>
                          <span>Share</span>
                        </div>
                        <div class="like-share-comment-inner">
                          <i class="mdi mdi-comment"></i>
                          <span>Comment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </tab-content> -->

            </form-wizard>
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
import partnerMixin from "../../../mixins/ModuleJs/partner";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { required, maxLength } from "vuelidate/lib/validators";
import { FormWizard, TabContent } from "vue-form-wizard";

const touchMap = new WeakMap();

export default {
  mixins: [MixinRequest, partnerMixin],
  data() {
    return {
      submitted: false,
      title1: "Add Partner",
      title2: "Edit Partner",
      items: [
        {
          text: "Back",
          href: "/partner",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
    };
  },
  components: {
    PageHeader,
    Layout,
    ckeditor: CKEditor.component,
    FormWizard,
    TabContent
  },
  validations: {
    form: {
      title: { required, maxLength: maxLength(190) },
      link_name: { required },
      description: { maxLength: maxLength(400) },
      meta_title: { maxLength: maxLength(190) },
      meta_description: { maxLength: maxLength(400) },
      meta_keywords: { maxLength: maxLength(240) },
    },
  },
  methods: {
    validateFormOne() {
      this.submitted = true;
      if (this.$v.form.title.$invalid || this.$v.form.link_name.$invalid) { 
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Please Fill The Required Fields"
        });
      return false;
      }
      return true;
    },
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
