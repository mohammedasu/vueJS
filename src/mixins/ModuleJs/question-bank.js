import { questionBankUrl, masterUrl } from "../../js/path";

export default {
  data() {
    return {
      filterOn: [],
      key: 0,
      currentPage: 1,
      sortBy: "id",
      sortDesc: true,
      filter: null,
      tableData: [],
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "question",
        },
        {
          key: "question_type",
          label: "Question Type",
        },
        {
          key: "options",
        },
        {
          key: "correct_option",
          lable: "Correct Option",
        },
        {
          key: "is_mandatory",
          label: "Is Mandatory",
        },
        {
          key: "edit",
        },
        {
          key: 'delete'
        }
      ],
      params: "",
      form: {
        question: "",
        question_type: "",
        correct_option: "",
        is_mandatory: 0,
        options: [
          {
            key: 0,
            value: "",
          },
        ],
      },
      questionTypes: [],
    };
  },
  methods: {
    addOption() {
      let length = this.form.options.length;
      this.form.options.push({
        key: length,
        value: "",
      });
    },
    removeOption(key) {
      if(key == 0) return;
      this.form.options.splice(key, 1);
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
        let url = questionBankUrl.questionBank;
        if (pagination == "search") {
          url = questionBankUrl.questionBank + "?search=" + this.filter;
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
    async fetchQuestionTypes() {
      const url = masterUrl.getQuestionBankTypes;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response;
        this.questionTypes = responseData;
      }
    },
    async fetchQuestionBank(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = questionBankUrl.questionBank + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.question != null && responseData.question != ""){
            this.form.question = responseData.question;
          }

          if(responseData.question_type != null && responseData.question_type != ""){
            this.form.question_type = responseData.question_type;
          }

          if (responseData.options != "" && responseData.options != null) {
            this.form.options = JSON.parse(responseData.options);
          }

          if (responseData.correct_option != "" && responseData.correct_option != null) {
            this.form.correct_option = responseData.correct_option;
          }

          if (responseData.is_mandatory) {
            this.form.is_mandatory = 1;
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
    async deleteQuestionBank(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = questionBankUrl.questionBank + "/" + id;
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
      try {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Please Fill The Required Fields"
          });
          return false;
        }
        this.$store.commit("loader/updateStatus", true);
        const url = questionBankUrl.questionBank;
        let dataAppend = new FormData();
        for (var key in this.form) {
          if (key != "options") {
            dataAppend.append(key, this.form[key]);
          }
        }
        if (this.form.is_mandatory) {
          dataAppend.append("is_mandatory", 1);
        } else {
          dataAppend.append("is_mandatory", 0);
        }
        dataAppend.append("options", JSON.stringify(this.form.options));
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/question-bank");
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
    async updateData(id) {
      try {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Please Fill The Required Fields"
          });
          return false;
        }
        this.$store.commit("loader/updateStatus", true);
        const url = questionBankUrl.questionBank + "/" + id;
        let dataAppend = new FormData();
        for (var key in this.form) {
          if (key != "options") {
            dataAppend.append(key, this.form[key]);
          }
        }
        if (this.form.is_mandatory) {
          dataAppend.append("is_mandatory", 1);
        } else {
          dataAppend.append("is_mandatory", 0);
        }
        dataAppend.append("options", JSON.stringify(this.form.options));
        dataAppend.append("_method", "put");
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/question-bank");
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
    "form.is_mandatory"(v) {
      if (v == 1) {
        this.form.is_mandatory = true;
      } else {
        this.form.is_mandatory = false;
      }
    },
  },
  created() {
    if (
      this.$route.name == "add-question-bank" ||
      this.$route.name == "edit-question-bank"
    ) {
      this.fetchQuestionTypes();
      if (this.$route.name == "edit-question-bank") {
        this.fetchQuestionBank(this.$route.params.id);
      }
    } else {
      this.fetchData();
    }
  },
};
