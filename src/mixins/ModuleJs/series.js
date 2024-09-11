import {
  series,
  expert,
  forum,
  partner,
  community,
  knowledgeCategory,
  video,
} from "../../js/path";

export default {
  data() {
    return {
      series_id: null,
      table_header: [],
      fields: [
        {
          key: "id",
          sortable: true,
        },
        {
          key: "title",
          label: 'Series Title'
        },
        {
          key: "is_active",
          label: "Active",
        },
        {
          key: "edit",
        },
        {
          key: "delete",
        },
      ],
      params: "",
      tableData: [],
      activeTab: "all",
      key: 0,
      currentPage: 1,
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      forum: [],
      partner: [],
      community: [],
      expert: [],
      knowledgeCategory: [],
      videos: [],
      form: {
        title: "",
        description: "",
        meta_title: "",
        meta_desc: "",
        meta_keywords: "",
        community_selected: [],
        partner_id: "",
        partner_division_id: "",
        expert_selected: [],
        knowledge_categories: [],
        video_selected: [],
        survey_fail: 0,
      },
      image_name_url: "",
      image_name: "",
      edit: {
        image_name_url: null,
      },
    };
  },
  methods: {
    // search() {
    //   if (this.filter.length > 1) this.fetchData(this.activeTab);
    //   else if (this.filter.length == 0) this.fetchData(this.activeTab);
    // },
    search(event) {
      if (this.filter.length > 1) {
        if (event.keyCode == 13) {
          this.fetchData(this.activeTab);
        }
      }
      else if (this.filter.length == 0) this.fetchData(this.activeTab);
    },
    addTag(newTag) {
      this.form.community_selected.push(newTag);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchCommunity() {
      const url = community.fetchAllActiveCommunity;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.community = responseData;
      }
      if (this.$route.name == "edit-series") {
        let comm = [];

        if (this.form.community_selected != "") {
          this.form.community_selected.map((item) => {
            comm.push(item.community_id);
          });

          this.form.community_selected = this.community.filter((item) => {
            if (comm.includes(item.id)) {
              return item;
            }
          });
        }
      }
    },
    async fetchExpert() {
      const url = expert.fetchAllActiveExpert;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.expert = responseData;
      }
      if (this.$route.name == "edit-series") {
        let exp = [];
        if (this.form.expert_selected != "") {
          this.form.expert_selected.map((item) => {
            exp.push(item.expert_id);
          });

          this.form.expert_selected = this.expert.filter((item) => {
            if (exp.includes(item.id)) {
              return item;
            }
          });
        }
      }
    },
    async fetchPartner() {
      const url = partner.fetchAllActivePartner;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.partner = responseData;
      }
    },
    async fetchForum() {
      const url = forum.fetchAllActiveForum;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.forum = responseData;
      }
    },
    async fetchVideo() {
      const url = video.fetchAllActiveVideo;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.videos = responseData;
      }
      if (this.$route.name == "edit-series") {
        let video = [];

        if (this.form.video_selected != "") {
          this.form.video_selected.map((item) => {
            video.push(item.video_id);
          });

          this.form.video_selected = this.videos.filter((item) => {
            if (video.includes(item.id)) {
              return item;
            }
          });
        }
      }
    },
    async fetchKnowledgeCategory() {
      const url = knowledgeCategory.fetchAllActiveKnowledgeCategory;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.knowledgeCategory = responseData;
      }
      if (this.$route.name == "edit-series") {
        let knowledgeCat = [];

        if (this.form.knowledge_categories != "") {
          this.form.knowledge_categories.map((cat) => {
            knowledgeCat.push(cat.knowledge_category_id);
          });

          this.form.knowledge_categories = this.knowledgeCategory.filter(
            (item) => {
              if (knowledgeCat.includes(item.id)) {
                return item;
              }
            }
          );
        }
      }
    },
    async fetchData(txt) {
      let url = null;
      if (txt == "active") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = series.seriesUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = series.seriesUrl + "?filter=" + txt;
        }
      } else if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = series.seriesUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = series.seriesUrl + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = series.seriesUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = series.seriesUrl + "?filter=" + txt;
        }
      }
      url += this.params;
      this.$store.commit("loader/updateStatus", true);
      try {
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.tableData = responseData;
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
    async fetchSeries(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = series.seriesUrl + "/" + id;
        this.$store.commit("loader/updateStatus", true);
        const data = await this.getRequest(url);
        this.$store.commit("loader/updateStatus", false);

        if (data.status) {
          const responseData = data.response;

          if(responseData.title != "" && responseData.title != null){
            this.form.title = responseData.title;
          }

          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
          }

          if(responseData.meta_title != "" && responseData.meta_title != null){
            this.form.meta_title = responseData.meta_title;
          }
          
          if(responseData.meta_desc != "" && responseData.meta_desc != null){
            this.form.meta_desc = responseData.meta_desc;
          }
          
          if(responseData.meta_keywords != "" && responseData.meta_keywords != null){
            this.form.meta_keywords = responseData.meta_keywords;
          }

          if (responseData.survey_fail) {
            this.form.survey_fail = true;
          }

          if(responseData.partner_id != "" && responseData.partner_id != null){
            this.form.partner_id = responseData.partner_id;
          }

          if(responseData.partner_division_id != "" && responseData.partner_division_id != null){
            this.form.partner_division_id = responseData.partner_division_id;
          }

          this.form.community_selected = responseData.community;
          this.form.expert_selected = responseData.expert;
          this.form.knowledge_categories = responseData.knowledge_category;
          this.form.video_selected = responseData.series_item;

          this.edit.image_name_url = responseData.image_name;

          this.series_id = responseData.id;

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
    readFile(e, txt) {
      if (txt == "image_name") {
        this.image_name = e.target.files[0];
        if (this.image_name.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.image_name.reset();
          this.image_name_url = '';
          this.edit.image_name_url = '';
          this.image_name = '';
          return false;
        } else {
          this.image_name_url = URL.createObjectURL(this.image_name);
          this.edit.image_name_url = '';
        }
        return true;
      }
    },
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = series.seriesUrl;
        if (this.$route.name == "edit-series") {
          url = series.seriesUrl + "/" + this.series_id;
        }
        let dataAppend = new FormData();
        dataAppend.append("image_name", this.image_name);
        for (var key in this.form) {
          if (
            key != "community_selected" &&
            key != "expert_selected" &&
            key != "knowledge_categories" &&
            key != "video_selected"
          ) {
            dataAppend.append(key, this.form[key]);
          }
        }
        this.form.community_selected.map((key) => {
          dataAppend.append("community_selected[]", key.id);
        });
        this.form.expert_selected.map((key) => {
          dataAppend.append("expert_selected[]", key.id);
        });
        this.form.knowledge_categories.map((key) => {
          dataAppend.append("knowledge_categories[]", key.id);
        });
        this.form.video_selected.map((key) => {
          dataAppend.append("video_selected[]", key.id);
        });
        if (this.form.survey_fail) {
          dataAppend.append("survey_fail", 1);
        } else {
          dataAppend.append("survey_fail", 0);
        }
        if (this.$route.name == "edit-series") {
          dataAppend.append("_method", "put");
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/series");
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
    // async updateData(id) {
    //   try {
    //     this.submitted = true;
    //     this.$v.$touch();
    //     if (this.$v.$invalid) {
    //       this.$store.commit("toast/updateStatus", {
    //         status: true,
    //         icon: "error",
    //         title: "Please Fill The Required Fields"
    //       });
    //       return false;
    //     }
    //     this.$store.commit("loader/updateStatus", true);
    //     const url = series.seriesUrl + "/" + id;
    //     let dataAppend = new FormData();
    //     if (this.image_name) {
    //       dataAppend.append("image_name", this.image_name);
    //     }
    //     for (var key in this.form) {
    //       if (
    //         key != "community_selected" &&
    //         key != "expert_selected" &&
    //         key != "knowledge_categories" &&
    //         key != "video_selected"
    //       ) {
    //         dataAppend.append(key, this.form[key]);
    //       }
    //     }
    //     this.form.community_selected.map((key) => {
    //       dataAppend.append("community_selected[]", key.id);
    //     });
    //     this.form.expert_selected.map((key) => {
    //       dataAppend.append("expert_selected[]", key.id);
    //     });
    //     this.form.knowledge_categories.map((key) => {
    //       dataAppend.append("knowledge_categories[]", key.id);
    //     });
    //     this.form.video_selected.map((key) => {
    //       dataAppend.append("video_selected[]", key.id);
    //     });
    //     if (this.form.survey_fail) {
    //       dataAppend.append("survey_fail", 1);
    //     } else {
    //       dataAppend.append("survey_fail", 0);
    //     }
    //     dataAppend.append("_method", "put");
    //     const data = await this.postRequest(url, dataAppend);
    //     if (data.status) {
    //       this.$store.commit("toast/updateStatus", {
    //         status: true,
    //         icon: "success",
    //         title: data.message,
    //       });
    //       this.$router.push("/series");
    //     }
    //   } catch (err) {
    //     this.$store.commit("toast/updateStatus", {
    //       status: true,
    //       icon: "error",
    //       title: err.data ? err.data.message : "Please try again!",
    //     });
    //   }
    //   this.$store.commit("loader/updateStatus", false);
    // },
    async updateStatus(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = series.statusUpdate;
        const data = await this.postRequest(url, {
          is_active: !this.tableData.data[index].is_active,
          id: id,
        });
        if (data.status) {
          this.tableData.data[index].is_active =
            !this.tableData.data[index].is_active;
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
        }
        this.key += 1;
      } catch (err) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Please try again!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    async deleteSeries(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = series.seriesUrl + "/" + id;
        const data = await this.postRequest(url, {
          _method: "DELETE",
        });
        if (data.status) {
          this.tableData.data.splice(index, 1);
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
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
    async restoreSeries(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = series.restoreSeries + "/" + id;
        const data = await this.postRequest(url);
        if (data.status) {
          this.tableData.data.splice(index, 1);
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
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
    tabActive() {
      if (this.activeTab == "trash") {
        if (this.table_header.includes("delete")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          this.fields[index] = {
            key: "restore",
          };
          let table_index = this.table_header.findIndex(
            (item) => item == "delete"
          );
          this.table_header[table_index] = "restore";
        } else {
          this.table_header.push("restore");
          this.fields.push({
            key: "restore",
          });
        }

        if (!this.can("restore-series")) {
          let index = this.fields.findIndex((item) => item.key == "restore");
          if (index !== -1) {
            this.fields.splice(index, 1);
            let table_index = this.table_header.findIndex(
              (item) => item == "restore"
            );
            this.table_header.splice(table_index, 1);
          }
        }

        let index = this.fields.findIndex((item) => item.key == "edit");
        if (index !== -1) {
          this.fields.splice(index, 1);
          let table_index = this.table_header.findIndex(
            (item) => item == "edit"
          );
          this.table_header.splice(table_index, 1);
        }
      } else {
        if (this.table_header.includes("restore")) {
          if (!this.can("edit-series")) {
            this.fields[3] = {
              key: "delete",
            };
          } else {
            this.fields[4] = {
              key: "delete",
            };
          }

          let table_index = this.table_header.findIndex(
            (item) => item == "restore"
          );
          this.table_header[table_index] = "delete";
        }

        if (!this.can("edit-series")) {
          let index = this.fields.findIndex((item) => item.key == "edit");
          if (index !== -1) {
            this.fields.splice(index, 1);
            let table_index = this.table_header.findIndex(
              (item) => item == "edit"
            );
            this.table_header.splice(table_index, 1);
          }
        } else {
          if (!this.table_header.includes("edit")) {
            this.table_header.push("edit");
            this.fields[3] = {
              key: "edit",
            };
          }
        }

        if (!this.can("delete-series")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          if (index !== -1) {
            this.fields.splice(index, 1);
            let table_index = this.table_header.findIndex(
              (item) => item == "delete"
            );
            this.table_header.splice(table_index, 1);
          }
        } else {
          if (!this.table_header.includes("delete")) {
            this.table_header.push("delete");
            this.fields[4] = {
              key: "delete",
            };
          }
        }
      }
    },
  },
  watch: {
    currentPage: {
      handler: function (value) {
        if (typeof value != undefined) {
          this.params = `&page=${value}`;
          this.fetchData(this.activeTab);
        }
      },
    },
    activeTab(v) {
      if (v) this.tabActive();
    },
    "form.survey_fail"(v) {
      if (v == 1) {
        this.survey_fail = true;
      } else {
        this.survey_fail = false;
      }
    },
  },
  created() {
    if (this.$route.name == "add-series" || this.$route.name == "edit-series") {
      if (this.$route.name == "edit-series") {
        this.fetchSeries(this.$route.params.id);
      }
      this.fetchForum();
      this.fetchPartner();
      this.fetchCommunity();
      this.fetchExpert();
      this.fetchKnowledgeCategory();
      this.fetchVideo();
    } else {
      this.fetchData("all");
    }
    this.fields.map((item) => {
      this.table_header.push(item.key);
    });
    this.tabActive();
  },
};
