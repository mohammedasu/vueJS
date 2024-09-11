import { partner } from "../../js/path";

export default {
  data() {
    return {
      partner_id: null,
      forum_tabs: {
        overview: {
          index: 1,
          label: "Overview",
          active: false,
        },
        videos: {
          index: 2,
          label: "Videos",
          active: false,
        },
        cases: {
          index: 3,
          label: "Cases",
          active: false,
        },
        live_events: {
          index: 4,
          label: "Live Events",
          active: false,
        },
        podcasts: {
          index: 5,
          label: "Podcast",
          active: false,
        },
      },
      table_header: [],
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: 'website_banner_image',
          label: 'Banner'
        },
        {
          key: "title",
          label: 'Partner Name'
        },
        {
          key: "is_active",
          label: "Active",
        },
        {
          key: 'is_visible_in_home',
          label: 'Visibility'
        },
        {
          key: "edit",
        },
        {
          key: "delete",
        },
      ],
      params: "",
      activeTab: "all",
      key: 0,
      sortBy: "id",
      sortDesc: true,
      tableData: [],
      filter: null,
      filterOn: [],
      currentPage: 1,
      form: {
        title: "",
        link_name: "",
        description: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        is_visible_in_home: 0,
      },
      app_banner_image: "",
      open_page_register_image: "",
      app_logo_image: "",
      website_banner_image: "",
      open_page_banner_img: "",
      app_banner_image_url : "",
      open_page_register_image_url: "",
      app_logo_image_url: "",
      website_banner_image_url: "",
      open_page_banner_img_url: "",
      edit: {
        app_banner_image_url: null,
        open_page_register_image_url: null,
        app_logo_image_url: null,
        website_banner_image_url: null,
        open_page_banner_img_url: null,
      },
    };
  },
  methods: {
    slugify() {
      this.partner_title = this.form.title;
      if (this.partner_title) {
        const slug_generate = this.partner_title
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/--+/g, "-")
          .replace(/^-+/, "");
        this.form.link_name = slug_generate;
      } else {
        this.form.link_name = null;
      }
    },
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
    async fetchData(txt) {
      let url = null;
      if (txt == "active") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            partner.partnerUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = partner.partnerUrl + "?filter=" + txt;
        }
      } else if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            partner.partnerUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = partner.partnerUrl + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            partner.partnerUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = partner.partnerUrl + "?filter=" + txt;
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
          title: "Fetching error!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    async fetchPartner(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = partner.partnerUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.title != "" && responseData.title != null){
            this.form.title = responseData.title;
          }

          if(responseData.link_name != "" && responseData.link_name != null){
            this.form.link_name = responseData.link_name;
          }

          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
          }

          if(responseData.meta_title != "" && responseData.meta_title != null){
            this.form.meta_title = responseData.meta_title;
          }

          if(responseData.meta_description != "" && responseData.meta_description != null){
            this.form.meta_description = responseData.meta_description;
          }

          if(responseData.meta_keywords != "" && responseData.meta_keywords != null){
            this.form.meta_keywords = responseData.meta_keywords;
          }

          if (responseData.is_visible_in_home) {
            this.form.is_visible_in_home = true;
          }
          if (responseData.forum_tabs) {
            if(typeof responseData.forum_tabs == 'string'){
              this.forum_tabs = JSON.parse(responseData.forum_tabs);
            }else{
              this.forum_tabs = responseData.forum_tabs;
            }
          }

          this.edit.app_banner_image_url = responseData.app_banner_image;
          this.app_banner_image = responseData.app_banner_image;

          this.edit.app_logo_image_url = responseData.app_logo_image;
          this.app_logo_image = responseData.app_logo_image;

          this.edit.open_page_banner_img_url =
            responseData.open_page_banner_img;
          this.open_page_banner_img = responseData.open_page_banner_img;

          this.edit.open_page_register_image_url =
            responseData.open_page_register_image;
          this.open_page_register_image = responseData.open_page_register_image;

          this.edit.website_banner_image_url =
            responseData.website_banner_image;
          this.website_banner_image = responseData.website_banner_image;

          this.partner_id = responseData.id;
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
    async updateStatus(id) {
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = partner.statusUpdate + "/" + id;
        const data = await this.postRequest(url, {
          is_active: !this.tableData.data[index].is_active,
        });
        if (data.status) {
          const responseData = data.response;
          this.tableData.data[index] = responseData;
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
    },
    async deletePartner(id) {
      let index = this.tableData.data.findIndex((e) => e.id === id);
      const url = partner.partnerUrl + "/" + id;
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
    },
    async restorePartner(id) {
      let index = this.tableData.data.findIndex((e) => e.id === id);
      const url = partner.restorePartner + "/" + id;
      const data = await this.postRequest(url, {});
      if (data.status) {
        this.tableData.data.splice(index, 1);
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "success",
          title: data.message,
        });
      } else {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Please try again!",
        });
      }
    },
    readFile(e, txt) {
      if (txt == "app_banner_image") {
        this.app_banner_image = e.target.files[0];
        if (this.app_banner_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.app_banner_image.reset();
          this.app_banner_image_url = '';
          this.edit.app_banner_image_url = '';
          this.app_banner_image = '';
          return false;
        } else {
          this.app_banner_image_url = URL.createObjectURL(this.app_banner_image);
          this.edit.app_banner_image_url = '';
        }
        return true;
      } else if (txt == "open_page_register_image") {
        this.open_page_register_image = e.target.files[0];
        if (this.open_page_register_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.open_page_register_image.reset();
          this.open_page_register_image_url = '';
          this.edit.open_page_register_image_url = '';
          this.open_page_register_image = '';
          return false;
        } else {
          this.open_page_register_image_url = URL.createObjectURL(this.open_page_register_image);
          this.edit.open_page_register_image_url = '';
        }
        return true;
      } else if (txt == "app_logo_image") {
        this.app_logo_image = e.target.files[0];
        if (this.app_logo_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.app_logo_image.reset();
          this.app_logo_image_url = '';
          this.edit.app_logo_image_url = '';
          this.app_logo_image = '';
          return false;
        } else {
          this.app_logo_image_url = URL.createObjectURL(this.app_logo_image);
          this.edit.app_logo_image_url = '';
        }
        return true;
      } else if (txt == "website_banner_image") {
        this.website_banner_image = e.target.files[0];
        if (this.website_banner_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.website_banner_image.reset();
          this.website_banner_image_url = '';
          this.edit.website_banner_image_url = '';
          this.website_banner_image = '';
          return false;
        } else {
          this.website_banner_image_url = URL.createObjectURL(this.website_banner_image);
          this.edit.website_banner_image_url = '';
        }
        return true;
      } else if (txt == "open_page_banner_img") {
        this.open_page_banner_img = e.target.files[0];
        if (this.open_page_banner_img.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.open_page_banner_img.reset();
          this.open_page_banner_img_url = '';
          this.edit.open_page_banner_img_url = '';
          this.open_page_banner_img = '';
          return false;
        } else {
          this.open_page_banner_img_url = URL.createObjectURL(this.open_page_banner_img);
          this.edit.open_page_banner_img_url = '';
        }
        return true;
      }
    },
    // async updateData(id) {
    //   this.submitted = true;
    //   this.$v.$touch();
    //   if (this.$v.$invalid) {
    //     this.$store.commit("toast/updateStatus", {
    //         status: true,
    //         icon: "error",
    //         title: "Please Fill The Required Fields"
    //       });
    //     return false;
    //   }
    //   this.$store.commit("loader/updateStatus", true);
    //   const url = partner.partnerUrl + "/" + id;
    //   let dataAppend = new FormData();
    //   dataAppend.append("forum_tabs", JSON.stringify(this.forum_tabs));

    //   if (this.app_banner_image) {
    //     dataAppend.append("app_banner_image", this.app_banner_image);
    //   }
    //   if (this.open_page_register_image) {
    //     dataAppend.append(
    //       "open_page_register_image",
    //       this.open_page_register_image
    //     );
    //   }
    //   if (this.app_logo_image) {
    //     dataAppend.append("app_logo_image", this.app_logo_image);
    //   }
    //   if (this.website_banner_image) {
    //     dataAppend.append("website_banner_image", this.website_banner_image);
    //   }
    //   if (this.open_page_banner_img) {
    //     dataAppend.append("open_page_banner_img", this.open_page_banner_img);
    //   }
    //   for (var key in this.form) {
    //     dataAppend.append(key, this.form[key]);
    //   }
    //   if (this.form.is_visible_in_home) {
    //     dataAppend.append("is_visible_in_home", 1);
    //   } else {
    //     dataAppend.append("is_visible_in_home", 0);
    //   }
    //   dataAppend.append("_method", "put");
    //   const data = await this.postRequest(url, dataAppend);
    //   if (data.status) {
    //     this.$store.commit("toast/updateStatus", {
    //       status: true,
    //       icon: "success",
    //       title: data.message,
    //     });
    //     this.$router.push("/partner");
    //   } else {
    //     this.$store.commit("toast/updateStatus", {
    //       status: true,
    //       icon: "error",
    //       title: "Please try again!",
    //     });
    //   }
    //   this.$store.commit("loader/updateStatus", false);
    // },
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try{
        let url = partner.partnerUrl;
        if(this.$route.name == 'edit-partner'){
          url = partner.partnerUrl + '/' + this.partner_id;
        }
        let dataAppend = new FormData();

        if (typeof this.app_banner_image === 'string') {
          if (this.app_banner_image.includes("https://")) {
            this.app_banner_image = "";
          }
        }

        if(this.app_banner_image){
          dataAppend.append("app_banner_image", this.app_banner_image);
        }

        if (typeof this.open_page_register_image === 'string') {
          if (this.open_page_register_image.includes("https://")) {
            this.open_page_register_image = "";
          }
        }

        if(this.open_page_register_image){
          dataAppend.append(
            "open_page_register_image",
            this.open_page_register_image
          );
        }
        
        if (typeof this.app_logo_image === 'string') {
          if (this.app_logo_image.includes("https://")) {
            this.app_logo_image = "";
          }
        }

        if(this.app_logo_image){
          dataAppend.append("app_logo_image", this.app_logo_image);
        }

        if (typeof this.website_banner_image === 'string') {
          if (this.website_banner_image.includes("https://")) {
            this.website_banner_image = "";
          }
        }        

        if(this.website_banner_image){
          dataAppend.append("website_banner_image", this.website_banner_image);
        }

        if (typeof this.open_page_banner_img === 'string') {
          if (this.open_page_banner_img.includes("https://")) {
            this.open_page_banner_img = "";
          }
        }  

        if(this.open_page_banner_img){
          dataAppend.append("open_page_banner_img", this.open_page_banner_img);
        }

        for (var key in this.form) {
          dataAppend.append(key, this.form[key]);
        }
        if (this.form.is_visible_in_home) {
          dataAppend.append("is_visible_in_home", 1);
        } else {
          dataAppend.append("is_visible_in_home", 0);
        }
        dataAppend.append("forum_tabs", JSON.stringify(this.forum_tabs));

        if (this.$route.name == "edit-partner") {
          dataAppend.append("_method", "put");
        }

        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/partner");
        }
      }
      catch (err) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: err.data ? err.data.message : "Please try again!",
        });
      }
      this.$store.commit("loader/updateStatus", true);
    },
    tabActive() {
      if (this.activeTab == "trash") {
        if (this.table_header.includes("delete")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          this.fields[index] = {
            key: "restore",
          };
          let table_index = this.table_header.findIndex((item) => item == "delete");
          this.table_header[table_index] = "restore";

        } else {
          this.table_header.push("restore");
          this.fields.push({
            key: "restore",
          });
        }

        if (!this.can("restore-partner")) {
          let index = this.fields.findIndex((item) => item.key == "restore");
          if (index !== -1) {
            this.fields.splice(index, 1);
            let table_index = this.table_header.findIndex(
              (item) => item == "restore"
            );
            this.table_header.splice(table_index, 1);
          }
        }

        let index = this.fields.findIndex((item) => item.key == "edit");
        if (index !== -1) {
          this.fields.splice(index, 1);
          let table_index = this.table_header.findIndex(
            (item) => item == "edit"
          );
          this.table_header.splice(table_index, 1);
        }
      } else {
        if (this.table_header.includes("restore")) {
           if (!this.can("edit-partner")) {
             this.fields[5] = {
               key: "delete",
             };
           } else {
             this.fields[6] = {
               key: "delete",
             };
           }
 
           let table_index = this.table_header.findIndex((item) => item == "restore");
           this.table_header[table_index] = "delete";
        }

        if (!this.can("edit-partner")) {
          let index = this.fields.findIndex((item) => item.key == "edit");
          if (index !== -1) {
            this.fields.splice(index, 1);
            let table_index = this.table_header.findIndex(
              (item) => item == "edit"
            );
            this.table_header.splice(table_index, 1);
          }
        } else {
          if (!this.table_header.includes("edit")) {
            this.table_header.push("edit");
            this.fields[5] = {
              key: "edit",
            };
          }
        }

        if (!this.can("delete-partner")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          if (index !== -1) {
            this.fields.splice(index, 1);
            let table_index = this.table_header.findIndex(
              (item) => item == "delete"
            );
            this.table_header.splice(table_index, 1);
          }
        } else {
          if (!this.table_header.includes("delete")) {
            this.table_header.push("delete");
            this.fields[6] = {
              key: "delete",
            };
          }
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
    "form.is_visible_in_home"(v) {
      if (v == 1) {
        this.form.is_visible_in_home = true;
      } else {
        this.form.is_visible_in_home = false;
      }
    },
    activeTab(v) {
      if (v) this.tabActive();
    },
  },
  created() {
    if (
      this.$route.name == "add-partner" ||
      this.$route.name == "edit-partner"
    ) {
      if (this.$route.name == "edit-partner") {
        this.fetchPartner(this.$route.params.id);
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
