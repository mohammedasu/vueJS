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
                  ref="article"
                  :finishButtonText="this.$route.name == 'add-article' ? 'Save Data' : 'Update Data'"
                  back-button-text="Go Back!" 
                  next-button-text="Go Next!"
                >
                  <tab-content title="Article Details" icon="mdi mdi-account-details" :before-change="() => validateFormOne()">
                    <div class="row">
                      <b-form-group class="col-6">
                        <label for="article_header">Article Header <span style="color: red">*</span></label>
                        <b-form-textarea
                          id="article_header"
                          v-model="form.header"
                          placeholder="[Eg: EMERALD study: A brief report of kidney and inflammatory outcomes]"
                          rows="3"
                          :class="{'is-invalid': submitted && $v.form.header.$invalid}">
                        </b-form-textarea>
                        <div v-if="submitted && !$v.form.header.required" class="invalid-feedback">Header is required.</div>
                      </b-form-group>
                      <b-form-group class="col-6" label="Article Link" label-for="article_link">
                        <b-form-textarea
                          id="article_link"
                          v-model="form.link"
                          placeholder="[Eg: https://www.annfammed.org/content/early/2020/12/15/afm.2591]"
                          rows="3">
                        </b-form-textarea>
                      </b-form-group>
                      <b-form-group class="col-6">
                        <div class="d-flex justify-content-between">
                          <label for="small_desc">Small Description of the Article <span style="color: red">*</span></label>
                          <label>Count : {{form.small_description.length}} Characters </label>
                        </div>
                        <b-form-textarea
                          id="small_desc"
                          v-model="form.small_description"
                          placeholder="Enter Small Description"
                          :class="{'is-invalid': submitted && $v.form.small_description.$invalid}"
                          rows="5">
                        </b-form-textarea>
                        <div v-if="submitted && !$v.form.small_description.required" class="invalid-feedback">Small Description is required.</div>
                      </b-form-group>
                      <b-form-group
                        class="col-6"
                        label="Journal"
                        label-for="article_journal"
                        :class="{'form-group--error': $v.form.journal.$error}"
                      >
                        <b-form-textarea
                          id="article_journal"
                          v-model="form.journal"
                          @input="delayTouch($v.form.journal)"
                          placeholder="[Eg: European Journal of Heart Failure]"
                          rows="5">
                        </b-form-textarea>
                        <div class="error" v-if="!$v.form.journal.maxLength">Must have maximum  {{ $v.form.journal.$params.maxLength.max }} characters. </div>
                      </b-form-group>
                      <b-form-group class="col-6" label="Button Text" label-for="article_button_text">
                        <b-form-input
                          id="article_button_text"
                          v-model="form.button_text"
                          placeholder="Enter Button Text">
                        </b-form-input>
                      </b-form-group>
                      <b-form-group class="col-6">
                        <label for="article_thumbnail_img">Thumbnail Image [Upload Max File Size : 2MB] <span style="color: red">*</span></label>
                        <b-form-file
                          id="article_thumbnail_img"
                          accept="image/*"
                          placeholder="Choose a file or drop it here..."
                          @change="readFile($event, 'card_image')"
                          ref="card_image"
                          :class="{'is-invalid': submitted && $v.card_image.$invalid}">
                        </b-form-file>
                        <template v-if="$route.name == 'edit-article' && edit.card_image_url">
                          <img
                            :src="edit.card_image_url"
                            width="128px"
                            height="128px"
                            style="object-fit: contain"
                          />
                        </template>
                        <template v-if="card_image_url">
                          <img
                            :src="card_image_url"
                            width="128px"
                            height="128px"
                            ref="card_image_url"
                            style="object-fit: contain"
                          />
                        </template>
                        <div v-if="submitted && !$v.card_image.required" class="invalid-feedback">Image is required.</div>
                      </b-form-group>
                    </div>
                  </tab-content>
                  <tab-content title="Add Tags" icon="fa fa-tag" :before-change="() => validateFormTwo()">
                    <div class="row">
                      <b-form-group class="col-6">
                        <label for="date">Article Scheduled Date <span style="color: red">*</span></label>
                        <b-form-input
                          id="date"
                          v-model="form.article_timestamp"
                          type="datetime-local"
                          :min="disabledDates()"
                          :class="{'is-invalid': submitted2 && $v.form.article_timestamp.$invalid}">
                        </b-form-input>
                        <div v-if="submitted2 && !$v.form.article_timestamp.required" class="invalid-feedback">Article Scheduled Date is required.</div>
                      </b-form-group>
                      <b-form-group class="col-6">
                        <label for="article_community">Community <span style="color: red">*</span></label>
                        <b-form-select
                          id="article_community"
                          v-model="form.community_id"
                          :class="{'is-invalid': submitted2 && $v.form.community_id.$invalid}"
                        >
                          <b-form-select-option 
                            v-for="community in community" 
                            :key="community.id" 
                            :value="community.id">
                            {{ community.title }}
                          </b-form-select-option>
                        </b-form-select>
                        <div v-if="submitted2 && !$v.form.community_id.required" class="invalid-feedback">Community is required.
                        </div>
                      </b-form-group>
                      <b-form-group
                        class="col-6"
                        label="Meta Title"
                        label-for="article_meta_title"
                        :class="{'form-group--error': $v.form.meta_title.$error}"
                      >
                        <b-form-input
                          id="article_meta_title"
                          v-model="form.meta_title"
                          placeholder="Enter Meta Title"
                          @input="delayTouch($v.form.meta_title)"
                        ></b-form-input>
                        <div class="error" v-if="!$v.form.meta_title.maxLength">Must have maximum {{ $v.form.meta_title.$params.maxLength.max }}characters.</div>
                      </b-form-group>
                      <b-form-group
                        class="col-6"
                        label="Meta Keywords"
                        label-for="article_meta_key"
                        :class="{'form-group--error': $v.form.meta_keywords.$error}"
                      >
                        <b-form-input
                          id="article_meta_key"
                          v-model="form.meta_keywords"
                          placeholder="Enter Meta Keywords"
                          @input="delayTouch($v.form.meta_keywords)">
                        </b-form-input>
                        <div class="error" v-if="!$v.form.meta_keywords.maxLength">Must have maximum {{ $v.form.meta_keywords.$params.maxLength.max }} characters.</div>
                      </b-form-group>
                    </div>
                    <b-form-group
                      label="Meta Description"
                      label-for="article_meta_desc"
                      :class="{'form-group--error': $v.form.meta_desc.$error}"
                    >
                      <ckeditor
                        id="article_meta_desc"
                        v-model="form.meta_desc"
                        @input="delayTouch($v.form.meta_desc)"
                        :editor="editor">
                      </ckeditor>
                      <div class="error" v-if="!$v.form.meta_desc.maxLength">Must have maximum {{ $v.form.meta_desc.$params.maxLength.max }} characters.</div>
                    </b-form-group>
                    <b-form-group>
                      <div style="display: flex; gap: 10px">
                        <b-form-checkbox v-model="form.article_show">Available for Article</b-form-checkbox>
                        <b-form-checkbox v-model="form.article_schedule">Scheduled Notification</b-form-checkbox>
                      </div>
                    </b-form-group>
                  </tab-content>
                  <tab-content title="Preview" icon="dripicons-preview">
                  <!-- <tab-content title="Preview" icon="dripicons-preview"> -->
                    <div class="preview">
                      <div class="thumbnail-preview">
                        <h5>Thumbnail View</h5>
                        <div class="thumbnail-card grid-article p-2">
                          <div class="article">
                            <div><img src="../../../../public/articles/ICON-_ENDO-DIABETOLOGY.svg" width="30" alt=""></div>
                            <div class="article-header">{{this.form.header}}</div>
                          </div>
                          <div class="article-small-desc">{{form.small_description}}</div>
                          <div class="date-read-more">
                            <div class="article-date">{{this.form.article_timestamp | moment}}</div>
                            <div class="read-more">Read More</div>
                          </div>
                        </div>
                      </div>
                      <div class="web-preview">
                        <h5>Web View</h5>
                        <div class="web-article-card">
                          <div class="article-img">
                            <template v-if="this.$route.name == 'add-article'">
                              <template v-if="this.card_image_url">
                                <img :src="card_image_url" alt="Article Thumbnail" class="web-preview-img"/>
                              </template>
                              <template v-else>
                                <img src="../../../../public/placeholder/placeholder-article.png" alt="" class="web-preview-img" />
                              </template>
                            </template>
                            <template v-else-if="this.$route.name == 'edit-article'">
                              <template v-if="this.edit.card_image_url">
                                <img :src="edit.card_image_url" alt="Article Thumbnail" class="web-preview-img"/>
                              </template>
                              <template v-else>
                                <img src="../../../../public/placeholder/placeholder-article.png" alt="" class="web-preview-img" />
                              </template>
                            </template>
                          </div>
                          <div style="grid-column:2;grid-row:2;align-self: end;">
                            <div class="actions-grid">
                              <div class="video-img-text">
                                <div class="img-icon">
                                  <img src="../../../../public/mind-icon-grey.svg" class="article-action-icon"> 
                                  <div class="article-action-text">Insightful</div>
                                </div>
                              </div> 
                              <div class="video-img-text">
                                <div class="img-icon">
                                  <img src="../../../../public/like-icon.svg" class="article-action-icon"> 
                                  <div class="article-action-text">Like</div>
                                </div>
                              </div>
                              <div class="video-img-text">
                                <div class="img-icon"><img src="../../../../public/share-icon.svg" class="article-action-icon"> 
                                  <div class="article-action-text">Share</div>
                                </div>
                              </div>
                              <div class="video-img-text">
                                <div class="img-icon"><img src="../../../../public/bookmark-heart-fill-grey-icon.svg" class="article-action-icon"> 
                                  <div class="article-action-text"> Bookmark</div>
                                </div>
                              </div>
                              <div class="read-more-btn"><span>Read More</span></div>
                            </div>
                          </div>
                          <div class="article-info">
                            <div class="article-date-header">
                              <span class="article-date">{{this.form.article_timestamp | moment}}</span>
                              <span class="mx-1" style="font-size: 25px;">|</span>
                              <span class="article-header"> {{this.form.header}}</span>
                            </div>
                            <div class="article-community mt-2"><span>#{{getCommunityTitle(form.community_id)}}</span></div>
                          </div>
                          <div class="article-small-desc">
                            <div class="small-desc">
                              {{form.small_description}}
                            </div>
                            <div class="article-journal">{{form.journal}}</div>
                        </div>
                          
                        </div>
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
                <div class="row">
                  <b-form-group class="col-6">
                    <label for="input-3"
                      >Article Header</label
                    >
                    <b-form-textarea
                      id="input-3"
                      v-model="form.translation.indonesia.header"
                      placeholder="[Eg: EMERALD study: A brief report of kidney and inflammatory outcomes]"
                      rows="3"
                    ></b-form-textarea>
                  </b-form-group>
                  <b-form-group
                    label="Article Link"
                    label-for="input-6"
                    class="col-6"
                  >
                    <b-form-textarea
                      id="input-6"
                      v-model="form.translation.indonesia.link"
                      placeholder="[Eg: https://www.annfammed.org/content/early/2020/12/15/afm.2591]"
                      rows="3"
                    ></b-form-textarea>
                  </b-form-group>
                </div>
                <div class="row">
                  <b-form-group class="col-6">
                    <div class="d-flex justify-content-between">
                      <label for="input-2">Small Description of the Article </label>
                      <label for="">Count : {{form.translation.indonesia.small_description.length}} Characters</label>
                    </div>
                    <b-form-textarea
                      id="input-2"
                      v-model="form.translation.indonesia.small_description"
                      placeholder="Enter Small Description"
                      rows="5"
                    ></b-form-textarea>
                  </b-form-group>
                  <b-form-group
                    label="Journal"
                    label-for="input-5"
                    class="col-6"
                  >
                    <b-form-textarea
                      id="input-5"
                      v-model="form.translation.indonesia.journal"
                      placeholder="[Eg: European Journal of Heart Failure]"
                      rows="5"
                    ></b-form-textarea>
                  </b-form-group>
                </div>
                <div class="row">
                  <b-form-group
                    class="col-6"
                    label="Button Text"
                    label-for="input-9"
                  >
                    <b-form-input
                      id="input-9"
                      v-model="form.translation.indonesia.button_text"
                      placeholder="Enter Button Text"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-6"> 
                  <label for="image">Thumbnail Image</label>
                  <b-form-file
                    id="image"
                    accept="image/*"
                    placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'image_name_indonesia')"
                    ref="image_name_indonesia"
                  ></b-form-file>
                  <template
                    v-if="$route.name == 'edit-article' && edit.image_name_indonesia_url"
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
                </div>
                </div>
                <div class="row">
                  <b-form-group
                    class="col-6"
                    label="Meta Title"
                    label-for="input-9"
                  >
                    <b-form-input
                      id="input-9"
                      v-model="form.translation.indonesia.meta_title"
                      placeholder="Enter Meta Title"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group
                    class="col-6"
                    label="Meta Keywords"
                    label-for="input-11"
                  >
                    <b-form-input
                      id="input-11"
                      v-model="form.translation.indonesia.meta_keywords"
                      placeholder="Enter Meta Keywords"
                    ></b-form-input>
                  </b-form-group>
                </div>
                <b-form-group
                  label="Meta Description"
                  label-for="input-10"
                >
                  <ckeditor
                    id="input-10"
                    v-model="form.translation.indonesia.meta_desc"
                    :editor="editor"
                  ></ckeditor>
                </b-form-group>
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
import articleMixin from "../../../mixins/ModuleJs/article";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { required, maxLength } from "vuelidate/lib/validators";
import { FormWizard, TabContent } from "vue-form-wizard";
import moment from "moment";

