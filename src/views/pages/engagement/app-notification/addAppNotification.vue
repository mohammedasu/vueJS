<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-communication'">
      <PageHeader :title="title1" :items="items"></PageHeader>
    </template>
    <template v-else>
      <PageHeader :title="title2" :items="items"></PageHeader>
    </template>
    <div class="row">
      <div class="col-8">
        <div class="card">
          <div class="card-body">
            <b-form
              enctype="multipart/form-data"
              ref="engagement"
              @submit.prevent="
                $route.name == 'add-app-notification' ? submitData : ''
              "
            >
              <b-form-group>
                <label for="input-2"
                  >Engagement Name <span style="color: red">*</span></label
                >
                <b-form-input
                  id="input-2"
                  v-model="form.engagement_name"
                  placeholder="Enter Engagement Name"
                  :class="{
                    'is-invalid': submitted && $v.form.engagement_name.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.engagement_name.required"
                  class="invalid-feedback"
                >
                  Engagement Name is required.
                </div>
              </b-form-group>
              <b-form-group label="Scheduled Date" label-for="input-6">
                <b-form-input
                  id="input-6"
                  v-model="form.scheduled_time"
                  type="datetime-local"
                  :min="disabledDates()"
                ></b-form-input>
              </b-form-group>

              <!-- <b-form-group label="Pick your Channel">
                <b-form-checkbox-group
                  id="checkbox-group-1"
                  v-model="form.notification_type"
                  :options="typeOpt"
                  :multiple="false"
                ></b-form-checkbox-group>
              </b-form-group> -->
              <b-form-group label="Pick your Channel" label-for="radio-group-1">
                <b-form-radio-group
                  id="radio-group-1"
                  v-model="form.notification_type"
                  :options="typeOpt"
                  name="radio-options"
                  @input="changeNotificationType"
                ></b-form-radio-group>
              </b-form-group>
              <template v-if="form.notification_type == 'whatsapp'">
                <b-form-group>
                  <label for="input-8">Pick Your Content <span style="color: red">*</span></label>
                  <b-form-select
                    id="input-8"
                    :key="action_key"
                    value-field="value"
                    text-field="text"
                    v-model="form.action_type"
                    :options="actionType"
                    @input="changeType"
                    :class="{'is-invalid': submitted && $v.form.action_type.$error}">
                  </b-form-select>
                  <div v-if="submitted && !$v.form.action_type.required" class="invalid-feedback">Pick your Content is required.</div>
                </b-form-group>
                <template v-if="form.action_type != null && form.action_type != 'custom'">
                  <b-form-group id="input-group-9"
                    :label="form.action_type == 'video'? 'Action ID : Video'
                          : form.action_type == 'newsletter' ? 'Action ID : Newsletter'
                          : form.action_type == 'case'? 'Action ID : Case'
                          : ''" 
                    label-for="input-9">
                    <template v-if="form.action_type == 'case' || form.action_type == 'newsletter' || form.action_type == 'video'">
                      <b-form-select 
                        id="input-9"
                        v-model="form.action_id"
                        :options="action_type"
                        value-field="id"
                        text-field="title"
                        :class="{'is-invalid': submitted && $v.form.action_id.$invalid}">
                      </b-form-select>
                      <div v-if="submitted && !$v.form.action_id.required" class="invalid-feedback">Action ID is required.</div>
                    </template>
                    <!-- <template v-else-if="form.action_type == 'newsletter'">
                      <b-form-select
                        id="input-9"
                        placeholder="Enter Action ID"
                        v-model="form.action_id"
                        :options="action_type"
                        value-field="id"
                        text-field="title"
                        :class="{'is-invalid': submitted && $v.form.action_id.$error}"
                        >
                      </b-form-select>
                      <div v-if="submitted && !$v.form.action_id.required" class="invalid-feedback">Action ID is required.</div>
                    </template>
                     <template v-else-if="form.action_type == 'video'">
                      <b-form-select
                        id="input-9"
                        placeholder="Enter Action ID"
                        v-model="form.action_id"
                        :options="action_type"
                        value-field="id"
                        text-field="title"
                        :class="{'is-invalid': submitted && $v.form.action_id.$error}">
                      </b-form-select>
                      <div v-if="submitted && !$v.form.action_id.required" class="invalid-feedback">Action ID is required.</div>
                    </template> -->
                  </b-form-group>
                </template>
                <template v-if="form.action_type == 'custom'">
                  <b-form-group>
                    <label for="input-10">Type Your Content <span style="color: red">*</span></label>
                    <b-form-textarea
                      id="input-10"
                      placeholder="Enter something..."
                      rows="3"
                      max-rows="6"
                      v-model="form.content"
                      :class="{'is-invalid': submitted && $v.form.content.$error}"
                      >
                    </b-form-textarea>
                    <div v-if="submitted && !$v.form.content.required" class="invalid-feedback">Content is required.</div>
                  </b-form-group>
                  <b-form-group
                    id="example-img"
                    label="Upload Image"
                    label-for="img"
                    class="mt-1"
                  >
                    <b-form-file
                      id="img"
                      accept="image/png, image/jpeg, image/jpg"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'image')"
                      ref="image"
                    ></b-form-file>
                    <template
                      v-if="$route.name == 'edit-communication' && edit.image_url"
                    >
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
                    <!-- <div v-if="submitted && !$v.image.required" class="invalid-feedback">Image is required.</div> -->
                  </b-form-group>
                </template>
                <b-form-group id="input-4">
                  <label for="input-grp-4">Pick Your Audience <span style="color: red">*</span></label>
                  <b-form-select
                    id="input-grp-4"
                    @input="changeSendType"
                    v-model="form.send_to_medium"
                    value-field="value"
                    text-field="text"
                    :options="sendToMedium"
                    :class="{'is-invalid': submitted && $v.form.send_to_medium.$error}">
                  </b-form-select>
                  <div v-if="submitted && !$v.form.send_to_medium.required" class="invalid-feedback">Pick Your Audience is required.</div>
                </b-form-group>
             
                <template v-if="isDataFilter">
                  <h6>From Data Filters</h6>
                  <b-form-group id="example-tel" label="Data Filter" label-for="i10">
                  <b-form-select
                    id="i10"
                    v-model="form.data_filter_id"
                    value-field="id"
                    text-field="name"
                    :options="dataFilter"
                    :class="{'is-invalid': submitted && $v.form.data_filter_id.$error}"
                    >
                  </b-form-select>
                   <div v-if="submitted && !$v.form.data_filter_id.required" class="invalid-feedback">Data Filter is required.</div>
                </b-form-group>
                </template>
                <template v-if="isCSV">
                  <h6>From File</h6>
                  <b-form-group class="mt-2">
                    <div class="d-flex justify-content-between">
                      <label for="input-11">Upload CSV File <span style="color: red;">*</span></label>
                      <a
                          href="/test_data_whatsapp.csv"
                          download
                        >
                          <i class="fa fa-download"></i> Download Sample CSV
                      </a>
                    </div>
                    <b-form-file
                      accept=".csv"
                      id="input-11"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'csv_file')"
                    ></b-form-file>
                    <template v-if="$route.name == 'edit-communication'">
                      <div class="mt-2">CSV File: {{ edit.csv_file_url }}</div>
                    </template>
                  </b-form-group>
                </template>
                <template v-if="isTestMob">
                  <b-card header-class="bg-transparent border-primary" class="border border-primary">
                    <div>
                      <h5 class="my-0 text-primary"><i class="mdi mdi-bullseye-arrow mr-3"></i>For Test</h5>
                      <b-form-group
                        id="example-tel"
                        label-cols-lg="4"
                        label="Enter Mobile Number"
                        label-for="i12">
                      <b-form-input
                        v-model="form.mobile_numbers"
                        class="col-8"
                        id="i12"
                        :class="{'is-invalid': submitted && $v.form.mobile_numbers.$error}">
                        >
                      </b-form-input>
                       <div v-if="submitted && !$v.form.mobile_numbers.required" class="invalid-feedback">Mobile Number is required</div>
                    </b-form-group>
                    </div>
                  </b-card>
                </template>
              </template>
              <template v-else-if="form.notification_type == 'app_notification'">
                <b-form-group>
                  <label for="input-6">Notification Title <span style="color: red;">*</span></label>
                  <b-form-input 
                    id="input-6" 
                    v-model="form.notification_title"
                    :class="{'is-invalid': submitted && $v.form.notification_title.$error}">
                  </b-form-input>
                  <div v-if="submitted && !$v.form.notification_title.required" class="invalid-feedback">Notification Title is required.</div>
                </b-form-group>
                <b-form-group>
                  <label for="input-7">Notification Description <span style="color: red;">*</span></label>
                  <b-form-input 
                    id="input-7" 
                    v-model="form.notification_description"
                    :class="{'is-invalid': submitted && $v.form.notification_description.$error}">
                  </b-form-input>
                  <div v-if="submitted && !$v.form.notification_description.required" class="invalid-feedback">Notification Description is required.</div>
                </b-form-group>
                <b-form-group id="example-tel">
                  <label for="tele">Device Type <span style="color: red;">*</span></label>
                  <b-form-select
                    id="tele"
                    v-model="form.device_type"
                    value-field="value"
                    text-field="text"
                    :options="deviceType"
                    :class="{'is-invalid': submitted && $v.form.device_type.$error}">
                  </b-form-select>
                  <div v-if="submitted && !$v.form.device_type.required" class="invalid-feedback">Device Type is required.</div>
                </b-form-group>
                <b-form-group>
                  <label for="input-8">Pick Your Content <span style="color: red">*</span></label>
                  <b-form-select
                    :key="action_key"      
                    id="input-8"
                    value-field="value"
                    text-field="text"
                    v-model="form.action_type"
                    :options="actionType"
                    :class="{'is-invalid': submitted && $v.form.action_type.$error}">
                  </b-form-select>
                  <div v-if="submitted && !$v.form.action_type.required" class="invalid-feedback">Pick your Content is required.</div>
                </b-form-group>
                <template v-if="form.action_type != null && form.action_type != 'custom'">
                  <b-form-group id="input-group-9"
                    :label="form.action_type == 'video'? 'Action ID : Video'
                          : form.action_type == 'newsletter' ? 'Action ID : Newsletter'
                          : form.action_type == 'case'? 'Action ID : Case'
                          : ''" 
                    label-for="input-9">
                    <template v-if="form.action_type == 'case' || form.action_type == 'newsletter' || form.action_type == 'video'">
                      <b-form-select 
                        id="input-9"
                        placeholder="Enter Action ID"
                        v-model="form.action_id"
                        :options="action_type"
                        value-field="id"
                        text-field="title"
                        :class="{'is-invalid': submitted && $v.form.action_id.$error}"
                        >
                      </b-form-select>
                      <div v-if="submitted && !$v.form.action_id.required" class="invalid-feedback">Action ID is required.</div>
                    </template>
                    <!-- <template v-else-if="form.action_type == 'newsletter'">
                      <b-form-select
                        id="input-9"
                        placeholder="Enter Action ID"
                        v-model="form.action_id"
                        :options="action_type"
                        value-field="id"
                        text-field="title"
                        :class="{'is-invalid': submitted && $v.form.action_id.$error}">
                      </b-form-select>
                      <div v-if="submitted && !$v.form.action_id.required" class="invalid-feedback">Action ID is required.</div>
                    </template>
                     <template v-else-if="form.action_type == 'video'">
                      <b-form-select
                        id="input-9"
                        placeholder="Enter Action ID"
                        v-model="form.action_id"
                        :options="action_type"
                        value-field="id"
                        text-field="title"
                        :class="{'is-invalid': submitted && $v.form.action_id.$error}">
                      </b-form-select>
                      <div v-if="submitted && !$v.form.action_id.required" class="invalid-feedback">Action ID is required.</div>
                    </template> -->
                  </b-form-group>
                </template>
                <b-form-group id="input-4">
                  <label for="input-grp-4">Pick Your Audience <span style="color: red">*</span></label>
                  <b-form-select
                    id="input-grp-4"
                    @input="changeSendType"
                    v-model="form.send_to_medium"
                    value-field="value"
                    text-field="text"
                    :options="sendToMedium"
                    :class="{'is-invalid': submitted && $v.form.send_to_medium.$error}">
                  </b-form-select>
                  <div v-if="submitted && !$v.form.send_to_medium.required" class="invalid-feedback">Pick Your Audience is required.</div>
                </b-form-group>

                <template v-if="isDataFilter">
                <h6>From Data Filters</h6>
                <b-form-group
                  id="example-tel"
                  label="Data Filter"
                  label-for="i10"
                >
                  <b-form-select
                    id="i10"
                    v-model="form.data_filter_id"
                    value-field="id"
                    text-field="name"
                    :options="dataFilter"
                    :class="{'is-invalid': submitted && $v.form.data_filter_id.$error}"
                  >
                  </b-form-select>
                  <!-- <autocomplete
                    source="dataFilter"
                    results-property="id"
                    results-display="name">
                  </autocomplete> -->
                  <div v-if="submitted && !$v.form.data_filter_id.required" class="invalid-feedback">Data Filter is required.</div>
                </b-form-group>
                </template>
                <template v-if="isCSV">
                  <h6>From File</h6>
                  <b-form-group class="mt-2">
                    <b-form-file
                      accept=".csv"
                      id="input-11"
                      placeholder="Choose a file or drop it here..."
                      @change="readFile($event, 'csv_file')"
                    ></b-form-file>
                    <template v-if="$route.name == 'edit-communication'">
                      <div class="mt-2">CSV File: {{ edit.csv_file_url }}</div>
                    </template>
                    <!-- <div v-if="submitted && !$v.csv_file.required" class="invalid-feedback">CSV File is required</div> -->
                  </b-form-group>
                </template>
                <template v-if="isTestMob">
                  <b-card
                    header-class="bg-transparent border-primary"
                    class="border border-primary"
                  >
                    <div>
                      <h5 class="my-0 text-primary">
                        <i class="mdi mdi-bullseye-arrow mr-3"></i>For Test
                      </h5>
                      <b-form-group
                      id="example-tel"
                      label-cols-lg="4"
                      label="Enter Mobile Number"
                      label-for="i12"
                    >
                      <b-form-input
                        v-model="form.mobile_numbers"
                        class="col-8"
                        id="i12"
                        :class="{'is-invalid': submitted && $v.form.mobile_numbers.$error}"
                      ></b-form-input>
                      <div v-if="submitted && !$v.form.mobile_numbers.required" class="invalid-feedback">Mobile Number is required</div>
                    </b-form-group>
                    </div>
                  </b-card>
                </template>
              </template>
              
              <template v-if="$route.name == 'edit-communication'">
                <b-button
                  type="button"
                  variant="primary"
                  class="mr-2"
                  @click.prevent="updateData($route.params.id)"
                  >Update Message</b-button
                >
              </template>
              <template v-else-if="$route.name == 'add-communication'">
                <b-button
                  type="button"
                  variant="success"
                  class="mr-2"
                  @click.prevent="submitData"
                  >Store Message</b-button
                >
                <b-button
                  type="button"
                  variant="primary"
                  class="mr-2"
                  @click.prevent="checkData"
                  >Check Message</b-button
                >
              </template>
            </b-form>
          </div>
        </div>
      </div>
      <div class="col-4 d-flex justify-content-center">
        <div class="position-absolute">
          <img src="/asset.jpg" alt="" class="position-relative" />
          <div class="card app-card">
            <template v-if="form.notification_type == 'whatsapp'">
              <div class="card-img mb-2">
                <img
                  :src="`${form.image}`"
                  alt=""
                  height="80px"
                  width="147px"
                  style="border-radius: 10px"
                />
              </div>
              <div class="card-body px-0 py-0">
                <h6 class="mb-0">Dear Dr. [Name]</h6>
                <div class="app-notification">
                  <div v-for="items in form.contentParams" :key="items.id">
                    {{ items }}
                  </div>
                </div>
                <h6 class="mb-1">Regards,</h6>
                <h6 class="mb-0">Team Medisage</h6>
              </div>
            </template>
            <template v-else-if="form.notification_type == 'app_notification'">
              <h5 class="title">{{ form.notification_title }}</h5>
              <h6 class="desc">{{ form.notification_description }}</h6>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import MixinRequest from "../../../../mixins/request";
