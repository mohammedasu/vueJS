<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row" id="role">
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
                      placeholder="Search Role"
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
                <div
                  class="d-flex align-items-center justify-content-end"
                  v-if="can('add-role')"
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
                  <router-link :to="{ name: 'add-role' }" class="opt"
                    >Add Role</router-link
                  >
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
                <template v-slot:cell(permissions)="row">
                  <div
                    :class="
                      row.item.permissions.length > 18 ? 'permissions' : ''
                    "
                    v-if="!readMore || row.item.id != index"
                  >
                    <span
                      v-for="permission in row.item.permissions"
                      :key="permission"
                      class="badge border border-secondary p-2 m-1"
                      style="font-size: 0.9rem"
                      >{{ permission }}</span
                    >
                    <div class="expand-btn">
                      <b-button
                        class="read-more"
                        v-if="row.item.permissions.length > 18"
                        @click="activateReadmore(row.item.id)"
                      >
                        <i class="fa fa-plus"></i> Click to Expand</b-button
                      >
                    </div>
                  </div>
                  <div
                    class="permissions1"
                    v-else-if="readMore || row.item.id != index"
                  >
                    <span
                      v-for="permission in row.item.permissions"
                      :key="permission"
                      class="badge border border-secondary p-2 m-1"
                      style="font-size: 0.9rem"
                      >{{ permission }}</span
                    >
                    <div class="collapse-btn">
                      <b-button
                        class="read-more"
                        @click="collapse(row.item.id)"
                      >
                        Collapse <i class="mdi mdi-archive-arrow-up-outline"></i
                      ></b-button>
                    </div>
                  </div>
                </template>
                <template v-can="'edit-role'" v-slot:cell(edit)="row">
                  <router-link
                    :to="{ name: 'edit-role', params: { id: row.item.id } }"
                  >
                    <i class="fa fa-edit edit-i"></i>
                  </router-link>
                </template>
                <template v-can="'delete-role'" v-slot:cell(delete)="row">
                  <div @click.prevent="deleteRole(row.item.id)">
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
import roleMixin from "../../../mixins/ModuleJs/role";

export default {
  mixins: [MixinRequest, roleMixin],
  data() {
    return {
      readMore: false,
      index: 0,
      title: "Role Management",
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
  methods: {
    activateReadmore(id) {
      this.readMore = true;
      this.index = id;
    },
    collapse(id) {
      this.readMore = false;
      this.index = id;
    },
  },
};
</script>
