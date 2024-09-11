import { community } from "../../js/path";

export default {
  data() {
    return {
      communityId: null,
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
          key: 'thumbnail_image',
          label: 'Thumbnail'
        },
        {
          key: "title",
          label: 'Community Title'
        },
        {
          key: 'show_in_home_page',
          label: 'Visibility'
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
      form: {
        title: "",
        tag_line: "",
        description: "",
        show_in_home_page: 0,
        available_for_registration: 0,
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        news_card_color: "",
      },
      activeTab: "all",
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      tableData: [],
      currentPage: 1,
      key: 0,
      params: "",
      pre_login_image: "",
      pre_login_image2: "",
      logo_image: "",
      banner_image: "",
      website_banner_image: "",
      thumbnail_image: "",
      pre_login_image_url: "",
      pre_login_image2_url: "",
      logo_image_url: "",
      banner_image_url: "",
      website_banner_image_url: "",
      thumbnail_image_url: "",
      edit: {
        pre_login_image_url: null,
        pre_login_image2_url: null,
        logo_image_url: null,
        banner_image_url: null,
        website_banner_image_url: null,
        thumbnail_image_url: null,
      },
    };
  },
  methods: {
    // search() {
    //   if (this.filter.length > 1) this.fetchData(this.activeTab);
    //   else if (this.filter.length == 0) this.fetchData(this.activeTab);
    // },
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
            community.fetchCommunity +
            "?filter=" +
            txt +
            "&search=" +
            this.filter;
        } else {
          url = community.fetchCommunity + "?filter=" + txt;
        }
      } else if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            community.fetchCommunity +
            "?filter=" +
            txt +
            "&search=" +
            this.filter;
        } else {
          url = community.fetchCommunity + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            community.fetchCommunity +
            "?filter=" +
            txt +
            "&search=" +
            this.filter;
        } else {
          url = community.fetchCommunity + "?filter=" + txt;
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
    async fetchCommunity(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = community.fetchCommunity + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.title != "" && responseData.title != null){
            this.form.title = responseData.title;
          }

          if(responseData.tag_line != "" && responseData.tag_line != null){
            this.form.tag_line = responseData.tag_line;
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

          if(responseData.news_card_color != "" && responseData.news_card_color != null){
            this.form.news_card_color = responseData.news_card_color;
          }

          this.edit.pre_login_image_url = responseData.pre_login_image;
          this.pre_login_image = responseData.pre_login_image;

          this.edit.pre_login_image2_url = responseData.pre_login_image2;
          this.pre_login_image2 = responseData.pre_login_image2;

          this.edit.logo_image_url = responseData.logo_image;
          this.logo_image = responseData.logo_image;

          this.edit.banner_image_url = responseData.banner_image;
          this.banner_image = responseData.banner_image;

          this.edit.website_banner_image_url =
            responseData.website_banner_image;
          this.website_banner_image = responseData.website_banner_image;

          this.edit.thumbnail_image_url = responseData.thumbnail_image;
          this.thumbnail_image = responseData.thumbnail_image;


          if (responseData.forum_tabs) {
            if(typeof responseData.forum_tabs == 'string'){
              this.forum_tabs = JSON.parse(responseData.forum_tabs);
            }
            else{
              this.forum_tabs = responseData.forum_tabs;
            }
          }

          if (responseData.available_for_registration) {
            this.form.available_for_registration = true;
          }

          if (responseData.show_in_home_page) {
            this.form.show_in_home_page = true;
          }

          this.communityId = responseData.id;
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
      if (txt == "pre_login_image") {
        this.pre_login_image = e.target.files[0];
        if (!this.pre_login_image) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "No File Choosen",
          });
          return false;
        }
        if (this.pre_login_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.pre_login_image.reset();
          this.pre_login_image_url = '';
          this.edit.pre_login_image_url = '';
          this.pre_login_image = '';
          return false;
        } else {
          this.pre_login_image_url = URL.createObjectURL(this.pre_login_image);
          this.edit.pre_login_image_url = '';
        }
        return true;
      } else if (txt == "pre_login_image2") {
        this.pre_login_image2 = e.target.files[0];
        if (!this.pre_login_image2) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "No File Choosen",
          });
          return false;
        }
        if (this.pre_login_image2.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.pre_login_image2.reset();
          this.pre_login_image2_url = '';
          this.edit.pre_login_image2_url = '';
          this.pre_login_image2 = '';
          return false;
        } else {
          this.pre_login_image2_url = URL.createObjectURL(this.pre_login_image2);
          this.edit.pre_login_image2_url = '';
        }
        return true;
      } else if (txt == "logo_image") {
        this.logo_image = e.target.files[0];
        if (!this.logo_image) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "No File Choosen",
          });
          return false;
        }
        if (this.logo_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.logo_image.reset();
          this.logo_image_url = '';
          this.edit.logo_image_url = '';
          this.logo_image = '';
          return false;
        } else {
          this.logo_image_url = URL.createObjectURL(this.logo_image);
          this.edit.logo_image_url = '';
        }
        return true;
      } else if (txt == "banner_image") {
        this.banner_image = e.target.files[0];
        if (!this.banner_image) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "No File Choosen",
          });
          return false;
        }
        if (this.banner_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.banner_image.reset();
          this.banner_image_url = '';
          this.edit.banner_image_url = '';
          this.banner_image = '';
          return false;
        } else {
          this.banner_image_url = URL.createObjectURL(this.banner_image);
          this.edit.banner_image_url = '';
        }
        return true;
      } else if (txt == "website_banner_image") {
        this.website_banner_image = e.target.files[0];
        if (!this.website_banner_image) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "No File Choosen",
          });
          return false;
        }
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
      } else if (txt == "thumbnail_image") {
        this.thumbnail_image = e.target.files[0];
        if (!this.thumbnail_image) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "No File Choosen",
          });
          return false;
        }
        if (this.thumbnail_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.thumbnail_image.reset();
          this.thumbnail_image_url = '';
          this.edit.thumbnail_image_url = '';
          this.thumbnail_image = '';
          return false;
        } else {
          this.thumbnail_image_url = URL.createObjectURL(this.thumbnail_image);
          this.edit.thumbnail_image_url = '';
        }
        return true;
      }
    },
    async updateStatus(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id == id);
        const url = community.statusUpdate + "/" + id;
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
      this.$store.commit("loader/updateStatus", false);
    },
    async deleteCommunity(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id == id);
        const url = community.fetchCommunity + "/" + id;
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
    async restoreCommunity(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id == id);
        const url = community.restoreCommunity + "/" + id;
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
    createFormData() {
      this.$store.commit("loader/updateStatus", true);
      let dataAppend = new FormData();
      if (this.pre_login_image) {
        dataAppend.append("pre_login_image", this.pre_login_image);
      }
      if (this.logo_image) {
        dataAppend.append("logo_image", this.logo_image);
      }
      if (this.banner_image) {
        dataAppend.append("banner_image", this.banner_image);
      }
      if (this.pre_login_image2) {
        dataAppend.append("pre_login_image2", this.pre_login_image2);
      }
      if (this.website_banner_image) {
        dataAppend.append("website_banner_image", this.website_banner_image);
      }
      if (this.thumbnail_image) {
        dataAppend.append("thumbnail_image", this.thumbnail_image);
      }

      if (this.form.available_for_registration) {
        dataAppend.append("available_for_registration", 1);
      } else {
        dataAppend.append("available_for_registration", 0);
      }

      if (this.form.show_in_home_page) {
        dataAppend.append("show_in_home_page", 1);
      } else {
        dataAppend.append("show_in_home_page", 0);
      }

      return dataAppend;
    },
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try {

        let url = community.fetchCommunity;
        if(this.$route.name == 'edit-community'){
          url = community.fetchCommunity + '/' + this.communityId;
        }

        let dataAppend = new FormData();
        for (var key in this.form) {
          if (key != "available_for_registration" && key != "show_in_home_page")
            dataAppend.append(key, this.form[key]);
        }

        if (typeof this.pre_login_image === 'string') {
          if (this.pre_login_image.includes("https://")) {
            this.pre_login_image = "";
          }
        }

        if (this.pre_login_image) {
          dataAppend.append("pre_login_image", this.pre_login_image);
        }

        if (typeof this.logo_image === 'string') {
          if (this.logo_image.includes("https://")) {
            this.logo_image = "";
          }
        }
        
        if (this.logo_image) {
          dataAppend.append("logo_image", this.logo_image);
        }

        if (typeof this.banner_image === 'string') {
          if (this.banner_image.includes("https://")) {
            this.banner_image = "";
          }
        }

        if (this.banner_image) {
          dataAppend.append("banner_image", this.banner_image);
        }

        if (typeof this.pre_login_image2 === 'string') {
          if (this.pre_login_image2.includes("https://")) {
            this.pre_login_image2 = "";
          }
        }

        if (this.pre_login_image2) {
          dataAppend.append("pre_login_image2", this.pre_login_image2);
        }

        if (typeof this.website_banner_image === 'string') {
          if (this.website_banner_image.includes("https://")) {
            this.website_banner_image = "";
          }
        }

        if (this.website_banner_image) {
          dataAppend.append("website_banner_image", this.website_banner_image);
        }

        if (typeof this.thumbnail_image === 'string') {
          if (this.thumbnail_image.includes("https://")) {
            this.thumbnail_image = "";
          }
        }

        if (this.thumbnail_image) {
          dataAppend.append("thumbnail_image", this.thumbnail_image);
        }
  
        if (this.form.available_for_registration) {
          dataAppend.append("available_for_registration", 1);
        } else {
          dataAppend.append("available_for_registration", 0);
        }
  
        if (this.form.show_in_home_page) {
          dataAppend.append("show_in_home_page", 1);
        } else {
          dataAppend.append("show_in_home_page", 0);
        }

        dataAppend.append("forum_tabs", JSON.stringify(this.forum_tabs));

        if (this.$route.name == "edit-community") {
          dataAppend.append("_method", "put");
        }

        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/community");
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
    // async updateData(id) {
    //   try {
    //     let url = community.fetchCommunity + "/" + id;
    //     let dataAppend = this.createFormData();
    //     dataAppend.append("forum_tabs", JSON.stringify(this.forum_tabs));

    //     for (var key in this.form) {
    //       if (key != "available_for_registration" && key != "show_in_home_page")
    //         dataAppend.append(key, this.form[key]);
    //     }

    //     dataAppend.append("_method", "put");
    //     const data = await this.postRequest(url, dataAppend);
    //     if (data.status) {
    //       this.$store.commit("toast/updateStatus", {
    //         status: true,
    //         icon: "success",
    //         title: data.message,
    //       });
    //       this.$router.push("/community");
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
    tabActive() {
      if (this.activeTab == "trash") {
        if (this.table_header.includes("delete")) {
          let index = this.fields.findIndex((item) => item.key == "delete");
          this.fields[index] = {
            key: "restore",
          };
          let table_index = this.table_header.findIndex(
            (item) => item == "delete"
          );
          this.table_header[table_index] = "restore";
        } else {
          this.table_header.push("restore");
          this.fields.push({
            key: "restore",
          });
        }

        if (!this.can("restore-community")) {
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
          if (!this.can("edit-community")) {
            this.fields[5] = {
              key: "delete",
            };
          } else {
            this.fields[6] = {
              key: "delete",
            };
          }

          let table_index = this.table_header.findIndex(
            (item) => item == "restore"
          );
          this.table_header[table_index] = "delete";
        }

        if (!this.can("edit-community")) {
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

        if (!this.can("delete-community")) {
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
    activeTab(v) {
      if (v) this.tabActive();
    },
    currentPage: {
      handler: function (value) {
        this.params = `&page=${value}`;
        this.fetchData(this.activeTab);
      },
    },
    "form.available_for_registration"(v) {
      if (v == 1) {
        this.form.available_for_registration = true;
      } else {
        this.form.available_for_registration = false;
      }
    },
    "form.show_in_home_page"(v) {
      if (v == 1) {
        this.form.show_in_home_page = true;
      } else {
        this.form.show_in_home_page = false;
      }
    },
    "form.case_active"(v) {
      if (v == "on") {
        this.form.case_active = true;
      } else {
        this.form.case_active = false;
      }
    },
    "form.overview_active"(v) {
      if (v == "on") {
        this.form.overview_active = true;
      } else {
        this.form.overview_active = false;
      }
    },
    "form.podcast_active"(v) {
      if (v == "on") {
        this.form.podcast_active = true;
      } else {
        this.form.podcast_active = false;
      }
    },
    "form.event_active"(v) {
      if (v == "on") {
        this.form.event_active = true;
      } else {
        this.form.event_active = false;
      }
    },
    "form.videos_active"(v) {
      if (v == "on") {
        this.form.event_active = true;
      } else {
        this.form.event_active = false;
      }
    },
  },
  created() {
    if (
      this.$route.name == "add-community" ||
      this.$route.name == "edit-community"
    ) {
      if (this.$route.name == "edit-community") {
        this.fetchCommunity(this.$route.params.id);
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
