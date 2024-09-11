import { adminUser, role } from "../../js/path";

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
          key: "username",
        },
        {
          key: "role_name",
          label: "Roles",
        },
        {
          key: "edit",
        },
        {
          key: "delete",
        },
      ],
      form: {
        username: "",
        email: "",
        password: "",
        role: "",
        confirm_password: "",
      },
      roles: [],
      params: "",
      filter: null,
      filterOn: [],
      tableData: [],
      sortBy: "id",
      sortDesc: true,
      key: 0,
      currentPage: 1,
      activeTab: "all",
    };
  },
  methods: {
    search(event) {
      if (this.filter.length > 1) {
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
    async fetchRole() {
      const url = role.roleUrl;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.roles = responseData;
      }
    },
    async fetchData(txt) {
      let url = null;
      if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            adminUser.adminUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = adminUser.adminUrl + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            adminUser.adminUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = adminUser.adminUrl + "?filter=" + txt;
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
    async fetchUser(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = `${adminUser.adminUrl}/${id}`;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.form.role = responseData.user.role;
          this.form.username = responseData.user.username;
          this.form.email = responseData.user.email;
          this.form.password = "123456";
          this.form.confirm_password = "123456";
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
    async addAdmin() {
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
        let url = `${adminUser.adminUrl}`;
        const data = await this.postRequest(url, this.form);
        if (data.status) {
          const responseData = data.response.data;
          this.tableData = responseData;
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/admin");
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
    async updateAdmin(id) {
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
        let url = `${adminUser.adminUrl}/${id}`;
        delete this.form.password;
        delete this.form.confirm_password;
        const data = await this.putRequest(url, this.form);
        if (data.status) {
          const responseData = data.response.data;
          this.tableData = responseData;
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/admin");
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
    async deleteAdmin(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = adminUser.adminUrl + "/" + id;
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
    async restoreAdmin(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = adminUser.restoreAdmin + "/" + id;
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
        if (!this.can("restore-admin-user")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          this.fields.splice(index, 1);
          let table_index = this.table_header.findIndex(
            (item) => item == "delete"
          );
          this.table_header.splice(table_index, 1);
        } else {
          if (!this.table_header.includes("delete")) {
            this.table_header.push("delete");
            this.fields.push({
              key: "delete",
            });
          }
        }
        let index = this.fields.findIndex((item) => item.key == "edit");
        this.fields.splice(index, 1);
        let table_index = this.table_header.findIndex((item) => item == "edit");
        this.table_header.splice(table_index, 1);
      } else {
        if (!this.can("delete-admin-user")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          this.fields.splice(index, 1);
          let table_index = this.table_header.findIndex(
            (item) => item == "delete"
          );
          this.table_header.splice(table_index, 1);
        } else {
          if (!this.table_header.includes("delete")) {
            this.table_header.push("delete");
            this.fields.push({
              key: "delete",
            });
          }
        }

        if (!this.table_header.includes("edit")) {
          this.table_header.push("edit");
          this.fields[3] = {
            key: "edit",
          };
          this.fields[4] = {
            key: "delete",
          };
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
    if (this.$route.name == "add-admin" || this.$route.name == "edit-admin") {
      this.fetchRole();
      if (this.$route.name == "edit-admin") {
        this.fetchUser(this.$route.params.id);
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
