<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row" id="universal-member-upload">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row justify-content-center">
              <div class="col-lg-6">
                <b-card
                  header-class="bg-transparent border-primary"
                  class="border border-primary d-flex justify-content-center"
                >
                  <template v-slot:header>
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <h5 class="my-0 text-primary d-flex">
                        <i class="ri-chat-upload-fill mr-1"></i>Upload Bulk
                      </h5>
                      <a
                        href="/sample_universal_upload.csv"
                        download
                        class="btn btn-primary btn-sm"
                      >
                        <i class="fa fa-download mr-1"></i> Download Sample File
                      </a>
                    </div>
                  </template>
                  <h5 class="card-title mt-0">Excel File:</h5>
                  <b-form-group
                    class="mt-2"
                    id="input-group-1"
                    label="Upload Excel File Here [Upload only .csv and .xlsx]"
                    label-for="input-1"
                  >
                    <b-form-file
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      id="input-1"
                      placeholder="Choose a file or drop it here..."
                      ref="file"
                    ></b-form-file>
                  </b-form-group>
                  <b-button
                    type="submit"
                    variant="success"
                    class="mr-2"
                    @click.prevent="fetchExcel"
                    >Upload</b-button
                  >
                </b-card>
              </div>
            </div>
            <div class="row align-items-center mb-4">
              <div class="col-md-12">
                <div class="form-inline navbar-search">
                  <div class="input-group">
                    <input
                       v-on:keyup="search"
                      name="title"
                      class="form-control bg-light border-0 small"
                      placeholder="Search..."
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                      v-model="filter"
                    />
                    <div class="input-group-append">
                      <button class="btn btn-search">
                        <i class="fas fa-search fa-sm"> </i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-responsive mb-0">
              <b-table
                striped
                bordered
                :items="tableData.data"
                :per-page="0"
                :current-page="currentPage"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
                responsive="sm"
                class="table-bordered table-hover"
                :key="key"
              >
                <!-- <template v-slot:cell(log_file)="row">
                    <a v-if="row.item.log_file != null" :href="row.item.log_file" download>Download</a>
                </template> -->
                <template v-slot:cell(status)="row">
                    <div v-if="row.item.status == 1">Completed</div>
                    <div v-else-if="row.item.status == 2">In Progress</div>
                    <div v-else>Processing</div>
                </template>
                <template
                  v-can="'update-ask-expert'"
                  v-slot:cell(case_status)="row"
                >
                  <select
                    size="sm"
                    class="form-control"
                    @input="updateStatus($event, row.item.ref_no)"
                  >
                    <option
                      value="under_review"
                      :selected="
                        row.item.case_status == 'under_review' ? 'selected' : ''
                      "
                    >
                      Under Review
                    </option>
                    <option
                      value="sent_to_expert"
                      :selected="
                        row.item.case_status == 'sent_to_expert'
                          ? 'selected'
                          : ''
                      "
                    >
                      Sent to Expert
                    </option>
                    <option
                      value="respond_to_user"
                      :selected="
                        row.item.case_status == 'respond_to_user'
                          ? 'selected'
                          : ''
                      "
                    >
                      Response to User
                    </option>
                    <option
                      value="publish"
                      :selected="
                        row.item.case_status == 'publish' ? 'selected' : ''
                      "
                    >
                      Publish
                    </option>
                  </select>
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div
                  class="dataTables_paginate paging_simple_numbers d-flex justify-content-end"
                >
                  <ul class="pagination pagination-rounded mb-0">
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="tableData.total"
                      :total-pages="tableData.total_pages"
                      :per-page="tableData.per_page"
                    ></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
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
import askExpertMixin from "../../../mixins/ModuleJs/universal-member-upload";

export default {
  mixins: [MixinRequest, askExpertMixin],
  data() {
    return {
      checked: false,
      title: "Unviversal Member",
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "List",
        },
      ],
    };
  },
  page: {
    title: "Ask Expert",
  },
  components: {
    Layout,
    PageHeader,
  },
};
</script>
