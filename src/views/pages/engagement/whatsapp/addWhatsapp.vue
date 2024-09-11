<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-form
              enctype="multipart/form-data"
              ref="engagement"
              @submit.prevent="
                $route.name == 'edit-whatsapp'
                  ? updateData($route.params.id)
                  : $route.name == 'add-whatsapp'
                  ? submitData
                  : ''
              "
            >
              <b-form-group
                id="input-group-1"
                label="Engagement Name"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="form.engagement_name"
                  placeholder="Enter Engagement Name"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="input-group-3"
                label="Content"
                label-for="input-3"
              >
                <b-form-textarea
                  id="textarea-rows"
                  v-model="form.content"
                  placeholder="Add your content here..."
                  rows="8"
                ></b-form-textarea>
              </b-form-group>
              <b-form-group
                id="input-group-2"
                label="Add Image"
                label-for="input-2"
              >
                <b-form-file
                  id="input-2"
                  accept="image/*"
                  placeholder="Choose a file or drop it here... [Upload Max File Size : 2MB]"
                  @change="readFile($event, 'image_bank_id')"
                ></b-form-file>
                <template
                  v-if="
                    $route.name == 'edit-whatsapp' && edit.image_bank_id_url
                  "
                >
                  <img
                    :src="edit.image_bank_id_url"
                    width="128px"
                    height="128px"
                  />
                </template>
              </b-form-group>
              <b-form-group
                id="example-date-time"
                label="Scheduled Time"
                label-for="date-time"
              >
                <b-form-input
                  id="date-time"
                  v-model="form.scheduled_time"
                  type="datetime-local"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-4" label-for="input-grp-4" label="Type">
                <b-form-select
                  id="input-grp-4"
                  @input="changeType"
                  v-model="form.type"
                  value-field="value"
                  text-field="text"
                  :options="type"
                >
                </b-form-select>
              </b-form-group>

              <template v-if="isDataFilter">
                <h6>From Data Filters</h6>
                <b-form-group
                  id="example-tel"
                  label="Select Data Filter"
                  label-for="tele"
                >
                  <b-form-select
                    id="input-grp-4"
                    v-model="form.data_filter_id"
                    value-field="value"
                    text-field="text"
                    :options="dataFilter"
                  >
                  </b-form-select>
                </b-form-group>
              </template>

              <template v-if="isCSV">
                <h6>From File</h6>
                <b-form-group
                  id="example-tel"
                  label="Select CSV"
                  label-for="tele"
                >
                  <b-form-file
                    accept=".csv"
                    placeholder="Choose a file or drop it here..."
                    ref="file"
                    @change="readFile($event, 'csv_file')"
                  ></b-form-file>
                  <template
                    v-if="$route.name == 'edit-whatsapp' && edit.csv_file_url"
                  >
                    <img
                      :src="edit.csv_file_url"
                      width="128px"
                      height="128px"
                    />
                  </template>
                </b-form-group>
              </template>

              <template v-if="isTestMob">
                <h6>
                  Test: Use this to check for sending to a individual member /
                  list (give comma seperated numbers)
                </h6>
                <b-form-group
                  id="input-group-1"
                  label="Member's Mobile Number"
                  label-for="input-1"
                >
                  <b-form-input
                    id="input-1"
                    v-model="form.mobile_numbers"
                    placeholder="Enter Member's Mobile Number"
                  ></b-form-input>
                </b-form-group>
              </template>

              <b-button
                type="button"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-whatsapp'"
                @click.prevent="submitData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="button"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-whatsapp'"
                @click.prevent="submitData()"
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
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import MixinRequest from "../../../../mixins/request";
import whatsappMixin from "../../../../mixins/ModuleJs/whatsapp";

export default {
  data() {
    return {
      title: "Whatsapp Engagement",
      items: [
        {
          text: "Back",
          href: "/whatsapp-engagement",
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
  },
  mixins: [MixinRequest, whatsappMixin],
};
</script>
