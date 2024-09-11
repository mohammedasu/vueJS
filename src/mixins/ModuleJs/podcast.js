import { community, partner, podcast } from "../../js/path";
import moment from "moment";

export default {
  data() {
    return {
      podcast_id: null,
      table_header: [],
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: 'image_name',
          label: "Thumbnail"
        },
        {
          key: "title",
          label: 'Podcast Title'
        },
        {
          key: 'date',
          formatter: value => {
            return moment(String(value)).format('ll')
          }
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
      community: [],
      partner: [],
      form: {
        community_id: "",
        partner_id: "",
        title: "",
        audio_link: "",
        description: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        date: "",
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
      image_name: "",
      image_name_url: "",
      edit: {
        image_name_url: null,
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
            podcast.podcastUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = podcast.podcastUrl + "?filter=" + txt;
        }
      } else if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            podcast.podcastUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = podcast.podcastUrl + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            podcast.podcastUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = podcast.podcastUrl + "?filter=" + txt;
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
    async fetchPodcast(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = podcast.podcastUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.title != "" && responseData.title != null){      
            this.form.title = responseData.title;
          }

          if(responseData.audio_link != "" && responseData.audio_link != null){
            this.form.audio_link = responseData.audio_link;
          }

          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
          }

          if(responseData.meta_title != "" && responseData.meta_title != null){
            this.form.meta_title = responseData.meta_title;
          }

          if(responseData.meta_keywords != "" && responseData.meta_keywords != null){
            this.form.meta_keywords = responseData.meta_keywords;
          }

          if(responseData.meta_description != "" && responseData.meta_description != null){
            this.form.meta_description = responseData.meta_description;
          }          
          
          if(responseData.date != "" && responseData.date != null){
            this.form.date = responseData.date;
          }

          if(responseData.community_id != "" && responseData.community_id != null){
            this.form.community_id = responseData.community_id;
          }

          if(responseData.partner_id != "" && responseData.partner_id != null){
            this.form.partner_id = responseData.partner_id;
          }

          this.edit.image_name_url = responseData.image_name;
          this.podcast_id = responseData.id;
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
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = podcast.statusUpdate + "/" + id;
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
    async deletePodcast(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = podcast.podcastUrl + "/" + id;
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
    async restorePodcast(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = podcast.restorePodcast + "/" + id;
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
    readFile(e, txt) {
      if (txt == "image_name") {
        this.image_name = e.target.files[0];
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
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try {
        if(this.$route.name == 'edit-podcast'){
          url = podcast.podcastUrl + '/' + this.podcast_id;
        }
        let url = podcast.podcastUrl;
        let dataAppend = new FormData();
        if(this.image_name){
          dataAppend.append("image_name", this.image_name);
        }
        for (var key in this.form) {
          dataAppend.append(key, this.form[key]);
        }
        if (this.$route.name == "edit-podcast") {
          dataAppend.append("_method", "put");
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/podcast");
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
    async fetchCommunity() {
      const url = community.fetchAllActiveCommunity;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.community = responseData;
      }
    },
    async fetchPartner() {
      const url = partner.fetchAllActivePartner;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.partner = responseData;
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
        const url = podcast.podcastUrl + "/" + id;
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
          this.$router.push("/podcast");
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

        if (!this.can("restore-podcast")) {
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
          if (!this.can("edit-podcast")) {
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

        if (!this.can("edit-podcast")) {
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

        if (!this.can("delete-podcast")) {
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
        if (typeof value != undefined) {
          this.params = `&page=${value}`;
          this.fetchData(this.activeTab);
        }
      },
    },
    activeTab(v) {
      if (v) this.tabActive();
    },
  },
  created() {
    if (
      this.$route.name == "add-podcast" ||
      this.$route.name == "edit-podcast"
    ) {
      this.fetchCommunity();
      this.fetchPartner();
      if (this.$route.name == "edit-podcast") {
        this.fetchPodcast(this.$route.params.id);
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
