<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row" id="expert">
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
                      v-on:keyup="search"
                      name="title"
                      class="form-control bg-light border-0 small"
                      placeholder="Search Title"
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
                  <div
                    :class="activeTab == 'active' ? ' tab-options' : ''"
                    @click.prevent="fetchData('active')"
                    class="mx-2 opt"
                  >
                    Active
                  </div>
                  <template v-if="can('add-expert')">
                    |
                    <div
                      class="d-flex align-items-center"
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
                      <router-link
                        :to="{ name: 'add-expert' }"
                        class="podcast-options"
                        >Add Expert</router-link
                      >
                    </div>
                  </template>
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
                <template v-slot:cell(show_in_home)="row">
                  <template v-if="row.item.show_in_home">
                    <i class="mdi mdi-eye is_visible" v-b-tooltip.hover title="Visibile on Home Page" ></i>
                  </template>
                  <template v-else>
                    <i class="mdi mdi-eye-off is_visible" v-b-tooltip.hover title="Not Visibile on Home Page" ></i>
                  </template>
                </template>
                <template v-slot:cell(image_name)="row">
                  <img 
                    :src="row.item.image_name"
                    alt=""
                    class="thumbnail"
                  >
                </template>
                <template
                  v-can="'update-expert-status'"
                  v-slot:cell(is_active)="row"
                >
                  <b-form-checkbox
                    switch
                    class="mb-1"
                    @change="updateStatus(row.item.id)"
                    :checked="row.item.is_active == 1 ? true : false"
                  >
                  </b-form-checkbox>
                </template>
                <template
                  v-can="'update-expert-discussion-status'"
                  v-slot:cell(discussion_flag)="row"
                >
                  <b-form-checkbox
                    switch
                    class="mb-1"
                    @change="updateFlag(row.item.id)"
                    :checked="row.item.discussion_flag == 1 ? true : false"
                  >
                  </b-form-checkbox>
                </template>
                <template v-can="'edit-expert'" v-slot:cell(edit)="row">
                  <router-link
                    :to="{
                      name: 'edit-expert',
                      params: { id: row.item.id },
                    }"
                  >
                    <i class="fa fa-edit edit-i"></i>
                  </router-link>
                </template>
                <template
                  v-if="fields[fields.length - 1].key == 'delete'"
                  v-slot:cell(delete)="row"
                  v-can="'delete-expert'"
                >
                  <div
                    v-if="activeTab != 'trash'"
                    @click.prevent="deleteExpert(row.item.id)"
                  >
                    <i class="mdi mdi-delete delete-i"></i>
                  </div>
                </template>
                <template
                  v-else
                  v-slot:cell(restore)="row"
                  v-can="'restore-expert'"
                >
                  <div
                    v-if="activeTab == 'trash'"
                    @click.prevent="restoreExpert(row.item.id)"
                  >
                    <i class="mdi mdi-restore restore-i"></i>
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
import ExpertMixin from "../../../mixins/ModuleJs/expert";

export default {
  mixins: [MixinRequest, ExpertMixin],
  data() {
    return {
      title: "Expert Management",
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
