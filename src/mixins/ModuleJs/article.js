import { article, community } from "../../js/path";
import moment from "moment";

export default {
  data() {
    return {
      article_id: null,
      table_header: [],
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: 'community_name',
          label: 'Community'
        },
        {
          key: "journal",
        },
        {
          key: "article_timestamp",
          label: "Date",
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
      form: {
        translation: {
          indonesia: {
            header: '',
            link: '',
            small_description: '',
            journal: '',
            meta_title: '',
            meta_keywords: '',
            meta_desc: '',
            button_text: '',
          }
        },
        community_id: "",
        card_name: "",
        article_timestamp: null,
        header: "",
        journal: "",
        small_description: "",
        link: "",
        meta_title: "",
        meta_desc: "",
        meta_keywords: "",
        content: "",
        article_schedule: 0,
        article_show: 0,
        button_text: '',
      },
      placeholder: null,
      currentPage: 1,
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      activeTab: "all",
      tableData: [],
      key: 0,
      params: "",
      card_image: "",
      card_image_url: "",
      image_name_indonesia_url: '',
      image_name_indonesia: '',
      edit: {
        card_image_url: "",
        image_name_indonesia_url: null
      },
    };
  },
  methods: {
    // search() {
    //   if (this.filter.length > 1) {
    //     this.fetchData(this.activeTab);
    //   } else if (this.filter.length == 0) {
    //     this.fetchData(this.activeTab);
    //   }
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
            article.articleUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = article.articleUrl + "?filter=" + txt;
        }
      } else if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            article.articleUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = article.articleUrl + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url =
            article.articleUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = article.articleUrl + "?filter=" + txt;
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
    async fetchArticle(id, article_timestamp) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = article.articleUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.card_name != "" && responseData.card_name != null){
            this.form.card_name = responseData.card_name;
          }
          
          if(responseData.header != "" && responseData.header != null){
            this.form.header = responseData.header;
          }

          if(responseData.journal != "" && responseData.journal != null){
            this.form.journal = responseData.journal;
          }

          if(responseData.small_description != "" && responseData.small_description != null){
            this.form.small_description = responseData.small_description;
          }

          if(responseData.link != "" && responseData.link != null){
            this.form.link = responseData.link;
          }

          if(responseData.meta_title != "" && responseData.meta_title != null){
            this.form.meta_title = responseData.meta_title;
          }

          if(responseData.meta_desc != "" && responseData.meta_desc != null){
            this.form.meta_desc = responseData.meta_desc;
          }

          if(responseData.meta_keywords != "" && responseData.meta_keywords != null){
            this.form.meta_keywords = responseData.meta_keywords;
          }

          if(responseData.content != "" && responseData.content != null){
            this.form.content = responseData.content;
          }

          if(responseData.button_text != "" && responseData.button_text != null){
            this.form.button_text = responseData.button_text;
          }

          if (responseData.article_schedule) {
            this.form.article_schedule = true;
          }

          if (responseData.article_show) {
            this.form.article_show = true;
          }

          this.edit.card_image_url = responseData.card_image;
          this.card_image = responseData.card_image;

          this.form.community_id = responseData.community_id;

          this.form.article_timestamp = moment(article_timestamp).format("YYYY-MM-DDTHH:mm");
          
          if(responseData.translation != "" && responseData.translation != null){
            this.form.translation = responseData.translation;
            this.edit.image_name_indonesia_url = responseData.translation.indonesia.image ? responseData.translation.indonesia.image : '';
          }

          this.article_id = responseData.id;
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
    async restoreArticle(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = article.articleUrl + "/" + id;
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
    async updateStatus(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = article.statusUpdate;
        const data = await this.postRequest(url, {
          is_active: !this.tableData.data[index].is_active,
          id: id,
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
    async deleteArticle(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = article.articleUrl + "/" + id;
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
    async fetchCommunity() {
      const url = community.fetchAllActiveCommunity;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.community = responseData;
      }
    },
    readFile(e, txt) {
      if (txt == "card_image") {
        this.card_image = e.target.files[0];
        if (this.card_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.card_image.reset();
          this.card_image_url = '';
          this.edit.card_image_url = '';
          this.card_image = '';
          return false;
        } else {
          this.card_image_url = URL.createObjectURL(this.card_image);
          this.edit.card_image_url = URL.createObjectURL(this.card_image_url);
        }
        return true;
      } else if(txt == 'image_name_indonesia'){
        this.image_name_indonesia = e.target.files[0];
        if (this.image_name_indonesia.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.image_name_indonesia.reset();
          this.image_name_indonesia_url = '';
          this.edit.image_name_indonesia_url = '';
          this.image_name_indonesia = '';
          return false;
        } else {
          this.image_name_indonesia_url = URL.createObjectURL(this.image_name_indonesia);
          this.edit.image_name_indonesia_url = '';
        }
        return true; 
      }
    },
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = article.articleUrl;
        if(this.$route.name == 'edit-article'){
          url = article.articleUrl + '/' + this.article_id;
        }
        let dataAppend = new FormData();
        if (this.card_image) {
          dataAppend.append("card_image", this.card_image);
        }
        if (this.image_name_indonesia) {
          dataAppend.append("image_name_indonesia", this.image_name_indonesia);
        }
        dataAppend.append("translation", JSON.stringify(this.form.translation));
        for (var key in this.form) {
          if(key != "translation"){
            dataAppend.append(key, this.form[key]);
          }
        }
        if (this.form.article_show) {
          dataAppend.append("article_show", 1);
        } else {
          dataAppend.append("article_show", 0);
        }
        if (this.form.article_schedule) {
          dataAppend.append("article_schedule", 1);
        } else {
          dataAppend.append("article_schedule", 0);
        }
        if (this.$route.name == "edit-article") {
          dataAppend.append("_method", "put");
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/article");
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
    async fetchExcel() {
      this.$store.commit("loader/updateStatus", true);
      try {
        const url = article.importFile;
        let dataAppend = new FormData();
        dataAppend.append("excel", this.$refs.file.files[0]);
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: "File added successfully",
          });
          this.$refs.file.reset();
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
          let table_index = this.table_header.findIndex((item) => item == "delete");
          this.table_header[table_index] = "restore";

        } else {
          this.table_header.push("restore");
          this.fields.push({
            key: "restore",
          });
        }

        if (!this.can("restore-article")) {
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
           if (!this.can("edit-article")) {
             this.fields[6] = {
               key: "delete",
             };
           } else {
             this.fields[7] = {
               key: "delete",
             };
           }
 
           let table_index = this.table_header.findIndex((item) => item == "restore");
           this.table_header[table_index] = "delete";
        }

        if (!this.can("edit-article")) {
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
            this.fields[6] = {
              key: "edit",
            };
          }
        }

        if (!this.can("delete-article")) {
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
            this.fields[7] = {
              key: "delete",
            };
          }
        }
      }
    },
  },
  watch: {
    "form.article_show"(v) {
      if (v == 1) {
        this.form.article_show = true;
      } else {
        this.form.article_show = false;
      }
    },
    "form.article_schedule"(v) {
      if (v == 1) {
        this.form.article_schedule = true;
      } else {
        this.form.article_schedule = false;
      }
    },
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
    if (
      this.$route.name == "add-article" ||
      this.$route.name == "edit-article"
    ) {
      this.fetchCommunity();
      if (this.$route.name == "edit-article") {
        this.fetchArticle(this.$route.params.id);
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
