import { cases, community, country, expert, forum, knowledgeCategory, subspeciality, } from "../../js/path";
import moment from "moment";
import _ from 'lodash';

export default {
  data() {
    return {
      status: false,
      formwizard: true,
      table_header: [],
      case_id: null,
      images: [],
      image_name_indonesia: [],
      knowledgeCategories: [],
      subspecialities: [],
      allCountry: [],
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        // {
        //   key: 'case_item.image',
        //   label: 'Thumbnail'
        // },
        {
          key: "title",
          label: 'Case Title'
        },
        {
          key: "link_id",
          label: "Link Id",
        },
        {
          key: "question_type",
          label: "Question Type",
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
        // {
        //   key: "restore",
        // },
      ],
      filter: null,
      tableData: [],
      sortBy: "id",
      sortDesc: true,
      filterOn: [],
      currentPage: 1,
      case_question_options: [
        {
          text: "MCQ",
          value: "mcq",
        },
        {
          text: "Comments",
          value: "comments",
        },
      ],
      question_options: [
        {
          text: "MCQ",
          value: "mcq",
        },
        {
          text: "Discussion Forum",
          value: "discussion_forum",
        },
      ],
      type_options: [
        {
          text: "None",
          value: "none",
        },
        {
          text: 1,
          value: 0,
        },
        {
          text: 2,
          value: 1,
        },
        {
          text: 3,
          value: 2,
        },
        {
          text: 4,
          value: 3,
        },
      ],
      oldForm : {},
      form: {
        translation: {
          indonesia: {
            title: '',
            description: '',
            meta_title: '',
            meta_desc: '',
            meta_keywords: ''
          }
        },
        title: "",
        description: "",
        question_type: "",
        view_multiplication_factor: 0,
        meta_title: "",
        meta_desc: "",
        meta_keywords: "",
        community_selected: [],
        country: [],
        tags: [],
        knowledge_category: [],
        sub_specialities: [],
        partner_division_id: "",
        expert_id: "",
        correct_option: "",
        addMore: [
          {
            type: "mcq",
            question: "",
            correct_option: null,
            answer_details: null,
            show_answer_at: null,
            option: [
              {
                key: 0,
                value: "",
              },
            ],
          },
        ],
      },
      community: [],
      allCommunity: [],
      forum: [],
      expert: [],
    };
  },
  methods: {
    async downloadZip() {
      this.$store.commit('loader/updateStatus', true);
      const data = await this.postRequest(cases.caseUrl + "/download-zip/" + this.case_id);
      this.$store.commit('loader/updateStatus', false);
      window.location.href = data.response;
    },
    questionType() {
      if (this.form.question_type == 'comments') {
        this.formwizard = false;
      } else {
        this.formwizard = true;
      }
    },
    addOption(key) {
      let length = this.form.addMore[key].option.length;
      if (length <= 3) {
        this.form.addMore[key].option.push({
          key: length,
          value: "",
        });
      }
    },
    removeOption(index, key) {
      if (index == 0) return;
      this.form.addMore[key].option.splice(index, 1);
    },
    search(event) {
      if (this.filter.length > 1) {
        //enter key == keycode 13
        if (event.keyCode == 13) {
          this.fetchData(this.activeTab);
        }
      }
      else if (this.filter.length == 0) this.fetchData(this.activeTab);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchData(txt) {
      let url = null;
      if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = cases.caseUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = cases.caseUrl + "?filter=" + txt;
        }
      } else if (txt == "active") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = cases.caseUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = cases.caseUrl + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = cases.caseUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = cases.caseUrl + "?filter=" + txt;
        }
      }
      url += this.params;
      this.getUrl();
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
      this.key += 1;
    },
    readFile(e, txt) {
      if (txt == "image") {
        
        if (this.image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.case_item_image.reset();
        } else {
          var selectedFiles = e.target.files;
          for (let i = 0; i < selectedFiles.length; i++) {
            this.images.push(URL.createObjectURL(selectedFiles[i]));
          }
          // this.images = URL.createObjectURL(this.image);
        }
      }
      else if (txt == 'indonesia_image') {
        this.indonesia_image = e.target.files[0];
        if (this.indonesia_image.size > 2 * 1000 * 1000) {
          this.$store.commit('toast/updateStatus', {
            status: true,
            icon: 'error',
            title: 'Uploaded File is More than 2MB'
          });
          this.$refs.indonesia_item_image.reset();
        }
      }
    },
    addmore() {
      const options = [
        {
          key: 0,
          value: "",
        },
      ];
      this.form.addMore.push({
        type: "",
        question: "",
        correct_option: "",
        option: options,
        answer_details: null,
        show_answer_at: null,
      });
      this.setSlide();
    },
    deleteRow(index) {
      this.form.addMore.splice(index, 1);
    },
    setSlide() {
      this.slide = this.slide + 1;
    },
    async fetchCase(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = cases.caseUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          if (responseData.title != null && responseData != "") {
            this.form.title = responseData.title;
          }
          if (responseData.meta_desc != null && responseData.meta_desc != "") {
            this.form.meta_desc = responseData.meta_desc;
          }
          if (responseData.meta_keywords != null && responseData.meta_keywords != null) {
            this.form.meta_keywords = responseData.meta_keywords;
          }
          if (responseData.meta_title != "" && responseData.meta_title != null) {
            this.form.meta_title = responseData.meta_title;
          }

          this.form.view_multiplication_factor =
            responseData.view_multiplication_factor;

          if (responseData.description != null && responseData.description != "") {
            this.form.description = responseData.description;
          }

          this.form.question_type = responseData.question_type;

          if (responseData.partner_division_id != "" && responseData.partner_division_id != null) {
            this.form.partner_division_id = responseData.partner_division_id;
          }

          if (responseData.expert_id != "" && responseData.expert_id != null) {
            this.form.expert_id = responseData.expert_id;
          }

          this.case_id = responseData.id;

          if (responseData.sub_specialities != null && responseData.sub_specialities != "") {
            this.form.sub_specialities = this.subspecialities.filter((item) => {
              if (responseData.sub_specialities.includes(item.id)) {
                return item;
              }
            });
          }

          if (responseData.community != null && responseData.community != "") {
              this.form.community_selected = responseData.community.map(c => {return {id : c.community_id, title : c.name}});
          }

          if (responseData.knowledge_category != null && responseData.knowledge_category != "") {
            responseData.knowledge_category.map(cat => {
              this.form.knowledge_category.push(...this.knowledgeCategories.filter((item) => {
                return cat.knowledge_category_id == item.id;
              }));
            });
          }

          if (responseData.country != null && responseData.country != "") {
            responseData.country.map((item) => {
              this.fetchSingleCountry(item);
           })
          }

          if (responseData.tags != null && responseData.tags != "") {
            this.form.tags = responseData.tags;
          }

          if (responseData.questions != "" && responseData.question != null) {
            this.form.addMore = responseData.questions;
            responseData.questions.map((item, index) => {
              if (this.form.addMore[index].show_answer_at != null && this.form.addMore[index].show_answer_at != '') {
                this.form.addMore[index].show_answer_at = moment(
                  item.show_answer_at
                ).format("YYYY-MM-DDTHH:mm");
              }
            });
          }
          if (responseData.case_item != "" && responseData.case_item != null) {
            responseData.case_item.map(item => {
              this.images.push(item.image);
            });
            // this.images = responseData.case_item; 
          }
          if (responseData.translation != "" && responseData.translation != null) {
            this.form.translation = responseData.translation;
            this.image_name_indonesia = responseData.translation.indonesia.image ? responseData.translation.indonesia.image : '';
          }
        }
        this.oldForm = _.clone(this.form);
      } catch (err) {
        console.log(err);
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Please try again!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    async updateStatus(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = cases.statusUpdate;
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
    getUrl() {
      var url = new URL(window.location);
      if (this.activeTab == null || this.activeTab == "") {
        this.activeTab = "all";
      }
      (url.searchParams.has('filter') ? url.searchParams.set('filter', this.activeTab) : url.searchParams.append('filter', this.activeTab));
      if (this.filter != null && this.filter != "") {
        (url.searchParams.has('search') ? url.searchParams.set('search', this.filter) : url.searchParams.append('search', this.filter));
      }
      else {
        url.searchParams.delete('search');
      }
      if (this.currentPage != null && this.currentPage != "") {
        (url.searchParams.has('page') ? url.searchParams.set('page', this.currentPage) : url.searchParams.append('page', this.currentPage));
      }
      else {
        url.searchParams.set('page', 1);
      }
      url.search = url.searchParams;
      url = url.toString();
      history.pushState({}, null, url);
    },
    async updateCommentStatus(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.findIndex((e) => e.id == id);
        const url = cases.caseCommentStatusUpdate;
        const data = await this.postRequest(url, {
          is_approved: !this.tableData[index].is_approved,
          id: id,
        });
        if (data.status) {
          this.tableData[index].is_approved =
            !this.tableData[index].is_approved;
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
    async deleteCase(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = cases.caseUrl + "/" + id;
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
    async deleteCaseMCQ(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.findIndex((e) => e.id === id);
        const url = cases.deleteCaseMCQ + "/" + id;
        const data = await this.postRequest(url, {
          _method: "DELETE",
        });
        if (data.status) {
          this.tableData.splice(index, 1);
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
    async restoreCase(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = cases.caseUrl + "/" + id;
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

    tabActive() {
      if (this.activeTab == "trash") {
        if (this.table_header.includes("delete")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          this.fields[index] = {
            key: "restore",
          };
          let table_index = this.table_header.findIndex((item) => item == "delete");
          this.table_header[table_index] = "restore";

        } else {
          this.table_header.push("restore");
          this.fields.push({
            key: "restore",
          });
        }

        if (!this.can("restore-case")) {
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
          if (!this.can("edit-case")) {
            this.fields[5] = {
              key: "delete",
            };
          } else {
            this.fields[6] = {
              key: "delete",
            };
          }

          let table_index = this.table_header.findIndex((item) => item == "restore");
          this.table_header[table_index] = "delete";
        }

        if (!this.can("edit-case")) {
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
            this.fields[5] = {
              key: "edit",
            };
          }
        }

        if (!this.can("delete-case")) {
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
            this.fields[6] = {
              key: "delete",
            };
          }
        }
      }
    },
    async fetchAllCommunity(){
      const url = community.fetchAllActiveCommunity;
      const data = await this.getRequest(url);
      if(data.status){
        this.form.community_selected = data.response.data;
      }
    },
    async fetchCommunity(query) {
      const url = community.fetchCommunity;
      const data = await this.getRequest(url + '?search=' + query);
      if (data.status) {
        this.community = data.response.data;
      }
    },
    // async fetchSingleCommunity(id){
    //   const url = community.fetchCommunity;
    //   const data = await this.getRequest(url + '/' + id);
    //   if(data.status){
    //     this.form.community_selected.push(data.response);
    //   }
    // },
    async fetchAllCountry(query) {
      const url = country.countryUrl;
      const data = await this.getRequest(url + '?search=' + query);
      if (data.status) {
        this.allCountry = data.response.data;
      }
    },
    async fetchSingleCountry(id){
      const url = country.countryUrl;
      const data = await this.getRequest(url + '/' + id);
      if(data.status){
        this.form.country.push(data.response);
      }
    },
    async fetchKnowledgeCategory() {
      const url = knowledgeCategory.fetchKnowledgeCategory;
      const data = await this.getRequest(url);
      if (data.status) {
        this.knowledgeCategories = data.response.data;
      }
    },
    // async fetchSingleKnowledgeCategory(id){
    //   const url = knowledgeCategory.knowledgeCategoryUrl;
    //   const data = await this.getRequest(url + '/' + id);
    //   if(data.status){
    //     this.form.knowledge_category.push(data.response);
    //   }
    // },
    async fetchSubSpeciality() {
      const url = subspeciality.fetchSubSpeciality;
      const data = await this.getRequest(url);
      if (data.status) {
        this.subspecialities = data.response.data;
      }
    },
    // async fetchSingleSubSpeciality(id){
    //   const url = knowledgeCategory.knowledgeCategoryUrl;
    //   const data = await this.getRequest(url + '/' + id);
    //   if(data.status){
    //     this.form.knowledge_category.push(data.response);
    //   }
    // },
    async fetchForum() {
      const url = forum.fetchAllActiveForum;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.forum = responseData;
      }
    },
    async fetchExpert() {
      const url = expert.expertVisibleInCases;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.expert = responseData;
      }
    },
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = cases.caseUrl;
        if (this.$route.name == "edit-case") {
          url = cases.caseUrl + "/" + this.case_id;
        }
        let dataAppend = new FormData();
        if (this.$refs.case_item_image.files.length > 0) {
          for (
            let index = 0;
            index < this.$refs.case_item_image.files.length;
            index++
          ) {
            dataAppend.append(
              "images[" + index + "]",
              this.$refs.case_item_image.files[index]
            );
          }
        }
        if (this.$refs.indonesia_item_image.files.length > 0) {
          for (
            let index = 0;
            index < this.$refs.indonesia_item_image.files.length;
            index++
          ) {
            dataAppend.append(
              "image_name_indonesia[" + index + "]",
              this.$refs.indonesia_item_image.files[index]
            );
          }
        }
        for (var key in this.form) {
          if (
            key != "option" &&
            key != "sub_specialities" &&
            key != "community_selected" &&
            key != "addMore" &&
            key != "country" &&
            key != "knowledge_category" &&
            key != "tags" &&
            key != "translation"
          ) {
            dataAppend.append(key, this.form[key]);
          }
        }
        const community_selected = this.form.community_selected.map((key) => key.id);
        const sub_specialities = this.form.sub_specialities.map((key) => key.id);
        const country = this.form.country.map((key) => key.id);
        const knowledge_category = this.form.knowledge_category.map((key) => key.id);
        const tags = this.form.tags.map((key) => key);

        // dataAppend.append("community_selected", JSON.stringify(community_selected));
        // dataAppend.append("sub_specialities", JSON.stringify(sub_specialities));

        community_selected.forEach(c => dataAppend.append("community_selected[]", c));
        sub_specialities.forEach(s => dataAppend.append("sub_specialities[]", s));
        country.forEach(l => dataAppend.append("country[]", l));
        knowledge_category.forEach(k => dataAppend.append("knowledge_categories[]", k));
        tags.forEach(t => dataAppend.append("tags[]", t));

        dataAppend.append("question_data", JSON.stringify(this.form.addMore));
        dataAppend.append("translation", JSON.stringify(this.form.translation));

        if (this.$route.name == "edit-case") {
          dataAppend.append("_method", "put");
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/case");
        }
      } catch (err) {
        this.$store.commit("toast/updateStatus"),
        {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Please try again!",
        };
      }
      this.$store.commit("loader/updateStatus", false);
    },
  },
  watch: {
    'status'(v){
      if(v == 1){
        this.fetchAllCommunity();
      } else {
        if(this.$route.name == 'add-case'){
          this.form.community_selected = [];
        } else if(this.$route.name == 'edit-case') {
          this.form.community_selected = this.oldForm.community_selected;
        }
      }
    },
    currentPage: {
      handler: function (value) {
        this.params = `&page=${value}`;
        this.fetchData(this.activeTab);
      },
    },
    activeTab(v) {
      if (v) this.tabActive();
    },
  },
  mounted() {
    if (this.$route.name == "add-case" || this.$route.name == "edit-case") {
      // this.fetchCommunity();
      this.fetchForum();
      this.fetchExpert();
      // this.fetchAllCountry();
      this.fetchSubSpeciality();
      this.fetchKnowledgeCategory();
      if (this.$route.name == "edit-case") {
      this.$store.commit('loader/updateStatus', true);
        this.fetchCase(this.$route.params.id);
      this.$store.commit('loader/updateStatus', false);
      }
    } else {
      if (this.$route.name == "case-question-mcq") {
        this.fetchCaseQuestionMCQ();
      } else {
        this.activeTab = "all";
        if (this.$route.query.filter) {
          this.activeTab = this.$route.query.filter;
        }
        if (this.$route.query.search) {
          this.filter = this.$route.query.search;
        }
        if (this.$route.query.page && this.$route.query.page != 1) {
          this.currentPage = parseInt(this.$route.query.page);
        } else {
          this.fetchData(this.activeTab);
        }
      }
    }
    this.fields.map((item) => {
      this.table_header.push(item.key);
    });
    this.tabActive();
  },
};
