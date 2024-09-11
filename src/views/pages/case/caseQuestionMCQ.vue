<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <div class="row" id="case">
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
                      value=""
                      v-model="filter"
                    />
                    <div class="input-group-append">
                      <button class="btn btn-primary">
                        <i class="fas fa-search fa-sm"> </i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-responsive mb-0">
              <b-table
                :items="tableData"
                :fields="fields"
                :sort-by.sync="sortBy"
                :per-page="0"
                :current-page="currentPage"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
                responsive="sm"
                class="table-bordered"
                :key="key"
              >
                <template
                  v-can="'delete-case-question-mcq'"
                  v-slot:cell(delete)="row"
                >
                  <button
                    class="btn btn-danger"
                    @click.prevent="deleteCaseMCQ(row.item.id)"
                  >
                    Delete
                  </button>
                </template>
              </b-table>
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
import { cases } from "../../../js/path";

export default {
  data() {
    return {
      title: "Case Question MCQ",
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "List of MCQ Case Questions",
        },
      ],
      filter: null,
      tableData: [],
      sortBy: "id",
      sortDesc: true,
      filterOn: [],
      currentPage: 1,
      key: 0,
      fields: [
        {
          key: "id",
        },
        {
          key: "question",
        },
        {
          key: "answer",
        },
        {
          key: "type",
        },
        {
          key: "delete",
        },
      ],
    };
  },
  mixins: [MixinRequest],
  components: {
    Layout,
    PageHeader,
  },
  methods: {
    async fetchCaseQuestionMCQ() {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = cases.caseUrl + "/" + this.$route.params.id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.tableData = responseData.questions;
        }
      } catch (err) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Please try again!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  created() {
    this.fetchCaseQuestionMCQ();
  },
};
</script>
