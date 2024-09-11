import { role } from "../../js/path";

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
          key: "name",
          label: "Role Name",
        },
        {
          key: "permissions",
        },
        {
          key: "edit",
        },
        {
          key: "delete",
        },
      ],
      permission: [],
      form: {
        name: "",
        permission: [],
      },
      params: "",
      tableData: [],
      activeTab: "all",
      key: 0,
      currentPage: 1,
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      selected: [],
      // isCheckAll: false,
    };
  },
  methods: {
    checkAll(e,id) {
        let data = this.permission
        .filter((p) => p.id == id);
        if(data != '') {
          if(typeof data[0].sub_menu != undefined && data[0].sub_menu.length > 0) {
            data[0].sub_menu.map(parent => {
              if(e.target.checked) {
                if(!this.form.permission.includes(parent.id)) {
                  this.form.permission.push(parent.id); 
                } else {
                  this.form.permission.splice(this.form.permission.indexOf(parent.id), 1);
                }
              } else {
                if(this.form.permission.includes(parent.id)) {
                  this.form.permission.splice(this.form.permission.indexOf(parent.id), 1);
                }
              }
            });
          }
        }
    },
    subMenuCheck(id,parent) {
        if(!this.form.permission.includes(id)) {
          this.form.permission.push(id);
        } else {
          this.form.permission.splice(this.form.permission.indexOf(id), 1); 
        }
        
      let data = this.permission
      .filter((p) => p.id == parent);
      if(data != '') {
        let length = data[0].sub_menu.length;
        if(typeof data[0].sub_menu != undefined && data[0].sub_menu.length > 0) {
          let count = 0;
          data[0].sub_menu.map(sub => {
            if(this.form.permission.includes(sub.id)) {
              count++;
            }
          });
          if(length == count) {
            this.form.permission.push(parent);
          }
        }
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
        let url = role.roleUrl;
        if (pagination == "search") {
          url = role.roleUrl + "?search=" + this.filter;
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
    async getPermissions() {
      let url = `${role.permissionUrl}?nopagination`;
      const data = await this.getRequest(url);
      if (data.status) {
        if (data.response.data) {
          this.permission = data.response.data;
          this.permission
            .filter((p) => p.parent == 0)
            .map((item) => {
              item.sub_menu = this.permission.filter(
                (perm) => perm.parent == item.id
              );
            });
          this.permission = this.permission.filter((p) => p.parent == 0);
        }
      }
    },
    async fetchRole(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = role.roleUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          if (responseData.permission.data) {
            this.permission = responseData.permission.data;
            this.permission
              .filter((p) => p.parent == 0)
              .map((item) => {
                item.sub_menu = this.permission.filter(
                  (perm) => perm.parent == item.id
                );
              });
            this.permission = this.permission.filter((p) => p.parent == 0);
          }
          this.form.name = data.response.role.name;
          this.form.permission = data.response.rolePermissions;
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
    async deleteRole(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = role.roleUrl + "/" + id;
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
        const url = role.roleUrl;
        const data = await this.postRequest(url, this.form);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/role");
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
        this.$store.commit("loader/updateStatus");
        const url = role.roleUrl + "/" + id;
        const data = await this.putRequest(url, {
          name: this.form.name,
          permission: this.form.permission,
        });
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/role");
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
    if (this.$route.name == "add-role" || this.$route.name == "edit-role") {
      if (this.$route.name == "edit-role") {
        this.fetchRole(this.$route.params.id);
      } else {
        this.getPermissions();
      }
    } else {
      this.fetchData("all");
    }
  },
};
