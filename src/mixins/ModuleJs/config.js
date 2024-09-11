import { config } from "../../js/path";

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
          key: "config_name",
          lable: "Config Name",
        },
        {
          key: "description",
        },
        {
          key: "value",
        },
        {
          key: "edit",
        },
      ],
      form: {
        config_name: "",
        value: "",
        description: ""
      },
      filter: null,
      filterOn: [],
      tableData: [],
      sortBy: "id",
      sortDesc: true,
      currentPage: 1,
      key: 0,
    };
  },
  methods: {
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
        let url = config.configUrl;
        if (pagination == "search") {
          url = config.configUrl + "?search=" + this.filter;
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
    async fetchConfig(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = config.configUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.config_name != "" && responseData.config_name != null){
            this.form.config_name = responseData.config_name;
          }

          if(responseData.value != "" && responseData.value != null){
            this.form.value = responseData.value;
          }

          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
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
        const url = config.configUrl + "/" + id;
        let dataAppend = new FormData();
        dataAppend.append('config_name', this.form.config_name);
        dataAppend.append('value', this.form.value);
        dataAppend.append('description', this.form.description);
        dataAppend.append("_method", "put");
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/config");
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
        const url = config.configUrl;
        let dataAppend = new FormData();
        dataAppend.append('config_name', this.form.config_name);
        dataAppend.append('value', this.form.value);
        dataAppend.append('description', this.form.description);
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/config");
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
        if (value) {
          this.params = `&page=${value}`;
          this.fetchData(value);
        }
      },
    },
  },
  created() {
    if (this.$route.name == "add-config" || this.$route.name == "edit-config") {
      if (this.$route.name == "edit-config") {
        this.fetchConfig(this.$route.params.id);
      }
    } else {
      this.fetchData("all");
    }
  },
};
