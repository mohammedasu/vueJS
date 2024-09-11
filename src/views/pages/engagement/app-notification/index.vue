<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row" id="engagement">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row align-items-center mb-4">
              <div class="col-md-6">
                <div class="form-inline navbar-search">
                  <div class="input-group">
                    <input
                      name="title"
                      class="form-control bg-light border-0 small"
                      placeholder="Search..."
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                      v-model="filter"
                       v-on:keyup="search"
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
                  <div
                    class="d-flex align-items-center"
                    v-if="can('add-communication')"
                  >
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
                    <router-link :to="{ name: 'add-communication' }" class="opt"
                      >Add Notification</router-link
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
                :fields="fields"
                :sort-by.sync="sortBy"
                :per-page="0"
                :current-page="currentPage"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
                responsive="sm"
                class="table-bordered table-hover"
                :key="key"
              >
                <template v-slot:cell(is_processed)="row">
                  <div v-if="row.item.is_processed == 1">Completed</div>
                  <div v-else-if="row.item.is_processed == 0">Pending</div>
                  <div v-if="row.item.is_processed == 2">In Progress</div>
                </template>
                <template v-can="'edit-communication'" v-slot:cell(edit)="row">
                <template v-if="row.item.is_processed == 1 || row.item.is_processed == 2">
                  <i class="fa fa-edit is_processed_edit"></i>
                </template>
                <template v-else>
                  <router-link
                    :to="{
                      name: 'edit-communication',
                      params: { id: row.item.id },
                    }"
                  >
                    <i class="fa fa-edit edit-i"></i>
                  </router-link>
                </template>
                </template>
                <template v-slot:cell(action_type)="row">
                  {{ row.item.action_type }} : {{ row.item.action_id }}
                </template>
                <template
                v-slot:cell(delete)="row"
                  v-can="'delete-communication'"
                >
                  <template v-if="row.item.is_processed == 0">
                  <div @click.prevent="deleteAppNotification(row.item.id)">
                    <i class="mdi mdi-delete delete-i"></i>
                  </div>
                  </template>
                  <template v-else>
                    <div>
                      <i class="mdi mdi-delete is_processed_delete" ></i>
                    </div>
                  </template>
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
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import MixinRequest from "../../../../mixins/request";
import appNotificationMixin from "../../../../mixins/ModuleJs/app-notification";

export default {
  data() {
    return {
      title: "Notification Engagement Module",
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
  mixins: [MixinRequest, appNotificationMixin],
  components: {
    Layout,
    PageHeader,
  },
};
</script>
