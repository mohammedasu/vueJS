<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row" id="cityState">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row align-items-center mb-4">
              <div class="col-md-12">
                <div class="form-inline navbar-search">
                  <div class="input-group">
                    <input
                      name="title"
                      class="form-control bg-light border-0 small"
                      placeholder="Search for..."
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                      value=""
                      v-model="filter"
                       v-on:keyup="search"
                    />
                    <div class="input-group-append">
                      <button class="btn btn-search" @click="search">
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
                <template v-can="'edit-cityState'" v-slot:cell(edit)="row">
                  <router-link
                    :to="{
                      name: 'edit-cityState',
                      params: { id: row.item.id },
                    }"
                    class="btn btn-info btn-xs"
                  >
                    <i class="fa fa-edit"></i>
                  </router-link>
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
import cityStateMixin from "../../../mixins/ModuleJs/citystate";

export default {
  mixins: [MixinRequest, cityStateMixin],
  data() {
    return {
      title: "CityState",
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
