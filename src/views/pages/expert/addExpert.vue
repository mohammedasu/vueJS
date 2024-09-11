<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items" /> -->
    <template v-if="this.$route.name == 'add-expert'">
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
              ref="expert"
              @submit.prevent="
                $route.name == 'edit-expert'
                  ? updateData($route.params.id)
                  : $route.name == 'add-expert'
                  ? submitData
                  : ''
              "
            > -->
            <form-wizard
              @on-complete="submitData"
              color="#556ee6"
              enctype="multipart/form-data"
              ref="expert"
              :finishButtonText="this.$route.name == 'add-expert' ? 'Save Data' : 'Update Data'"
              back-button-text="Go Back!" 
              next-button-text="Go Next!"
              >
                <tab-content title="Expert Details" icon="mdi mdi-account-details" :before-change="() => validateFormOne()">
                  <div class="row">
                    <b-form-group
                      class="col-6"
                      :class="{ 'form-group--error': $v.form.name.$invalid }"
                    >
                      <label for="input-2"
                        >Expert Name <span style="color: red">*</span></label
                      >
                      <b-form-input
                        id="input-2"
                        v-model="form.name"
                        placeholder="Enter Expert Name"
                        :class="{
                          'is-invalid': submitted && $v.form.name.$invalid,
                        }"
                        @input="delayTouch($v.form.name)"
                      ></b-form-input>
                      <div
                        v-if="submitted && !$v.form.name.required"
                        class="invalid-feedback"
                      >
                        Expert Name is required.
                      </div>
                      <div class="error" v-if="!$v.form.name.maxLength">
                        Must have maximum
                        {{ $v.form.name.$params.maxLength.max }} characters.
                      </div>
                    </b-form-group>
                    <b-form-group
                      class="col-6"
                      id="input-group-8"
                      label="Thumbnail URL"
                      label-for="input-8"
                      :class="{
                        'form-group--error': $v.form.thumbnail_url.$error,
                      }"
                    >
                      <b-form-input
                        id="input-8"
                        v-model="form.thumbnail_url"
                        placeholder="Enter Thumbnail URL"
                        @input="delayTouch($v.form.thumbnail_url)"
                      ></b-form-input>
                      <div class="error" v-if="!$v.form.thumbnail_url.maxLength">
                        Must have maximum
                        {{ $v.form.thumbnail_url.$params.maxLength.max }}
                        characters.
                      </div>
                    </b-form-group>
                  </div>

                  <div class="row">
                    <b-form-group id="input-group-3" class="col-4">
                      <label for="input-1">Email</label>
                      <b-form-input
                        id="input-1"
                        v-model="form.email"
                        placeholder="Enter Email"
                      ></b-form-input>
                      <div
                        v-if="!$v.form.email.email"
                        class="error"
                      >
                        <span
                          >Please Enter Valid Email.</span
                        >
                      </div>
                    </b-form-group>
                    <b-form-group
                      class="col-4"
                      id="input-group-4"
                      label="Designation"
                      label-for="input-4"
                      :class="{
                        'form-group--error': $v.form.designation.$error,
                      }"
                    >
                      <b-form-input
                        @input="delayTouch($v.form.designation)"
                        id="input-4"
                        v-model="form.designation"
                        placeholder="Enter Designation"
                      ></b-form-input>
                      <div class="error" v-if="!$v.form.designation.maxLength">
                        Must have maximum
                        {{ $v.form.designation.$params.maxLength.max }} characters.
                      </div>
                    </b-form-group>
                    <b-form-group
                      id="input-group-5"
                      label="Working At"
                      label-for="input-5"
                      class="col-4"
                    >
                      <b-form-input
                        id="input-5"
                        v-model="form.working_at"
                        placeholder="Enter Working At"
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <b-form-group
                      id="input-group-6"
                      label="Area of Interest"
                      label-for="input-6"
                    >
                      <b-form-textarea
                        id="input-6"
                        v-model="form.areas_of_interest"
                        rows="3"
                        max-rows="6"
                      >
                      </b-form-textarea>
                  </b-form-group>

                  <b-form-group
                    id="input-group-7"
                    label="Tell Us More About The Expert"
                    label-for="input-7"
                  >
                    <ckeditor
                      id="input-7"
                      v-model="form.description"
                      :editor="editor"
                    ></ckeditor>
                  </b-form-group>
                  <b-form-group
                    id="input-group-20"
                    label="Thumbnail Image [Upload Max File Size : 2MB]"
                    label-for="input-20"
                  >
                    <b-form-file
                      id="input-20"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'image_name')"
                      ref="image_name"
                    ></b-form-file>
                    <template
                      v-if="$route.name == 'edit-expert' && edit.image_name_url"
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
                </tab-content>

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
                      <multiselect
                        @search-change="fetchCommunity"
                        id="comm"
                        v-model="form.community_selected"
                        :options="community"
                        :multiple="true"
                        track-by="id"
                        label="title"
                        placeholder="Type here to search"
                        :class="{
                          'is-invalid':
                            store && $v.form.community_selected.$invalid,
                        }"
                      >
                        <span slot="noOptions">
                          Type here to search
                        </span>
                      </multiselect>
                      <div
                        v-if="store && !$v.form.community_selected.required"
                        class="invalid-feedback"
                      >
                        Community is required.
                      </div>
                    </b-form-group>
                    <b-form-group label="Sub Speciality" label-for="subspe" class="col-6">
                      <multiselect
                        id="subspe"
                        v-model="form.sub_specialities"
                        :options="subspeciality"
                        :multiple="true"
                        track-by="id"
                        label="name"
                      >
                        <span slot="noOptions">
                          Type here to search
                        </span>
                      </multiselect>
                    </b-form-group>
                  </div>
                  <div class="row">
                    <b-form-group class="col-4">
                    <label for="natio">Nationality <span style="color: red">*</span></label>
                    <b-form-select
                      id="natio"
                      v-model="form.nationality"
                      :options="country"
                      value-field="name"
                      text-field="name"
                      :class="{
                        'is-invalid': store && $v.form.nationality.$invalid,
                      }"
                    >
                    </b-form-select>
                    <div
                      v-if="store && !$v.form.nationality.required"
                      class="invalid-feedback"
                    >
                      Nationality is required.
                    </div>
                  </b-form-group>
                    <b-form-group
                      class="col-4"
                      id="input-group-9"
                      label="Meta Title"
                      label-for="input-9"
                      :class="{
                        'form-group--error': $v.form.meta_title.$error,
                      }"
                    >
                      <b-form-input
                        id="input-9"
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
                      class="col-4"
                      id="input-group-11"
                      label="Meta Keywords"
                      label-for="input-11"
                      :class="{
                        'form-group--error':
                          $v.form.meta_keywords.$error,
                      }"
                    >
                      <b-form-input
                        id="input-11"
                        v-model="form.meta_keywords"
                        placeholder="Enter Meta Keywords"
                        @input="
                          delayTouch($v.form.meta_keywords)
                        "
                      ></b-form-input>
                      <div
                        class="error"
                        v-if="!$v.form.meta_keywords.maxLength"
                      >
                        Must have maximum
                        {{
                          $v.form.meta_keywords.$params
                            .maxLength.max
                        }}
                        characters.
                      </div>
                    </b-form-group>
                  </div>
                  <b-form-group
                    id="input-group-10"
                    label="Meta Description"
                    label-for="input-10"
                    :class="{
                      'form-group--error': $v.form.meta_description.$error,
                    }"
                  >
                    <ckeditor
                      id="input-10"
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
                  <b-form-group id="input-group-13">
                    <div style="display: flex; gap: 10px">
                      <b-form-checkbox v-model="form.show_in_home"
                        >Show in home page</b-form-checkbox
                      >
                      <b-form-checkbox v-model="form.visible_in_cases"
                        >Visible in cases</b-form-checkbox
                      >
                    </div>
                  </b-form-group>
                </tab-content>

                <!-- <tab-content title="Preview" icon="dripicons-preview">
                  <div class="d-flex justify-content-center">
                    <div class="card preview">
                      <div class="card-header bg-transparent">
                         <img
                          :src="`${image_name_url}`"
                          v-if="this.$route.name == 'add-expert'"
                          alt="Expert Thumbnail"
                          class="preview-img"
                        />
                        <img
                          :src="`${edit.image_name_url}`"
                          v-else-if="this.$route.name == 'edit-expert'"
                          alt="Expert Thumbnail"
                          class="preview-img"                
                        />
                      </div>
                      <div class="card-body pt-0">
                        <h6 class="text-center">{{ form.name }}</h6>
                        <div class="text-center" v-html="form.description"></div>
                        <div
                          class="text-center"
                          style="
                            border-radius: 5px;
                          "
                        >
                         <b-button class="preview-tags btn-sm" variant="outline-primary" v-for="(c,ci) in form.community_selected.map(c => c.title)" :key="ci">#{{c}}</b-button>
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
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import expertMixin from "../../../mixins/ModuleJs/expert";
import Multiselect from "vue-multiselect";
import { required, email, maxLength } from "vuelidate/lib/validators";
import { FormWizard, TabContent } from "vue-form-wizard";

