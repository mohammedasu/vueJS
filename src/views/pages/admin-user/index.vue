<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row" id="admin">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row align-items-center mb-4">
              <div class="col-md-6">
                <div
                  class="form-inline navbar-search"
                  v-if="activeTab == 'all'"
                >
                  <div class="input-group">
                    <input
                      name="title"
                      class="form-control bg-light border-0 small"
                      placeholder="Search Username"
                       v-on:keyup="search"
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
                  <div
                    :class="activeTab == 'all' ? ' tab-options' : ''"
                    @click.prevent="fetchData('all')"
                    class="mx-2 opt"
                  >
                    All
                  </div>
                  |
                  <div
                    :class="activeTab == 'trash' ? ' tab-options' : ''"
                    @click.prevent="fetchData('trash')"
                    class="mx-2 opt"
                  >
                    Trash
                  </div>
                  |
                  <div class="d-flex align-items-center">
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
                      v-can="'add-admin-user'"
                      :to="{ name: 'add-admin' }"
                      class="opt"
                      >Add Admin
                    </router-link>
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
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
                responsive="sm"
                class="table-bordered table-hover"
                :key="key"
              >
                <template v-slot:cell(role_name)="row">
                  <span
                    class="badge badge-success p-2"
                    style="font-size: 0.9rem"
                    >{{ row.item.role_name }}</span
                  >
                </template>
                <template v-can="'edit-admin-user'" v-slot:cell(edit)="row">
                  <router-link
                    :to="{ name: 'edit-admin', params: { id: row.item.id } }"
                  >
                    <i class="fa fa-edit edit-i"></i>
                  </router-link>
                </template>
                <template v-slot:cell(delete)="row">
                  <div
                    v-if="activeTab == 'trash' && can('restore-admin-user')"
                    @click.prevent="restoreAdmin(row.item.id)"
                  >
                    <i class="mdi mdi-restore restore-i"></i>
                  </div>
                  <div
                    v-else-if="activeTab != 'trash' && can('delete-admin-user')"
                    @click.prevent="deleteAdmin(row.item.id)"
                  >
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
import adminMixin from "../../../mixins/ModuleJs/admin-user";

export default {
  mixins: [MixinRequest, adminMixin],
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: "Admin",
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
};
</script>
