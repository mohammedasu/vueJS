<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-cme'">
      <PageHeader :title="title1" :items="items"></PageHeader>
    </template>
    <template v-else>
      <PageHeader :title="title2" :items="items"></PageHeader>
    </template>
    <div class="row" id="case-carousel">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <!-- <h4 class="card-title">Add CME Item</h4> -->
            <form-wizard
              color="#556ee6"
              enctype="multipart/form-data"
              ref="cme"
              :finishButtonText="this.$route.name == 'add-cme' ? 'Save Data' : 'Update Data'"
              @on-complete="submitData"
            >
              <tab-content icon="mdi mdi-comment">
                <div class="row">
                  <div class="col-12">
                    <b-form ref="step1">
                      <div class="row">
                        <b-form-group class="col-6">
                          <label for="input-1"
                            >Type <span style="color: red">*</span></label
                          >
                          <b-form-select
                            id="input-1"
                            :options="cmetype"
                            value-field="value"
                            text-field="text"
                            v-model="form.type"
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
                        <b-form-group
                          class="col-6"
                          :class="{ 'form-group--error': $v.form.name.$error }"
                        >
                          <label for="input-2"
                            ><span style="text-transform:capitalize">{{form.type}}</span> Title <span style="color: red">*</span></label
                          >
                          <b-form-input
                            id="input-2"
                            placeholder="Enter Title"
                            v-model="form.name"
                            @input="delayTouch($v.form.name)"
                            :class="{
                              'is-invalid': submitted && $v.form.name.$invalid,
                            }"
                          ></b-form-input>
                          <div
                            v-if="submitted && !$v.form.name.required"
                            class="invalid-feedback"
                          >
                            Title is required.
                          </div>
                          <div class="error" v-if="!$v.form.name.maxLength">
                            Must have maximum
                            {{ $v.form.name.$params.maxLength.max }} characters.
                          </div>
                        </b-form-group>
                      </div>
                     
                      <b-form-group>
                        <label for="i3"
                          >Landing Page Description
                          <span style="color: red">*</span></label
                        >
                        <ckeditor
                          id="i3"
                          :editor="editor"
                          v-model="form.description"
                          :class="{
                            'is-invalid': submitted && $v.form.name.$invalid,
                          }"
                        ></ckeditor>
                        <div
                          v-if="submitted && !$v.form.name.required"
                          class="invalid-feedback"
                        >
                          Landing Page Description is required.
                        </div>
                      </b-form-group>

                      <div class="row">
                        <b-form-group
                          class="col-6"
                          :class="{
                            'form-group--error': $v.form.heading_text.$error,
                          }"
                        >
                          <label for="input-4"
                            >Heading Text <span style="color: red">*</span></label
                          >
                          <b-form-input
                            id="input-4"
                            @input="delayTouch($v.form.heading_text)"
                            placeholder="Enter Heading Text [Eg: PDUI - Demam Typoid - Mock Assessment Test]"
                            v-model="form.heading_text"
                            :class="{
                              'is-invalid':
                                submitted && $v.form.heading_text.$invalid,
                            }"
                          ></b-form-input>
                          <div
                            v-if="submitted && !$v.form.heading_text.required"
                            class="invalid-feedback"
                          >
                            Heading Text is required.
                          </div>
                          <div
                            class="error"
                            v-if="!$v.form.heading_text.maxLength"
                          >
                            Must have maximum
                            {{ $v.form.heading_text.$params.maxLength.max }}
                            characters.
                          </div>
                        </b-form-group>
                        <b-form-group
                          class="col-6"
                          id="input-group-6"
                          label="Landing Page Button Text"
                          label-for="input-10"
                          :class="{
                            'form-group--error':
                              $v.form.landing_page_button_text.$error,
                          }"
                        >
                          <b-form-input
                            v-model="form.landing_page_button_text"
                            id="input-10"
                            @input="delayTouch($v.form.landing_page_button_text)"
                          ></b-form-input>
                          <div
                            class="error"
                            v-if="!$v.form.landing_page_button_text.maxLength"
                          >
                            Must have maximum
                            {{
                              $v.form.landing_page_button_text.$params.maxLength
                                .max
                            }}
                            characters.
                          </div>
                        </b-form-group>
                      </div>

                      <div class="row">
                        <b-form-group id="input-group-5" class="col-6">
                          <label for="input-5"
                            >Minimum Passing Criteria (%)
                            <span style="color: red">*</span></label
                          >
                          <b-form-input
                            id="input-5"
                            type="number"
                            placeholder="Enter Passing Criteria"
                            v-model="form.passing_criteria"
                            :class="{
                              'is-invalid':
                                submitted && $v.form.passing_criteria.$invalid,
                            }"
                          ></b-form-input>
                          <div
                            v-if="submitted && !$v.form.passing_criteria.required"
                            class="invalid-feedback"
                          >
                            Passing Criteria is required.
                          </div>
                        </b-form-group>
                        <b-form-group
                          v-if="form.type == 'cme'"
                          class="col-6"
                          id="input-group-6"
                          label="CME Points"
                          label-for="input-8"
                        >
                          <b-form-input
                            id="input-8"
                            type="number"
                            placeholder="Enter CME Points"
                            v-model="form.points"
                          ></b-form-input>
                        </b-form-group>
                      </div>

                      <b-form-group
                        v-if="form.type == 'survey'"
                        label="Survey URL"
                        label-for="input-4"
                        :class="{
                          'form-group--error': $v.form.survey_url.$error,
                        }"
                      >
                        <b-form-input
                          id="input-4"
                          placeholder="Enter Survey URL"
                          @input="delayTouch($v.form.survey_url)"
                          v-model="form.survey_url"
                        ></b-form-input>
                        <div class="error" v-if="!$v.form.survey_url.maxLength">
                          Must have maximum
                          {{ $v.form.survey_url.$params.maxLength.max }}
                          characters.
                        </div>
                      </b-form-group>
                      <div class="row">
                        <b-form-group class="col-6" v-if="form.type == 'survey'">
                          <label for="input-9"
                            >Coin Type</label
                          >
                          <b-form-select
                            id="input-9"
                            :options="surveyCoins"
                            value-field="value"
                            text-field="text"
                            v-model="form.coins_type"
                          >
                          </b-form-select>
                        </b-form-group>
                        <b-form-group
                          v-if="form.type == 'survey'"
                          class="col-6"
                          id="input-group-12"
                          label="Coins"
                          label-for="input-12"
                        >
                          <b-form-input
                            id="input-12"
                            type="number"
                            placeholder="Enter Coins"
                            v-model="form.coins"
                          ></b-form-input>
                        </b-form-group>
                      </div>

                      <div class="row">
                        <b-form-group v-if="form.type == 'quiz'" label="Timer Status" label-for="input-11" class="col-6">
                          <b-form-select
                            id="input-11"
                            :options="timerstatus"
                            value-field="value"
                            text-field="text"
                            v-model="form.timer_status"
                          >
                          </b-form-select>
                        </b-form-group>
                        <b-form-group
                          v-if="form.type == 'quiz'"
                          class="col-6"
                          id="input-group-12"
                          label="Timer in Seconds"
                          label-for="input-13"
                        >
                          <b-form-input
                            id="input-13"
                            type="number"
                            placeholder="Enter Timer in Seconds"
                            v-model="form.time_in_seconds"
                          ></b-form-input>
                        </b-form-group>
                      </div>
                     
                      <div class="row">
                        <b-form-group
                          v-if="form.type == 'quiz'"
                          class="col-6"
                          id="input-group-12"
                          label="Negative Mark"
                          label-for="input-14"
                        >
                          <b-form-input
                            id="input-14"
                            type="number"
                            placeholder="Enter Negative Mark"
                            v-model="form.negative_mark"
                          ></b-form-input>
                        </b-form-group>
                        <b-form-group
                          v-if="form.type == 'quiz'"
                          class="col-6"
                          id="input-group-12"
                          label="Positive Mark"
                          label-for="input-15"
                        >
                          <b-form-input
                            id="input-15"
                            type="number"
                            placeholder="Enter Positive Mark"
                            v-model="form.positive_mark"
                          ></b-form-input>
                        </b-form-group>
                      </div>
      
                      <div class="row">
                        <b-form-group
                          class="col-6"
                          :class="{
                            'form-group--error': $v.form.pass_text.$error,
                          }"
                        >
                          <label for="input-21"
                            >Pass Text <span style="color: red">*</span></label
                          >
                          <b-form-input
                            id="input-21"
                            placeholder="Enter Pass Text [Eg: Thank You]"
                            @input="delayTouch($v.form.pass_text)"
                            v-model="form.pass_text"
                            :class="{
                              'is-invalid':
                                submitted && $v.form.pass_text.$invalid,
                            }"
                          ></b-form-input>
                          <div
                            v-if="submitted && !$v.form.pass_text.required"
                            class="invalid-feedback"
                          >
                            Pass Text is required.
                          </div>
                          <div class="error" v-if="!$v.form.pass_text.maxLength">
                            Must have maximum
                            {{ $v.form.pass_text.$params.maxLength.max }}
                            characters.
                          </div>
                        </b-form-group>
                        <b-form-group
                          class="col-6"
                          :class="{
                            'form-group--error': $v.form.pass_button_text.$error,
                          }"
                        >
                          <label for="input-22"
                            >Pass Button Text
                            <span style="color: red">*</span></label
                          >
                          <b-form-input
                            id="input-22"
                            placeholder="Enter Pass Button Text [Eg: Finish]"
                            v-model="form.pass_button_text"
                            :class="{
                              'is-invalid':
                                submitted && $v.form.pass_button_text.$invalid,
                            }"
                            @input="delayTouch($v.form.pass_button_text)"
                          ></b-form-input>
                          <div
                            v-if="submitted && !$v.form.pass_button_text.required"
                            class="invalid-feedback"
                          >
                            Pass Button Text is required.
                          </div>
                          <div
                            class="error"
                            v-if="!$v.form.pass_button_text.maxLength"
                          >
                            Must have maximum
                            {{ $v.form.pass_button_text.$params.maxLength.max }}
                            characters.
                          </div>
                        </b-form-group>
                      </div>

                      <div class="row">
                        <b-form-group
                          class="col-6"
                          label="Fail Text"
                          label-for="input-23"
                          :class="{
                            'form-group--error': $v.form.fail_text.$error,
                          }"
                        >
                          <b-form-input
                            id="input-23"
                            placeholder="Enter Fail Text"
                            v-model="form.fail_text"
                            @input="delayTouch($v.form.fail_text)"
                          ></b-form-input>
                          <div class="error" v-if="!$v.form.fail_text.maxLength">
                            Must have maximum
                            {{ $v.form.fail_text.$params.maxLength.max }}
                            characters.
                          </div>
                        </b-form-group>
                        <b-form-group
                          class="col-6"
                          label="Fail Button Text"
                          label-for="input-24"
                          :class="{
                            'form-group--error': $v.form.fail_button_text.$error,
                          }"
                        >
                          <b-form-input
                            id="input-24"
                            placeholder="Enter Fail Button Text"
                            v-model="form.fail_button_text"
                            @input="delayTouch($v.form.fail_button_text)"
                          ></b-form-input>
                          <div
                            class="error"
                            v-if="!$v.form.fail_button_text.maxLength"
                          >
                            Must have maximum
                            {{ $v.form.fail_button_text.$params.maxLength.max }}
                            characters.
                          </div>
                        </b-form-group>
                      </div>

                      <div class="row">
                        <b-form-group class="col-6" v-if="form.type == 'survey'">
                          <label for="input-3"
                            >Registration Template
                            </label
                          >
                          <b-form-select
                            id="input-3"
                            :options="registrations"
                            value-field="id"
                            text-field="template_name"
                            v-model="form.registration_template_id"
                          >
                          </b-form-select>
                        </b-form-group>
                        <b-form-group class="col-6" v-if="form.type == 'cme'">
                          <label for="input-25"
                            >Certificate Template
                            </label
                          >
                          <b-form-select
                            id="input-25"
                            value-field="id"
                            text-field="template_name"
                            v-model="form.certificate_template_id"
                            :options="certificateName"
                          >
                          </b-form-select>
                        </b-form-group>
                      </div>

                      <div class="row">
                        <b-form-group id="input-4" class="col-6">
                          <label for="input-grp-4">Allowed Member From</label>
                          <b-form-select
                            id="input-grp-4"
                            @input="changeMember"
                            v-model="form.allowed_members_from"
                            value-field="value"
                            text-field="text"
                            :options="allowedMembers">
                          </b-form-select>
                        </b-form-group>

                        <template v-if="isDataFilter">
                          <b-form-group
                            id="example-tel"
                            label="Data Filter"
                            label-for="i10"
                            class="col-6"
                          >
                            <b-form-select
                              id="i10"
                              v-model="form.data_filter_id"
                              value-field="id"
                              text-field="name"
                              :options="dataFilter"
                            >
                            </b-form-select>
                          </b-form-group>
                        </template>

                        <template v-if="isCSV">
                          <b-form-group
                          id="input-group-14"
                          label="Upload CSV"
                          label-for="input-29"
                          class="col-6"
                        >  
                            <b-form-file
                              id="input-29"
                              placeholder="Choose a file or drop it here ..."
                              @change="readFile($event, 'members_csv_file')"
                            ></b-form-file>
                            <template v-if="$route.name == 'edit-cme'">
                              <a :href="edit.members_csv_file_url">
                              Download CSV File</a>
                            </template>
                          </b-form-group>
                        </template>
                      </div>

                      <div class="row">
                        <b-form-group
                          id="input-group-4"
                          label="Landing Page Image [Upload Max File Size : 2MB]"
                          label-for="input-16"
                          class="col-4"
                        >
                          <b-form-file
                            id="input-16"
                            accept="image/*"
                            placeholder="Choose a file or drop it here... "
                            @change="readFile($event, 'landing_page_image')"
                            ref="landing_page_image"
                          ></b-form-file>
                          <template
                            v-if="
                              $route.name == 'edit-cme' &&
                              edit.landing_page_image_url
                            "
                          >
                            <img
                              :src="edit.landing_page_image_url"
                              width="128px"
                              height="128px"
                              style="object-fit: contain"
                            />
                          </template>
                          <template v-if="landing_page_image_url">
                            <img
                              :src="landing_page_image_url"
                              width="128px"
                              height="128px"
                              ref="landing_page_image_url"
                              style="object-fit: contain"
                            />
                          </template>
                        </b-form-group>
                         <b-form-group
                          id="input-group-9"
                          label="Mobile Background [Upload Max File Size : 2MB]"
                          label-for="input-18"
                          class="col-4"
                        >
                          <b-form-file
                            id="input-18"
                            accept="image/*"
                            placeholder="Choose a file or drop it here... "
                            @change="
                              readFile($event, 'survey_background_mobile_image')
                            "
                            ref="survey_background_mobile_image"
                          ></b-form-file>
                          <template
                            v-if="
                              $route.name == 'edit-cme' &&
                              edit.survey_background_mobile_image_url
                            "
                          >
                            <img
                              :src="edit.survey_background_mobile_image_url"
                              width="128px"
                              height="128px"
                            />
                          </template>
                          <template v-if="survey_background_mobile_image_url">
                            <img
                              :src="survey_background_mobile_image_url"
                              width="128px"
                              height="128px"
                              ref="survey_background_mobile_image_url"
                              style="object-fit: contain"
                            />
                          </template>
                        </b-form-group>
                         <b-form-group
                          class="col-4"
                          id="input-group-8"
                          label="Desktop Background [Upload Max File Size : 2MB]"
                          label-for="input-17"
                        >
                          <b-form-file
                            id="input-17"
                            accept="image/*"
                            placeholder="Choose a file or drop it here... "
                            @change="
                              readFile($event, 'survey_background_image')
                            "
                            ref="survey_background_image"
                          ></b-form-file>
                          <template
                            v-if="
                              $route.name == 'edit-cme' &&
                              edit.survey_background_image_url
                            "
                          >
                            <img
                              :src="edit.survey_background_image_url"
                              width="128px"
                              height="128px"
                              style="object-fit: contain"
                            />
                          </template>
                          <template v-if="survey_background_image_url">
                            <img
                              :src="survey_background_image_url"
                              width="128px"
                              height="128px"
                              ref="survey_background_image_url"
                              style="object-fit: contain"
                            />
                          </template>
                        </b-form-group>
                      </div>

                      <div class="row">
                         <b-form-group
                          id="input-group-11"
                          label="Pass Image [Upload Max File Size : 2MB]"
                          label-for="input-19"
                          class="col-4"
                        >
                          <b-form-file
                            id="input-19"
                            accept="image/*"
                            placeholder="Choose a file or drop it here... "
                            @change="readFile($event, 'pass_image')"
                            ref="pass_image"
                          ></b-form-file>
                          <template
                            v-if="
                              $route.name == 'edit-cme' && edit.pass_image_url
                            "
                          >
                            <img
                              :src="edit.pass_image_url"
                              width="128px"
                              height="128px"
                              style="object-fit: contain"
                            />
                          </template>
                          <template v-if="pass_image_url">
                            <img
                              :src="pass_image_url"
                              width="128px"
                              height="128px"
                              ref="pass_image_url"
                              style="object-fit: contain"
                            />
                          </template>
                        </b-form-group>
                         <b-form-group
                          id="input-group-14"
                          class="col-4"
                          label="Fail Image [Upload Max File Size : 2MB]"
                          label-for="input-20"
                        >
                          <b-form-file
                            id="input-20"
                            accept="image/*"
                            placeholder="Choose a file or drop it here... "
                            @change="readFile($event, 'fail_image')"
                            ref="fail_image"
                          ></b-form-file>
                          <template
                            v-if="
                              $route.name == 'edit-cme' && edit.fail_image_url
                            "
                          >
                            <img
                              :src="edit.fail_image_url"
                              width="128px"
                              height="128px"
                            />
                          </template>
                          <template v-if="fail_image_url">
                            <img
                              :src="fail_image_url"
                              width="128px"
                              height="128px"
                              ref="fail_image_url"
                              style="object-fit: contain"
                            />
                          </template>
                        </b-form-group>
                      </div>

                      <b-form-group id="input-group-10">
                        <div style="display: flex; gap: 10px">
                          <b-form-checkbox v-model="form.show_landing_page"
                            >Display Landing Page</b-form-checkbox
                          >
                          <b-form-checkbox v-model="form.allow_back"
                            >Back Allowed</b-form-checkbox
                          >
                          <b-form-checkbox v-model="form.allow_retest"
                            >Retest Allowed</b-form-checkbox
                          >
                          <b-form-checkbox v-model="form.show_result"
                            >Display Score</b-form-checkbox
                          >
                          <b-form-checkbox v-if="form.type == 'cme'" v-model="form.download_certificate"
                            >Download Certificate</b-form-checkbox
                          >
                          <b-form-checkbox v-model="form.show_rand_questions"
                            >Show Random Questions</b-form-checkbox
                          >
                          <b-form-checkbox v-model="form.status"
                            >Status</b-form-checkbox
                          >
                          <b-form-checkbox v-if="form.type == 'quiz'" v-model="form.negative_marks_status"
                            >Negative Mark Status</b-form-checkbox
                          >
                        </div>
                      </b-form-group>
                    </b-form>
                  </div>
                </div>
              </tab-content>
              <tab-content icon="mdi mdi-file-image">
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex align-items-center">
                      <i class="mdi mdi-file-plus-outline mr-2"></i>
                      <h6 class="mb-0">Add CME Question</h6>
                    </div>
                    <b-form-group class="my-2">
                      <label for="input-2"
                        >Question <span style="color: red">*</span></label
                      >
                      <div
                        class="row"
                        v-for="(val, index) in form.questions"
                        :key="index"
                      >
                        <!-- <template> -->
                        <div class="col-7">
                          <b-form-group>
                            <b-form-select
                              v-model="val.id"
                              :options="questionName"
                              value-field="id"
                              text-field="question"
                              :class="{
                                'is-invalid':
                                  submitted &&
                                  $v.form.questions.$each[key].id.$invalid,
                              }"
                            >
                            </b-form-select>
                            <div
                              v-if="
                                submitted &&
                                !$v.form.questions.$each[key].id.required
                              "
                              class="invalid-feedback"
                            >
                              Question is required.
                            </div>
                          </b-form-group>
                        </div>
                        <div class="col-3">
                          <b-form-group id="input-group-12">
                            <!-- <div> -->
                            <b-form-checkbox v-model="val.show_answer"
                              >Display Correct Answer</b-form-checkbox
                            >
                            <b-form-checkbox v-model="val.show_answer_details"
                              >Display Answer Details</b-form-checkbox
                            >
                            <!-- </div> -->
                          </b-form-group>
                        </div>
                        <div class="col-2">
                          <b-button
                            variant="success"
                            class="mr-3"
                            :disabled="val.id == 0"
                            @click.prevent="addQuestion(index)"
                            >Add</b-button
                          >
                          <b-button
                            variant="danger"
                            @click.prevent="removeQuestion(index)"
                            >Remove</b-button
                          >
                        </div>
                        <!-- </template> -->
                      </div>
                    </b-form-group>
                  </div>
                </div>
              </tab-content>
              <tab-content icon="mdi mdi-content-copy">
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex align-items-center">
                      <i class="mdi mdi-file-plus-outline mr-2"></i>
                      <h6 class="mb-0">Add New Attachment</h6>
                    </div>
                    <div  v-for="(val, index) in form.attachments" :key="index" >
                      <div class="row">
                        <b-form-group class="col-6">
                          <label for="input-26"
                            >Attachment Type
                            <span style="color: red">*</span></label
                          >
                          <b-form-select
                            id="input-26"
                            value-field="value"
                            text-field="name"
                            v-model="val.map_type"
                            :options="attachType"
                            @input="changeType"
                            :class="{
                              'is-invalid':
                                submitted && $v.form.attachments.$invalid,
                            }"
                          >
                          </b-form-select>
                          <div
                            v-if="submitted && !$v.form.attachments.required"
                            class="invalid-feedback"
                          >
                            Attachments is required.
                          </div>
                        </b-form-group>
                        <b-form-group
                          class="col-6"
                          v-if="val.map_type != null"
                          :label="
                            val.map_type == 'video'
                              ? 'Video'
                              : val.map_type == 'reading_material'
                              ? 'Reading Material'
                              : val.map_type == 'forum'
                              ? 'Forum'
                              : val.map_type == 'live_event'
                              ? 'Live Event'
                              : val.map_type == 'live_event_registration'
                              ? 'Live Event Registration'
                              : ''
                          "
                          label-for="type2"
                        >
                          <template
                            v-if="
                              val.map_type == 'video' ||
                              val.map_type == 'reading_material' ||
                              val.map_type == 'forum' ||
                              val.map_type == 'live_event' ||
                              val.map_type == 'live_event_registration'
                            "
                          >
                            <b-form-select
                              id="type2"
                              v-model="val.map_type_id"
                              :options="attachment"
                              value-field="id"
                              text-field="title"
                            >
                            </b-form-select>
                          </template>
                        </b-form-group>
                      </div>
                      <div class="row">
                        <b-form-group
                          class="col-6"
                          id="input-group-12"
                          label="When To Show (%)"
                          label-for="input-27"
                        >
                          <b-form-input
                            id="input-27"
                            type="number"
                            placeholder="Enter percentage (%) of showing CME on attachment"
                            v-model="val.when_to_show"
                          ></b-form-input>
                        </b-form-group>
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
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import MixinRequest from "../../../mixins/request";
import cmeMixin from "../../../mixins/ModuleJs/cme";
import { FormWizard, TabContent } from "vue-form-wizard";

