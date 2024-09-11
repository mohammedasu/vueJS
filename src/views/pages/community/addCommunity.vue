<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-community'">
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
              enctype="multipart/form-data"
              ref="community"
              @submit.prevent="
                $route.name == 'edit-community'
                  ? updateData($route.params.id)
                  : $route.name == 'add-community'
                  ? submitData
                  : ''
              "
            > -->
            <form-wizard
              @on-complete="submitData"
              color="#556ee6"
              enctype="multipart/form-data"
              ref="podcast"
              :finishButtonText="this.$route.name == 'add-community' ? 'Save Data' : 'Update Data'"
              back-button-text="Go Back!" 
              next-button-text="Go Next!"
              >
                <tab-content title="Community Details" icon="mdi mdi-account-details" :before-change="() => validateFormOne()">
                  <b-form-group
                    :class="{
                      'form-group--error': $v.form.title.$invalid,
                    }"
                  >
                    <label for="input-1"
                      >Community Title <span style="color: red">*</span></label
                    >
                    <b-form-input
                      id="input-1"
                      v-model="form.title"
                      @input="delayTouch($v.form.title)"
                      placeholder="Enter Community Title"
                      :class="{
                        'is-invalid': submitted && $v.form.title.$error,
                      }"
                    ></b-form-input>
                    <div
                      v-if="submitted && !$v.form.title.required"
                      class="invalid-feedback"
                    >
                      Community Title is required.
                    </div>
                    <div class="error" v-if="!$v.form.title.maxLength">
                      Must have maximum
                      {{ $v.form.title.$params.maxLength.max }}
                      characters.
                    </div>
                  </b-form-group>
                  <b-form-group
                    label="Tell Us More About Community"
                    label-for="input-4"
                    :class="{
                      'form-group--error': $v.form.description.$error,
                    }"
                  >
                    <ckeditor
                      id="input-4"
                      :editor="editor"
                      v-model="form.description"
                      @input="delayTouch($v.form.description)"
                    ></ckeditor>
                    <div class="error" v-if="!$v.form.description.maxLength">
                      Must have maximum
                      {{ $v.form.description.$params.maxLength.max }}
                      characters.
                    </div>
                  </b-form-group>

                  <div class="row">
                    <b-form-group
                      class="col-6"
                      id="input-group-2"
                      label="Tagline"
                      label-for="input-2"
                      :class="{
                        'form-group--error': $v.form.tag_line.$error,
                      }"
                    >
                      <b-form-input
                        id="input-2"
                        v-model="form.tag_line"
                        placeholder="Enter Tagline"
                        @input="delayTouch($v.form.tag_line)"
                      ></b-form-input>
                      <div class="error" v-if="!$v.form.tag_line.maxLength">
                        Must have maximum
                        {{ $v.form.tag_line.$params.maxLength.max }}
                        characters.
                      </div>
                    </b-form-group>

                    <b-form-group id="input-group-8" class="col-6">
                      <label for="input-8"
                        >News Card Color <span style="color: red">*</span></label
                      >
                      <b-form-input
                        id="input-8"
                        v-model="form.news_card_color"
                        placeholder="Enter News Card Color [Eg: #00bcd4]"
                        :class="{
                          'is-invalid': submitted && $v.form.news_card_color.$invalid,
                        }"
                      ></b-form-input>
                      <div
                        v-if="submitted && !$v.form.news_card_color.required"
                        class="invalid-feedback"
                      >
                        News Card Color is required.
                      </div>
                    </b-form-group>
                  </div>

                  <div class="row">
                    <b-form-group
                      id="input-group-14"
                      label="Thumbnail Image [Upload Max File Size : 2MB]"
                      label-for="input-14"
                      class="col-6"
                    >
                      <b-form-file
                        id="input-14"
                        accept="image/*"
                        placeholder="Choose a file or drop it here..."
                        @change="readFile($event, 'thumbnail_image')"
                        ref="thumbnail_image"
                      ></b-form-file>
                      <template
                        v-if="
                          $route.name == 'edit-community' &&
                          edit.thumbnail_image_url
                        "
                      >
                        <img
                          :src="edit.thumbnail_image_url"
                          width="128px"
                          height="128px"
                          style="object-fit: contain"
                        />
                      </template>
                      <template v-if="thumbnail_image_url">
                        <img
                          :src="thumbnail_image_url"
                          width="128px"
                          height="128px"
                          ref="thumbnail_image_url"
                          style="object-fit: contain"
                        />
                      </template>
                    </b-form-group>
                    <b-form-group
                      id="input-group-9"
                      label="Pre Login Image [Upload Max File Size : 2MB]"
                      label-for="input-9"
                      class="col-6"
                    >
                      <b-form-file
                        id="input-9"
                        accept="image/*"
                        placeholder="Choose a file or drop it here..."
                        @change="readFile($event, 'pre_login_image')"
                        ref="pre_login_image"
                      ></b-form-file>
                      <template
                        v-if="
                          $route.name == 'edit-community' &&
                          edit.pre_login_image_url
                        "
                      >
                        <img
                          :src="edit.pre_login_image_url"
                          width="128px"
                          height="128px"
                          style="object-fit: contain"
                        />
                      </template>
                      <template v-if="pre_login_image_url">
                        <img
                          :src="pre_login_image_url"
                          width="128px"
                          height="128px"
                          ref="pre_login_image_url"
                          style="object-fit: contain"
                        />
                      </template>
                    </b-form-group>
                  </div>

                  <div class="row">
                    <b-form-group
                      id="input-group-10"
                      label="Mobile Screen Hand Banner [Upload Max File Size : 2MB]"
                      label-for="input-10"
                      class="col-6"
                    >
                      <b-form-file
                        id="input-10"
                        accept="image/*"
                        placeholder="Choose a file or drop it here..."
                        @change="readFile($event, 'pre_login_image2')"
                        ref="pre_login_image2"
                      ></b-form-file>
                      <template
                        v-if="
                          $route.name == 'edit-community' &&
                          edit.pre_login_image2_url
                        "
                      >
                        <img
                          :src="edit.pre_login_image2_url"
                          width="128px"
                          height="128px"
                          style="object-fit: contain"
                        />
                      </template>
                      <template v-if="pre_login_image2_url">
                        <img
                          :src="pre_login_image2_url"
                          width="128px"
                          height="128px"
                          ref="pre_login_image2_url"
                          style="object-fit: contain"
                        />
                      </template>
                    </b-form-group>
                    <b-form-group
                      id="input-group-13"
                      label="Website Banner Image [Upload Max File Size : 2MB]"
                      label-for="input-13"
                      class="col-6"
                    >
                      <b-form-file
                        id="input-13"
                        accept="image/*"
                        placeholder="Choose a file or drop it here..."
                        @change="readFile($event, 'website_banner_image')"
                        ref="website_banner_image"
                      ></b-form-file>
                      <template
                        v-if="
                          $route.name == 'edit-community' &&
                          edit.website_banner_image_url
                        "
                      >
                        <img
                          :src="edit.website_banner_image_url"
                          width="128px"
                          height="128px"
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
                  </div>

                  <div class="row">
                    <b-form-group id="input-group-12" class="col-6">
                      <label for="input-12"
                        >Banner Image [Upload Max File Size : 2MB] <span style="color: red">*</span></label
                      >
                      <b-form-file
                        id="input-12"
                        accept="image/*"
                        placeholder="Choose a file or drop it here..."
                        @change="readFile($event, 'banner_image')"
                        ref="banner_image"
                        :class="{
                          'is-invalid': submitted && $v.banner_image.$invalid,
                        }"
                      ></b-form-file>
                      <template
                        v-if="
                          $route.name == 'edit-community' && edit.banner_image_url
                        "
                      >
                        <img
                          :src="edit.banner_image_url"
                          width="128px"
                          height="128px"
                          style="object-fit: contain"
                        />
                      </template>
                      <template v-if="banner_image_url">
                        <img
                          :src="banner_image_url"
                          width="128px"
                          height="128px"
                          ref="banner_image_url"
                          style="object-fit: contain"
                        />
                      </template>
                      <div
                        v-if="submitted && !$v.banner_image.required"
                        class="invalid-feedback"
                      >
                        Banner Image is required.
                      </div>
                    </b-form-group>
                    <b-form-group id="input-group-11" class="col-6">
                      <label for="input-11"
                        >Logo Image [Upload Max File Size : 2MB] <span style="color: red">*</span></label
                      >
                      <b-form-file
                        id="input-11"
                        accept="image/*"
                        placeholder="Choose a file or drop it here..."
                        @change="readFile($event, 'logo_image')"
                        ref="logo_image"
                        :class="{
                          'is-invalid': submitted && $v.logo_image.$invalid,
                        }"
                      ></b-form-file>
                      <template
                        v-if="
                          $route.name == 'edit-community' && edit.logo_image_url
                        "
                      >
                        <img
                          :src="edit.logo_image_url"
                          width="128px"
                          height="128px"
                          style="object-fit: contain"
                        />
                      </template>
                      <template v-if="logo_image_url">
                        <img
                          :src="logo_image_url"
                          width="128px"
                          height="128px"
                          ref="logo_image_url"
                          style="object-fit: contain"
                        />
                      </template>
                      <div
                        v-if="submitted && !$v.logo_image.required"
                        class="invalid-feedback"
                      >
                        Logo Image is required.
                      </div>
                    </b-form-group>
                  </div>

                </tab-content>

                <tab-content title="Add Tags" icon="fa fa-tag">
                  <div class="row">
                    <b-form-group
                      class="col-6"
                      id="input-group-5"
                      label="Meta Title"
                      label-for="input-5"
                      :class="{
                        'form-group--error': $v.form.meta_title.$error,
                      }"
                    >
                      <b-form-input
                        id="input-5"
                        v-model="form.meta_title"
                        @input="delayTouch($v.form.meta_title)"
                        placeholder="Enter Meta Title"
                      ></b-form-input>
                      <div class="error" v-if="!$v.form.meta_title.maxLength">
                        Must have maximum
                        {{ $v.form.meta_title.$params.maxLength.max }}
                        characters.
                      </div>
                    </b-form-group>
                    <b-form-group
                      class="col-6"
                      label="Meta Keywords"
                      :class="{
                        'form-group--error': $v.form.meta_keywords.$error,
                      }"
                      label-for="input-7"
                    >
                      <b-form-input
                        id="input-7"
                        v-model="form.meta_keywords"
                        @input="delayTouch($v.form.meta_keywords)"
                        placeholder="Enter Meta Keywords"
                      ></b-form-input>
                      <div class="error" v-if="!$v.form.meta_keywords.maxLength">
                        Must have maximum
                        {{ $v.form.meta_keywords.$params.maxLength.max }}
                        characters.
                      </div>
                    </b-form-group>
                  </div>
               
                  <b-form-group
                    id="input-group-6"
                    label="Meta Description"
                    label-for="input-6"
                    :class="{
                      'form-group--error': $v.form.meta_description.$error,
                    }"
                  >
                    <ckeditor
                      id="input-6"
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

                  <template v-if="$route.name == 'edit-community'">
                    <h6 class="mb-3">Tabs Listed:</h6>
                    <div v-for="(data, i) in forum_tabs" :key="i">
                      <h6>Label for {{ i }} :</h6>
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
                 
                  <b-form-group id="input-group-15">
                    <div style="display: flex; gap: 10px">
                      <b-form-checkbox v-model="form.available_for_registration"
                        >Available for registration</b-form-checkbox
                      >
                      <b-form-checkbox v-model="form.show_in_home_page"
                        >Show in home page</b-form-checkbox
                      >
                    </div>
                  </b-form-group>
                </tab-content>

                <!-- <tab-content title="Preview" icon="dripicons-preview">
                  <div class="d-flex justify-content-center">
                    <div class="card preview">
                      <div class="card-header bg-transparent">
                         <img
                          :src="`${thumbnail_image_url}`"
                          v-if="this.$route.name == 'add-community'"
                          alt="Community Thumbnail"
                          class="preview-img"
                        />
                        <img
                          :src="`${edit.thumbnail_image_url}`"
                          v-else-if="this.$route.name == 'edit-community'"
                          alt="Community Thumbnail"
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
import communityMixin from "../../../mixins/ModuleJs/community";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { required, maxLength } from "vuelidate/lib/validators";
import { FormWizard, TabContent } from "vue-form-wizard";

const touchMap = new WeakMap();

export default {
  mixins: [MixinRequest, communityMixin],
  data() {
    return {
      submitted: false,
      title1: "Add Community",
      title2: "Edit Community",
      items: [
        {
          text: "Back",
          href: "/community",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
    };
  },
  validations: {
    form: {
      title: { required, maxLength: maxLength(190) },
      news_card_color: { required },
      description: { maxLength: maxLength(400) },
      tag_line: { maxLength: maxLength(250) },
      meta_title: { maxLength: maxLength(190) },
      meta_description: { maxLength: maxLength(400) },
      meta_keywords: { maxLength: maxLength(250) },
    },
    logo_image: { required },
    banner_image: { required },
  },
  components: {
    Layout,
    PageHeader,
    ckeditor: CKEditor.component,
    FormWizard,
    TabContent
  },
   methods: {
     validateFormOne() {
      this.submitted = true;
      if (this.$v.form.title.$invalid || this.$v.form.news_card_color.$invalid || this.$v.banner_image.$invalid || this.$v.logo_image.$invalid) { 
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
