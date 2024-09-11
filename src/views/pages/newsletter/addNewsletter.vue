<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <!-- <template v-if="this.$route.name == 'add-newsletter'">
      <PageHeader :title="title1" :items="items"></PageHeader>
    </template>
    <template v-else>
      <PageHeader :title="title2" :items="items"></PageHeader>
    </template> -->
    <b-tabs>
      <b-tab title="English">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <form-wizard @on-complete="submitData" color="#556ee6" enctype="multipart/form-data" ref="newsletter"
                  back-button-text="Go Back!" next-button-text="Go Next!"
                  :finishButtonText="this.$route.name == 'add-newsletter' ? 'Save Data' : 'Update Data'">
                  <!-- <tab-content title="Newsletter Details" icon="mdi mdi-comment" :before-change="() => validateFormOne()"> -->
                  <tab-content title="Newsletter Details" icon="mdi mdi-account-details"
                    :before-change="() => validateFormOne()">
                    <!-- <b-form
                  enctype="multipart/form-data"
                  ref="newsletter"
                  @submit.prevent="
                    $route.name == 'edit-newsletter'
                      ? updateData($route.params.id)
                      : $route.name == 'add-newsletter'
                      ? submitData
                      : ''
                  "
                > -->
                    <div class="row">
                      <b-form-group id="input-group-1" :class="{'form-group--error': $v.form.title.$invalid}"
                        class="col-6">
                        <label for="input-2">Newsletter Title <span style="color: red;">*</span></label>
                        <b-form-input id="input-2" placeholder="Enter Newsletter Title"
                          @input="delayTouch($v.form.title)" v-model="form.title"
                          :class="{'is-invalid': submitted && $v.form.title.$invalid}">
                        </b-form-input>
                        <div v-if="submitted && !$v.form.title.required" class="invalid-feedback">Newsletter Title is
                          required.</div>
                        <div class="error" v-if="!$v.form.title.maxLength">Must have maximum{{
                        $v.form.title.$params.maxLength.max }}characters.</div>
                      </b-form-group>
                      <b-form-group label="Reference Number" label-for="input-1" id="input-group-1" class="col-6">
                        <b-form-input id="input-1" placeholder="Enter Reference Number" v-model="form.reference_no">
                        </b-form-input>
                      </b-form-group>
                    </div>

                    <b-form-group id="input-group-2">
                      <label for="input-2">Tell Us More About The Newsletter <span style="color: red;">*</span></label>
                      <ckeditor id="input-2" v-model="form.description" :class="{
                        'is-invalid': submitted && $v.form.description.$invalid,
                      }" :editor="editor"></ckeditor>
                      <div v-if="submitted && !$v.form.description.required" class="invalid-feedback">
                        Description is required.
                      </div>
                    </b-form-group>
                    <b-form-group id="input-group-9">
                      <label for="input-9">HTML File Content <span style="color: red;">*</span></label>
                      <ckeditor id="input-9" v-model="form.html_content" :class="{
                        'is-invalid': submitted && $v.form.html_content.$invalid,
                      }" :editor="editor"></ckeditor>
                      <div v-if="submitted && !$v.form.html_content.required" class="invalid-feedback">
                        HTML File Content is required.
                      </div>
                    </b-form-group>
                    <b-form-group class="case-img" id="input-group-10">
                      <label for="input-10">HTML Content Images [Multiple Selection] </label>
                      <b-form-file id="input-10" accept="image/*" multiple="multiple" ref="newsletter_image"
                        placeholder="Choose a file or drop it here... [Upload only 2MB file]"
                        @change="readFile($event, 'image')"></b-form-file>
                      <template v-if="
                        $route.name == 'edit-newsletter' && html_images.length > 0
                      ">
                        <img v-for="image in html_images" :key="image" :src="form.html_images_path + image"
                          width="128px" height="128px" />
                      </template>
                      <!-- <div
                      v-if="submitted && !$v.form.html_images.required"
                      class="invalid-feedback"
                    >
                      HTML Content Images is required.
                    </div> -->
                    </b-form-group>

                    <div class="row">
                      <b-form-group class="col-6" id="input-group-3">
                        <label for="input-3">Thumbnail Image [Upload Max File Size : 2MB] <span
                            style="color: red;">*</span></label>
                        <b-form-file id="input-3" accept="image/*" placeholder="Choose a file or drop it here..."
                          @change="readFile($event, 'image_name')" :class="{
                            'is-invalid': submitted && $v.image_name.$invalid,
                          }" ref="image_name"></b-form-file>
                        <template v-if="$route.name == 'edit-newsletter' && edit.image_name_url">
                          <img :src="edit.image_name_url" width="128px" height="128px" style="object-fit: contain" />
                        </template>
                        <template v-if="image_name_url">
                          <img :src="image_name_url" width="128px" height="128px" ref="image_name_url"
                            style="object-fit: contain" />
                        </template>
                        <div v-if="submitted && !$v.image_name.required" class="invalid-feedback">
                          Image is required.
                        </div>
                      </b-form-group>
                      <b-form-group class="col-6" id="input-group-4">
                        <label for="input-4">Preview Image [Upload Max File Size : 2MB] <span
                            style="color: red;">*</span></label>
                        <b-form-file id="input-4" accept="image/*" placeholder="Choose a file or drop it here..."
                          @change="readFile($event, 'preview')" :class="{
                            'is-invalid': submitted && $v.preview.$invalid,
                          }" ref="preview"></b-form-file>
                        <template v-if="$route.name == 'edit-newsletter' && edit.preview_url">
                          <img :src="edit.preview_url" width="128px" height="128px" style="object-fit: contain" />
                        </template>
                        <template v-if="preview_url">
                          <img :src="preview_url" width="128px" height="128px" ref="preview_url"
                            style="object-fit: contain" />
                        </template>
                        <div v-if="submitted && !$v.preview.required" class="invalid-feedback">Preview Image is
                          required.</div>
                      </b-form-group>
                    </div>

                    <b-form-group id="input-group-5">
                      <label for="input-5">NewsLetter Document [Upload PDF] <span style="color: red;">*</span></label>
                      <b-form-file id="input-5" ref="newsletter_item_image" accept=".pdf"
                        placeholder="Choose a file or drop it here..." @change="readFile($event, 'file_name')" :class="{
                          'is-invalid': submitted && $v.file_name.$invalid,
                        }"></b-form-file>
                      <!-- <template
                      v-if="$route.name == 'edit-newsletter' && edit.file_name_url"
                    >
                      <img :src="edit.file_name_url" width="128px" height="128px" />
                    </template> -->
                      <template v-if="$route.name == 'edit-newsletter'">
                        <a :href="edit.file_name_url" target="_blank">{{
                        file_name
                        }}</a>
                      </template>
                      <div v-if="submitted && !$v.file_name.required" class="invalid-feedback">
                        Newsletter Document is required.
                      </div>
                    </b-form-group>
                  </tab-content>
                  <!-- <tab-content title="Add Tags" icon="mdi mdi-comment" :before-change="() => validateFormOne()"> -->
                  <tab-content title="Add Tags" icon="fa fa-tag" :before-change="() => validateFormTwo()">
                    <div class="row">
                      <b-form-group class="col-6">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <label for="comm" class="mb-0">Community <span style="color: red;">*</span></label>
                          <b-form-checkbox v-model="status" button button-variant="info" size="sm">
                            <template v-if="status">Unselect All</template>
                            <template v-else>Select All</template>
                          </b-form-checkbox>
                        </div>
                        <multiselect id="comm" @search-change="fetchCommunity" v-model="form.community_selected"
                          :options="community" :multiple="true" track-by="id" label="title"
                          placeholder="Type here to search">
                          <span slot="noOptions">
                            Type here to search
                          </span>
                        </multiselect>
                        <!-- <div v-if="store && !$v.form.community_selected.required" class="invalid-feedback">Community is required.</div> -->
                      </b-form-group>
                      <b-form-group class="col-6" label="Country" label-for="input-multi">
                        <multiselect id="input-multi" v-model="form.country" :options="allCountry" :multiple="true"
                          track-by="name" label="name">
                        </multiselect>
                      </b-form-group>
                      <b-form-group label="Sub Speciality" label-for="video_sub_spec" class="col-6">
                        <multiselect id="video_sub_spec" v-model="form.sub_specialities" :options="subspecialities"
                          :multiple="true" track-by="id" label="name" placeholder="Select Sub Speciality">
                        </multiselect>
                      </b-form-group>
                      <b-form-group class="col-6" label="Knowledge Category" label-for="video_knowledge">
                        <multiselect id="video_knowledge" v-model="form.knowledge_category"
                          :options="knowledgeCategories" :multiple="true" track-by="id" label="display_name"
                          placeholder="Select Knowledge Category">
                        </multiselect>
                      </b-form-group>
                      <b-form-group label="Enter Free tags" label-for="tags-separators" class="col-12">
                        <b-form-tags input-id="tags-separators" v-model="form.tags" tag-variant="primary" tag-pills
                          separator=" " placeholder="Enter new tags separated by space and enter">
                        </b-form-tags>
                      </b-form-group>
                      <b-form-group class="col-6" style="display: none" v-model="form.ip_address"></b-form-group>
                      <b-form-group class="col-6" id="input-group-11">
                        <label for="input-2">Partner <span style="color: red;">*</span></label>
                        <b-form-select id="input-2" :options="partners" value-field="id" text-field="title"
                          v-model="form.partner_id" :class="{
                            'is-invalid': store && $v.form.partner_id.$invalid,
                          }">
                        </b-form-select>
                        <div v-if="store && !$v.form.partner_id.required" class="invalid-feedback">
                          Partner is required.
                        </div>
                      </b-form-group>
                      <b-form-group class="col-6">
                        <label for="partner_div">Partner Division <span style="color: red;">*</span></label>
                        <b-form-select id="partner_div" v-model="form.partner_division_id" :options="forums"
                          value-field="id" text-field="title" :class="{
                            'is-invalid':
                              store && $v.form.partner_division_id.$invalid,
                          }">
                        </b-form-select>
                        <!-- <multiselect
                            v-model="form.partner_division_id"
                            :options="forums"
                            :multiple="false"
                            track-by="id"
                            label="title"
                            placeholder="Select Partner Division"
                            :class="{
                            'is-invalid':
                              submitted && $v.form.partner_division_id.$error,
                          }"
                          >
                          </multiselect> -->
                        <div v-if="store && !$v.form.partner_division_id.required" class="invalid-feedback">
                          Partner Division is required.
                        </div>
                      </b-form-group>
                    </div>

                    <div class="row">
                      <b-form-group id="input-group-12" class="col-6" :class="{
                        'form-group--error': $v.form.meta_title.$invalid,
                      }">
                        <label for="input-12">Meta Title <span style="color: red;">*</span></label>
                        <b-form-input id="input-12" placeholder="Enter Meta Title" v-model="form.meta_title"
                          @input="delayTouch($v.form.meta_title)" :class="{
                            'is-invalid': store && $v.form.meta_title.$invalid,
                          }"></b-form-input>
                        <div v-if="store && !$v.form.meta_title.required" class="invalid-feedback">
                          Meta Title is required.
                        </div>
                        <div class="error" v-if="!$v.form.meta_title.maxLength">
                          Must have maximum
                          {{ $v.form.meta_title.$params.maxLength.max }}
                          characters.
                        </div>
                      </b-form-group>
                      <b-form-group class="col-6" id="input-group-14">
                        <label for="input-14">Meta Keywords <span style="color: red;">*</span></label>
                        <b-form-input id="input-14" placeholder="Enter Meta Keywords" v-model="form.meta_keywords"
                          :class="{
                            'is-invalid': store && $v.form.meta_keywords.$invalid,
                          }"></b-form-input>
                        <div v-if="store && !$v.form.meta_keywords.required" class="invalid-feedback">
                          Meta Keywords is required.
                        </div>
                      </b-form-group>
                    </div>

                    <b-form-group id="input-group-13">
                      <label for="input-13">Meta Description <span style="color: red;">*</span></label>
                      <ckeditor id="input-13" v-model="form.meta_description" :class="{
                        'is-invalid': store && $v.form.meta_description.$invalid,
                      }" :editor="editor"></ckeditor>
                      <div v-if="store && !$v.form.meta_description.required" class="invalid-feedback">
                        Meta Description is required.
                      </div>
                    </b-form-group>

                    <b-form-group id="input-group-15">
                      <div style="display: flex; gap: 10px">
                        <b-form-checkbox v-model="form.is_active">Is Active</b-form-checkbox>
                        <b-form-checkbox v-model="form.send_to_email" @input="changeSendtoEmail">Is Document sent in
                          mail</b-form-checkbox>
                        <b-form-checkbox v-model="form.is_open_newsletter">Is Open Newsletter</b-form-checkbox>
                        <b-form-checkbox v-model="form.newsletter_show">Newsletter Show</b-form-checkbox>
                        <b-form-checkbox v-model="form.newsletter_schedule">Newsletter Schedule</b-form-checkbox>
                      </div>
                    </b-form-group>

                    <template v-if="IsSendToEmail">
                      <b-form-group id="input-group-20"
                        label="News Letter Document to - Email [Upload Max File Size : 2MB]" label-for="input-20">
                        <b-form-file id="input-20" accept="image/*" placeholder="Choose a file or drop it here..."
                          @change="readFile($event, 'email_file')" ref="email_file"></b-form-file>
                        <template v-if="
                          $route.name == 'edit-newsletter' && edit.email_file_url
                        ">
                          <img :src="edit.email_file_url" width="128px" height="128px" style="object-fit: contain" />
                        </template>
                        <template v-if="email_file_url">
                          <img :src="email_file_url" width="128px" height="128px" ref="email_file_url"
                            style="object-fit: contain" />
                        </template>
                      </b-form-group>
                    </template>

                    <!-- <b-button
                    type="submit"
                    variant="primary"
                    class="mr-2"
                    v-if="$route.name == 'edit-newsletter'"
                    @click.prevent="updateData($route.params.id)"
                    >Update Data</b-button
                  >
                  <b-button
                    type="submit"
                    variant="primary"
                    class="mr-2"
                    v-else-if="$route.name == 'add-newsletter'"
                    @click.prevent="submitData"
                    >Save Data</b-button
                  > -->
                  </tab-content>
                  <!-- <tab-content title="Preview" icon="dripicons-preview">
                    <div class="d-flex justify-content-center">
                      <div class="card preview">
                        <div class="card-header bg-transparent">
                          <h5 class="text-center">Posted By {{getFormTitle(form.partner_division_id)}}</h5>
                          <img :src="`${image_name_url}`" v-if="this.$route.name == 'add-newsletter'"
                            alt="Newsletter Thumbnail" class="preview-img" />
                          <img :src="`${edit.image_name_url}`" v-else-if="this.$route.name == 'edit-newsletter'"
                            alt="Newsletter Thumbnail" class="preview-img" />
                        </div>
                        <div class="card-body pt-0">
                          <h6 class="text-center">{{ form.title }}</h6>
                          <div class="text-center description" v-html="form.description"></div>
                          <div class="text-center" style="
                              border-radius: 5px;
                            ">
                          </div>
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
                    <div class="text-center">
                      <b-form-group id="input-group-6" label="Scheduled Date" label-for="input-6">
                        <div class="d-flex justify-content-center">
                          <b-form-input style="width: 20%" v-model="form.newsletter_timestamp" id="input-6"
                            type="datetime-local" :min="disabledDates()"></b-form-input>
                        </div>
                      </b-form-group>
                    </div>
                  </tab-content> -->
                  <!-- </b-form> -->
                </form-wizard>
              </div>
            </div>
          </div>
        </div>
      </b-tab>
      <b-tab title="Indonesia">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <b-form-group id="input-group-1" class="col-6">
                    <label for="input-2">Newsletter Title</label>
                    <b-form-input id="input-2" placeholder="Enter Newsletter Title"
                      v-model="form.translation.indonesia.title">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group label="Reference Number" label-for="input-1" id="input-group-1" class="col-6">
                    <b-form-input id="input-1" placeholder="Enter Reference Number"
                      v-model="form.translation.indonesia.reference_no"></b-form-input>
                  </b-form-group>
                </div>
                <b-form-group id="input-group-2">
                  <label for="input-2">Tell Us More About The Newsletter</label>
                  <ckeditor id="input-2" v-model="form.translation.indonesia.description" :editor="editor"></ckeditor>
                </b-form-group>
                <b-form-group id="input-group-9">
                  <label for="input-9">HTML File Content</label>
                  <ckeditor id="input-9" v-model="form.translation.indonesia.html_content" :editor="editor"></ckeditor>
                </b-form-group>
                <b-form-group id="input-group-3">
                  <label for="input-indonesia">Thumbnail Image [Upload Max File Size : 2MB]</label>
                  <b-form-file id="input-indonesia" accept="image/*" placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'image_name_indonesia')" ref="image_name_indonesia"></b-form-file>
                  <template v-if="$route.name == 'edit-newsletter' && edit.image_name_indonesia_url">
                    <img :src="edit.image_name_indonesia_url" width="128px" height="128px"
                      style="object-fit: contain" />
                  </template>
                  <template v-if="image_name_indonesia_url">
                    <img :src="image_name_indonesia_url" width="128px" height="128px" ref="image_name_indonesia_url"
                      style="object-fit: contain" />
                  </template>
                </b-form-group>
                <div class="row">
                  <b-form-group id="input-group-12" class="col-6">
                    <label for="input-12">Meta Title</label>
                    <b-form-input id="input-12" placeholder="Enter Meta Title"
                      v-model="form.translation.indonesia.meta_title"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-6" id="input-group-14">
                    <label for="input-14">Meta Keywords</label>
                    <b-form-input id="input-14" placeholder="Enter Meta Keywords"
                      v-model="form.translation.indonesia.meta_keywords"></b-form-input>
                  </b-form-group>
                </div>

                <b-form-group id="input-group-13">
                  <label for="input-13">Meta Description</label>
                  <ckeditor id="input-13" v-model="form.translation.indonesia.meta_description" :editor="editor">
                  </ckeditor>
                </b-form-group>
              </div>
            </div>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
