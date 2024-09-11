import { registration, userType } from "../../js/path";

export default {
  data() {
    return {
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "template_name",
          label: "Template Name",
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
      filter: null,
      tableData: [],
      sortBy: "id",
      sortDesc: true,
      filterOn: [],
      key: 0,
      currentPage: 1,
      activeTab: "all",
      usertypes: [],
      form: {
        template_name: "",
        user_types: [],
      },
    };
  },
  methods: {
    search() {
      if (this.filter.length > 1) this.fetchData("search");
      else if (this.filter.length == 0) this.fetchData("search");
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchUserTypes() {
      const url = userType.fetchUser;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response;
        this.usertypes = responseData;
      }
    },
    async fetchData(pagination = null) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = registration.registrationUrl;
        if (pagination == "search") {
          url = registration.registrationUrl + "?search=" + this.filter;
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
    async fetchRegistration(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = registration.registrationUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          this.form.template_name = responseData.template_name;
          this.form.description = responseData.description;
          this.form.meta_description = responseData.meta_description;
          this.form.meta_keywords = responseData.meta_keywords;
          this.form.meta_title = responseData.meta_title;
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
    async submitData(id) {
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
        const url = registration.registrationUrl + "/" + id;
        let dataAppend = new FormData();
        for (var key in this.form) {
          dataAppend.append(key, this.form[key]);
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/registration");
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
        const url = registration.registrationUrl + "/" + id;
        let dataAppend = new FormData();
        for (var key in this.form) {
          dataAppend.append(key, this.form[key]);
        }
        dataAppend.append("_method", "put");
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/registration");
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
    async deleteRegistration(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = registration.registrationUrl + "/" + id;
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
    if (
      this.$route.name == "edit-registration" ||
      this.$route.name == "add-registration"
    ) {
      if (this.$route.name == "edit-registration") {
        this.fetchRegistration(this.$route.params.id);
      }
      this.fetchUserTypes();
    } else {
      this.fetchData();
    }
  },
};
