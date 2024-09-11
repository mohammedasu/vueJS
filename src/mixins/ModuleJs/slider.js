/* eslint-disable */
import {
  slider,
  community,
  partner,
  forum,
  masterUrl,
  series,
  article,
  newsletter,
  expert,
  country
} from "../../js/path";
import moment from "moment";

export default {
  data() {
    return {
      allCountry: [],
      slider_id: null,
      table_header: [],
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: 'image',
          label: 'Thumbnail'
        },
        {
          key: "title",
          label: 'Slider Title'
        },
        {
          key: "type",
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
      forum: [],
      articles: [],
      newsletters: [],
      series: [],
      form: {
        translation: {
          indonesia: {
            title: "",
            description: "",
            meta_title: "",
            meta_desc: "",
            meta_keywords: "",
          }
        },
        title: "",
        description: "",
        action_id: "",
        action_type: "",
        type: "",
        type_id: "",
        expire_slider: "",
        meta_title: "",
        meta_desc: "",
        meta_keywords: "",
        country: [],
        tags: [],
      },
      action_types: [],
      actionType: [
        {
          text: "None",
          value: "none",
        },
        {
          text: "Video",
          value: "video",
        },
        {
          text: "Expert",
          value: "expert",
        },
        {
          text: "Live Event",
          value: "live_event",
        },
        {
          text: "News Letter",
          value: "news_letter",
        },
        {
          text: "Series",
          value: "series",
        },
        {
          text: "News Article",
          value: "news_article",
        },
        {
          text: "Partner Division",
          value: "forum",
        },
        {
          text: "External Website",
          value: "external",
        },
      ],
      type: [
        {
          text: "Home",
          value: "home",
        },
        {
          text: "Partner",
          value: "partner",
        },
        {
          text: "Partner division",
          value: "partner_division",
        },
        {
          text: "Community",
          value: "community",
        },
        {
          text: "External",
          value: "external",
        },
      ],
      image: "",
      android_image: "",
      ios_image: "",
      indonesia_ios_image: "",
      indonesia_android_image: "",
      indonesia_image: "",
      image_url: "",
      android_image_url: "",
      ios_image_url: "",
      indonesia_ios_image_url: "",
      indonesia_android_image_url: "",
      indonesia_image_url: "",
      edit: {
        image_url: null,
        android_image_url: null,
        ios_image_url: null,
        indonesia_ios_image_url: null,
        indonesia_android_image_url: null,
        indonesia_image_url: null,
      },
      filter: null,
      tableData: [],
      sortBy: "id",
      sortDesc: true,
      filterOn: [],
      key: 0,
      currentPage: 1,
      activeTab: "all",
      params: "",
    };
  },
  methods: {
    getDate(value){
        return moment(String(value)).format('ll');
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
    changeType(val) {
      if (val == "partner") {
        if (this.partner.length <= 0) {
          this.fetchPartner();
        }
      } else if (val == "partner_division") {
        if (this.forum.length <= 0) {
          this.fetchPartnerDivision();
        }
      } else if (val == "community") {
        if (this.community.length <= 0) {
          this.fetchCommunity();
        }
      }
    },
    changeActionType(val) {
      this.action_types = null;
      // this.form.action_id = null;
      this.fetchAttachment(val);
    },
    async fetchAttachment(val) {
      if (val == "video" || val == "live_event" || val == "forum") {
        const url = masterUrl.getAttachment + "&type=" + val;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          this.action_types = responseData.data;
        }
      } else if (val == "news_letter") {
        const url = newsletter.fetchActiveNewsletter;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response.data;
          this.action_types = responseData;
        }
      } else if (val == "news_article") {
        const url = article.articleUrl;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response.data;
          this.action_types = responseData;
        }
      } else if (val == "expert") {
        const url = expert.fetchAllActiveExpert;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response.data;
          this.action_types = responseData;
        }
      } else if(val == 'series') {
        const url = series.fetchAllActiveSeries;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response.data;
          this.action_types = responseData;
        }
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
    async fetchPartnerDivision() {
      const url = forum.fetchAllActiveForum;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.forum = responseData;
      }
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchData(pagination = null) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = slider.sliderUrl;
        if (pagination == "search") {
          url = slider.sliderUrl + "?search=" + this.filter;
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
    async fetchSlider(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = slider.sliderUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.title != "" && responseData.title != null){
            this.form.title = responseData.title;
          }

          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
          }

          if(responseData.action_id != "" && responseData.action_id != null){
            this.form.action_id = responseData.action_id;
          }

          if(responseData.action_type != "" && responseData.action_type != null){
            this.form.action_type = responseData.action_type;
          }

          this.fetchAttachment(this.form.action_type);

          if(responseData.type != "" && responseData.type != null){
            this.form.type = responseData.type;
          }

          if(responseData.type_id != "" && responseData.type_id != null){
            this.form.type_id = responseData.type_id;
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

          this.edit.image_url = responseData.image;
          this.image = responseData.image;

          this.edit.android_image_url = responseData.android_image;
          this.android_image = responseData.android_image;

          this.edit.ios_image_url = responseData.ios_image;
          this.ios_image = responseData.ios_image;

          if(responseData.expire_slider != "" && responseData.expire_slider != null){
            this.form.expire_slider = responseData.expire_slider
            ? moment(responseData.expire_slider).format("YYYY-MM-DDTHH:mm")
            : "";
          }

          this.slider_id = responseData.id;

          if(responseData.translation != "" && responseData.translation != null){
            this.form.translation = responseData.translation;
            this.edit.indonesia_image_url = responseData.translation.indonesia.indonesia_image;
            this.edit.indonesia_android_image_url = responseData.translation.indonesia.indonesia_android_image;
            this.edit.indonesia_ios_image_url = responseData.translation.indonesia.indonesia_ios_image;            
          }
          if (responseData.country != null && responseData.country != "") {
            this.form.country = this.allCountry.filter((item) => {
              if (responseData.country.includes(item.name)) {
                return item;
              }
            });
          }
          if (responseData.tags != null && responseData.tags != "") {
            this.form.tags =  responseData.tags;
          }
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
        const url = slider.statusUpdate;
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
    async deleteSlider(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = slider.sliderUrl + "/" + id;
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
    async restoreSlider(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = slider.restoreslider + "/" + id;
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
      if (txt == "image") {
        this.image = e.target.files[0];
        if (this.image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.image.reset();
          this.image_url = '';
          this.edit.image_url = '';
          this.image = '';
          return false;
        } else {
          this.image_url = URL.createObjectURL(this.image);
          this.edit.image_url = '';
        }
        return true;
      } else if (txt == "android_image") {
        this.android_image = e.target.files[0];
        if (this.android_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.android_image.reset();
          this.android_image_url = '';
          this.edit.android_image_url = '';
          this.android_image = '' 
          return false;
        } else {
          this.android_image_url = URL.createObjectURL(this.android_image);
          this.edit.android_image_url = '';
        }
        return true;
      } else if (txt == "ios_image") {
        this.ios_image = e.target.files[0];
        if (this.ios_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.ios_image.reset();
          this.ios_image_url = '';
          this.edit.ios_image_url = '';
          this.ios_image = '';
          return false;
        } else {
          this.ios_image_url = URL.createObjectURL(this.ios_image);
          this.edit.ios_image_url = '';
        }
        return true;
      } else if(txt == 'indonesia_image') {
        this.indonesia_image = e.target.files[0];
        if (this.indonesia_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.indonesia_image.reset();
          this.indonesia_image_url = '';
          this.edit.indonesia_image_url = '';
          this.indonesia_image = '';
          return false;
        } else {
          this.indonesia_image_url = URL.createObjectURL(this.indonesia_image);
          this.edit.indonesia_image_url = '';
        }
        return true;
      } else if (txt == 'indonesia_android_image'){
        this.indonesia_android_image = e.target.files[0];
        if (this.indonesia_android_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.indonesia_android_image.reset();
          this.indonesia_android_image_url = '';
          this.edit.indonesia_android_image_url = '';
          this.indonesia_android_image = '';
          return false;
        } else {
          this.indonesia_android_image_url = URL.createObjectURL(this.indonesia_android_image);
          this.edit.indonesia_android_image_url = '';
        }
        return true;
      } else if(txt == 'indonesia_ios_image'){
        this.indonesia_ios_image = e.target.files[0];
        if (this.indonesia_ios_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.indonesia_ios_image.reset();
          this.indonesia_ios_image_url = '';
          this.edit.indonesia_ios_image_url = '';
          this.indonesia_ios_image = '';
          return false;
        } else {
          this.indonesia_ios_image_url = URL.createObjectURL(this.indonesia_ios_image);
          this.edit.indonesia_ios_image_url = '';
        }
        return true;
      }
    },
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = slider.sliderUrl;
        if (this.$route.name == "edit-slider") {
          url = slider.sliderUrl + "/" + this.slider_id;
        }
        let dataAppend = new FormData();

        if (typeof this.image === 'string') {
          if (this.image.includes("https://")) {
            this.image = "";
          }
        }

        if(this.image){
          dataAppend.append("image", this.image);
        }

        if (typeof this.android_image === 'string') {
          if (this.android_image.includes("https://")) {
            this.android_image = "";
          }
        }

        if(this.android_image){
          dataAppend.append("android_image", this.android_image);
        }

        if (typeof this.ios_image === 'string') {
          if (this.ios_image.includes("https://")) {
            this.ios_image = "";
          }
        }

        if(this.ios_image){
          dataAppend.append("ios_image", this.ios_image);
        }

        if (typeof this.indonesia_image === 'string') {
          if (this.indonesia_image.includes("https://")) {
            this.indonesia_image = "";
          }
        }
        if(this.indonesia_image){
          dataAppend.append('indonesia_image', this.indonesia_image);
        }
        if (typeof this.indonesia_ios_image === 'string') {
          if (this.indonesia_ios_image.includes("https://")) {
            this.indonesia_ios_image = "";
          }
        }
        if(this.indonesia_ios_image){
          dataAppend.append('indonesia_ios_image', this.indonesia_ios_image);
        }
        if (typeof this.indonesia_android_image === 'string') {
          if (this.indonesia_android_image.includes("https://")) {
            this.indonesia_android_image = "";
          }
        }
        if(this.indonesia_android_image){
          dataAppend.append('indonesia_android_image', this.indonesia_android_image);
        }

        for (var key in this.form) {
          if(key != 'translation' && key != 'country' && key != 'tags'){
            dataAppend.append(key, this.form[key]);
          }
        }
        const country = this.form.country.map((key) =>key.name);
        const tags = this.form.tags.map((key) => key);
        country.forEach(l => dataAppend.append("country[]",l));
        tags.forEach(t => dataAppend.append("tags[]",t));
        dataAppend.append('translation', JSON.stringify(this.form.translation));
        if (this.$route.name == "edit-slider") {
          dataAppend.append("_method", "put");
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/slider");
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
        if (!this.can("restore-slider")) {
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
        if (!this.can("delete-slider")) {
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
          this.fields[4] = {
            key: "edit",
          };
          this.fields[5] = {
            key: "delete",
          };
        }
      }
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
    activeTab(v) {
      if (v) this.tabActive();
    },
  },
  created() {
    if (this.$route.name == "add-slider" || this.$route.name == "edit-slider") {
      this.fetchAllCountry();
      if (this.$route.name == "edit-slider") {
        this.fetchSlider(this.$route.params.id);
      }
      this.fetchAttachment();
    } else {
      this.fetchData();
    }
    this.fields.map((item) => {
      this.table_header.push(item.key);
    });
    this.tabActive();
  },
};
