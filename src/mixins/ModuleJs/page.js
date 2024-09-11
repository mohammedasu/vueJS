import {
  page
} from "../../js/path";

export default {
  data() {
    return {
      fields: [{
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "title",
        },
        {
          key: "edit",
        },
      ],
      params: "",
      form: {
        title: "",
        description: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
      },
      filter: null,
      tableData: [],
      sortBy: "id",
      sortDesc: true,
      filterOn: [],
      key: 0,
      currentPage: 1,
      activeTab: "all",
      image_name: "",
      image_name_url: "",
      edit: {
        image_name_url: null,
      },
    };
  },
  methods: {
    // search() {
    //   if (this.filter.length > 1)
    //     this.fetchData("search");
    //   else if (this.filter.length == 0)
    //     this.fetchData('search');
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
        let url = page.pageUrl;
        if (pagination == "search") {
          url = page.pageUrl + "?search=" + this.filter;
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
    async fetchPage(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = page.pageUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.title != "" && responseData.title != null){
            this.form.title = responseData.title;
          }

          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
          }

          if(responseData.meta_description != "" && responseData.meta_description != null){
            this.form.meta_description = responseData.meta_description;
          }

          if(responseData.meta_keywords != "" && responseData.meta_keywords != null){
            this.form.meta_keywords = responseData.meta_keywords;
          }

          if(responseData.meta_title != "" && responseData.meta_title != null){
            this.form.meta_title = responseData.meta_title;
          }

          this.edit.image_name_url = responseData.image_name;

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
        if (!this.image_name) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "No File Choosen",
          });
          return false;
        }
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
        const url = page.pageUrl + "/" + id;
        let dataAppend = new FormData();
        if (this.image_name) {
          dataAppend.append("image_name", this.image_name);
        }
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
          this.$router.push("/page");
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
    if (this.$route.name == "edit-page") {
      this.fetchPage(this.$route.params.id);
    } else {
      this.fetchData();
    }
  },
};