<template>
  <Layout>
    <PageHeader :title="title" :items="items"></PageHeader>
    <template v-if="tableData.length > 0">
      <div class="row" id="caseComment">
        <div class="col-12">
          <div class="row">
            <div class="col-md-12">
              <div
                class="card"
                v-for="case_comment in tableData"
                :key="case_comment.id"
              >
                <div class="media">
                  <a class="pr-3" href="#">
                    <span
                      :data-letters="
                        case_comment.member.first_name.toUpperCase().charAt(0) +
                        case_comment.member.last_name.toUpperCase().charAt(0)
                      "
                    ></span>
                  </a>
                  <div class="media-body">
                    <div class="row">
                      <div class="col-12 d-flex">
                        <h5>
                          {{
                            case_comment.member.first_name +
                            " " +
                            case_comment.member.last_name
                          }}
                        </h5>
                      </div>
                    </div>
                    <div v-html="case_comment.comment"></div>
                    <div>
                      <b-form-checkbox
                        switch
                        class="mb-1"
                        @change="updateCommentStatus(case_comment.id)"
                        :checked="case_comment.is_approved == 1 ? true : false"
                      >
                      </b-form-checkbox>
                    </div>
                    <template v-if="case_comment.replies.length > 0">
                      <div
                        class="media mt-3"
                        v-for="reply in case_comment.replies"
                        :key="reply.id"
                      >
                        <a class="pr-3" href="#">
                          <span
                            :data-letters="
                              reply.member.first_name.toUpperCase().charAt(0) +
                              reply.member.last_name.toUpperCase().charAt(0)
                            "
                          ></span>
                        </a>
                        <div class="media-body">
                          <div class="row">
                            <div class="col-12 d-flex">
                              <h5>
                                {{
                                  reply.member.first_name +
                                  " " +
                                  reply.member.last_name
                                }}
                              </h5>
                            </div>
                          </div>
                          <div v-html="reply.comment"></div>
                          <div>
                            <b-form-checkbox
                              v-model="reply.is_approved"
                              switch
                              class="mb-1"
                              @change="updateCommentStatus(reply.id)"
                              :checked="reply.is_approved == 1 ? true : false"
                            >
                            </b-form-checkbox>
                          </div>
                          <template v-if="reply.replies.length > 0">
                            <div
                              class="media mt-3"
                              v-for="nested_reply in reply.replies"
                              :key="nested_reply.id"
                            >
                              <a class="pr-3" href="#">
                                <span
                                  :data-letters="
                                    nested_reply.member.first_name
                                      .toUpperCase()
                                      .charAt(0) +
                                    nested_reply.member.last_name
                                      .toUpperCase()
                                      .charAt(0)
                                  "
                                ></span>
                              </a>
                              <div class="media-body">
                                <div class="row">
                                  <div class="col-12 d-flex">
                                    <h5>
                                      {{
                                        nested_reply.member.first_name +
                                        " " +
                                        nested_reply.member.last_name
                                      }}
                                    </h5>
                                  </div>
                                </div>
                                <div v-html="nested_reply.comment"></div>
                                <div>
                                  <b-form-checkbox
                                    v-model="nested_reply.is_approved"
                                    switch
                                    class="mb-1"
                                    @change="
                                      updateCommentStatus(nested_reply.id)
                                    "
                                    :checked="
                                      nested_reply.is_approved == 1
                                        ? true
                                        : false
                                    "
                                  >
                                  </b-form-checkbox>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <div class="col-lg-12">
          <b-card
            header-class="bg-transparent border-primary"
            class="border border-primary"
          >
            <template>
              <h5 class="my-4 text-primary text-center">NO DATA FOUND !!!</h5>
            </template>
          </b-card>
        </div>
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import MixinRequest from "../../../mixins/request";
import caseMixin from "../../../mixins/ModuleJs/case";
import { cases } from "../../../js/path";

export default {
  data() {
    return {
      title: "Case Question Comment",
      dataContent: " ",
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "List of Comment Case Questions",
        },
      ],
      tableData: [],
    };
  },
  mixins: [caseMixin, MixinRequest],
  components: {
    Layout,
    PageHeader,
  },
  methods: {
    async fetchCaseQuestionComment() {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = cases.caseUrl + "/" + this.$route.params.id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.tableData = responseData.comments;
          this.dataContent;
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
  },
};
</script>