import appNotificationMixin from "../../../../mixins/ModuleJs/app-notification";
import { required, requiredIf } from "vuelidate/lib/validators";

// import Autocomplete from 'vuejs-auto-complete'

export default {
  data() {
    return {
      submitted: false,
      title1: "Add Engagement",
      title2: "Edit Engagement",
      items: [
        {
          text: "Back",
          href: "/communication",
        },
        {
          text: "Data",
        },
      ],
    };
  },
  components: {
    Layout,
    PageHeader,
    // Autocomplete
  },
  mixins: [MixinRequest, appNotificationMixin],
  validations: {
    form: {
      engagement_name: { required },
      notification_type: { required },
      send_to_medium: { required },
      action_type: { required: requiredIf(form => form.action_type != 'custom') },
      action_id: { required: requiredIf(form => form.action_type != 'custom') },
      notification_title: { required: requiredIf(form => form.notification_type === "app_notification") },
      notification_description: { required: requiredIf(form => form.notification_type === "app_notification") },
      device_type: { required: requiredIf(form => form.notification_type === "app_notification") },
      content: { required: requiredIf(form => form.action_type == 'custom' && form.notification_type == 'whatsapp') },
      data_filter_id: { required: requiredIf(form => form.send_to_medium == 'data_filter') },
      mobile_numbers: { required: requiredIf(form => form.send_to_medium == 'test') },
    },
    // image: { required: requiredIf(form => form.action_type == 'custom' && form.notification_type == 'whatsapp') }
  },
  methods: {
    disabledDates() {
      return new Date().toISOString().slice(0, 16); 
    },
  }
};
</script>
 