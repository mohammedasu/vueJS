<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row" id="newsletter">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row align-items-center mb-4">
              <div class="col-md-6">
                <div class="form-inline navbar-search">
                  <div class="input-group">
                    <input
                       v-on:keyup="search"
                      name="title"
                      class="form-control bg-light border-0 small"
                      placeholder="Search Name"
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
              <div class="col-md-6">
                <div class="all-tabs">
                  <div class="d-flex align-items-center" v-if="can('add-cme')">
                    <svg
                      class="svg-inline--fa fa-table mx-2"
                      height="16px"
                      width="16px"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fa"
                      data-icon="table"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64v-96h160v96zm0-160H64v-96h160v96zm224 160H288v-96h160v96zm0-160H288v-96h160v96z"
                      ></path>
                    </svg>
                    <router-link
                      :to="{ name: 'add-cme' }"
                      class="podcast-options"
                      >Add CME</router-link
                    >
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
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
                responsive="sm"
                class="table-bordered table-hover"
                :key="key"
              >
                <template v-can="'update-cme-status'" v-slot:cell(status)="row">
                  <b-form-checkbox
                    switch
                    class="mb-1"
                    @change="updateStatus(row.item.id)"
                    :checked="row.item.status == 1 ? true : false"
                  >
                  </b-form-checkbox>
                </template>
                <template v-slot:cell(show_result)="row">
                  <span v-if="row.item.show_result == 1">Yes</span>
                  <span v-else>No</span>
                </template>
                <template v-slot:cell(show_landing_page)="row">
                  <span v-if="row.item.show_landing_page == 1">Yes</span>
                  <span v-else>No</span>
                </template>
                <template v-slot:cell(download_certificate)="row">
                  <span v-if="row.item.download_certificate == 1">Yes</span>
                  <span v-else>No</span>
                </template>
                <template v-slot:cell(allow_retest)="row">
                  <span v-if="row.item.allow_retest == 1">Yes</span>
                  <span v-else>No</span>
                </template>
                <template v-can="'edit-cme'" v-slot:cell(edit)="row">
                  <router-link
                    :to="{ name: 'edit-cme', params: { id: row.item.id } }"
                  >
                    <i class="fa fa-edit edit-i"></i>
                  </router-link>
                </template>
                <template v-can="'delete-cme'" v-slot:cell(delete)="row">
                  <div @click.prevent="deleteCME(row.item.id)">
                    <i class="mdi mdi-delete delete-i"></i>
                  </div>
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
import CMEMixin from "../../../mixins/ModuleJs/cme";

export default {
  mixins: [MixinRequest, CMEMixin],
  data() {
    return {
      checked: false,
      title: "CME Management",
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
  components: {
    Layout,
    PageHeader,
  },
};
</script>
