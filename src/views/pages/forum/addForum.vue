<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-forum'">
      <PageHeader :title="title1" :items="items"></PageHeader>
    </template>
    <template v-else>
      <PageHeader :title="title2" :items="items"></PageHeader>
    </template>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-form
              enctype="multipart/form-data"
              ref="forum"
              @submit.prevent="
                $route.name == 'edit-forum'
                  ? updateData($route.params.id)
                  : $route.name == 'add-forum'
                  ? submitData
                  : ''
              "
            >
              <b-form-group
              >
                <label for="input-3">Forum Name <span style="color: red;">*</span></label>
                <b-form-input
                  id="input-3"
                  v-model="form.name"
                  placeholder="Enter Forum Name"
                  @keyup.prevent="slugify"
                  :class="{
                    'is-invalid': submitted && $v.form.name.$error,
                  }"
                ></b-form-input>
                  <div
                  v-if="submitted && !$v.form.name.required"
                  class="invalid-feedback"
                >
                  Name is required.
                </div>
              </b-form-group>
              <b-form-group
              >
                <label for="input-4">Forum Link Name <span style="color: red;">*</span></label>
                <b-form-input
                  id="input-4"
                  v-model="form.link_name"
                  placeholder="Enter Forum Link Name"
                  :class="{
                    'is-invalid': submitted && $v.form.link_name.$error,
                  }"
                ></b-form-input>
                 <div
                  v-if="submitted && !$v.form.name.required"
                  class="invalid-feedback"
                >
                  Forum Link Name is required.
                </div>
              </b-form-group>
              <b-form-group
                label="Tell Us More About The Forum"
                label-for="input-26"
              >
                <ckeditor
                  id="input-26"
                  v-model="form.description"
                  :editor="editor"
                ></ckeditor>
              </b-form-group>
              <!-- <b-form-group
                id="input-group-25"
                label="Pre Login Description"
                label-for="input-25"
              >
                <b-form-textarea
                  placeholder="Enter Pre Login Description"
                  id="input-25"
                  v-model="form.pre_login_description"
                  rows="3"
                  max-rows="6"
                >
                </b-form-textarea>
              </b-form-group> -->
              <b-form-group
              >
                <label for="type">Forum Type <span style="color: red;">*</span></label>
                <b-form-select
                  @input="changeForumType"
                  id="type"
                  v-model="form.forum_type"
                  value-field="value"
                  text-field="text"
                  :options="discussion_forum_type"
                  :class="{
                    'is-invalid': submitted && $v.form.forum_type.$error,
                  }"
                >
                </b-form-select>
                 <div
                  v-if="submitted && !$v.form.forum_type.required"
                  class="invalid-feedback"
                >
                  Forum Type is required.
                </div>
              </b-form-group>
              <b-form-group
                v-if="form.forum_type == 'partner'"
                :label="form.forum_type == 'partner' ? 'Partner' : ''"
                label-for="forum-type"
              >
                <b-form-select
                  id="forum-type"
                  v-model="form.partner_id"
                  :options="form.forum_type == 'partner' ? partner : ''"
                  value-field="id"
                  text-field="title"
                >
                </b-form-select>
              </b-form-group>
              <b-form-group
                id="input-2"
              >
                <label for="input-grp-visible">Forum Visibility <span style="color: red;">*</span></label>
                <b-form-select
                  id="input-grp-visible"
                  v-model="form.forum_visibility"
                  value-field="value"
                  text-field="text"
                  :options="discussion_forum_visibility"
                  :class="{
                    'is-invalid': submitted && $v.form.forum_visibility.$error,
                  }"
                >
                </b-form-select>
                 <div
                  v-if="submitted && !$v.form.forum_visibility.required"
                  class="invalid-feedback"
                >
                  Forum Visibility is required.
                </div>
              </b-form-group>

              <b-form-group
                v-if="form.forum_visibility == 'private'"
                label="Forum Privacy Rules"
                label-for="checkbox-group-1"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-checkbox-group
                  id="checkbox-group-1"
                  v-model="form.privacy_rule"
                  :options="forum_privacy_rules"
                  :aria-describedby="ariaDescribedby"
                ></b-form-checkbox-group>
              </b-form-group>
              <b-form-group
                v-if="
                  form.privacy_rule.includes('password') &&
                  form.forum_visibility == 'private'
                "
                id="input-group-password"
                label="Password"
                label-for="input-password"
              >
                <b-form-input
                  id="input-password"
                  v-model="form.rule_type_password"
                  placeholder="Enter Password"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                class="position-relative"
                id="input-group-list-user"
                label="Upload List of Users"
                label-for="input-list-user"
                v-if="
                  form.privacy_rule.includes('invitation') &&
                  form.forum_visibility == 'private'
                "
              >
                <div style="position: absolute; top: 0; left: 150px">
                  <a href="/invitation.xlsx" target="_blank">
                    Download Sample File
                  </a>
                </div>
                <b-form-file
                  id="input-list-user"
                  accept=".csv"
                  placeholder="Choose a file or drop it here... [Upload Max File Size : 2MB]"
                  @change="readFile($event, 'invitation_file')"
                ></b-form-file>
                <!-- <template
                  v-if="$route.name == 'edit-forum' && form.invitation_file_url"
                >
                  <img
                    :src="form.invitation_file_url"
                    width="128px"
                    height="128px"
                    style="object-fit: contain"
                  />
                </template> -->
              </b-form-group>

              <!-- <b-form-group
                id="input-group-17"
                label="Brand Page Link Text"
                label-for="input-17"
                :class="{ 'form-group--error': $v.form.brand_page_link_text.$error }"
              >
                <b-form-input
                  id="input-17"
                  v-model="form.brand_page_link_text"
                  placeholder="Enter Brand Page Link Text"
                  @input="delayTouch($v.form.brand_page_link_text)"
                ></b-form-input>
                <div class="error" v-if="!$v.form.brand_page_link_text.maxLength">Must have maximum {{$v.form.brand_page_link_text.$params.maxLength.max}} characters.</div>
              </b-form-group> -->
              <!-- <b-form-group
                id="input-group-18"
                label="Brand Page Link"
                label-for="input-18"
                :class="{ 'form-group--error': $v.form.brand_page_link.$error }"
              >
                <b-form-input
                  id="input-18"
                  v-model="form.brand_page_link"
                  placeholder="Enter Brand Page Link"
                  @input="delayTouch($v.form.brand_page_link)"
                ></b-form-input>
                <div class="error" v-if="!$v.form.brand_page_link.maxLength">Must have maximum {{$v.form.brand_page_link.$params.maxLength.max}} characters.</div>
              </b-form-group> -->

              <div class="row">
                <b-form-group
                id="input-group-23"
                label="Thumbnail Image [Upload Max File Size : 2MB]"
                label-for="input-23"
                class="col-6"
              >
                <b-form-file
                  id="input-23"
                  accept=".jpg, .png, .gif, .jpeg, .svg"
                  placeholder="Choose a file or drop it here..."
                  @change="readFile($event, 'thumbnail_image')"
                  ref="thumbnail_image"
                ></b-form-file>
                <template
                  v-if="$route.name == 'edit-forum' && edit.thumbnail_image_url"
                >
                  <img
                    :src="edit.thumbnail_image_url"
                    width="128px"
                    height="128px"
                    style="object-fit: contain"
                  />
                </template>
                <template
                  v-if="thumbnail_image_url" 
                >
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
                  id="input-group-24"
                  label="Thumbnail Image Logo [Upload Max File Size : 2MB]"
                  label-for="input-24"
                  class="col-6"
                >
                  <b-form-file
                    id="input-24"
                    accept="image/*"
                    placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'thumbnail_image_logo')"
                    ref="thumbnail_image_logo"
                  ></b-form-file>
                  <template
                    v-if="
                      $route.name == 'edit-forum' && edit.thumbnail_image_logo_url
                    "
                  >
                    <img
                      :src="edit.thumbnail_image_logo_url"
                      width="128px"
                      height="128px"
                      style="object-fit: contain"
                    />
                  </template>
                  <template
                      v-if="thumbnail_image_logo_url" 
                    >
                      <img
                        :src="thumbnail_image_logo_url"
                        width="128px"
                        height="128px"
                        ref="thumbnail_image_logo_url"
                      />
                    </template>
                </b-form-group>
              </div>

              <div class="row">
                <b-form-group
                  id="input-group-19"
                  label="App link Image [Upload Max File Size : 2MB]"
                  label-for="input-19"
                  class="col-6"
                >
                  <b-form-file
                    id="input-19"
                    accept="image/*"
                    placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'image_name')"
                    ref="image_name"
                  ></b-form-file>
                  <template v-if="$route.name == 'edit-forum' && edit.image_name_url">
                    <img :src="edit.image_name_url" width="128px" height="128px" style="object-fit: contain" />
                  </template>
                  <template
                      v-if="image_name_url" 
                    >
                      <img
                        :src="image_name_url"
                        width="128px"
                        height="128px"
                        ref="image_name_url"
                        style="object-fit: contain"
                      />
                    </template>
                </b-form-group>
                <b-form-group
                  class="col-6"
                  label="Website Link Image [Upload Max File Size : 2MB]"
                  label-for="input-5"
                >
                  <b-form-file
                    id="input-5"
                    accept="image/*"
                    placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'website_banner_image')"
                    ref="website_banner_image"
                  ></b-form-file>
                  <template
                    v-if="
                      $route.name == 'edit-forum' && edit.website_banner_image_url
                    "
                  >
                    <img
                      :src="edit.website_banner_image_url"
                      width="128px"
                      height="128px"
                      style="object-fit: contain"
                    />
                  </template>
                   <template
                      v-if="website_banner_image_url" 
                    >
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
                <b-form-group
                  id="input-group-21"
                  label="Pre Login Image [Upload Max File Size : 2MB]"
                  label-for="input-21"
                  class="col-6"
                >
                  <b-form-file
                    id="input-21"
                    accept="image/*"
                    placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'pre_login_image')"
                    ref="pre_login_image"
                  ></b-form-file>
                  <template
                    v-if="$route.name == 'edit-forum' && edit.pre_login_image_url"
                  >
                    <img
                      :src="edit.pre_login_image_url"
                      width="128px"
                      height="128px"
                      style="object-fit: contain"
                    />
                  </template>
                    <template
                    v-if="pre_login_image_url" 
                  >
                    <img
                      :src="pre_login_image_url"
                      width="128px"
                      height="128px"
                      ref="pre_login_image_url"
                      style="object-fit: contain"
                    />
                  </template>
                </b-form-group>
                <b-form-group
                  id="input-group-22"
                  label="Mobile Screen Hand Banner [Upload Max File Size : 2MB]"
                  label-for="input-22"
                  class="col-6"
                >
                  <b-form-file
                    id="input-22"
                    accept="image/*"
                    placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'pre_login_image2')"
                    ref="pre_login_image2"
                  ></b-form-file>
                  <template
                    v-if="$route.name == 'edit-forum' && edit.pre_login_image2_url"
                  >
                    <img
                      :src="edit.pre_login_image2_url"
                      width="128px"
                      height="128px"
                      style="object-fit: contain"
                    />
                  </template>
                  <template
                    v-if="pre_login_image2_url" 
                  >
                    <img
                      :src="pre_login_image2_url"
                      width="128px"
                      height="128px"
                      ref="pre_login_image2_url"
                      style="object-fit: contain"
                    />
                  </template>
                </b-form-group>
              </div>

              <b-form-group
                id="input-group-5"
                label-for="input-geo"
                label="Select Geographic"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-radio-group
                  id="input-geo"
                  v-model="form.geographic_type"
                  :options="forum_geographic"
                  :aria-describedby="ariaDescribedby"
                  name="geographic"
                ></b-form-radio-group>
              </b-form-group>
              <template>
                <b-form-group
                  v-if="form.geographic_type == 'country'"
                >
                  <label for="input-multi">Country <span style="color: red;">*</span></label>
                  <multiselect
                    id="input-multi"
                    v-model="form.country"
                    :options="allCountry"
                    :multiple="true"
                    track-by="name"
                    label="name"
                    :class="{
                    'is-invalid': submitted && $v.form.country.$error,
                  }"
                  >
                  </multiselect>
                  <div
                    v-if="submitted && !$v.form.country.required"
                    class="invalid-feedback"
                  >
                    Country is required.
                  </div>
                </b-form-group>
                <b-form-group
                  label-for="input-country"
                  label="Country"
                  v-if="form.geographic_type != 'country'"
                >
                  <b-form-select
                    id="input-country"
                    v-model="form.country"
                    :options="allCountry"
                    value-field="name"
                    text-field="name"
                    @change="getStatesByCountry"
                  >
                  </b-form-select>
                </b-form-group>

                <b-form-group
                  label-for="input-grp-state-multi"
                  label="State"
                  v-if="form.geographic_type == 'state'"
                >
                  <multiselect
                    id="input-grp-state-multi"
                    v-model="form.state"
                    :options="allState"
                    :multiple="true"
                    track-by="state"
                    label="state"
                  >
                  </multiselect>
                </b-form-group>

                <b-form-group
                  label-for="input-grp-state2"
                  label="State"
                  v-if="form.geographic_type == 'city'"
                >
                  <b-form-select
                    id="input-grp-state2"
                    v-model="form.state"
                    :options="allState"
                    value-field="state"
                    text-field="state"
                    @change="getCitiesByState"
                  >
                  </b-form-select>
                </b-form-group>

                <b-form-group
                  label-for="input-grp-city"
                  label="City"
                  v-if="form.geographic_type == 'city'"
                >
                  <multiselect
                    id="input-grp-city"
                    v-model="form.city"
                    :options="allCity"
                    :multiple="true"
                    track-by="city"
                    label="city"
                  >
                  </multiselect>
                </b-form-group>
              </template>

              <b-form-group label-for="input-grp-6">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label for="comm" class="mb-0">Community <span style="color: red;">*</span></label>
                  <b-form-checkbox v-model="status" button button-variant="info" size="sm">
                    <template v-if="status">Unselect All</template>
                    <template v-else>Select All</template>
                  </b-form-checkbox>
                </div>
                <multiselect
                  id="input-grp-6"
                  @search-change="fetchCommunity"
                  v-model="form.community"
                  :options="community"
                  :multiple="true"
                  track-by="id"
                  label="title"
                  placeholder="Type here to search"
                >
                  <span slot="noOptions">Type here to search</span>
                </multiselect>
              </b-form-group>
              <b-form-group label-for="input-grp-7" label="User Type">
                <multiselect
                  id="input-grp-7"
                  v-model="form.user_types"
                  :options="user_types"
                  :multiple="true"
                  track-by="value"
                  label="name"
                >
                </multiselect>
              </b-form-group>

              <b-form-group
                id="example text"
                label-cols-sm="1"
                label-cols-lg="1"
                label="Expert"
                label-for="text"
              >
                <b-form-input
                  class="col-lg-4"
                  for="text"
                  v-model="form.forum_council_expert_text"
                ></b-form-input>
              </b-form-group>
              <multiselect
                class="mb-2"
                id="input-grp-28"
                v-model="form.council_experts"
                :options="forum_expert"
                :multiple="true"
                track-by="id"
                label="name"
                :preselect-first="true"
              >
              </multiselect>

              <b-form-group
                id="example text 2"
                label-cols-sm="1"
                label-cols-lg="1"
                label="Expert"
                label-for="text2"
              >
                <b-form-input
                  class="col-lg-4"
                  for="text2"
                  v-model="form.forum_other_expert_text"
                ></b-form-input>
              </b-form-group>
              <multiselect
                class="mb-2"
                id="input-grp-29"
                v-model="form.other_experts"
                :options="forum_expert"
                :multiple="true"
                track-by="id"
                label="name"
                :preselect-first="true"
              >
              </multiselect>

              <b-form-group
                id="input-31"
                label-for="input-grp-31"
                label="Sub Speciality"
              >
                <multiselect
                  id="input-grp-31"
                  v-model="form.sub_specialities"
                  :options="forum_subspeciality"
                  :multiple="true"
                  track-by="id"
                  label="name"
                  :preselect-first="true"
                >
                </multiselect>
              </b-form-group>
              <b-form-group
                id="input-32"
                label-for="input-grp-32"
                label="Forum Manager"
              >
                <multiselect
                  id="input-grp-32"
                  v-model="form.forum_manager"
                  :options="discussion_forum_manager"
                  :multiple="true"
                  track-by="id"
                  label="email"
                  :preselect-first="true"
                >
                </multiselect>
              </b-form-group>
              <b-form-group id="input-group-8">
                <div style="display: flex; gap: 10px">
                  <b-form-checkbox
                    @input="changeKnowledgeAcademy"
                    v-model="form.is_knowledge_academy_active"
                    >Is Knowledge Academy Active</b-form-checkbox
                  >
                  <b-form-checkbox v-model="form.is_open_forum"
                    >Is Open Forum
                  </b-form-checkbox>
                  <b-form-checkbox v-model="form.show_followers"
                    >Show Followers
                  </b-form-checkbox>
                </div>
              </b-form-group>
              <template v-if="isKnowledgeAcademy">
                <b-form-group
                  id="input-group-9"
                  label="Knowledge Academy Name"
                  label-for="input-9"
                  :class="{ 'form-group--error': $v.form.knowledge_academy_name.$error }"
                >
                  <b-form-input
                    id="input-9"
                    v-model="form.knowledge_academy_name"
                    @input="delayTouch($v.form.knowledge_academy_name)"
                    placeholder="Enter Knowledge Academy Name"
                  ></b-form-input>
                   <div class="error" v-if="!$v.form.knowledge_academy_name.maxLength">Must have maximum {{$v.form.knowledge_academy_name.$params.maxLength.max}} characters.</div>
                </b-form-group>
                <b-form-group
                  id="input-group-10"
                  label="Knowledge Academy Header Text"
                  label-for="input-10"
                  :class="{ 'form-group--error': $v.form.knowledge_academy_header_text.$error }"
                >
                  <b-form-input
                    id="input-10"
                    v-model="form.knowledge_academy_header_text"
                    @input="delayTouch($v.form.knowledge_academy_header_text)"
                    placeholder="Enter Knowledge Academy Header Text"
                  ></b-form-input>
                   <div class="error" v-if="!$v.form.knowledge_academy_header_text.maxLength">Must have maximum {{$v.form.knowledge_academy_header_text.$params.maxLength.max}} characters.</div>
                </b-form-group>
                <b-form-group
                  id="input-group-11"
                  label="Knowledge Academy Banner Image [Upload Max File Size : 2MB]"
                  label-for="input-11"
                >
                  <b-form-file
                    accept="image/*"
                    placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'knowledge_academy_banner_image')"
                  ></b-form-file>
                  <template
                    v-if="
                      $route.name == 'edit-forum' &&
                      edit.knowledge_academy_banner_image_url
                    "
                  >
                    <img
                      :src="edit.knowledge_academy_banner_image_url"
                      width="128px"
                      height="128px"
                      style="object-fit: contain"
                    />
                  </template>
                  <template
                    v-if="knowledge_academy_banner_image_url" 
                  >
                    <img
                      :src="knowledge_academy_banner_image_url"
                      width="128px"
                      height="128px"
                      ref="knowledge_academy_banner_image_url"
                    />
                  </template>
                </b-form-group>
                <b-form-group
                  id="input-group-12"
                  label="Thumbnail Image Banner Image Mobile [Upload Max File Size : 2MB]"
                  label-for="input-12"
                >
                  <b-form-file
                    accept="image/*"
                    placeholder="Choose a file or drop it here..."
                    @change="
                      readFile($event, 'knowledge_academy_banner_image_mobile')
                    "
                  ></b-form-file>
                  <template
                    v-if="
                      $route.name == 'edit-forum' &&
                      edit.knowledge_academy_banner_image_mobile_url
                    "
                  >
                    <img
                      :src="edit.knowledge_academy_banner_image_mobile_url"
                      width="128px"
                      height="128px"
                      style="object-fit: contain"
                    />
                  </template>
                  <template
                    v-if="knowledge_academy_banner_image_mobile_url" 
                  >
                    <img
                      :src="knowledge_academy_banner_image_mobile_url"
                      width="128px"
                      height="128px"
                      ref="knowledge_academy_banner_image_mobile_url"
                    />
                  </template>
                </b-form-group>
                <b-form-group
                  id="input-group-13"
                  label="Knowledge Academy to Address"
                  label-for="input-13"
                >
                  <b-form-input
                    id="input-13"
                    v-model="form.knowledge_academy_to_address"
                    placeholder="Enter Knowledge Academy to Address"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-14"
                  label="Interested in Grant Text"
                  label-for="input-14"
                >
                  <b-form-input
                    id="input-14"
                    v-model="form.interested_in_grant_text"
                    placeholder="Enter Interested in Grant Text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-15"
                  label="Reaching Out Text"
                  label-for="input-15"
                >
                  <b-form-input
                    id="input-15"
                    v-model="form.reaching_out_text"
                    placeholder="Enter Reacing Out Text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-16"
                  label="External Link"
                  label-for="input-16"
                >
                  <b-form-input
                    id="input-16"
                    v-model="form.external_link"
                    placeholder="Enter External Link"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-30"
                  label="Knowledge Academy Thankyou Message"
                  label-for="input-30"
                  :class="{ 'form-group--error': $v.form.knowledge_academy_thank_you_message.$error }"
                >
                  <b-form-input
                    id="input-30"
                    v-model="form.knowledge_academy_thank_you_message"
                    placeholder="Enter Knowledge Academy Thankyou Message"
                    @input="delayTouch($v.form.knowledge_academy_thank_you_message)"
                  ></b-form-input>
                  <div class="error" v-if="!$v.form.knowledge_academy_thank_you_message.maxLength">Must have maximum {{$v.form.knowledge_academy_thank_you_message.$params.maxLength.max}} characters.</div>
                </b-form-group>
              </template>
              <template v-if="$route.name == 'edit-forum'">
                <h6 class="mb-3">Forum Tabs:</h6>
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

                <b-form-group
                  id="input-group-9"
                  label="CTA (Call to Actions)"
                  label-for="input-9"
                  class="mb-0"
                >
                  <div class="row" v-for="(data, i) in cta_data" :key="i">
                    <b-form-group class="col-4">
                      <b-form-input
                      id="input-30"
                      v-model="data.label"
                      :placeholder="data.label"
                    ></b-form-input>
                    </b-form-group>
                    
                    <b-form-group class="col-4">
                      <b-form-input
                        id="input-30"
                        v-model="data.text"
                        placeholder="Text"
                      ></b-form-input>
                    </b-form-group>
                    
                    <b-form-group class="col-4">
                      <b-form-input
                        id="input-30"
                        v-model="data.link"
                        placeholder="Link"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                </b-form-group>
              </template>
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-forum'"
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-forum'"
                @click.prevent="submitData"
                >Save Data</b-button
              >
            </b-form>
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
import forumMixin from "../../../mixins/ModuleJs/forum";
import Multiselect from "vue-multiselect";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { required, maxLength } from "vuelidate/lib/validators";

const touchMap = new WeakMap()

export default {
  mixins: [MixinRequest, forumMixin],
  data() {
    return {
      submitted: false,
      title1: "Add Forum",
      title2: "Edit Forum",
      items: [
        {
          text: "Back",
          href: "/forum",
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
      country: { required },
      name: { required },
      link_name: { required },
      forum_type: { required },
      forum_visibility: { required },
      brand_page_link_text: { maxLength: maxLength(250) },
      brand_page_link: { maxLength: maxLength(250) },
      knowledge_academy_name: { maxLength: maxLength(250) },
      knowledge_academy_header_text	: { maxLength: maxLength(250) },
      knowledge_academy_thank_you_message	: { maxLength: maxLength(250) },

    }
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
    ckeditor: CKEditor.component,
  },
  methods: {
    delayTouch($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    }
  }
};
</script>
