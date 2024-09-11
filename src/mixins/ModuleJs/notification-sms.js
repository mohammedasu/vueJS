import { notification } from "../../js/path";

export default {
  data() {
    return {
      table_header: [],
      form: {
        name: "",
        content: "",
        subject: "",
        type: "sms",
      },
      fields: [
        {
          key: "template_ref_no",
          label: "Template Reference No.",
        },
        {
          key: "name",
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
      title: "SMS Notification",
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "List",
        },
      ],
      tableData: [],
      sortBy: "id",
      sortDesc: true,
      filter: null,
      filterOn: [],
      params: "",
      currentPage: 1,
      activeTab: "all",
      key: 0,
    };
  },
  methods: {
    search() {
      if (this.filter.length > 1)
        this.fetchData("search");
      else if (this.filter.length == 0)
        this.fetchData('search');
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchData(txt) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = null;
        if (txt == "trash") {
          this.activeTab = txt;
          url = notification.fetchSMS + "&filter=" + txt;
        } else if (txt == "search") {
          this.activeTab = txt;
          url = notification.fetchSMS + "&search=" + this.filter;
        } else {
          this.activeTab = txt;
          url = notification.fetchSMS + "&";
        }
        url += this.params;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.tableData = responseData;
        }
      } catch (err) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Fetching error!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    async updateStatus(template_ref_no) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex(
          (e) => e.template_ref_no == template_ref_no
        );
        const url = notification.smsStatusUpdate;
        const data = await this.postRequest(url, {
          is_active: !this.tableData.data[index].is_active,
          template_ref_no: template_ref_no,
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
      } catch (err) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Fetching error!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    async fetchSMS(template_ref_no) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = notification.smsUrl + "/" + template_ref_no;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.form.name = responseData.name;
          this.form.subject = responseData.subject;
          this.form.content = responseData.content;
          this.form.type = "sms";
        }
      } catch (err) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Fetching error!",
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
        const url = notification.smsUrl;
        const data = await this.postRequest(url, this.form);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/sms-notification");
        }
      } catch (err) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Fetching error!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    async updateData(template_ref_no) {
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
        const url = notification.smsUrl + "/" + template_ref_no;
        const data = await this.putRequest(url, this.form);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/sms-notification");
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
    async deleteSMS(template_ref_no) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex(
          (e) => e.template_ref_no === template_ref_no
        );
        const url = notification.smsUrl + "/" + template_ref_no;
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
          title: err.data ? err.data.message : "Fetching error!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    async restoreSMS(template_ref_no) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex(
          (e) => e.template_ref_no === template_ref_no
        );
        const url = notification.restoreSMS + "/" + template_ref_no;
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
          title: err.data ? err.data.message : "Fetching error!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    tabActive() {
      if (this.activeTab == "trash") {
        if (!this.can("restore-sms-notification")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          this.fields.splice(index, 1);
          let table_index = this.table_header.findIndex(
            (item) => item == "delete"
          );
          this.table_header.splice(table_index, 1);
        } else {
          if (!this.table_header.includes("delete")) {
            this.table_header.push("delete");
            this.fields.push({ key: "delete" });
          }
        }
        let index = this.fields.findIndex((item) => item.key == "edit");
        this.fields.splice(index, 1);
        let table_index = this.table_header.findIndex((item) => item == "edit");
        this.table_header.splice(table_index, 1);
      } else {
        if (!this.can("delete-sms-notification")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          this.fields.splice(index, 1);
          let table_index = this.table_header.findIndex(
            (item) => item == "delete"
          );
          this.table_header.splice(table_index, 1);
        } else {
          if (!this.table_header.includes("delete")) {
            this.table_header.push("delete");
            this.fields.push({ key: "delete" });
          }
        }
        if (!this.table_header.includes("edit")) {
          this.table_header.push("edit");
          this.fields[3] = { key: "edit" };
          this.fields[4] = { key: "delete" };
        }
      }
    },
  },
  watch: {
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
  created() {
    if (this.$route.name == "add-sms" || this.$route.name == "edit-sms") {
      if (this.$route.name == "edit-sms") {
        this.fetchSMS(this.$route.params.template_ref_no);
      }
    } else {
      this.fetchData("all");
    }
    this.fields.map((item) => {
      this.table_header.push(item.key);
    });
    this.tabActive();
  },
};