// import PageHeader from "@/components/page-header";
import MixinRequest from "../../../mixins/request";
import newsletterMixin from "../../../mixins/ModuleJs/newsletter";
import { required, maxLength } from "vuelidate/lib/validators";
import { FormWizard, TabContent } from "vue-form-wizard";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Multiselect from "vue-multiselect";
const touchMap = new WeakMap();

export default {
  mixins: [MixinRequest, newsletterMixin],
  data() {
    return {
      submitted: false,
      store: false,
      title1: "Add Newsletter",
      title2: "Edit Newsletter",
      items: [
        {
          text: "Back",
          href: "/newsletter",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
    };
  },
  components: {
    Layout,
    // PageHeader,
    ckeditor: CKEditor.component,
    FormWizard,
    TabContent,
    Multiselect
  },
  validations: {
    form: {
      title: { required, maxLength: maxLength(190) },
      partner_id: { required },
      partner_division_id: { required },
      description: { required },
      meta_title: { required, maxLength: maxLength(250) },
      meta_description: { required },
      meta_keywords: { required },
      html_content: { required },
      // html_images: { required },
    },
    file_name: { required },
    preview: { required },
    image_name: { required },
  },
  methods: {
    getFormTitle(id) {
      let res = this.forums.filter(f => f.id == id);
      if (res.length > 0) {
        return res[0].title;
      }
      return null;
    },
    validateFormOne() {
      this.submitted = true;
      if (this.$v.form.title.$invalid || this.$v.form.description.$invalid || this.$v.form.html_content.$invalid || this.$v.image_name.$invalid || this.$v.preview.$invalid || this.$v.file_name.$invalid) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: 'error',
          title: 'Please Fill The Required Fields'
        });
        return false;
      }
      return true;
    },
    validateFormTwo() {
      this.store = true;
      if (this.$v.form.partner_id.$invalid || this.$v.form.partner_division_id.$invalid || this.$v.form.meta_title.$invalid || this.$v.form.meta_description.$invalid || this.$v.form.meta_keywords.$invalid) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: 'error',
          title: 'Please Fill The Required Fields'
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
    disabledDates() {
      return new Date().toISOString().slice(0, 16);
    },
  }
};
</script>
<style>
.wizard-icon-circle.checked {
  border: none !important;
}

.vue-form-wizard .wizard-icon-circle .wizard-icon-container {
  border-radius: 50% !important;
}
</style>
