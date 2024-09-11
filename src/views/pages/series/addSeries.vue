<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-series'">
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
              ref="series"
              @submit.prevent="
                $route.name == 'edit-series'
                  ? updateData($route.params.id)
                  : $route.name == 'add-series'
                  ? submitData
                  : ''
              "
            > -->
            <form-wizard
              @on-complete="submitData"
              color="#556ee6"
              enctype="multipart/form-data"
              ref="series"
              :finishButtonText="this.$route.name == 'add-series' ? 'Save Data' : 'Update Data'"
              back-button-text="Go Back!" 
              next-button-text="Go Next!"
              >

              <tab-content title="Series Details" icon="mdi mdi-account-details" :before-change="() => validateFormOne()">
                <b-form-group
                  :class="{
                    'form-group--error': $v.form.title.$error,
                  }"
                >
                  <label for="title"
                    >Series Title <span style="color: red">*</span></label
                  >
                  <b-form-input
                    id="title"
                    v-model="form.title"
                    placeholder="Enter Series Title"
                    @input="delayTouch($v.form.title)"
                    :class="{
                      'is-invalid': submitted && $v.form.title.$invalid,
                    }"
                  ></b-form-input>
                  <div
                    v-if="submitted && !$v.form.title.required"
                    class="invalid-feedback"
                  >
                    Series Title is required.
                  </div>
                  <div class="error" v-if="!$v.form.title.maxLength">
                    Must have maximum
                    {{ $v.form.title.$params.maxLength.max }}
                    characters.
                  </div>
                </b-form-group>
                <b-form-group>
                  <label for="de"
                    >Tell Us More About The Series <span style="color: red">*</span></label
                  >
                  <ckeditor
                    id="de"
                    :editor="editor"
                    v-model="form.description"
                    :class="{
                      'is-invalid': submitted && $v.form.description.$invalid,
                    }"
                  ></ckeditor>
                  <div
                    v-if="submitted && !$v.form.title.required"
                    class="invalid-feedback"
                  >
                    Description is required.
                  </div>
                </b-form-group>
                <b-form-group label="Thumbnail Image [Upload Max File Size : 2MB]" label-for="im">
                  <b-form-file
                    id="im"
                    accept="image/*"
                    placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'image_name')"
                    ref="image_name"
                  ></b-form-file>
                  <template
                    v-if="$route.name == 'edit-series' && edit.image_name_url"
                  >
                    <img
                      :src="edit.image_name_url"
                      width="128px"
                      height="128px"
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
              </tab-content>

              <tab-content title="Add Tags" icon="fa fa-tag" :before-change="() => validateFormTwo()">
                <div class="row">
                  <b-form-group class="col-6">
                    <label for="comm"
                      >Community <span style="color: red">*</span></label
                    >
                    <multiselect
                      id="comm"
                      v-model="form.community_selected"
                      :options="community"
                      :multiple="true"
                      :taggable="true"
                      track-by="id"
                      label="title"
                      placeholder="Select Community"
                      @click="fetchCommunity"
                      :class="{
                        'is-invalid':
                          store && $v.form.community_selected.$invalid,
                      }"
                    >
                    </multiselect>
                    <div
                      v-if="store && !$v.form.community_selected.required"
                      class="invalid-feedback"
                    >
                      Community is required.
                    </div>
                  </b-form-group>
                  <b-form-group label="Expert" label-for="exp" class="col-6">
                    <multiselect
                      id="exp"
                      v-model="form.expert_selected"
                      :options="expert"
                      :multiple="true"
                      track-by="id"
                      label="name"
                      :preselect-first="true"
                      placeholder="Select Expert"
                    >
                    </multiselect>
                  </b-form-group>
                </div>

                <div class="row">
                  <b-form-group class="col-6">
                    <label for="video"
                      >Video <span style="color: red">*</span></label
                    >
                    <multiselect
                      id="video"
                      v-model="form.video_selected"
                      :options="videos"
                      :multiple="true"
                      track-by="id"
                      label="title"
                      :preselect-first="true"
                      placeholder="Select Video"
                      :class="{
                        'is-invalid': store && $v.form.video_selected.$invalid,
                      }"
                    >
                    </multiselect>
                    <div
                      v-if="store && !$v.form.video_selected.required"
                      class="invalid-feedback"
                    >
                      Video is required.
                    </div>
                  </b-form-group>
                  <b-form-group label="Knowledge Category" label-for="know" class="col-6">
                    <multiselect
                      id="know"
                      v-model="form.knowledge_categories"
                      :options="knowledgeCategory"
                      :multiple="true"
                      track-by="id"
                      label="display_name"
                      :preselect-first="true"
                      placeholder="Select Knowledge Category"
                    >
                    </multiselect>
                  </b-form-group>
                </div>

                <div class="row">
                  <b-form-group class="col-6">
                    <label for="part1"
                      >Partner <span style="color: red">*</span></label
                    >
                    <b-form-select
                      id="part1"
                      v-model="form.partner_id"
                      :options="partner"
                      value-field="id"
                      text-field="title"
                      :class="{
                        'is-invalid': store && $v.form.partner_id.$invalid,
                      }"
                    >
                    </b-form-select>
                    <div
                      v-if="store && !$v.form.partner_id.required"
                      class="invalid-feedback"
                    >
                      Partner is required.
                    </div>
                  </b-form-group>
                  <b-form-group class="col-6">
                    <label for="part"
                      >Partner Division <span style="color: red">*</span></label
                    >
                    <b-form-select
                      id="part"
                      v-model="form.partner_division_id"
                      :options="forum"
                      value-field="id"
                      text-field="title"
                      :class="{
                        'is-invalid':
                          store && $v.form.partner_division_id.$invalid,
                      }"
                    >
                    </b-form-select>
                    <div
                      v-if="store && !$v.form.partner_division_id.required"
                      class="invalid-feedback"
                    >
                      Partner Division is required.
                    </div>
                  </b-form-group>
                </div>     
               
                <div class="row">
                  <b-form-group
                    class="col-6"
                    label="Meta Title"
                    label-for="title"
                    :class="{
                      'form-group--error': $v.form.meta_title.$error,
                    }"
                  >
                    <b-form-input
                      id="title"
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
                    label-for="key"
                    :class="{
                      'form-group--error': $v.form.meta_keywords.$error,
                    }"
                  >
                    <b-form-input
                      id="key"
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
                  id="input-group-20"
                  label="Meta Description"
                  label-for="input-20"
                  :class="{
                    'form-group--error': $v.form.meta_desc.$error,
                  }"
                >
                  <ckeditor
                    id="input-20"
                    v-model="form.meta_desc"
                    @input="delayTouch($v.form.meta_desc)"
                    :editor="editor"
                  ></ckeditor>
                  <div class="error" v-if="!$v.form.meta_desc.maxLength">
                    Must have maximum
                    {{ $v.form.meta_desc.$params.maxLength.max }}
                    characters.
                  </div>
                </b-form-group>

                <b-form-group>
                  <div style="display: flex; gap: 10px">
                    <b-form-checkbox v-model="form.survey_fail"
                      >If Survey Show Failed
                    </b-form-checkbox>
                  </div>
                </b-form-group>
              </tab-content>

              <!-- <tab-content title="Preview" icon="dripicons-preview">
                  <div class="d-flex justify-content-center">
                    <div class="card preview">
                      <div class="card-header bg-transparent">
                        <h5 class="text-center">Posted By {{getFormTitle(form.partner_division_id)}}</h5>
                        <img
                          :src="`${image_name_url}`"
                          v-if="this.$route.name == 'add-series'"
                          alt="Series Thumbnail"
                          class="preview-img"
                        />
                        <img
                          :src="`${edit.image_name_url}`"
                          v-else-if="this.$route.name == 'edit-series'"
                          alt="Series Thumbnail"
                          class="preview-img"
                        />
                      </div>
                      <div class="card-body pt-0">
                        <h6 class="text-center">{{ form.title }}</h6>
                        <div class="text-center" v-html="form.description"></div>
                        <div
                          class="text-center"
                          style="
                            border-radius: 5px;
                          "
                        >
                          <b-button class="preview-tags btn-sm" variant="outline-primary" v-for="(c,ci) in form.community_selected.map(c => c.title)" :key="ci">#{{c}}</b-button>                        
                        </div>
                        <div class="experts">
                          <div class="expert-card" v-for="(e, ei) in form.expert_selected" :key="ei">
                            <img class="expert-img" :src="`${e.image_name}`" alt="Expert Image" />
                            <h6>{{e.name}}</h6>
                          </div>
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
                </tab-content> -->

            </form-wizard>

              <!-- <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-series'"
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-series'"
                @click.prevent="submitData"
                >Save Data</b-button
              > -->
            <!-- </b-form> -->
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
import seriesMixin from "../../../mixins/ModuleJs/series";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Multiselect from "vue-multiselect";
import { required, maxLength } from "vuelidate/lib/validators";
import { FormWizard, TabContent } from "vue-form-wizard";

