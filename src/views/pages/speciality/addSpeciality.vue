<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-speciality'">
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
              ref="speciality"
              @submit.prevent="
                $route.name == 'edit-speciality'
                  ? updateData($route.params.id)
                  : $route.name == 'add-speciality'
                  ? submitData
                  : ''
              "
            > -->
            <form-wizard
              @on-complete="submitData"
              color="#556ee6"
              enctype="multipart/form-data"
              ref="speciality"
              :finishButtonText="this.$route.name == 'add-speciality' ? 'Save Data' : 'Update Data'"
              back-button-text="Go Back!" 
              next-button-text="Go Next!"
              >
                <tab-content title="Speciality Details" icon="mdi mdi-account-details" :before-change="() => validateFormOne()">
                  <b-form-group id="input-group-1">
                    <label for="input-1"
                      >Speciality Title <span style="color: red">*</span></label
                    >
                    <b-form-input
                      id="input-1"
                      v-model="form.title"
                      placeholder="Enter Speciality Title"
                      :class="{
                        'is-invalid': submitted && $v.form.title.$invalid,
                      }"
                    ></b-form-input>
                    <div
                      v-if="submitted && !$v.form.title.required"
                      class="invalid-feedback"
                    >
                      Speciality Title is required.
                    </div>
                  </b-form-group>
                  <b-form-group
                    id="input-group-3"
                    label="Tell Us More About Speciality"
                    label-for="input-3"
                    :class="{
                      'form-group--error': $v.form.description.$error,
                    }"
                  >
                    <ckeditor
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
                </tab-content>

                <tab-content title="Add Tags" icon="fa fa-tag" :before-change="() => validateFormTwo()">
                  <div class="row">
                    <b-form-group
                      class="col-6"
                      id="input-group-4"
                      label="Member Type"
                      label-for="input-4"
                      :class="{
                        'form-group--error': $v.form.member_type.$error,
                      }"
                    >
                      <b-form-input
                        id="input-4"
                        v-model="form.member_type"
                        placeholder="Enter Member Type"
                        @input="delayTouch($v.form.member_type)"
                      ></b-form-input>
                      <div class="error" v-if="!$v.form.member_type.maxLength">
                        Must have maximum
                        {{ $v.form.member_type.$params.maxLength.max }}
                        characters.
                      </div>
                    </b-form-group>
                    <b-form-group id="input-group-comm" class="col-6">
                      <label for="input-comm"
                        >Community <span style="color: red">*</span></label
                      >
                      <!-- <b-form-select
                        v-model="form.community_id"
                        id="input-comm"
                        :class="{
                          'is-invalid': store && $v.form.community_id.$invalid,
                        }"
                      >
                        <b-form-select-option
                          v-for="community in community"
                          :key="community.id"
                          :value="community.id"
                          >{{ community.title }}</b-form-select-option
                        >
                      </b-form-select> -->
                      <b-form-select
                        id="input-comm"
                        v-model="form.community_id"
                        :options="activeCommunity"
                        value-field="id"
                        text-field="title"
                        :class="{
                          'is-invalid': store && $v.form.community_id.$invalid,
                        }"
                      >
                      </b-form-select>
                      <div
                        v-if="store && !$v.form.community_id.required"
                        class="invalid-feedback"
                      >
                        Community is required.
                      </div>
                    </b-form-group>
                  </div>

                  <div class="row">
                    <b-form-group label-for="input-com" label="Community Mapping" class="col-6">
                      <multiselect
                        @search-change="fetchCommunity"
                        id="input-com"
                        v-model="form.communityMap"
                        :options="community"
                        :multiple="true"
                        track-by="id"
                        label="title"
                      >
                        <span slot="noOptions">
                          Type here to search
                        </span>
                      </multiselect>
                    </b-form-group>
                    <b-form-group class="col-6">
                      <label for="input-spec"
                        >Sub Speciality Mapping
                        <span style="color: red">*</span></label
                      >
                      <multiselect
                        @search-change="fetchSubSpeciality"
                        :class="{
                          'is-invalid': store && $v.form.subSpeciality.$invalid,
                        }"
                        id="input-spec"
                        v-model="form.subSpeciality"
                        :options="subspeciality"
                        :multiple="true"
                        track-by="id"
                        label="name"
                      >
                        <span slot="noOptions">
                          Type here to search
                        </span>
                      </multiselect>
                      <div
                        v-if="store && !$v.form.subSpeciality.required"
                        class="invalid-feedback"
                      >
                        Sub Speciality Mapping is required.
                      </div>
                    </b-form-group>
                  </div>
              
                  <b-form-group label-for="input-regi">
                    <b-form-checkbox
                      id="input-regi"
                      v-model="form.is_available_for_registration"
                      >Is Available for registration</b-form-checkbox
                    >
                  </b-form-group>

                </tab-content>  

                <!-- <tab-content title="Preview" icon="dripicons-preview">
                  <div class="d-flex justify-content-center">
                    <div class="card preview">
                      <div class="card-body">
                        <h6 class="text-center">{{ form.title }}</h6>
                        <div class="text-center" v-html="form.description"></div>
                        <div
                          class="text-center"
                          style="
                            border-radius: 5px;
                          "
                        >
                          <b-button class="preview-tags btn-sm" variant="outline-primary" v-for="(c,ci) in form.communityMap.map(c => c.title)" :key="ci">#{{c}}</b-button>
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
import specialityMixin from "../../../mixins/ModuleJs/speciality";
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
      editor: ClassicEditor,
      title1: "Add Speciality",
      title2: "Edit Speciality",
      items: [
        {
          text: "Back",
          href: "/speciality",
        },
        {
          text: "Data",
        },
      ],
    };
  },
  mixins: [MixinRequest, specialityMixin],
  components: {
    Layout,
    PageHeader,
    ckeditor: CKEditor.component,
    Multiselect,
    FormWizard,
    TabContent
  },
  validations: {
    form: {
      title: { required },
      subSpeciality: { required },
      community_id: { required },
      member_type: { maxLength: maxLength(250) },
      description: { maxLength: maxLength(250) },
    },
  },
  methods: {
    validateFormOne() {
      this.submitted = true;
      if (this.$v.form.title.$invalid) {
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
      if (this.$v.form.subSpeciality.$invalid || this.$v.form.community_id.$invalidd) {
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
