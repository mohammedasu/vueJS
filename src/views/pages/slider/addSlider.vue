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
                    ref="podcast"
                    :finishButtonText="this.$route.name == 'add-slider' ? 'Save Data' : 'Update Data'"
                    back-button-text="Go Back!" 
                    next-button-text="Go Next!"
                    >

                    <tab-content title="Slider Details" icon="mdi mdi-account-details" :before-change="() => validateFormOne()">
                      <b-form-group id="input-group-1">
                        <label for="input-1"
                          >Slider Title <span style="color: red">*</span></label
                        >
                        <b-form-input
                          id="input-1"
                          v-model="form.title"
                          placeholder="Enter Slider Title"
                          :class="{
                            'is-invalid': submitted && $v.form.title.$invalid,
                          }"
                        ></b-form-input>
                        <div
                          v-if="submitted && !$v.form.title.required"
                          class="invalid-feedback"
                        >
                          Slider Title is required.
                        </div>
                      </b-form-group>
                      <b-form-group
                        id="input-group-2"
                        label="Tell Us More About The Slider"
                        label-for="input-2"
                        :class="{
                          'form-group--error': $v.form.description.$error,
                        }"
                      >
                        <ckeditor
                          v-model="form.description"
                          @input="delayTouch($v.form.description)"
                          :editor="editor"
                        ></ckeditor>
                        <div class="error" v-if="!$v.form.description.maxLength">
                          Must have maximum
                          {{ $v.form.description.$params.maxLength.max }}
                          characters.
                        </div>
                      </b-form-group>

                      <div class="row">
                        <b-form-group class="col-6">
                          <label for="input-2"
                            >Type <span style="color: red">*</span></label
                          >
                          <b-form-select
                            id="typee"
                            value-field="value"
                            text-field="text"
                            v-model="form.type"
                            :options="type"
                            @input="changeType"
                            :class="{
                              'is-invalid': submitted && $v.form.type.$invalid,
                            }"
                          >
                          </b-form-select>
                          <div
                            v-if="submitted && !$v.form.type.required"
                            class="invalid-feedback"
                          >
                            Type is required.
                          </div>
                        </b-form-group>
                        <template
                          v-if="
                            form.type != null &&
                            form.type != 'home' &&
                            form.type != 'external'
                          "
                        >
                          <b-form-group
                            class="col-6"
                            :label="
                              form.type == 'partner'
                                ? 'Partner'
                                : form.type == 'partner_division'
                                ? 'Forum'
                                : form.type == 'community'
                                ? 'Community'
                                : ''
                            "
                            label-for="type2"
                          >
                            <template
                              v-if="
                                form.type == 'partner' ||
                                form.type == 'partner_division' ||
                                form.type == 'community'
                              "
                            >
                              <b-form-select
                                id="type2"
                                v-model="form.type_id"
                                :options="
                                  form.type == 'partner'
                                    ? partner
                                    : form.type == 'partner_division'
                                    ? forum
                                    : form.type == 'community'
                                    ? community
                                    : ''
                                "
                                value-field="id"
                                text-field="title"
                              >
                              </b-form-select>
                              <!-- <div
                                v-if="submitted && !$v.form.type_id.required"
                                class="invalid-feedback"
                              >
                                Type ID is required.
                              </div> -->
                            </template>
                          </b-form-group>
                        </template>
                      </div>

                      <div class="row">
                        <b-form-group label="Action Type" label-for="act" class="col-6">
                          <b-form-select
                            id="act"
                            v-model="form.action_type"
                            :options="actionType"
                            value-field="value"
                            text-field="text"
                            @input="changeActionType"
                          >
                          </b-form-select>
                        </b-form-group>
                        <template
                          v-if="
                            form.action_type != null &&
                            form.action_type != 'none' &&
                            form.action_type != 'external_website'
                          "
                        >
                          <b-form-group
                            class="col-6"
                            id="input-group-3"
                            :label="
                              form.action_type == 'expert'
                                ? 'Action ID : Expert'
                                : form.action_type == 'video'
                                ? 'Action ID : Video'
                                : form.action_type == 'live_event'
                                ? 'Action ID : Live Event'
                                : form.action_type == 'forum'
                                ? 'Action ID : Partner Division'
                                : form.action_type == 'news_letter'
                                ? 'Action ID : Newsletter'
                                : form.action_type == 'series'
                                ? 'Action ID : Series'
                                : form.action_type == 'news_article'
                                ? 'Action ID : Article'
                                : form.action_type == 'external'
                                ? 'Action ID : External Website'
                                : ''
                            "
                            label-for="input-3"
                          >
                            <template v-if="form.action_type == 'news_article'">
                              <b-form-select
                                id="input-3"
                                placeholder="Enter Action ID"
                                v-model="form.action_id"
                                :options="action_types"
                                value-field="id"
                                text-field="card_name"
                              ></b-form-select>
                            </template>

                            <template v-else-if="form.action_type == 'expert'">
                              <b-form-select
                                id="input-3"
                                placeholder="Enter Action ID"
                                v-model="form.action_id"
                                :options="action_types"
                                value-field="url_link"
                                text-field="name"
                              ></b-form-select>
                            </template>

                            <template v-else-if="form.action_type == 'external'">
                              <b-form-input
                                id="input-1"
                                v-model="form.action_id"
                                placeholder="Enter External link"
                                text-field="title"
                              ></b-form-input>
                            </template>

                            <template
                              v-else-if="
                                form.action_type == 'video' ||
                                form.action_type == 'live_event' ||
                                form.action_type == 'forum' ||
                                form.action_type == 'news_letter' ||
                                form.action_type == 'series'
                              "
                            >
                              <template v-if="form.action_type == 'video'">
                                <b-form-select
                                  id="input-3"
                                  placeholder="Enter Action ID"
                                  v-model="form.action_id"
                                  :options="action_types"
                                  value-field="url_link"
                                  text-field="title"
                                ></b-form-select>
                              </template>
                              <template v-else-if="form.action_type == 'live_event'">
                                <b-form-select
                                  id="input-3"
                                  placeholder="Enter Action ID"
                                  v-model="form.action_id"
                                  :options="action_types"
                                  value-field="link_id"
                                  text-field="title"
                                ></b-form-select>
                              </template>
                              <template v-else-if="form.action_type == 'forum'">
                                <b-form-select
                                  id="input-3"
                                  placeholder="Enter Action ID"
                                  v-model="form.action_id"
                                  :options="action_types"
                                  value-field="link_name"
                                  text-field="title"
                                ></b-form-select>
                              </template>
                              <template v-else-if="form.action_type == 'series'">
                                <b-form-select
                                  id="input-3"
                                  placeholder="Enter Action ID"
                                  v-model="form.action_id"
                                  :options="action_types"
                                  value-field="id"
                                  text-field="title"
                                ></b-form-select>
                              </template>
                              <template v-else-if="form.action_type == 'news_letter'">
                                <b-form-select
                                  id="input-3"
                                  placeholder="Enter Action ID"
                                  v-model="form.action_id"
                                  :options="action_types"
                                  value-field="id"
                                  text-field="title"
                                ></b-form-select>
                              </template>
                            </template>
                          </b-form-group>
                        </template>
                      </div>
                      <div class="row">
                        <b-form-group id="input-group-4" class="col-4">
                          <label for="input-4"
                            >Thumbnail Image [Upload Max File Size : 2MB] <span style="color: red">*</span></label
                          >
                          <b-form-file
                            id="input-4"
                            accept="image/*"
                            placeholder="Choose a file or drop it here..."
                            @change="readFile($event, 'image')"
                            ref="image"
                            :class="{
                              'is-invalid': submitted && $v.image.$invalid,
                            }"
                          ></b-form-file>
                          <template v-if="$route.name == 'edit-slider' && edit.image_url">
                            <img
                              :src="edit.image_url"
                              width="128px"
                              height="128px"
                              style="object-fit: contain"
                            />
                          </template>
                          <template v-if="image_url">
                            <img
                              :src="image_url"
                              width="128px"
                              height="128px"
                              ref="image_url"
                              style="object-fit: contain"
                            />
                          </template>
                          <div v-if="submitted && !$v.image.required" class="invalid-feedback">Thumbnail Image is required.</div>
                        </b-form-group>
                        <b-form-group
                          class="col-4"
                          id="input-group-5"
                          label="Android Image [Upload Max File Size : 2MB]"
                          label-for="input-5"
                        >
                          <b-form-file
                            id="input-5"
                            accept="image/*"
                            placeholder="Choose a file or drop it here..."
                            @change="readFile($event, 'android_image')"
                            ref="android_image"
                          ></b-form-file>
                          <template
                            v-if="$route.name == 'edit-slider' && edit.android_image_url"
                          >
                            <img
                              :src="edit.android_image_url"
                              width="128px"
                              height="128px"
                              style="object-fit: contain"
                            />
                          </template>
                          <template v-if="android_image_url">
                            <img
                              :src="android_image_url"
                              width="128px"
                              height="128px"
                              style="object-fit: contain"
                              ref="android_image_url"
                            />
                          </template>
                        </b-form-group>
                        <b-form-group
                          class="col-4"
                          id="input-group-6"
                          label="IOS Image [Upload Max File Size : 2MB]"
                          label-for="input-6"
                        >
                          <b-form-file
                            id="input-6"
                            accept="image/*"
                            placeholder="Choose a file or drop it here..."
                            @change="readFile($event, 'ios_image')"
                            ref="ios_image"
                          ></b-form-file>
                          <template
                            v-if="$route.name == 'edit-slider' && edit.ios_image_url"
                          >
                            <img
                              :src="edit.ios_image_url"
                              width="128px"
                              height="128px"
                              style="object-fit: contain"
                            />
                          </template>
                          <template v-if="ios_image_url">
                            <img
                              :src="ios_image_url"
                              width="128px"
                              height="128px"
                              ref="ios_image_url"
                              style="object-fit: contain"
                            />
                          </template>
                        </b-form-group>
                      </div>
                    </tab-content>  

                    <tab-content title="Add Tags" icon="fa fa-tag">
                      <b-form-group label="Country" label-for="input-multi">
                          <multiselect
                            id="input-multi"
                            v-model="form.country"
                            :options="allCountry"
                            :multiple="true"
                            track-by="name"
                            label="name">
                          </multiselect>
                        </b-form-group>
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
                        <b-form-group
                          id="input-group-7"
                          label="Meta Title"
                          label-for="input-7"
                          class="col-6"
                          :class="{
                            'form-group--error': $v.form.meta_title.$error,
                          }"
                        >
                          <b-form-input
                            id="input-7"
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
                          id="input-group-9"
                          label="Meta Keywords"
                          label-for="input-9"
                          :class="{
                            'form-group--error': $v.form.meta_keywords.$error,
                          }"
                        >
                          <b-form-input
                            id="input-9"
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
                        id="input-group-8"
                        label="Meta Description"
                        label-for="input-8"
                        :class="{
                          'form-group--error': $v.form.meta_desc.$error,
                        }"
                      >
                        <ckeditor
                          id="input-8"
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
                    </tab-content>

                    <!-- <tab-content title="Preview" icon="dripicons-preview">
                      <div class="d-flex justify-content-center">
                        <div class="card preview">
                          <div class="card-header bg-transparent">
                            <img
                              :src="`${image_url}`"
                              v-if="this.$route.name == 'add-slider'"
                              alt="slider Thumbnail"
                              class="preview-img"
                            />
                            <img
                              :src="`${edit.image_url}`"
                              v-else-if="this.$route.name == 'edit-slider'"
                              alt="slider Thumbnail"
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

                      <div class="text-center">
                        <b-form-group
                          id="example-date-time"
                          label="Expired Slider - Date and Time"
                          label-for="date-time"
                        >
                          <div class="d-flex justify-content-center">
                            <b-form-input
                            style="width: 20%"
                            id="date-time"
                            v-model="form.expire_slider"
                            type="datetime-local"
                            :min="disabledDates()"
                          ></b-form-input>
                          </div>
                        </b-form-group>
                      </div> 
                    </tab-content> -->
                
                  </form-wizard>
                  <!-- <template v-if="form.action_type == 'news_letter'">
                    <b-form-group label="Action ID : Newsletter" label-for="act">
                      <b-form-select
                        id="act"
                        v-model="form.action_type"
                        :options="newsletters"
                        value-field="id"
                        text-field="title"
                      >
                      </b-form-select>
                    </b-form-group>
                  </template>

                  <template v-if="form.action_type == 'series'">
                    <b-form-group label="Action ID : Series" label-for="act">
                      <b-form-select
                        id="act"
                        v-model="form.action_type"
                        :options="series"
                        value-field="id"
                        text-field="title"
                      >
                      </b-form-select>
                    </b-form-group>
                  </template>

                  <template v-if="form.action_type == 'news_article'">
                    <b-form-group label="Action ID : Article" label-for="act">
                      <b-form-select
                        id="act"
                        v-model="form.action_type"
                        :options="articles"
                        value-field="id"
                        text-field="card_name"
                      >
                      </b-form-select>
                    </b-form-group>
                  </template> -->

                  <!-- <b-button
                    type="submit"
                    variant="primary"
                    class="mr-2"
                    v-if="$route.name == 'edit-slider'"
                    @click.prevent="updateData($route.params.id)"
                    >Update Data</b-button
                  >
                  <b-button
                    type="submit"
                    variant="primary"
                    class="mr-2"
                    @click.prevent="submitData"
                    v-else-if="$route.name == 'add-slider'"
                    >Save Data</b-button
                  > -->
                <!-- </b-form> -->
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
                  <label for="translation-title"
                    >Slider Title</label
                  >
                  <b-form-input
                    id="translation-title"
                    v-model="form.translation.indonesia.title"
                    placeholder="Enter Slider Title"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Tell Us More About The Slider"
                  label-for="translation-desc"
                >
                  <ckeditor
                    id="translation-desc"
                    v-model="form.translation.indonesia.description"
                    :editor="editor"
                  ></ckeditor>
                </b-form-group>
                <div class="row">
                  <b-form-group class="col-4">
                    <label for="translation-thumbnail"
                      >Thumbnail Image [Upload Max File Size : 2MB]</label
                    >
                    <b-form-file
                      id="translation-thumbnail"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'indonesia_image')"
                      ref="indonesia_image"
                    ></b-form-file>
                    <template v-if="$route.name == 'edit-slider' && edit.indonesia_image_url">
                      <img
                        :src="edit.indonesia_image_url"
                        width="128px"
                        height="128px"
                        style="object-fit: contain"
                      />
                    </template>
                    <template v-if="indonesia_image_url">
                      <img
                        :src="indonesia_image_url"
                        width="128px"
                        height="128px"
                        ref="indonesia_image_url"
                        style="object-fit: contain"
                      />
                    </template>
                  </b-form-group>
                  <b-form-group
                    class="col-4"
                    label="Android Image [Upload Max File Size : 2MB]"
                    label-for="translation-android"
                  >
                    <b-form-file
                      id="translation-android"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'indonesia_android_image')"
                      ref="indonesia_android_image"
                    ></b-form-file>
                    <template
                      v-if="$route.name == 'edit-slider' && edit.indonesia_android_image_url"
                    >
                      <img
                        :src="edit.indonesia_android_image_url"
                        width="128px"
                        height="128px"
                        style="object-fit: contain"
                      />
                    </template>
                    <template v-if="indonesia_android_image_url">
                      <img
                        :src="indonesia_android_image_url"
                        width="128px"
                        height="128px"
                        style="object-fit: contain"
                        ref="indonesia_android_image_url"
                      />
                    </template>
                  </b-form-group>
                  <b-form-group
                    class="col-4"
                    label="IOS Image [Upload Max File Size : 2MB]"
                    label-for="translation-ios"
                  >
                    <b-form-file
                      id="translation-ios"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'indonesia_ios_image')"
                      ref="indonesia_ios_image"
                    ></b-form-file>
                    <template
                      v-if="$route.name == 'edit-slider' && edit.indonesia_ios_image_url"
                    >
                      <img
                        :src="edit.indonesia_ios_image_url"
                        width="128px"
                        height="128px"
                        style="object-fit: contain"
                      />
                    </template>
                    <template v-if="indonesia_ios_image_url">
                      <img
                        :src="indonesia_ios_image_url"
                        width="128px"
                        height="128px"
                        ref="indonesia_ios_image_url"
                        style="object-fit: contain"
                      />
                    </template>
                  </b-form-group>
                </div>
                <div class="row">
                  <b-form-group
                    class="col-6"
                    label="Meta Title"
                    label-for="translation-meta-title"
                  >
                    <b-form-input
                      id="translation-meta-title"
                      v-model="form.translation.indonesia.meta_title"
                      placeholder="Enter Meta Title"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group
                    class="col-6"
                    label="Meta Keywords"
                    label-for="translation-meta-keywords"
                  >
                    <b-form-input
                      id="translation-meta-keywords"
                      v-model="form.translation.indonesia.meta_keywords"
                      placeholder="Enter Meta Keywords"
                    ></b-form-input>
                  </b-form-group>
                </div>
                <b-form-group
                  label="Meta Description"
                  label-for="translation-meta-desc"
                >
                  <ckeditor
                    id="translation-meta-desc"
                    v-model="form.translation.indonesia.meta_desc"
                    :editor="editor"
                  ></ckeditor>
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
import sliderMixin from "../../../mixins/ModuleJs/slider";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { required, maxLength } from "vuelidate/lib/validators";
import { FormWizard, TabContent } from "vue-form-wizard";
import Multiselect from "vue-multiselect";

const touchMap = new WeakMap();

export default {
  data() {
    return {
      submitted: false,
      title1: "Add Slider",
      title2: "Edit Slider",
      items: [
        {
          text: "Back",
          href: "/slider",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
    };
  },
  mixins: [MixinRequest, sliderMixin],
  components: {
    Layout,
    ckeditor: CKEditor.component,
    FormWizard,
    TabContent,
    Multiselect
  },
  validations: {
    form: {
      title: { required },
      type: { required },
      description: { maxLength: maxLength(190) },
      meta_title: { maxLength: maxLength(250) },
      meta_desc: { maxLength: maxLength(250) },
      meta_keywords: { maxLength: maxLength(250) },
      // type_id: { required: requiredIf(form => form.type == 'partner' && form.type == 'partner_division' && form.type == 'community') }
    },
    image: { required }
  },
  methods: {
    validateFormOne() {
      this.submitted = true;
      if (this.$v.form.title.$invalid || this.$v.form.type.$invalid || this.$v.image.$invalid) {
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
      return new Date().toISOString().slice(0, 16); 
    },
  },
};
</script>