const touchMap = new WeakMap();

export default {
  mixins: [MixinRequest, articleMixin],
  data() {
    return {
      mycolor: '#'+(Math.random()*0xFFFFFF<<0).toString(16),
      submitted: false,
      submitted2: false,
      title1: "Add Article",
      title2: "Edit Article",
      items: [
        {
          text: "Back",
          href: "/article",
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
    ckeditor: CKEditor.component,
    FormWizard,
    TabContent,
    // moment
  },
  validations: {
    form: {
      community_id: { required },
      journal: { maxLength: maxLength(250) },
      small_description: { required },
      header: { required },
      article_timestamp: { required },
      meta_title: { maxLength: maxLength(250) },
      meta_desc: { maxLength: maxLength(250) },
      meta_keywords: { maxLength: maxLength(250) },
    },
    card_image: { required }
  },
  methods: {
      randdomColor(){
        this.mycolor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        document.querySelector('.thumbnail-card').style.background = this.mycolor;
      },
    validateFormOne() {
      this.submitted = true;
      if (this.$v.form.header.$invalid || this.$v.form.small_description.$invalid || this.$v.card_image.$invalid) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Please Fill The Required Fields"
        });
      return false;
      }
      if (this.$v.form.journal.$error) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Max chararcters exceeded"
        });
      return false;
      }
      return true;
      
    },
    validateFormTwo() {
      this.submitted2 = true;
      if (this.$v.form.article_timestamp.$invalid || this.$v.form.community_id.$invalid) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Please Fill The Required Fields"
        });
      return false;
      }
      return true;
    },
    getCommunityTitle(id) {
      let res = this.community.filter(f => f.id == id);
      if(res.length > 0){
        return res[0].title;
      }
      return null;
    },
    removeEventSpaces(e) {
      e.preventDefault();
      const left = e.target.value.substring(0, e.target.selectionStart);
      const right = e.target.value.substring(
        e.target.selectionEnd,
        e.target.value.length
      );
      const pasted = (e.dataTransfer || e.clipboardData)
        .getData("text")
        .replace(/ /g, "");
      e.target.value = left + pasted + right;
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
  },
  mounted() {
    document.querySelector('.thumbnail-card').style.background = this.mycolor;
  },
  filters: {
    moment: function (article_timestamp) {
      return moment(article_timestamp).format('Do MMMM');
    }
  }
};
</script>
