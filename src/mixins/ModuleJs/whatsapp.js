import { whatsapp, imageBank } from "../../js/path";
import moment from "moment";

export default {
  data() {
    return {
      imageBank: [],
      imageBankFolder: [],
      images: [],
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "engagement_name",
          label: "Name",
        },
        {
          key: "scheduled_time",
          label: "Scheduled At",
        },
        {
          key: "is_processed",
          label: "Is Processed",
        },
        {
          key: "edit",
        },
        {
          key: "delete",
        },
      ],
      form: {
        engagement_name: "",
        type: null,
        content: null,
        mobile_numbers: null,
        notification_type: "whatsapp",
        scheduled_time: null,
      },
      csv_file: "",
      dataFilter: [],
      edit: {
        image_bank_id_url: null,
        csv_file_url: null,
      },
      image_bank_id: "",
      type: [
        {
          text: "Test",
          value: "test",
        },
        {
          text: "CSV",
          value: "csv",
        },
        {
          text: "Data Filter",
          value: "data_filter",
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
      isDataFilter: false,
      isCSV: false,
      isTestMob: false,
    };
  },
  methods: {
    readFile(e, txt) {
      if (txt == "csv_file") {
        this.csv_file = e.target.files[0];
      }
    },
    search() {
      if (this.filter.length > 1) this.fetchData("search");
      else if (this.filter.length == 0) this.fetchData("search");
    },
    removeBorder(id) {
      const boxes = document.querySelectorAll(".folder");
      boxes.forEach((box) => {
        box.classList.remove("clickStyle", "rightIcon");
      });

      document
        .getElementById(id)
        .classList.add("clickStyle", "folder-name-checked");
    },
    changeType(val = null) {
      if (val == "data_filter") {
        this.isDataFilter = true;
        this.isCSV = false;
        this.isTestMob = false;
      } else if (val == "csv") {
        this.isDataFilter = false;
        this.isCSV = true;
        this.isTestMob = false;
      } else {
        this.isDataFilter = false;
        this.isCSV = false;
        this.isTestMob = true;
      }
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchData(pagination = null) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = whatsapp.fetchWhatsapp;
        if (pagination) {
          url = url + "&page=" + pagination;
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
    async fetchEngagement(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = whatsapp.whatsappUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.form.engagement_name = responseData.payload.engagement_name;
          this.form.image_bank_id = responseData.image_bank_id;
          this.form.content = responseData.payload.content;
          this.form.scheduled_time = moment(
            responseData.payload.scheduled_time
          ).format("YYYY-MM-DDTHH:mm");
          this.form.type = responseData.payload.type;
          this.form.data_filter_id = responseData.data_filter_id;
          this.form.mobile_numbers = responseData.payload.mobile_numbers;
          this.edit.csv_file_url = responseData.payload.csv_file;
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
    async submitData(id = "") {
      this.$store.commit("loader/updateStatus", true);
      try {
        let dataAppend = new FormData();
        for (var key in this.form) {
          dataAppend.append(key, this.form[key]);
        }
        if (typeof this.$refs.file != undefined)
          dataAppend.append("csv_file", this.$refs.file.files[0]);
        let url = whatsapp.whatsappUrl;
        if (id != null && id != "") {
          url = whatsapp.whatsappUrl + "/" + id;
          dataAppend.append("_method", "PUT");
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/whatsapp-engagement");
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
    async deleteWhatsapp(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = whatsapp.whatsappUrl + "/" + id;
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
    async getImageBank() {
      try {
        const url = imageBank.getImage;
        const data = await this.getRequest(url);
        if (data.response.data != "") {
          this.imageBank = data.response.data;
          let folder = [];
          data.response.data.map((item) => {
            if (item.folder != null && item.folder != "") {
              if (!folder.includes(item.folder)) {
                folder.push(item.folder);
                this.imageBankFolder.push(item);
              }
            } else {
              this.images.push(item);
            }
          });
        }
      } catch (err) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Please try again!",
        });
      }
    },
    // async updateData(id) {
    //   this.$store.commit("loader/updateStatus", true);
    //   try {
    //     const url = whatsapp.whatsappUrl + "/" + id;
    //     const data = await this.postRequest(url);
    //     if (data.status) {
    //       this.$store.commit("toast/updateStatus", {
    //         status: true,
    //         icon: "success",
    //         title: data.message,
    //       });
    //       this.$router.push("/whatsapp-engagement");
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
  },
  watch: {
    tableData(v) {
      if (v) {
        return (this.tableData = v);
      }
    },
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
    if (
      this.$route.name == "add-whatsapp" ||
      this.$route.name == "edit-whatsapp"
    ) {
      if (this.$route.name == "edit-whatsapp") {
        this.fetchEngagement(this.$route.params.id);
      }
    } else {
      this.fetchData();
    }
    this.getImageBank();
  },
  // mounted() {
  //   let elements = document.querySelectorAll(".folder");
  //   elements.forEach((element) => {
  //     element.style.border = "none";
  //     element.addEventListener("click", function () {
  //       element.style.border = "4px solid blue";
  //     });
  //   });
  // },
};