const touchMap = new WeakMap();

export default {
  mixins: [MixinRequest, expertMixin],
  data() {
    return {
      submitted: false,
      store: false,
      title1: "Add Expert",
      title2: "Edit Expert",
      items: [
        {
          text: "List",
          href: "/expert",
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
      community_selected: { required },
      name: { required, maxLength: maxLength(250) },
      nationality: { required },
      email: { email },
      designation: { maxLength: maxLength(250) },
      thumbnail_url: { maxLength: maxLength(250) },
      meta_title: { maxLength: maxLength(190) },
      meta_description: { maxLength: maxLength(400) },
      meta_keywords: { maxLength: maxLength(250) },
    },
  },
  components: {
    PageHeader,
    Layout,
    Multiselect,
    ckeditor: CKEditor.component,
    FormWizard,
    TabContent,
  },
  methods: {
    validateFormOne() {
      this.submitted = true;
      if (this.$v.form.name.$invalid) {
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
      if (this.$v.form.community_selected.$invalid || this.$v.form.nationality.$invalid) {
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

<style>
.autocomplete__box {
    background: #f1f9ff !important;
    border: none !important;
    padding: 0 !important;
    gap: 5px;
}
.autocomplete__box .autocomplete__icon {
    height: 14px;
    width: 14px;
}
.autocomplete__box .autocomplete__icon.autocomplete--clear{
    height: 14px;
    width: 14px;
}
.autocomplete__box .autocomplete__inputs {
    padding: 0 !important;
}
.autocomplete__box .autocomplete__inputs input {
    border-bottom: 2px solid #8a8a8a;
}
.autocomplete__box .autocomplete__inputs input:focus {
    border-bottom: 2px solid #0cbfd7;
    transition: all .2s;
}
</style>

