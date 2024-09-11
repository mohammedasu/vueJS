<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-podcast'">
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
              ref="podcast"
              @submit.prevent="
                $route.name == 'edit-podcast'
                  ? updateData($route.params.id)
                  : $route.name == 'add-podcast'
                  ? submitData
                  : ''
              "
            > -->
            <form-wizard
              @on-complete="submitData"
              color="#556ee6"
              enctype="multipart/form-data"
              ref="podcast"
              :finishButtonText="this.$route.name == 'add-podcast' ? 'Save Data' : 'Update Data'"
              back-button-text="Go Back!" 
              next-button-text="Go Next!"
              >
                <tab-content title="Podcast Details" icon="mdi mdi-account-details" :before-change="() => validateFormOne()">
                  <div class="row">
                    <b-form-group
                      class="col-6"
                      id="input-group-1"
                      :class="{
                        'form-group--error': $v.form.title.$error,
                      }"
                    >
                      <label for="input-1"
                        >Podcast Title <span style="color: red">*</span></label
                      >
                      <b-form-input
                        id="input-1"
                        v-model="form.title"
                        @input="delayTouch($v.form.title)"
                        placeholder="Enter Podcast Title"
                        :class="{
                          'is-invalid': submitted && $v.form.title.$invalid,
                        }"
                      ></b-form-input>
                      <div
                        v-if="submitted && !$v.form.title.required"
                        class="invalid-feedback"
                      >
                        Podcast Title is required.
                      </div>
                      <div class="error" v-if="!$v.form.title.maxLength">
                        Must have maximum
                        {{ $v.form.title.$params.maxLength.max }}
                        characters.
                      </div>
                    </b-form-group>
                    <b-form-group
                      id="input-group-3"
                      class="col-6"
                      :class="{
                        'form-group--error': $v.form.audio_link.$invalid,
                      }"
                    >
                      <label for="input-3"
                        >Audio URL <span style="color: red">*</span></label
                      >
                      <b-form-input
                        id="input-3"
                        v-model="form.audio_link"
                        @input="delayTouch($v.form.audio_link)"
                        placeholder="Enter Audio URL [Eg: 663251034]"
                        :class="{
                          'is-invalid': submitted && $v.form.audio_link.$invalid,
                        }"
                      ></b-form-input>
                      <div
                        v-if="submitted && !$v.form.audio_link.required"
                        class="invalid-feedback"
                      >
                        Audio URL is required.
                      </div>
                      <div class="error" v-if="!$v.form.audio_link.maxLength">
                        Must have maximum
                        {{ $v.form.audio_link.$params.maxLength.max }}
                        characters.
                      </div>
                      <!-- <span class="error" v-if="submitted && !$v.form.audio_link.url">This value should be a valid url.</span> -->
                    </b-form-group>
                  </div>
                 
                  <b-form-group
                    id="input-group-4"
                    label="Tell Us More About Podcast"
                    label-for="input-4"
                  >
                    <ckeditor
                      id="input-4"
                      :editor="editor"
                      v-model="form.description"
                    ></ckeditor>
                  </b-form-group>
                 
                  <b-form-group
                    id="input-group-2"
                    label="Thumbnail Image [Upload Max File Size : 2MB]"
                    label-for="input-2"
                  >
                    <b-form-file
                      id="input-2"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'image_name')"
                      ref="image_name"
                    ></b-form-file>
                    <template
                      v-if="$route.name == 'edit-podcast' && edit.image_name_url"
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
                      <label for="comm"
                        >Community <span style="color: red">*</span></label
                      >
                      <b-form-select
                        id="comm"
                        v-model="form.community_id"
                        :options="community"
                        value-field="id"
                        text-field="title"
                        :class="{
                          'is-invalid': store && $v.form.community_id.$invalid,
                        }"
                      >
                      </b-form-select>
                      <!-- <multiselect
                          v-model="form.community_id"
                          :options="community"
                          :multiple="false"
                          track-by="id"
                          label="title"
                          placeholder="Select Community"
                          :class="{
                          'is-invalid': submitted && $v.form.community_id.$error,
                        }"
                        >
                        </multiselect> -->
                      <div
                        v-if="store && !$v.form.community_id.required"
                        class="invalid-feedback"
                      >
                        Community is required.
                      </div>
                    </b-form-group>
                    <b-form-group class="col-6">
                      <label for="input-2"
                        >Partner <span style="color: red">*</span></label
                      >
                      <b-form-select
                        id="in-partner"
                        v-model="form.partner_id"
                        :options="partner"
                        value-field="id"
                        text-field="title"
                        :class="{
                          'is-invalid': store && $v.form.partner_id.$invalid,
                        }"
                      >
                      </b-form-select>
                      <!-- <multiselect
                          v-model="form.partner_id"
                          :options="partner"
                          :multiple="false"
                          track-by="id"
                          label="title"
                          placeholder="Select Partner"
                          :class="{
                          'is-invalid': submitted && $v.form.partner_id.$error,
                        }"
                        >
                        </multiselect> -->
                      <div
                        v-if="store && !$v.form.partner_id.required"
                        class="invalid-feedback"
                      >
                        Partner is required.
                      </div>
                    </b-form-group>
                  </div>

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
                      class="col-6"
                      id="input-group-7"
                      label="Meta Keywords"
                      label-for="input-7"
                      :class="{
                        'form-group--error': $v.form.meta_keywords.$error,
                      }"
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
                      {{ $v.form.meta_description.$params.maxLength.max }}
                      characters.
                    </div>
                  </b-form-group>
                  <b-form-group id="example-date">
                    <label for="date">Date <span style="color: red">*</span></label>
                      <b-form-input
                        id="date"
                        v-model="form.date"
                        :min="disabledDates()"
                        type="date"
                        :class="{
                          'is-invalid': form3 && $v.form.date.$invalid,
                        }"
                      ></b-form-input>
                    <div
                      v-if="form3 && !$v.form.date.required"
                      class="invalid-feedback"
                    >
                      Date is required.
                    </div>
                  </b-form-group>
                </tab-content>

                <!-- <tab-content title="Preview" icon="dripicons-preview">
                  <div class="d-flex justify-content-center">
                    <div class="card preview">
                      <div class="card-header bg-transparent">
                         <img
                          :src="`${image_name_url}`"
                          v-if="this.$route.name == 'add-podcast'"
                          alt="Podcast Thumbnail"
                          class="preview-img"
                        />
                        <img
                          :src="`${edit.image_name_url}`"
                          v-else-if="this.$route.name == 'edit-podcast'"
                          alt="Podcast Thumbnail"
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
                          <b-button class="preview-tags btn-sm" variant="outline-primary">{{form.community_id}}</b-button>
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
                v-if="$route.name == 'edit-podcast'"
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-podcast'"
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
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import podcastMixin from "../../../mixins/ModuleJs/podcast";
import { required, maxLength } from "vuelidate/lib/validators";
import { FormWizard, TabContent } from "vue-form-wizard";

const touchMap = new WeakMap();

export default {
  mixins: [MixinRequest, podcastMixin],
  data() {
    return {
      submitted: false,
      store: false,
      form3: false,
      title1: "Add Podcast",
      title2: "Edit Podcast",
      items: [
        {
          text: "Back",
          href: "/podcast",
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
    TabContent,
  },
  validations: {
    form: {
      partner_id: { required },
      community_id: { required },
      title: { required, maxLength: maxLength(400) },
      audio_link: { required, maxLength: maxLength(250) },
      date: { required },
      meta_title: { maxLength: maxLength(190) },
      meta_description: { maxLength: maxLength(400) },
      meta_keywords: { maxLength: maxLength(250) },
    },
  },
  methods: {
    validateFormOne() {
      this.submitted = true;
      if (this.$v.form.title.$invalid || this.$v.form.audio_link.$invalid) {
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
      if (this.$v.form.community_id.$invalid || this.$v.form.partner_id.$invalid || this.$v.form.date.$invalid) {
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
    disabledDates() {
      return new Date().toISOString().slice(0, 10); 
    },
  },
};
</script>
