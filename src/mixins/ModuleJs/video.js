import {
  video,
  community,
  expert,
  country,
  partner,
  forum,
  knowledgeCategory,
  subspeciality,
  live_event
} from "../../js/path";
import moment from "moment";
import _ from 'lodash';

export default {
  data() {
    return {
      status: false,
      oldForm: {},
      video_id: null,
      activeTab: "all",
      table_header: [],
      communities: [],
      expertsopt: [],
      partners: [],
      forums: [],
      allCountry: [],
      knowledgeCategories: [],
      subspecialities: [],
      liveEvents: [],
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      tableData: [],
      currentPage: 1,
      params: "",
      key: 0,
      url: 'https://mymedisage.com/video/',
      // translations: [
      //   {
      //     label: 'Video Title',
      //     label_id: 'title',
      //     placeholder: 'Enter Video Title',
      //     lang: "indonesia",
      //   },
      //   {
      //     label: 'Tell Us More About The Video',
      //     label_id: 'description',
      //     placeholder: '',
      //     lang: "indonesia",
      //   },
      //   {
      //     label: 'Meta Title',
      //     label_id: 'meta_title',
      //     placeholder: 'Enter Meta Title',
      //     lang: "indonesia",
      //   },
      //   {
      //     label: 'Meta Description',
      //     label_id: 'meta_description',
      //     placeholder: '',
      //     lang: 'indonesia'
      //   },
      //   {
      //     label: 'Meta Keywords',
      //     label_id: 'meta_keywords',
      //     placeholder: 'Enter Meta Keywords',
      //     lang: 'indonesia'
      //   },
      //   {
      //     label: 'Thumbnail Image',
      //     label_id: 'thumbnail',
      //     placeholder: 'Choose a file or drop it here...',
      //     lang: 'indonesia'
      //   }
      // ],
      form: {
        translation: {
          indonesia: {
            title: '',
            description: '',
            meta_title: '',
            meta_description: '',
            meta_keywords: ''
          }
        },
        title: "",
        community_selected: [],
        country: [],
        tags:[],
        knowledge_categories: [],
        meta_title: "",
        meta_keywords: "",
        meta_description: "",
        partner_id: "",
        partner_division_id: 0,
        video_link: "",
        videocrypt_id: "",
        url_link: "",
        quiz_percentage: 0,
        popup: 0,
        popup_percentage: 0,
        popup_description: "",
        why_to_watch: "",
        recommended_for: "",
        thumbnail_url: "",
        video_timestamp: "",
        visible_on_main_page: 0,
        is_open_video: 0,
        sub_specialities: [],
        experts: [],
        live_event_id: 0,
        custom_button_name: "",
        custom_link: "",
        description: "",
      },
      image_name: "",
      image_name_indonesia: "",
      image_name_url: "",
      image_name_indonesia_url: "",
      edit: {
        image_name_url: null,
        image_name_indonesia_url: null,
      },
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: 'image_name',
          label: 'Thumbnail'
        },
        {
          key: "title",
        },
        {
          key: "is_active",
          label: "Active",
        },
        {
          key: 'visible_on_main_page',
          label: 'Visibility'
        },
        {
          key: 'video_timestamp',
          label: 'Date',
          formatter: value => {
            return moment(String(value)).format('ll')
          }
        },
        {
          key: "edit",
        },
        {
          key: "delete",
        },
      ],
      isVideoTimestamp: false
    };
  },
  computed: {
    geturl() {
      return `${this.url+this.form.url_link}`;
    }
  },
  methods: {
    getFormatedDate(video_timestamp, type = "date") {
      if (type == "date") {
        return moment(video_timestamp).format("DD MMMM");
      } else {
        return moment(video_timestamp).format("MMMM");
      }
    },
    disabledDates() {
      return new Date().toISOString().slice(0, 16);
    },
    changeDate(val){
      if(val){
        this.isVideoTimestamp = true;
      }
      else{
        this.isVideoTimestamp = false;
      }
    },
    slugify() {
      this.video_title = this.form.title;
      if (this.video_title) {
        const slug_generate = this.video_title
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/--+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "");
        this.form.url_link = slug_generate;
      } else {
        this.form.url_link = null;
      }
    },
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
          url = video.videoUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = video.videoUrl + "?filter=" + txt;
        }
      } else if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = video.videoUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = video.videoUrl + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = video.videoUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = video.videoUrl + "?filter=" + txt;
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
    async fetchVideo(id, video_timestamp) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = video.videoUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          if(responseData.translation != null && responseData.translation != ""){
            this.form.translation = responseData.translation;
            this.edit.image_name_indonesia_url = responseData.translation.indonesia.image ? responseData.translation.indonesia.image : '';
          }

          if(responseData.title !="" && responseData.title != null){
            this.form.title = responseData.title;
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

          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
          }

          if(responseData.partner_id != "" && responseData.partner_id != null) {
            this.form.partner_id = responseData.partner_id;
          }

          if(responseData.videocrypt_id != "" && responseData.videocrypt_id != null) {
            this.form.videocrypt_id = responseData.videocrypt_id;
          }

          if(responseData.video_link != "" && responseData.video_link != null){
            this.form.video_link = responseData.video_link;
          }

          if(responseData.url_link != "" && responseData.url_link != null) {
            this.form.url_link = responseData.url_link;
          }

          if(responseData.quiz_percentage != "" && responseData.quiz_percentage != null){
            this.form.quiz_percentage = responseData.quiz_percentage;
          }

          if(responseData.popup_percentage != "" && responseData.popup_percentage != null){
            this.form.popup_percentage = responseData.popup_percentage;
          }

          if(responseData.popup_description != "" && responseData.popup_description != null){
            this.form.popup_description = responseData.popup_description;
          }

          if(responseData.why_to_watch != "" && responseData.why_to_watch != null){
            this.form.why_to_watch = responseData.why_to_watch;
          }

          if(responseData.recommended_for != "" && responseData.recommended_for != null){
            this.form.recommended_for = responseData.recommended_for;
          }

          if(responseData.thumbnail_url != "" && responseData.thumbnail_url != null){
            this.form.thumbnail_url = responseData.thumbnail_url;
          }

          this.form.video_timestamp =
            moment(video_timestamp).format("YYYY-MM-DDTHH:mm");

            if (responseData.community_selected != "" && responseData.community_selected != null) {
              this.form.community_selected = responseData.community_selected.map(c => {return {id: c.community_id, title: c.name}});
            }

          if (responseData.country != "" && responseData.country != null) {
            this.form.country = this.allCountry.filter((item) => {
              if (responseData.country.includes(item.name)) {
                return item;
              }
            });
          }

          if (responseData.knowledge_category != "" && responseData.knowledge_category != null) {
            responseData.knowledge_category.map(cat => {
              this.form.knowledge_categories.push(...this.knowledgeCategories.filter((item) => {
                return cat.knowledge_category_id == item.id;
              }));
            });
          }

          if (responseData.tags != "" && responseData.tags != null) {
            this.form.tags =  responseData.tags;
          }

          if (responseData.sub_specialities != "" && responseData.sub_specialities != null) {
            this.form.sub_specialities = this.subspecialities.filter((item) => {
              if (responseData.sub_specialities.includes(item.id)) {
                return item;
              }
            });
          }
          if (responseData.experts != "" && responseData.experts != null) {
            this.form.experts = this.expertsopt.filter((item) => {
              if (responseData.experts.includes(item.id)) {
                return item;
              }
            });
          }
          
          if(responseData.partner_division_id != null && responseData.partner_division_id != ""){
            this.form.partner_division_id = responseData.partner_division_id;
          }
          
          if(responseData.live_event_id != null && responseData.live_event_id != ""){
            this.form.live_event_id = responseData.live_event_id;
          }
          
          this.form.custom_button_name = responseData.custom_button_name;
          this.form.custom_link = responseData.custom_link;
          this.edit.image_name_url = responseData.image_name;
         
          if (responseData.popup) {
            this.form.popup = true;
          }
          if (responseData.visible_on_main_page) {
            this.form.visible_on_main_page = true;
          }
          if (responseData.is_open_video) {
            this.form.is_open_video = true;
          }
          
          this.video_id = responseData.id;
          this.oldForm = _.clone(this.form);
        }
      } catch (err) {
        console.log(err);
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Fetching error!",
        });
      }
      this.$store.commit("loader/updateStatus", false);
    },
    async updateStatus(id) {
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = video.statusUpdate + "/" + id;
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
    async fetchAllCountry() {
      const url = country.fetchAllCountry;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.allCountry = responseData;
      }
    },  
    async updateFlag(id) {
      try {
        let index = this.tableData.data.findIndex((e) => e.id == id);
        const url = video.flagUpdate + "/" + id;
        const data = await this.postRequest(url, {
          discussion_flag: !this.tableData.data[index].discussion_flag,
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
    async deleteVideo(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = video.videoUrl + "/" + id;
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
    async restoreVideo(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = video.restoreVideo + "/" + id;
        const data = await this.postRequest(url, {});
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
          // this.edit.image_name_url = '';
          this.edit.image_name_url = URL.createObjectURL(this.image_name);
        }
        return true;
      } else if(txt == 'image_name_indonesia') {
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
        let url = video.videoUrl;
        if (this.$route.name == "edit-video") {
          url = video.videoUrl + "/" + this.video_id;
        }
        // this.submitted = true;
        // this.$v.$touch();
        // if (this.$v.$invalid) {
        //   window.scrollTo(0, 0);
        //   return false;
        // }
        let dataAppend = new FormData();
        // if (this.image_name.includes("https://")) {
        //   this.image_name = "";
        // }
        // if (this.$route.name == "edit-video") {
        //   if (this.edit.image_name_indonesia_url.includes("https://")) {
        //     this.image_name_indonesia = "";
        //   }
        // }
        if(this.image_name){
          dataAppend.append("image_name", this.image_name);
        }
        if(this.image_name_indonesia){
          dataAppend.append("image_name_indonesia", this.image_name_indonesia);
        }
        for (var key in this.form) {
          if (
            key != "community_selected" &&
            key != "sub_specialities" &&
            key != "experts"  &&
            key != "country" &&
            key != "knowledge_categories" && 
            key != "tags" &&
            key != "translation"

          ) {
            dataAppend.append(key, this.form[key]);
          }
        }
        if (this.form.popup) {
          dataAppend.append("popup", 1);
        } else {
          dataAppend.append("popup", 0);
        }
        if (this.form.is_open_video) {
          dataAppend.append("is_open_video", 1);
        } else {
          dataAppend.append("is_open_video", 0);
        }
        if (this.form.visible_on_main_page) {
          dataAppend.append("visible_on_main_page", 1);
        } else {
          dataAppend.append("visible_on_main_page", 0);
        }
        const community_selected = [];
        this.form.community_selected.map((key) => {
          community_selected.push(key.id);
        });
        const sub_specialities = [];
        this.form.sub_specialities.map((key) => {
          sub_specialities.push(key.id);
        });
        const experts = [];
        this.form.experts.map((key) => {
          experts.push(key.id);
        });

        const country = this.form.country.map((key) => key.name);
        const knowledge_categories = this.form.knowledge_categories.map((key) => key.id);
        const tags = this.form.tags.map((key) => key);
        
        dataAppend.append(
          "community_selected",
          JSON.stringify(community_selected)
        );
        dataAppend.append("sub_specialities", JSON.stringify(sub_specialities));
        dataAppend.append("experts", JSON.stringify(experts));
        dataAppend.append("translation", JSON.stringify(this.form.translation));
        country.forEach(l => dataAppend.append("country[]",l));
        knowledge_categories.forEach(k => dataAppend.append("knowledge_categories[]",k));
        tags.forEach(t => dataAppend.append("tags[]",t));
        // dataAppend.append("knowledge_category[]", knowledge_category);
        // dataAppend.append("tags[]", tags);
        for (var pair of dataAppend.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }
        if (this.$route.name == "edit-video") {
          dataAppend.append("_method", "put");
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/video");
        }
      } catch (err) {
        console.log(err);
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

        if (!this.can("restore-video")) {
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
          if (!this.can("edit-video")) {
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

        if (!this.can("edit-video")) {
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
        if (!this.can("delete-video")) {
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
    async fetchAllCommunity(){
      const url = community.fetchAllActiveCommunity;
      const data = await this.getRequest(url);
      if(data.status){
        this.form.community_selected = data.response.data;
      }
    },
    async fetchCommunity(query) {
      const url = community.fetchCommunity;
      const data = await this.getRequest(url + '?search=' + query);
      if (data.status) {
        this.communities = data.response.data;
      }
    },
    async fetchLiveEvent() {
      const url = live_event.fetchLiveEvent;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.liveEvents = responseData;
      }
    },
    async fetchExpert() {
      const url = expert.fetchAllActiveExpert;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.expertsopt = responseData;
      }
    },
    async fetchPartner() {
      const url = partner.fetchAllActivePartner;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.partners = responseData;
      }
    },
    async fetchForum() {
      const url = forum.fetchAllActiveForum;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.forums = responseData;
      }
    },
    async fetchKnowledgeCategory() {
      const url = knowledgeCategory.fetchAllActiveKnowledgeCategory;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.knowledgeCategories = responseData;
      }
    },
    async fetchSubSpeciality() {
      const url = subspeciality.fetchAllSubSpeciality;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.subspecialities = responseData;
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
    "status"(v){
      if(v==1) {
        this.fetchAllCommunity();
      } else {
        if(this.$route.name == 'add-video'){
          this.form.community_selected = [];
        } else if(this.$route.name == 'edit-video'){
          this.form.community_selected = this.oldForm.community_selected;
        }
      }
    },
    "form.popup"(v) {
      if (v == 1) {
        this.form.popup = true;
      } else {
        this.form.popup = false;
      }
    },
    "form.visible_on_main_page"(v) {
      if (v == 1) {
        this.form.visible_on_main_page = true;
      } else {
        this.form.visible_on_main_page = false;
      }
    },
    "form.is_open_video"(v) {
      if (v == 1) {
        this.form.is_open_video = true;
      } else {
        this.form.is_open_video = false;
      }
    },
    activeTab(v) {
      if (v) this.tabActive();
    },
  },
  created() {
    if (this.$route.name == "add-video" || this.$route.name == "edit-video") {
      this.fetchCommunity();
      this.fetchExpert();
      this.fetchPartner();
      this.fetchForum();
      this.fetchAllCountry();
      this.fetchSubSpeciality();
      this.fetchKnowledgeCategory();
      if (this.$route.name == "edit-video") {
        this.fetchVideo(this.$route.params.id);
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
