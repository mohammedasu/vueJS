import { certificate } from "../../js/path";

export default {
  data() {
    return {
      images: [],
      form: {
        template_name: "",
        template: "",
        points: "",
        image_fillers: [
          {
            file: "",
            filler: "",
            key: 0
          },
        ],
      },
      file: "",
      edit: {
        filler_img_url: null,
      },
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
          key: "points",
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
    };
  },
  methods: {
    readFile(e, txt) {
      if (txt == "file") {
        this.file = e.target.files[0];
      }
    },
    addImage() {
      let length = this.form.options.length;
      this.form.image_fillers.push({
        key: length,
        file: null,
        filler: null
      });
    },
    removeImage(key) {
      if (key == 0) return;
      this.form.image_fillers.splice(key, 1);
    },
    search() {
      if (this.filter.length > 1) this.fetchData("search");
      else if (this.filter.length == 0) this.fetchData("search");
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchData(pagination = null) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = certificate.certificateUrl;
        if (pagination == "search") {
          url = certificate.certificateUrl + "?search=" + this.filter;
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
    async fetchCertificate(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = certificate.certificateUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.form.template_name = responseData.template_name;
          this.form.template = responseData.template;
          this.form.points = responseData.points;

          if (responseData.image_fillers != "" && responseData.image_fillers != null) {
            this.form.image_fillers = responseData.image_fillers;
          }

          this.edit.filler_img_url = responseData.image_fillers.file;
          this.file = responseData.image_fillers.file;
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
    async deleteCertificate(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = certificate.certificateUrl + "/" + id;
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
        const url = certificate.certificateUrl;
        let dataAppend = new FormData();
        for (var key in this.form) {
          if (key != "image_fillers") {
            dataAppend.append(key, this.form[key]);
          }
        }
        dataAppend.append("image_fillers", this.form.image_fillers);
      
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/certificate");
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
        const url = certificate.certificateUrl + "/" + id;
        let dataAppend = new FormData();
        for (var key in this.form) {
          if (key != "image_fillers") {
            dataAppend.append(key, this.form[key]);
          }
        }
        dataAppend.append("image_fillers", this.form.image_fillers);
        dataAppend.append("_method", "put");
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/certificate");
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
          this.fetchData(value);
        }
      },
    },
  },
  created() {
    if (
      this.$route.name == "add-certificate" ||
      this.$route.name == "edit-certificate"
    ) {
      if (this.$route.name == "edit-certificate") {
        this.fetchCertificate(this.$route.params.id);
      }
    } else {
      this.fetchData("all");
    }
  },
};