import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import Multiselect from "vue-multiselect";
import { required, maxLength } from "vuelidate/lib/validators";

const touchMap = new WeakMap();

export default {
  data() {
    return {
      finalModel: {},
      submitted: false,
      interval: 0,
      slide: 0,
      sliding: null,
      title1: "Add CME",
      title2: "Edit CME",
      fields: [
        {
          key: "link_id",
          label: "Case Link ID",
        },
        {
          key: "images",
          label: "Item Image",
        },
        {
          key: "edit",
        },
        {
          key: "delete",
        },
      ],
      items: [
        {
          text: "Back",
          href: "/cme",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
    };
  },
  mixins: [MixinRequest, cmeMixin],
  validations: {
    form: {
      type: { required },
      name: { required, maxLength: maxLength(250) },
      description: { required },
      heading_text: { required, maxLength: maxLength(250) },
      survey_url: { maxLength: maxLength(250) },
      passing_criteria: { required },
      pass_text: { required, maxLength: maxLength(250) },
      fail_text: { required, maxLength: maxLength(250) },
      pass_button_text: { required, maxLength: maxLength(250) },
      fail_button_text: { maxLength: maxLength(250) },
      landing_page_button_text: { maxLength: maxLength(250) },
      attachments: { required },
      questions: {
        $each: {
          id: { required },
        },
      },
    },
  },
  components: {
    Layout,
    PageHeader,
    ckeditor: CKEditor.component,
    FormWizard,
    TabContent,
    // Multiselect,
  },
  methods: {
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    },
    delayTouch($v) {
      $v.$reset();
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },
    // validateFormOne() {
    //   this.submitted = true;
    //   if (this.$v.form.type.$invalid || this.$v.form.name.$invalid || this.$v.form.description.$invalid || this.$v.form.heading_text.$invalid || this.$v.form.passing_criteria.$invalid || this.$v.form.pass_text.$invalid || this.$v.form.pass_button_text.$invalid) {
    //     this.$store.commit("toast/updateStatus", {
    //       status: true,
    //       icon: "error",
    //       title: "Please Fill The Required Fields"
    //     });
    //   return false;
    //   }
    //   return true;
    // },
    //  validateFormTwo() {
    //   this.submitted = true;
    //    for (let index = 0; index < this.form.questions.length; index++) {
    //     console.log(this.$v.form.questions.$each[index].id.$invalid);
    //       if (this.$v.form.questions.$each[index].id.$invalid) {
    //           this.$store.commit("toast/updateStatus", {
    //           status: true,
    //           icon: "error",
    //           title: "Please Fill The Required Fields"
    //         });
    //       }
    //     }
    //   },
    //  validateFormThree() {
    //   this.submitted = true;
    //   if (this.$v.form.attachments.$invalid) {
    //     this.$store.commit("toast/updateStatus", {
    //       status: true,
    //       icon: "error",
    //       title: "Please Fill The Required Fields"
    //     });
    //   return false;
    //   }
    //   return true;
    // },
  },
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
