<template>
   <Layout>
      <template v-if="this.$route.name == 'add-dataFilters'">
         <PageHeader :title="title1" :items="items"></PageHeader>
      </template>
      <template v-else>
         <PageHeader :title="title2" :items="items"></PageHeader>
      </template>
      <div class="row">
         <div class="col-12">
            <div class="card">
               <div class="card-body">
                  <b-form enctype="multipart/form-data" ref="dataFilters">
                     <b-form-group id="input-group-1">
                        <label for="input-1"
                           >Data Filter Title
                           <span style="color: red">*</span></label
                        >
                        <b-form-input
                           id="input-1"
                           v-model="form.title"
                           placeholder="Enter Data Filter Title"
                           :class="{
                              'is-invalid': submitted && $v.form.title.$error,
                           }"
                        ></b-form-input>
                        <div
                           v-if="submitted && !$v.form.title.required"
                           class="invalid-feedback"
                        >
                           Data Filter Title is required.
                        </div>
                     </b-form-group>
                     <b-form-group
                        id="input-group-5"
                        label="Description"
                        label-for="input-5"
                     >
                        <ckeditor
                           id="input-5"
                           :editor="editor"
                           v-model="form.description"
                        ></ckeditor>
                     </b-form-group>

                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group label="Zone" label-for="zone">
                              <multiselect
                                 id="zone"
                                 v-model="form.zone_selected"
                                 :options="zone"
                                 :multiple="true"
                                 track-by="value"
                                 label="text"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="Zone: Negative"
                              label-for="zone-neg"
                           >
                              <multiselect
                                 id="zone-neg"
                                 v-model="form.zone_negative_selected"
                                 :options="zone"
                                 :multiple="true"
                                 track-by="value"
                                 label="text"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group label="Tier" label-for="tier">
                              <multiselect
                                 id="tier"
                                 v-model="form.tier_selected"
                                 :options="tier"
                                 :multiple="true"
                                 track-by="value"
                                 label="text"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="Tier: Negative"
                              label-for="tier-neg"
                           >
                              <multiselect
                                 id="tier-neg"
                                 v-model="form.tier_negative_selected"
                                 :options="tier"
                                 :multiple="true"
                                 track-by="value"
                                 label="text"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group label="Country" label-for="country">
                              <multiselect
                                 v-model="form.countries_selected"
                                 id="country"
                                 track-by="name"
                                 label="name"
                                 :options="country"
                                 :multiple="true"
                                 placeholder="Type here to search"
                                 :loading="isLoading"
                                 @search-change="fetchCountry"
                              > <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="Countries: Negative"
                              label-for="country_neg"
                           >
                              <multiselect
                                 id="country_neg"
                                 v-model="form.countries_negative_selected"
                                 :options="country"
                                 :multiple="true"
                                 track-by="name"
                                 label="name"
                                 @search-change="fetchCountry"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group label="State" label-for="state">
                              <multiselect
                                 id="state"
                                 v-model="form.state_selected"
                                 :options="states"
                                 :multiple="true"
                                 track-by="state"
                                 label="state"
                                 @search-change="fetchAllStates"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="State: Negative"
                              label-for="state-neg"
                           >
                              <multiselect
                                 id="state-neg"
                                 v-model="form.state_negative_selected"
                                 :options="states_negative"
                                 :multiple="true"
                                 track-by="state"
                                 label="state"
                                 @search-change="fetchAllStates"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group label="City" label-for="city">
                              <multiselect
                                 id="city"
                                 v-model="form.city_selected"
                                 :options="city_state"
                                 :multiple="true"
                                 track-by="city"
                                 label="city"
                                 placeholder="Type here to search"
                                 @search-change="fetchAllCities"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="City: Negative"
                              label-for="city-neg"
                           >
                              <multiselect
                                 id="city-neg"
                                 v-model="form.city_negative_selected"
                                 :options="city_state_negative"
                                 :multiple="true"
                                 track-by="city"
                                 label="city"
                                 placeholder="Type here to search"
                                 @search-change="fetchAllCities"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group label="Speciality" label-for="spec">
                              <multiselect
                                 id="spec"
                                 v-model="form.speciality_selected"
                                 :options="specialities"
                                 :multiple="true"
                                 track-by="title"
                                 label="title"
                                 @search-change="fetchSpeciality"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="Speciality: Negative"
                              label-for="spec-neg"
                           >
                              <multiselect
                                 id="spec-neg"
                                 v-model="form.speciality_negative_selected"
                                 :options="specialities"
                                 :multiple="true"
                                 track-by="title"
                                 label="title"
                                 @search-change="fetchSpeciality"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group
                              label="DigiMR Status"
                              label-for="digimr"
                           >
                              <multiselect
                                 id="digimr"
                                 v-model="form.digiMR_status"
                                 :options="digiMR_status"
                                 :multiple="true"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="DigiMR Status: Negative"
                              label-for="digimir-neg"
                           >
                              <multiselect
                                 id="digimr-neg"
                                 v-model="form.digiMR_negative_status"
                                 :options="digiMR_status"
                                 :multiple="true"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group
                              label="Whatsapp Active"
                              label-for="whatsapp"
                           >
                              <multiselect
                                 id="whatsapp"
                                 v-model="form.whatsapp_active_status"
                                 :options="whatsapp_active_status"
                                 :multiple="true"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="Whatsapp Active: Negative"
                              label-for="whatsapp-act"
                           >
                              <multiselect
                                 id="whatsapp-act"
                                 v-model="form.whatsapp_active_negative_status"
                                 :options="whatsapp_active_status"
                                 :multiple="true"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group label="SMS Active" label-for="sms">
                              <multiselect
                                 id="sms"
                                 v-model="form.sms_active_status"
                                 :options="sms_active_status"
                                 :multiple="true"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="SMS Active: Negative"
                              label-for="sms-act"
                           >
                              <multiselect
                                 id="sms-act"
                                 v-model="form.sms_active_negative_status"
                                 :options="sms_active_status"
                                 :multiple="true"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-md-6">
                           <b-form-group
                              label="User Type Status"
                              label-for="member"
                           >
                              <multiselect
                                 id="member"
                                 v-model="form.member_type"
                                 :options="member_types"
                                 :multiple="true"
                                 track-by="value"
                                 label="name"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                        <div class="col-md-6">
                           <b-form-group
                              label="User Type Status: Negative"
                              label-for="member-neg"
                           >
                              <multiselect
                                 id="member-neg"
                                 v-model="form.member_negative_type"
                                 :options="member_types"
                                 :multiple="true"
                                 track-by="value"
                                 label="name"
                                 placeholder="Type here to search"
                              >
                              <span slot="noOptions">
                                 Type here to search
                              </span>
                              </multiselect>
                           </b-form-group>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col-6">
                           <b-form-group
                              id="example-number"
                              label="Last Active Since"
                              label-for="number"
                           >
                              <b-form-input
                                 v-model="form.last_active_since"
                                 id="number"
                                 type="number"
                                 name="number"
                                 placeholder="Enter Last Active Since in Days"
                              ></b-form-input>
                           </b-form-group>
                        </div>
                     </div>
                     <template v-if="liveTypeCheck">
                        <h6>Live Event filter</h6>
                        <div class="row">
                           <div class="col-10">
                              <b-form-group
                                 id="input-group-2"
                                 label-for="input-3"
                                 label="Registered for Live Event"
                              >
                                 <multiselect
                                    id="input-3"
                                    v-model="form.live_event_registered"
                                    :options="liveEvent"
                                    :multiple="true"
                                    track-by="id"
                                    label="title"
                                    @search-change="fetchLiveEvent"
                                    placeholder="Type here to search"
                                 >
                                 <span slot="noOptions">
                                    Type here to search
                                 </span>
                                 </multiselect>
                              </b-form-group>
                           </div>
                           <div
                              class="col-2"
                              style="
                                 display: flex;
                                 align-items: center;
                                 padding-top: 10px;
                              "
                           >
                              <div style="display: flex; gap: 10px">
                                 <b-form-checkbox
                                    v-model="form.live_event_registered_check"
                                    >And/OR</b-form-checkbox
                                 >
                              </div>
                           </div>
                        </div>
                        <div class="row">
                           <div class="col-10">
                              <b-form-group
                                 id="input-group-3"
                                 label-for="input-3"
                                 label="Visited Live Event"
                              >
                                 <multiselect
                                    v-model="form.live_event_visited"
                                    :options="liveEvent"
                                    :multiple="true"
                                    track-by="id"
                                    label="title"
                                    @search-change="fetchLiveEvent"
                                    placeholder="Type here to search"
                                 >
                                 <span slot="noOptions">
                                    Type here to search
                                 </span>
                                 </multiselect>
                              </b-form-group>
                           </div>
                           <div
                              class="col-md-2"
                              style="
                                 display: flex;
                                 align-items: center;
                                 padding-top: 10px;
                              "
                           >
                              <div style="display: flex; gap: 10px">
                                 <b-form-checkbox
                                    v-model="form.live_event_visited_check"
                                    >And/OR</b-form-checkbox
                                 >
                              </div>
                           </div>
                        </div>
                        <div class="row">
                           <div class="col-6">
                              <b-form-group label="Live Event Partner">
                                 <multiselect
                                    v-model="form.live_event_partner"
                                    :options="partner"
                                    :multiple="false"
                                    track-by="id"
                                    label="title"
                                    placeholder="Type here to search"
                                    @search-change="fetchPartner"
                                 >
                                 <span slot="noOptions">
                                    Type here to search
                                 </span>
                                 </multiselect>
                              </b-form-group>
                           </div>
                           <div class="col-6">
                              <b-form-group label="Live Event Partner Division">
                                 <multiselect
                                    v-model="form.live_event_partner_division_id"
                                    :options="forum"
                                    :multiple="false"
                                    track-by="id"
                                    label="title"
                                    @search-change="fetchForum"
                                    placeholder="Type here to search"
                                 >
                                 <span slot="noOptions">
                                    Type here to search
                                 </span>
                                 </multiselect>
                              </b-form-group>
                           </div>
                        </div>
                     </template>
                     <template v-if="memberTypeCheck">
                        <h6>Member filter</h6>
                        <div class="row">
                           <div class="col-10">
                              <b-form-group
                                 id="input-group-2"
                                 label-for="input-2"
                                 label="Subscribed to Forum"
                              >
                                 <multiselect
                                    v-model="form.forum_subscription"
                                    :options="forum"
                                    :multiple="true"
                                    track-by="id"
                                    label="title"
                                    @search-change="fetchForum"
                                    placeholder="Type here to search"
                                 >
                                 <span slot="noOptions">
                                    Type here to search
                                 </span>
                                 </multiselect>
                              </b-form-group>
                           </div>
                           <div
                              class="col-2"
                              style="
                                 display: flex;
                                 align-items: center;
                                 padding-top: 10px;
                              "
                           >
                              <div style="display: flex; gap: 10px">
                                 <b-form-checkbox
                                    v-model="form.forum_subscription_check"
                                    >And/OR</b-form-checkbox
                                 >
                              </div>
                           </div>
                        </div>
                        <div class="row">
                           <div class="col-10">
                              <b-form-group
                                 id="input-group-3"
                                 label-for="input-3"
                                 label="Watched a Video"
                              >
                                 <multiselect
                                    v-model="form.video_watched"
                                    :options="videos"
                                    :multiple="true"
                                    track-by="id"
                                    label="title"
                                    @search-change="fetchVideo"
                                    placeholder="Type here to search"
                                 >
                                 <span slot="noOptions">
                                    Type here to search
                                 </span>
                                 </multiselect>
                              </b-form-group>
                           </div>
                           <div
                              class="col-md-2"
                              style="
                                 display: flex;
                                 align-items: center;
                                 padding-top: 10px;
                              "
                           >
                              <div style="display: flex; gap: 10px">
                                 <b-form-checkbox
                                    v-model="form.video_watched_check"
                                    >And/OR</b-form-checkbox
                                 >
                              </div>
                           </div>
                        </div>
                        <div class="row">
                           <div class="col-10">
                              <b-form-group
                                 id="input-group-4"
                                 label-for="input-4"
                                 label="Answered a Case"
                              >
                                 <multiselect
                                    v-model="form.answered_case"
                                    :options="cases"
                                    :multiple="true"
                                    track-by="id"
                                    label="title"
                                    @search-change="fetchCase"
                                    placeholder="Type here to search"
                                 >
                                 <span slot="noOptions">
                                    Type here to search
                                 </span>
                                 </multiselect>
                              </b-form-group>
                           </div>
                           <div
                              class="col-2"
                              style="
                                 display: flex;
                                 align-items: center;
                                 padding-top: 10px;
                              "
                           >
                              <div style="display: flex; gap: 10px">
                                 <b-form-checkbox
                                    v-model="form.answered_case_check"
                                    >And/OR</b-form-checkbox
                                 >
                              </div>
                           </div>
                        </div>
                        <div class="row">
                           <div
                              class="col-2"
                              style="
                                 display: flex;
                                 align-items: center;
                                 padding-bottom: 10px;
                              "
                           >
                              <div style="display: flex; gap: 10px">
                                 <b-form-checkbox v-model="form.member_is_prime"
                                    >Is Prime</b-form-checkbox
                                 >
                              </div>
                           </div>
                        </div>
                     </template>

                     <template v-if="$route.name == 'edit-dataFilters'">
                        <b-button
                           type="button"
                           variant="success"
                           class="mr-2"
                           @click.prevent="
                              updateData($route.params.id, 'store')
                           "
                           >Update Data</b-button
                        >
                        <b-button
                           type="button"
                           variant="primary"
                           class="mr-2"
                           @click.prevent="
                              updateData($route.params.id, 'check')
                           "
                           >Check Data</b-button
                        >
                        <h6 class="mt-3" v-if="action == 'check'">
                           Number of User selected: {{ count }}
                        </h6>
                     </template>
                     <template v-else-if="$route.name == 'add-dataFilters'">
                        <b-button
                           type="button"
                           variant="success"
                           class="mr-2"
                           @click.prevent="submitData('store')"
                           >Store Data</b-button
                        >
                        <b-button
                           type="button"
                           variant="primary"
                           class="mr-2"
                           @click.prevent="submitData('check')"
                           >Check Data</b-button
                        >
                        <h6 class="mt-3" v-if="action == 'check'">
                           Number of User selected: {{ count }}
                        </h6>
                     </template>
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
import datafilterMixin from "../../../mixins/ModuleJs/data-filters";
import Multiselect from "vue-multiselect";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { required } from "vuelidate/lib/validators";

export default {
   data() {
      return {
         submitted: false,
         title1: "Add Data Filters",
         title2: "Edit Data Filters",
         items: [
            {
               text: "Back",
               href: "/dataFilters",
            },
            {
               text: "Data",
            },
         ],
         editor: ClassicEditor,
         spec: [
            { label: "label1", value: "value1" },
            { label: "label2", value: "value2" },
         ],
      };
   },
   components: {
      Layout,
      PageHeader,
      Multiselect,
      ckeditor: CKEditor.component,
   },
   mixins: [datafilterMixin, MixinRequest],
   validations: {
      form: {
         title: { required },
      },
   },
};
</script>

