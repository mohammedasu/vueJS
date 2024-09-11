<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row" id="ask-expert">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
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
                <template v-slot:cell(is_active)="row">
                  <b-form-checkbox
                    switch
                    class="mb-1"
                    :checked="row.item.is_active == 1 ? true : ''"
                  >
                  </b-form-checkbox>
                </template>
                <template v-slot:cell(member)="row">
                  {{ row.item.member.fname }} {{ row.item.member.lname }}
                </template>
                <template v-slot:cell(details)="row">
                  <div style="font-weight: bold">
                    Questions:
                    <span style="font-weight: 400">{{
                      row.item.question
                    }}</span>
                  </div>
                  <div style="font-weight: bold">
                    Case History:
                    <span style="font-weight: 400">{{
                      row.item.case_history
                    }}</span>
                  </div>
                  <div style="font-weight: bold">
                    Presenting Complaints:
                    <span style="font-weight: 400">{{
                      row.item.presenting_complaints
                    }}</span>
                  </div>
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
import askExpertMixin from "../../../mixins/ModuleJs/ask-expert";

export default {
  mixins: [MixinRequest, askExpertMixin],
  data() {
    return {
      checked: false,
      title: "Ask Expert Management",
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
