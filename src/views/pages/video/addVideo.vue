<template>
  <Layout>
    <b-tabs>
      <b-tab title="English">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <form-wizard
                  @on-complete="submitData"
                  color="#556ee6"
                  enctype="multipart/form-data"
                  ref="video"
                  :finishButtonText="this.$route.name == 'add-video' ? 'Save Data' : 'Update Data'"
                  back-button-text="Go Back!" 
                  next-button-text="Go Next!"
                >
                  <tab-content title="Video Details" icon="mdi mdi-account-details" :before-change="() => validateFormOne()">
                    <div class="row">
                      <b-form-group class="col-6">
                        <label for="video_title">Video Title <span style="color: red">*</span></label>
                        <b-form-input
                          id="video_title"
                          v-model="form.title"
                          @keyup.prevent="slugify"
                          placeholder="Enter Video Title"
                          :class="{ 'is-invalid': submitted && $v.form.title.$invalid }">
                        </b-form-input>
                        <div v-if="submitted && !$v.form.title.required" class="invalid-feedback">Video Title is required.</div>
                        <!-- <div class="error" v-if="!$v.form.title.maxLength">
                          Must have maximum
                          {{ $v.form.title.$params.maxLength.max }}
                          characters.
                        </div> -->
                      </b-form-group>
                      <b-form-group label="Thumbnail URL" label-for="video_thumbnail" class="col-6">
                        <b-form-input
                          id="video_thumbnail"
                          v-model="form.thumbnail_url"
                          placeholder="Enter Thumbnail URL">
                        </b-form-input>
                        <!-- <div v-if="submitted && !$v.form.thumbnail_url.required" class="invalid-feedback">Thumbnail URL is required.</div> -->
                        <!-- <div class="error" v-if="!$v.form.thumbnail_url.maxLength">Must have maximum {{ $v.form.thumbnail_url.$params.maxLength.max }} characters.</div> -->
                      </b-form-group>
                    </div>    
                    <b-form-group label="Tell Us More About The Video" label-for="video_desc">
                      <ckeditor
                        id="video_desc"
                        v-model="form.description"
                        :editor="editor">
                      </ckeditor>
                    </b-form-group>
                    <div class="row">
                      <b-form-group class="col-6">
                        <label for="video_link">Vimeo Video ID <span style="color: red">*</span></label>
                        <b-form-input
                          id="video_link"
                          v-model="form.video_link"
                          placeholder="Enter Vimeo Video ID [Eg: 726000412]"
                          :class="{ 'is-invalid': submitted && $v.form.video_link.$invalid }">
                        </b-form-input>
                        <div v-if="submitted && !$v.form.video_link.required" class="invalid-feedback">Vimeo Video ID is required.</div>
                        <!-- <div class="error" v-if="!$v.form.video_link.maxLength">Must have maximum {{ $v.form.video_link.$params.maxLength.max }} characters.</div> -->
                      </b-form-group>
                      <b-form-group class="col-6">
                        <label for="video_ID">VideoCrypt Video ID<span style="color: red">*</span></label>
                        <b-form-input
                          id="video_ID"
                          v-model="form.videocrypt_id"
                          placeholder="Must be a Valid VideoCrypt ID. [Eg:131699_0_8634139956157727]"
                          :disabled="$route.name == 'edit-video' ? true : false"
                          :class="{ 'is-invalid': submitted && $v.form.videocrypt_id.$invalid }">
                        </b-form-input>
                        <div v-if="submitted && !$v.form.videocrypt_id.required" class="invalid-feedback">VideoCrypt Video ID is required.</div>
                        <!-- <div class="error" v-if="!$v.form.videocrypt_id.maxLength">Must have maximum {{ $v.form.videocrypt_id.$params.maxLength.max }} characters.</div> --> 
                      </b-form-group>
                    </div>
                    <b-form-group label="Thumbnail Image [Upload Max File Size : 2MB]" label-for="image_name">
                      <b-form-file
                        id="image_name"
                        accept="image/*"
                        placeholder="Choose a file or drop it here..."
                        @change="readFile($event, 'image_name')"
                        ref="image_name">
                      </b-form-file>
                      <template v-if="$route.name == 'edit-video' && edit.image_name_url">
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
                          id="video_community"
                          v-model="form.community_selected"
                          :options="communities"
                          :multiple="true"
                          track-by="id"
                          label="title"
                          placeholder="Type here to search"
                          :class="{ 'is-invalid': store && $v.form.community_selected.$invalid }">
                          <span slot="noOptions">
                            Type here to search
                          </span>
                        </multiselect>
                        <div v-if="store && !$v.form.community_selected.required" class="invalid-feedback">Community is required.</div>
                      </b-form-group>
                      <b-form-group label="Country" label-for="input-multi" class="col-6">
                        <multiselect
                          id="input-multi"
                          v-model="form.country"
                          :options="allCountry"
                          :multiple="true"
                          track-by="name"
                          label="name">
                        </multiselect>
                      </b-form-group>
                      <b-form-group label="Sub Speciality" label-for="video_sub_spec" class="col-6">
                        <multiselect
                          id="video_sub_spec"
                          v-model="form.sub_specialities"
                          :options="subspecialities"
                          :multiple="true"
                          track-by="id"
                          label="name"
                          placeholder="Select Sub Speciality">
                        </multiselect>
                      </b-form-group>
                      <b-form-group label="Expert" label-for="video_expert" class="col-6">
                        <multiselect
                          id="video_expert"
                          v-model="form.experts"
                          :options="expertsopt"
                          :multiple="true"
                          track-by="id"
                          label="name"
                          :preselect-first="true"
                          placeholder="Select Expert">
                        </multiselect>
                      </b-form-group>
                    </div>
                    <b-form-group label="Enter Free tags" label-for="tags-separators">
                      <b-form-tags
                        input-id="tags-separators"
                        v-model="form.tags"
                        tag-variant="primary"
                        tag-pills
                        separator=" "
                        placeholder="Enter new tags separated by space and enter">
                      </b-form-tags>
                    </b-form-group>
                    <div class="row">
                      <b-form-group class="col-6">
                        <label for="video_partner">Partner <span style="color: red">*</span></label>
                        <b-form-select
                          id="video_partner"
                          v-model="form.partner_id"
                          :options="partners"
                          value-field="id"
                          text-field="title"
                          :class="{ 'is-invalid': store && $v.form.partner_id.$invalid }">
                        </b-form-select>
                        <div v-if="store && !$v.form.partner_id.required" class="invalid-feedback">Partner is required.</div>
                      </b-form-group>
                      <b-form-group class="col-6" label="Partner Division" label-for="video_partner_div">
                        <b-form-select
                          id="video_partner_div"
                          v-model="form.partner_division_id"
                          :options="forums"
                          value-field="id"
                          text-field="title">
                        </b-form-select>
                        <!-- <div
                          v-if="store && !$v.form.partner_id.required"
                          class="invalid-feedback"
                        >
                          Partner Division is required.
                        </div> -->
                      </b-form-group>
                      <b-form-group class="col-6" label="Knowledge Category" label-for="video_knowledge">
                        <multiselect
                          id="video_knowledge"
                          v-model="form.knowledge_categories"
                          :options="knowledgeCategories"
                          :multiple="true"
                          track-by="id"
                          label="display_name"
                          placeholder="Select Knowledge Category">
                        </multiselect>
                        <!-- <b-form-select
                          id="video_knowledge"
                          v-model="form.knowledge_category_id"
                          :options="knowledgeCategories"
                          value-field="id"
                          text-field="name"
                        >
                        </b-form-select> -->
                      </b-form-group>
                      <b-form-group class="col-6" label="Live Event" label-for="video_live_event">
                        <b-form-select
                          id="video_live_event"
                          v-model="form.live_event_id"
                          :options="forums"
                          value-field="id"
                          text-field="title">
                        </b-form-select>
                      </b-form-group>
                      <b-form-group class="col-6" label="Meta Title" label-for="video_meta_title">
                        <b-form-input
                          id="video_meta_title"
                          v-model="form.meta_title"
                          placeholder="Enter Meta Title">
                        </b-form-input>
                        <!-- <div class="error" v-if="!$v.form.meta_title.maxLength">Must have maximum {{ $v.form.meta_title.$params.maxLength.max }} characters.</div> -->
                      </b-form-group>
                      <b-form-group class="col-6" label="Meta Keywords" label-for="video_meta_keywords">
                        <b-form-input
                          id="video_meta_keywords"
                          v-model="form.meta_keywords"
                          placeholder="Enter Meta Keywords">
                        </b-form-input>
                        <!-- <div class="error" v-if="!$v.form.meta_keywords.maxLength">Must have maximum {{ $v.form.meta_keywords.$params.maxLength.max }} characters.</div> -->
                      </b-form-group>
                    </div>
                    <b-form-group label="Meta Description" label-for="video_meta_desc">
                      <ckeditor
                        id="video_meta_desc"
                        v-model="form.meta_description"
                        :editor="editor">
                      </ckeditor>
                      <!-- <div class="error" v-if="!$v.form.meta_description.maxLength">Must have maximum {{ $v.form.meta_description.$params.maxLength.max }} characters.</div> -->
                    </b-form-group>
                    <b-form-group>
                      <label for="video_url_link">URL Link <span style="color: red">*</span></label>
                      <b-form-input
                        id="video_url_link"
                        v-model="form.url_link"
                        placeholder="Enter URL Link"
                        :class="{ 'is-invalid': store && $v.form.url_link.$invalid }">
                      </b-form-input>
                      <div v-if="store && !$v.form.url_link.required" class="invalid-feedback">URL Link is required.</div>
                      <!-- <div class="error" v-if="!$v.form.url_link.maxLength">Must have maximum {{ $v.form.url_link.$params.maxLength.max }} characters.</div> -->
                    </b-form-group>
                    <b-form-group id="input-group-26">
                      <div style="display: flex; gap: 10px">
                        <b-form-checkbox v-model="form.popup">Has Popup</b-form-checkbox>
                        <b-form-checkbox v-model="form.visible_on_main_page">Visible on Home Page</b-form-checkbox>
                        <b-form-checkbox v-model="form.is_open_video">Is Open Video</b-form-checkbox>
                      </div>
                    </b-form-group>
                  </tab-content>
                  <tab-content title="Preview" icon="dripicons-preview" :before-change="() => validateFormThree()">
                    <div class="preview">
                      <div class="thumbnail-preview">
                        <h5>Thumbnail View</h5>
                        <div class="thumbnail-card">
                          <div class="video-img">
                            <template v-if="this.$route.name == 'add-video'">
                              <template v-if="this.image_name_url">
                                <img :src="image_name_url" alt="Video Thumbnail" class="web-preview-img"/>
                              </template>
                              <template v-else>
                                <img src="../../../../public/placeholder/placeholder-video_thumbnail_small.png" alt="" class="thumbnail-preview-img" />
                              </template>
                            </template>
                            <template v-else-if="this.$route.name == 'edit-video'">
                              <template v-if="this.edit.image_name_url">
                                <img :src="edit.image_name_url" alt="Video Thumbnail" class="web-preview-img"/>
                              </template>
                              <template v-else>
                                <img src="../../../../public/placeholder/placeholder-video_thumbnail_small.png" alt="" class="thumbnail-preview-img" />
                              </template>
                            </template>
                          </div>
                          <template v-if="this.form.title">
                            <div class="thumbnail-video-title">{{ form.title }}</div>
                          </template>
                          <template v-else>
                            <div class="thumbnail-video-title">No Video Title</div>
                          </template>
                        </div>
                      </div>
                      <div class="web-preview">
                        <h5>Web View</h5>
                        <div class="web-video-card">
                          <div class="video-img">
                            <!-- <img src="../../../../public/sample_thumbnail.png" alt="" class="web-preview-img"> -->
                            <template v-if="this.$route.name == 'add-video'">
                              <template v-if="this.image_name_url">
                                <img :src="image_name_url" alt="Video Thumbnail" class="web-preview-img"/>
                              </template>
                              <template v-else>
                                <img src="../../../../public/placeholder/placeholder-video_thumbnail_Big.png" alt="" class="web-preview-img" />
                              </template>
                            </template>
                            <template v-else-if="this.$route.name == 'edit-video'">
                              <template v-if="this.edit.image_name_url">
                                <img :src="edit.image_name_url" alt="Video Thumbnail" class="web-preview-img"/>
                              </template>
                              <template v-else>
                                <img src="../../../../public/placeholder/placeholder-video_thumbnail_Big.png" alt="" class="web-preview-img" />
                              </template>
                            </template>
                          </div>
                          <div style="padding: 10px;display: grid;grid-gap: 10px;">
                            <template v-if="this.form.title">
                              <div class="web-video-title">{{ form.title }}</div>
                            </template>
                            <template v-else>
                              <div class="web-video-title">No Video Title</div>
                            </template>
                            <div class="actions-grid">
                              <div class="video-img-text">
                                <div class="img-icon">
                                  <img src="../../../../public/videos/button_insightful.svg" class="video-action-icon"> 
                                  <div class="video-action-text">Insightful</div>
                                </div>
                              </div> 
                              <div class="video-img-text">
                                <div class="img-icon">
                                  <img src="../../../../public/videos/button_like.svg" class="video-action-icon"> 
                                  <div class="video-action-text">Like</div>
                                </div>
                              </div>
                              <div class="video-img-text">
                                <div class="img-icon"><img src="../../../../public/videos/button_share.svg" class="video-action-icon"> 
                                  <div class="video-action-text">Share</div>
                                </div>
                              </div>
                              <div class="video-img-text">
                                <div class="img-icon"><img src="../../../../public/videos/button_comment.svg" class="video-action-icon"> 
                                  <div class="video-action-text">Comment</div>
                                </div>
                              </div>
                              <div class="video-img-text">
                                <div class="img-icon"><img src="../../../../public/videos/button_bookmark.svg" class="bookmark-heart-fill-icon video-action-icon"> 
                                  <div class="video-action-text"> Bookmark</div>
                                </div>
                              </div>
                            </div>
                            <template v-if="form.partner_division_id != ''">
                              <div>
                                <div class="powered-by">Powered By</div>
                                <div class="forum-title">{{ getFormTitle(form.partner_division_id) }}</div>
                              </div>
                            </template>
                            <div class="video-link" style="color: #0bbcd4;">{{ geturl }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-center mt-4">
                        <label for="video_time_date">Schedule a Date <span style="color: red">*</span></label>
                        <div class="d-flex justify-content-center">
                          <b-form-input
                            style="width: 20%"
                            id="video_time_date"
                            v-model="form.video_timestamp"
                            type="datetime-local"
                            :class="{ 'is-invalid': form3 && $v.form.video_timestamp.$invalid }"
                            :min="disabledDates()">
                          </b-form-input>
                        </div>
                        <div v-if="form3 && !$v.form.video_timestamp.required" class="invalid-feedback">
                          Schedule Date is required.
                        </div>
                    </div> 
                  </tab-content>
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
                  <b-form-group>
                    <label for="video_title"
                      >Video Title</label
                    >
                    <b-form-input
                      id="video_title"
                      v-model="form.translation.indonesia.title"
                      placeholder="Enter Video Title"
                    >
                    </b-form-input>
                  </b-form-group>
                  <b-form-group>
                    <label for="video_desc"
                        >Tell Us More About The Video</label
                      >
                      <ckeditor
                        id="video_desc"
                        v-model="form.translation.indonesia.description"
                        :editor="editor"
                      >
                      </ckeditor>
                  </b-form-group>
                  <b-form-group> 
                      <label for="image">Thumbnail Image</label>
                      <b-form-file
                        id="image"
                        accept="image/*"
                        placeholder="Choose a file or drop it here..."
                        @change="readFile($event, 'image_name_indonesia')"
                        ref="image_name_indonesia"
                      ></b-form-file>
                      <template
                        v-if="$route.name == 'edit-video' && edit.image_name_indonesia_url"
                      >
                        <img
                          :src="edit.image_name_indonesia_url"
                          width="128px"
                          height="128px"
                          style="object-fit: contain"
                        />
                      </template>
                      <template v-if="image_name_indonesia_url">
                        <img
                          :src="image_name_indonesia_url"
                          width="128px"
                          height="128px"
                          ref="image_name_indonesia_url"
                          style="object-fit: contain"
                        />
                      </template>
                  </b-form-group>
                  <b-form-group>
                    <label for="meta_title"
                      >Meta Title</label
                    >
                    <b-form-input
                      id="meta_title"
                      v-model="form.translation.indonesia.meta_title"
                      placeholder="Enter Meta Title"
                    >
                    </b-form-input>
                  </b-form-group>
                  <b-form-group>
                    <label for="meta_keywords"
                      >Meta Keywords</label
                    >
                    <b-form-input
                      id="meta_keywords"
                      v-model="form.translation.indonesia.meta_keywords"
                      placeholder="Enter Meta Keywords"
                    >
                    </b-form-input>
                  </b-form-group>
                  <b-form-group>
                    <label for="meta_desc"
                        >Meta Description</label
                      >
                      <ckeditor
                        id="meta_desc"
                        v-model="form.translation.indonesia.meta_description"
                        :editor="editor"
                      >
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
import MixinRequest from "../../../mixins/request";
import videoMixin from "../../../mixins/ModuleJs/video";
import { FormWizard, TabContent } from "vue-form-wizard";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Multiselect from "vue-multiselect";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      submitted: false,
      store: false,
      form3: false,
      title1: "Add Video",
      title2: "Edit Video",
      items: [
        {
          text: "Back",
          href: "/video",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
    };
  },
  mixins: [MixinRequest, videoMixin],
  components: {
    Layout,
    FormWizard,
    TabContent,
    Multiselect,
    ckeditor: CKEditor.component,
  },
  validations: {
    form: {
      title: { required },
      videocrypt_id: { required },
      video_link: { required },
      community_selected: { required },
      partner_id: { required },
      url_link: { required },
      video_timestamp: { required }
    }
  },
  methods: {
    disabledDates() {
      return new Date().toISOString().slice(0, 16); 
    },
    getFormTitle(id) {
      let res = this.forums.filter(f => f.id == id);
      if(res.length > 0){
        return res[0].title;
      }
      return null;
    },
    validateFormOne() {
      this.submitted = true;
      if (this.$v.form.title.$invalid || this.$v.form.videocrypt_id.$invalid || this.$v.form.video_link.$invalid) {
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
      if (this.$v.form.community_selected.$invalid || this.$v.form.partner_id.$invalid || this.$v.form.url_link.$invalid || this.$v.form.videocrypt_id.$invalid){
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Please Fill The Required Fields"
        });
        return false;
      }
      return true;
    },
    validateFormThree(){
      this.form3 = true;
      if(this.$v.form.video_timestamp.$invalid){
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: 'error',
          title: 'Please Fill The Required Fields'
        });
        return false;
      }
      return true;
    }
  }
};
</script>