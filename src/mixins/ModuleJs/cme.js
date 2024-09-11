import {
  cme,
  questionBankUrl,
  masterUrl,
  certificate,
  registration,
  dataFilters
} from "../../js/path";

export default {
  data() {
    return {
      table_header: [],
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "name",
        },
        {
          key: "passing_criteria",
          label: "Passing Criteria",
        },
        {
          key: "show_result",
          label: "Show Result",
        },
        {
          key: "show_landing_page",
          label: "Show Landing Page",
        },
        {
          key: "download_certificate",
          label: "Download Certificate",
        },
        {
          key: "allow_retest",
          label: "Allow Retest",
        },
        {
          key: "status",
          label: 'Active'
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
      cme_id: null,
      dataFilter: [],
      form: {
        allowed_members_from: "all",
        timer_status: 0,
        time_in_seconds: 0,
        negative_marks_status: 0,
        negative_mark: 0,
        positive_mark: 0,
        map_type: null,
        map_type_id: "",
        type: 'cme',
        name: "",
        heading_text: "",
        description: "",
        passing_criteria: "",
        survey_url: "",
        fail_text: "",
        fail_button_text: "",
        certificate_template_id: "",
        registration_template_id: null,
        allow_back: 0,
        allow_retest: 0,
        show_result: 0,
        download_certificate: 0,
        status: 0,
        points: "",
        landing_page_button_text: "",
        coins_type: "coin",
        coins: 0,
        show_landing_page: 0,
        show_rand_questions: 0,
        questions: [
          {
            mapped_id: "",
            id: 0,
            show_answer: 0,
            show_answer_details: 0,
          },
        ],
        attachments: [
          {
            mapped_id: "",
            map_type: "",
            map_type_id: 0,
            when_to_show: 0,
          },
        ],
      },
      allowedMembers: [
        {
          text: 'CSV File',
          value: 'csv'
        },
        {
          text: 'Data Filter',
          value: 'data_filter'
        },
        {
          text: 'All',
          value: 'all'
        }
      ],
      
      isDataFilter: false,
      isCSV: false,
      landing_page_image: "",
      survey_background_image: "",
      survey_background_mobile_image: "",
      pass_image: "",
      fail_image: "",
      survey_background_image_url: "",
      pass_image_url: "",
      fail_image_url: "",
      survey_background_mobile_image_url: "",
      landing_page_image_url: "",
      edit: {
        survey_background_image_url: null,
        pass_image_url: null,
        fail_image_url: null,
        survey_background_mobile_image_url: null,
        landing_page_image_url: null,
        members_csv_file_url: null
      },
      members_csv_file: "",
      certificateName: [],
      registrations: [],
      questionName: [],
      attachment: [],
      attachType: [],
      surveyCoins: [
        {
          value: "coin",
          text: "Coin",
        },
        {
          value: "cash",
          text: "Cash",
        },
      ],
      cmetype: [
        {
          value: "cme",
          text: "CME",
        },
        {
          value: "survey",
          text: "Survey",
        },
        {
          value: 'quiz',
          text: 'Quiz'
        }
      ],
      timerstatus: [
        {
          text: "in active",
          value: 0,
        },
        {
          text: "on module",
          value: 1,
        },
        {
          text: "on question",
          value: 2,
        },
      ],
    };
  },
  methods: {
    changeMember(val = null) {
      if (val == "data_filter") {
        this.isDataFilter = true;
        this.isCSV = false;
      } else if (val == "csv") {
        this.isDataFilter = false;
        this.isCSV = true;
      } else if (val == "all") {
        this.isDataFilter = false;
        this.isCSV = false;
      } 
    },
    // search() {
    //   if (this.filter.length > 1) this.fetchData("search");
    //   else if (this.filter.length == 0) this.fetchData("search");
    // },
    search(event) {
      if (this.filter.length > 1) {
        if (event.keyCode == 13) {
          this.fetchData('search');
        }
      }
      else if (this.filter.length == 0) this.fetchData('search');
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchData(pagination = null) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = cme.cmeUrl;
        if (pagination == "search") {
          url = cme.cmeUrl + "?search=" + this.filter;
        } else if (pagination) {
          url = url + "?page=" + pagination;
        }
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
    addQuestion() {
      this.form.questions.push({
        mapped_id: null,
        id: 0,
        show_answer: 0,
        show_answer_details: 0,
      });
    },
    removeQuestion(key) {
      if (key == 0) return;
      this.form.questions.splice(key, 1);
    },
    changeType(val) {
      this.fetchAttachment(val);
    },
    async fetchCertificate() {
      const url = certificate.fetchActiveCertificate;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.certificateName = responseData;
      }
    },
    async fetchRegistration() {
      const url = registration.fetchAllRegistration;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.registrations = responseData;
      }
    },
    async fetchQuestion() {
      const url = questionBankUrl.fetchAllQuestion;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        let array = [];
        if (responseData != "") {
          responseData.map((item) => {
            array.push({ id: item.id, question: item.question });
          });
        }
        this.questionName = array;
      }
    },
    async fetchAttachmentType() {
      const url = masterUrl.getAttachmentType;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response;
        this.attachType = responseData;
      }
    },
    async fetchAttachment(val) {
      const url = masterUrl.getAttachment + "&type=" + val;
      this.$store.commit("loader/updateStatus", true);
      const data = await this.getRequest(url);
      this.$store.commit("loader/updateStatus", false);
      if (data.status) {
        const responseData = data.response;
        this.attachment = responseData.data;
      }
    },
    async fetchDataFilter() {
      const url = dataFilters.fetchAllDataFilter;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response;
        this.dataFilter = responseData.data;
      }
    },
    readFile(e, txt) {
      if (txt == "survey_background_image") {
        this.survey_background_image = e.target.files[0];
         if (this.survey_background_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.survey_background_image.reset();
          this.survey_background_image_url = '';
          this.edit.survey_background_image_url = '';
          this.survey_background_image = '';
          return false;
        } else {
          this.survey_background_image_url = URL.createObjectURL(this.survey_background_image);
          this.edit.survey_background_image_url = '';
        }
        return true;
      } else if (txt == "pass_image") {
        this.pass_image = e.target.files[0];
         if (this.pass_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.pass_image.reset();
          this.pass_image_url = '';
          this.edit.pass_image_url = '';
          this.pass_image = '';
          return false;
        } else {
          this.pass_image_url = URL.createObjectURL(this.pass_image);
          this.edit.pass_image_url = '';
        }
        return true;
      } else if (txt == "fail_image") {
        this.fail_image = e.target.files[0];
         if (this.fail_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.fail_image.reset();
          this.fail_image_url = '';
          this.edit.fail_image_url = '';
          this.fail_image = '';
          return false;
        } else {
          this.fail_image_url = URL.createObjectURL(this.fail_image);
          this.edit.fail_image_url = '';
        }
        return true;
      } else if (txt == "survey_background_mobile_image") {
        this.survey_background_mobile_image = e.target.files[0];
         if (this.survey_background_mobile_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.survey_background_mobile_image.reset();
          this.survey_background_mobile_image_url = '';
          this.edit.survey_background_mobile_image_url = '';
          this.survey_background_mobile_image = '';
          return false;
        } else {
          this.survey_background_mobile_image_url = URL.createObjectURL(this.survey_background_mobile_image);
          this.edit.survey_background_mobile_image_url = '';
        }
        return true;
      } else if (txt == "landing_page_image") {
        this.landing_page_image = e.target.files[0];
         if (this.landing_page_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.landing_page_image.reset();
          this.landing_page_image_url = '';
          this.edit.landing_page_image_url = '';
          this.landing_page_image = '';
          return false;
        } else {
          this.landing_page_image_url = URL.createObjectURL(this.landing_page_image);
          this.edit.landing_page_image_url = '';
        }
        return true;
      } else if(txt == 'members_csv_file'){
        this.members_csv_file = e.target.files[0]
      }
    },
    async updateStatus(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = cme.statusUpdate;
        const data = await this.postRequest(url, {
          status: !this.tableData.data[index].status,
          id: id,
        });
        if (data.status) {
          this.tableData.data[index].status =
            !this.tableData.data[index].status;
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
    async fetchCME(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = cme.cmeUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.form.type = responseData.type;
          this.form.name = responseData.name;
          this.form.heading_text = responseData.heading_text;

          if(responseData.registration_template_id != "" && responseData.registration_template_id != null){
            this.form.registration_template_id =
            responseData.registration_template_id;
          }

          if(responseData.description != null && responseData.description != ""){
            this.form.description = responseData.description;
          }
          
          this.form.passing_criteria = responseData.passing_criteria;
          this.form.survey_url = responseData.survey_url;
          this.form.pass_text = responseData.pass_text;
          this.form.pass_button_text = responseData.pass_button_text;
          this.form.fail_button_text = responseData.fail_button_text;
          this.form.points = responseData.points;
          this.form.cme_attachment = responseData.cme_attachment;
          this.form.coins_type = responseData.coins_type;
          this.form.coins = responseData.coins;
          this.form.fail_text = responseData.fail_text;
          this.form.timer_status = responseData.timer_status;
          this.form.time_in_seconds = responseData.time_in_seconds;
          this.form.negative_mark = responseData.negative_mark;
          this.form.positive_mark = responseData.positive_mark;
          this.form.landing_page_button_text =
            responseData.landing_page_button_text;
          this.edit.survey_background_image_url =
            responseData.survey_background_image;
          this.edit.survey_background_mobile_image_url =
            responseData.survey_background_mobile_image;
          this.edit.landing_page_image_url = responseData.landing_page_image;
          this.edit.pass_image_url = responseData.pass_image;
          this.edit.fail_image_url = responseData.fail_image;
          this.cme_id = responseData.id;

          this.form.certificate_template_id =
            responseData.certificate_template_id;

          if (responseData.cme_questions) {
            this.form.questions = responseData.cme_questions.map((item) => {
              return {
                mapped_id: item.id,
                id: item.question_bank_id,
                show_answer: item.show_answer ? true : false,
                show_answer_details: item.show_answer_details ? true : false,
              };
            });
          }

          if (responseData.cme_attachment) {
            this.form.attachments = responseData.cme_attachment.map((item) => {
              return {
                mapped_id: item.id,
                map_type: item.map_type,
                map_type_id: item.map_type_id,
                when_to_show: item.when_to_show,
              };
            });
          }

          if (responseData.show_landing_page) {
            this.form.show_landing_page = true;
          }
          if (responseData.negative_marks_status) {
            this.form.negative_marks_status = true;
          }
          if (responseData.allow_back) {
            this.form.allow_back = true;
          }
          if (responseData.allow_retest) {
            this.form.allow_retest = true;
          }
          if (responseData.show_result) {
            this.form.show_result = true;
          }
          if (responseData.download_certificate) {
            this.form.download_certificate = true;
          }
          if (responseData.show_rand_questions) {
            this.form.show_rand_questions = true;
          }
          if (responseData.status) {
            this.form.status = true;
          }

          if(responseData.data_filter_id != '' && responseData.data_filter_id != null){
            this.form.data_filter_id = responseData.data_filter_id;
          }
          // this.edit.csv_file_url = responseData.import_csv;
          this.edit.members_csv_file_url = responseData.members_csv_file;
          // this.members_csv_file = responseData.members_csv_file;

          if(responseData.allowed_members_from != "" && responseData.allowed_members_from != null){
            this.form.allowed_members_from = responseData.allowed_members_from;
          }
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
    async deleteCME(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = cme.cmeUrl + "/" + id;
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
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = cme.cmeUrl;
        if (this.$route.name == "edit-cme") {
          url = cme.cmeUrl + "/" + this.cme_id;
        }
        let dataAppend = new FormData();
        dataAppend.append(
          "survey_background_image",
          this.survey_background_image
        );
        dataAppend.append("landing_page_image", this.landing_page_image);
        dataAppend.append(
          "survey_background_mobile_image",
          this.survey_background_mobile_image
        );
        dataAppend.append("pass_image", this.pass_image);
        dataAppend.append("fail_image", this.fail_image);
        dataAppend.append("members_csv_file", this.members_csv_file);

        if (this.form.show_landing_page) {
          dataAppend.append("show_landing_page", 1);
        } else {
          dataAppend.append("show_landing_page", 0);
        }

        if (this.form.allow_back) {
          dataAppend.append("allow_back", 1);
        } else {
          dataAppend.append("allow_back", 0);
        }

        if (this.form.allow_retest) {
          dataAppend.append("allow_retest", 1);
        } else {
          dataAppend.append("allow_retest", 0);
        }

        if (this.form.show_result) {
          dataAppend.append("show_result", 1);
        } else {
          dataAppend.append("show_result", 0);
        }

        if (this.form.download_certificate) {
          dataAppend.append("download_certificate", 1);
        } else {
          dataAppend.append("download_certificate", 0);
        }

        if (this.form.show_rand_questions) {
          dataAppend.append("show_rand_questions", 1);
        } else {
          dataAppend.append("show_rand_questions", 0);
        }

        if (this.form.status) {
          dataAppend.append("status", 1);
        } else {
          dataAppend.append("status", 0);
        }

        if (this.form.negative_marks_status) {
          dataAppend.append("negative_marks_status", 1);
        } else {
          dataAppend.append("negative_marks_status", 0);
        }

        for (var key in this.form) {
          if (
            this.form[key] != null &&
            key != "questions" &&
            key != "attachments" &&
            key != "show_landing_page" &&
            key != "allow_back" &&
            key != "allow_retest" &&
            key != "show_result" &&
            key != "download_certificate" &&
            key != "show_rand_questions" &&
            key != "status"
          ) {
            dataAppend.append(key, this.form[key]);
          }
        }

        dataAppend.append("questions", JSON.stringify(this.form.questions));
        dataAppend.append("attachments", JSON.stringify(this.form.attachments));

        if (this.$route.name == "edit-cme") {
          dataAppend.append("_method", "put");
        }

        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/cme");
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
  watch: {
    currentPage: {
      handler: function (value) {
        this.params = `page=${value}`;
        this.fetchData(value);
      },
    },
  },
  created() {
    if (this.$route.name == "add-cme" || this.$route.name == "edit-cme") {
      if (this.$route.name == "edit-cme") {
        this.fetchCME(this.$route.params.id);
      }
      this.fetchCertificate();
      this.fetchRegistration();
      this.fetchQuestion();
      this.fetchAttachment();
      this.fetchAttachmentType();
      this.fetchDataFilter();
    } else {
      this.fetchData();
    }
  },
};