const touchMap = new WeakMap();

export default {
  data() {
    return {
      submitted: false,
      store: false,
      title1: "Add Series",
      title2: "Edit Series",
      items: [
        {
          text: "Back",
          href: "/series",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
    };
  },
  mixins: [MixinRequest, seriesMixin],
  components: {
    Layout,
    PageHeader,
    ckeditor: CKEditor.component,
    Multiselect,
    FormWizard,
    TabContent,
  },
  validations: {
    form: {
      title: { required, maxLength: maxLength(400) },
      description: { required },
      video_selected: { required },
      community_selected: { required },
      partner_id: { required },
      partner_division_id: { required },
      meta_title: { maxLength: maxLength(250) },
      meta_desc: { maxLength: maxLength(250) },
      meta_keywords: { maxLength: maxLength(250) },
    },
  },
  methods: {
    validateFormOne() {
      this.submitted = true;
      if (this.$v.form.title.$invalid || this.$v.form.description.$invalid) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Please Fill The Required Fields"
        });
      return false;
      }
      return true;
    },
    validateFormTwo() {
      this.store = true;
      if (this.$v.form.video_selected.$invalid || this.$v.form.community_selected.$invalid || this.$v.form.partner_id.$invalid || this.$v.form.partner_division_id.$invalid) {
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
    getFormTitle(id) {
      let res = this.forum.filter(f => f.id == id);
      if(res.length > 0){
        return res[0].title;
      }
      return null;
    },
  },
};
</script>
