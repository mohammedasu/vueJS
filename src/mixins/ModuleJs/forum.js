import {
  forum,
  partner,
  country,
  community,
  userType,
  expert,
  adminUser,
  subspeciality,
  stateUrl,
  cityUrl,
} from "../../js/path";
import _ from 'lodash';

export default {
  data() {
    return {
      status: false,
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
          label: "Forum Name",
        },
        {
          key: "link_name",
          label: "Forum Link Name",
        },
        {
          key: 'forum_visibility',
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
      oldForm: {},
      form: {
        name: "",
        link_name: "",
        forum_type: "",
        partner_id: "",
        forum_visibility: "",
        geographic_type: "country",
        community: [],
        user_types: [],
        brand_page_link_text: "",
        brand_page_link: "",
        pre_login_description: "",
        description: "",
        is_open_forum: 0,
        show_followers: 0,
        is_knowledge_academy_active: 0,
        council_experts: [],
        other_experts: [],
        sub_specialities: [],
        forum_manager: [],
        country: [],
        state: [],
        city: [],
        knowledge_academy_name: "",
        knowledge_academy_header_text: "",
        interested_in_grant_text: "",
        reaching_out_text: "",
        knowledge_academy_to_address: "",
        external_link: "",
        privacy_rule: [],
        rule_type_password: "",
        forum_other_expert_text: "Others",
        forum_council_expert_text: "Council",
        knowledge_academy_thank_you_message: "",
      },
      website_banner_image: "",
      pre_login_image: "",
      pre_login_image2: "",
      thumbnail_image: "",
      thumbnail_image_logo: "",
      image_name: "",
      knowledge_academy_banner_image: "",
      knowledge_academy_banner_image_mobile: "",
      invitation_file: "",
      thumbnail_image_url: "",
      thumbnail_image_logo_url: "",
      image_name_url: "",
      website_banner_image_url: "",
      pre_login_image_url: "",
      pre_login_image2_url: "",
      invitation_file_url: "",
      knowledge_academy_banner_image_url: "",
      knowledge_academy_banner_image_mobile_url: "",
      edit: {
        website_banner_image_url: "",
        pre_login_image_url: "",
        pre_login_image2_url: "",
        thumbnail_image_url: "",
        thumbnail_image_logo_url: "",
        image_name_url: "",
        knowledge_academy_banner_image_url: "",
        knowledge_academy_banner_image_mobile_url: "",
        invitation_file_url: "",
      },
      community: [],
      partner: [],
      user_types: [],
      forum_expert: [],
      forum_subspeciality: [],
      discussion_forum_manager: [],
      forum_geographic: [
        {
          text: "Country",
          value: "country",
        },
        {
          text: "State",
          value: "state",
        },
        {
          text: "City",
          value: "city",
        },
      ],
      discussion_forum_type: [
        {
          text: "College",
          value: "college",
        },
        {
          text: "Disease",
          value: "disease",
        },
        {
          text: "Partner",
          value: "partner",
        },
        {
          text: "Associate",
          value: "associate",
        },
        {
          text: "Hospital",
          value: "hospital",
        },
        {
          text: "Doctor",
          value: "doctor",
        },
      ],
      discussion_forum_visibility: [
        {
          text: "Public",
          value: "public",
        },
        {
          text: "Private",
          value: "private",
        },
      ],
      forum_privacy_rules: [
        {
          text: "Invitation",
          value: "invitation",
        },
        {
          text: "Password",
          value: "password",
        },
        {
          text: "Approval",
          value: "approval",
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
      isKnowledgeAcademy: false,
      allCountry: [],
      allState: [],
      allCity: [],
      cta_data: {
        sample: {
          label: "Sample",
          text: "",
          link: "",
          active: false,
        },
        request_expert: {
          label: "Request Expert",
          text: "",
          link: "",
          active: false,
        },
        visit_to_page: {
          label: "Visit to Page",
          text: "",
          link: "",
          active: false,
        },
        visit_brand_page: {
          label: "Visit brand page",
          text: "",
          link: "",
          active: false,
        },
      },
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
        reading_material: {
          index: 3,
          label: "Reading Material",
          active: false,
        },
        discussion_forum: {
          index: 4,
          label: "Discussion Forum",
          active: false,
        },
        cases: {
          index: 5,
          label: "Cases",
          active: false,
        },
        live_events: {
          index: 6,
          label: "Live Events",
          active: false,
        },
        podcasts: {
          index: 7,
          label: "Podcast",
          active: false,
        },
        askanexpert: {
          index: 8,
          label: "Ask an expert",
          active: false,
        },
      },
    };
  },
  methods: {
    resetPrivacyRule() {
      this.form.privacy_rule = [];
    },
    async getStatesByCountry() {
      if (this.form.country != null) {
        const url = stateUrl.state + "/" + this.form.country;
        const data = await this.getRequest(url);
        if (data.status) {
          this.allState = data.response;
        }
      }
    },
    async getCitiesByState() {
      if (this.form.state != null) {
        const url =
          cityUrl.city + "/" + this.form.country + "/" + this.form.state;
        const data = await this.getRequest(url);
        if (data.status) {
          this.allCity = data.response;
        }
      }
    },
    slugify() {
      this.forum_name = this.form.name;
      if (this.forum_name) {
        const slug_generate = this.forum_name
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
    changeForumType(val) {
      if (val == "partner") {
        if (this.partner.length <= 0) {
          this.fetchPartner();
        }
      }
    },

    changeKnowledgeAcademy(val) {
      if (val) {
        this.isKnowledgeAcademy = true;
      } else {
        this.isKnowledgeAcademy = false;
        this.form.knowledge_academy_name = "";
        this.form.knowledge_academy_header_text = "";
        this.form.interested_in_grant_text = "";
        this.form.reaching_out_text = "";
        this.form.knowledge_academy_to_address = "";
        (this.form.external_link = ""),
          (this.knowledge_academy_banner_image = ""),
          (this.knowledge_academy_banner_image_mobile = "");
      }
    },
    search(event) {
      if (this.filter.length > 1) {
        //enter key == keycode 13
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
          url = forum.forumUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = forum.forumUrl + "?filter=" + txt;
        }
      } else if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = forum.forumUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = forum.forumUrl + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = forum.forumUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = forum.forumUrl + "?filter=" + txt;
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
    readFile(e, txt) {
      if (txt == "knowledge_academy_banner_image") {
        this.knowledge_academy_banner_image = e.target.files[0];
      if (this.knowledge_academy_banner_image.size > 2 * 1000 * 1000) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Uploaded File is More than 2MB"
        });
        this.$refs.knowledge_academy_banner_image.reset();
        this.knowledge_academy_banner_image_url = '';
        this.edit.knowledge_academy_banner_image_url = '';
        this.knowledge_academy_banner_image = '';
        return false;
      } else {
        this.knowledge_academy_banner_image_url = URL.createObjectURL(this.knowledge_academy_banner_image);
        this.edit.knowledge_academy_banner_image_url = '';
      }
      return true;
      } else if (txt == "knowledge_academy_banner_image_mobile") {
        this.knowledge_academy_banner_image_mobile = e.target.files[0];
        if (this.knowledge_academy_banner_image_mobile.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.knowledge_academy_banner_image_mobile.reset();
          this.knowledge_academy_banner_image_mobile_url = '';
          this.edit.knowledge_academy_banner_image_mobile_url = '';
          this.knowledge_academy_banner_image_mobile = '';
          return false;
        } else {
          this.knowledge_academy_banner_image_mobile_url = URL.createObjectURL(this.knowledge_academy_banner_image_mobile);
          this.edit.knowledge_academy_banner_image_mobile_url = '';
        }
        return true;
      } else if (txt == "thumbnail_image_logo") {
        this.thumbnail_image_logo = e.target.files[0];
        if (this.thumbnail_image_logo.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.thumbnail_image_logo.reset();
          this.thumbnail_image_logo_url = '';
          this.thumbnail_image_logo = '';
          this.edit.thumbnail_image_logo_url = '';
          return false;
        } else {
          this.thumbnail_image_logo_url = URL.createObjectURL(this.thumbnail_image_logo);
          this.edit.thumbnail_image_logo_url = '';
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
        this.website_banner_image = '';
        this.edit.website_banner_image_url = '';
        return false;
      } else {
        this.website_banner_image_url = URL.createObjectURL(this.website_banner_image);
        this.edit.website_banner_image_url = '';
      }
      return true;
      } else if (txt == "pre_login_image") {
        this.pre_login_image = e.target.files[0];
        if (this.pre_login_image.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.pre_login_image.reset();
          this.pre_login_image_url = '';
          this.pre_login_image = '';
          this.edit.pre_login_image_url = '';
          return false;
        } else {
          this.pre_login_image_url = URL.createObjectURL(this.pre_login_image);
          this.edit.pre_login_image_url = '';
        }
        return true;
      } else if (txt == "pre_login_image2") {
        this.pre_login_image2 = e.target.files[0];
      if (this.pre_login_image2.size > 2 * 1000 * 1000) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Uploaded File is More than 2MB"
        });
        this.$refs.pre_login_image2.reset();
        this.pre_login_image2_url = '';
        this.pre_login_image2 = '';
        this.edit.pre_login_image2_url = '';
        return false;
      } else {
        this.pre_login_image2_url = URL.createObjectURL(this.pre_login_image2);
        this.edit.pre_login_image2_url = '';
      }
      return true;
      } else if (txt == "thumbnail_image") {
        this.thumbnail_image = e.target.files[0];
        // const fileExtension = this.thumbnail_image.name.split('.')[this.thumbnail_image.name.split('.').length - 1].toLowerCase();
        // let txt = "File type : " + fileExtension + "\n";
        if (!this.thumbnail_image) {
          // alert('No file chosen');
            this.$store.commit("toast/updateStatus", {
              status: true,
              icon: "error",
              title: "No File Choosen",
            });
            return false;
          }
      if (this.thumbnail_image.size > 2 * 1000 * 1000) {
        // alert('File too big (> 2MB)');
        // txt += "Size: " + (this.thumbnail_image.size / (1024*1024)).toFixed(2) + " MB \n";
        // console.log(txt);
        
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Uploaded File is More than 2MB"
        });
        this.$refs.thumbnail_image.reset();
        this.edit.thumbnail_image_url = '';
        this.thumbnail_image = '';
        this.thumbnail_image_url = '';
        return false;
      } else {
        this.thumbnail_image_url = URL.createObjectURL(this.thumbnail_image);
        this.edit.thumbnail_image_url = '';
      }
      return true;
      } else if (txt == "image_name") {
        this.image_name = e.target.files[0];
        if (this.image_name.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.image_name.reset();
          this.image_name_url = '';
          this.image_name = '';
          this.edit.image_name_url = '';
          return false;
        } else {
          this.image_name_url = URL.createObjectURL(this.image_name);
          this.edit.image_name_url = '';
        }
        return true;
      } else if (txt == "invitation_file") {
        this.invitation_file = e.target.files[0];
      if (this.invitation_file.size > 2 * 1000 * 1000) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Uploaded File is More than 2MB"
        });
        this.$refs.invitation_file.reset();
        this.invitation_file = '';
        this.invitation_file_url = '';
        this.edit.invitation_file_url = '';
        return false;
      } else {
        this.invitation_file_url = URL.createObjectURL(this.invitation_file);
        this.edit.invitation_file_url = '';
      }
      return true;
      }
    },
    async fetchForum(id) {
      this.$store.commit("loader/updateStatus", true);

      let url = forum.forumUrl + "/" + id;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response;

        if(responseData.forum_type != "" && responseData.forum_type != null){
          this.form.forum_type = responseData.forum_type;
        }

        if(responseData.forum_visibility != "" && responseData.forum_visibility != null){
          this.form.forum_visibility = responseData.forum_visibility;
        }

        if(responseData.title != "" && responseData.title != null){
          this.form.name = responseData.title;
        }

        if(responseData.link_name != "" && responseData != null){
          this.form.link_name = responseData.link_name;
        }
        
        if(responseData.partner_id != null && responseData.partner_id != ""){
          this.form.partner_id = responseData.partner_id;
        }

        if(responseData.geographic_type != "" && responseData.geographic_type != null){
          this.form.geographic_type = responseData.geographic_type;
        }
        
        if(responseData.pre_login_description != "" && responseData.pre_login_description != null){
          this.form.pre_login_description = responseData.pre_login_description;
        }

        if(responseData.brand_page_link_text != "" && responseData.brand_page_link_text != null){
          this.form.brand_page_link_text = responseData.brand_page_link_text;
        }

        if(responseData.brand_page_link != "" && responseData.brand_page_link != null){
          this.form.brand_page_link = responseData.brand_page_link; 
        }
        
        if(responseData.description != "" && responseData.description != null){
          this.form.description = responseData.description;
        }

        if(responseData.forum_council_expert_text != "" && responseData.forum_council_expert_text != null){
          this.form.forum_council_expert_text =
          responseData.forum_council_expert_text;
        }

        if(responseData.forum_other_expert_text != "" && responseData.forum_other_expert_text != null){
          this.form.forum_other_expert_text =
          responseData.forum_other_expert_text;
        }

        if(responseData.knowledge_academy_thank_you_message != "" && responseData.knowledge_academy_thank_you_message != null){
          this.form.knowledge_academy_thank_you_message =
          responseData.knowledge_academy_thank_you_message;
        }

        if (responseData.country) {
          const country_parse = JSON.parse(responseData.country);
          if (this.form.geographic_type == "country") {
            this.form.country = country_parse.map((item) => {
              return {
                name: item,
              };
            });
          } else {
            country_parse.map((item) => {
              this.form.country = item;
            });
            this.getStatesByCountry();
          }
        }

        if (responseData.state) {
          const state_parse = JSON.parse(responseData.state);
          if (this.form.geographic_type == "state") {
            this.form.state = state_parse.map((item) => {
              return {
                state: item,
              };
            });
          } else {
            state_parse.map((item) => {
              this.form.state = item;
            });
            this.getCitiesByState();
          }
        }

        if (responseData.city) {
          const city_parse = JSON.parse(responseData.city);
          this.form.city = city_parse.map((item) => {
            return {
              city: item,
            };
          });
        }

        if (responseData.user_types) {
          const user_type_parse = JSON.parse(responseData.user_types);
          this.form.user_types = this.user_types.filter((user_type) => {
            if (user_type_parse.includes(user_type.value)) {
              return user_type;
            }
          });
        }

        if (responseData.forum_manager) {
          const forum_manager_parse = JSON.parse(responseData.forum_manager);
          this.form.forum_manager = this.discussion_forum_manager.filter(
            (forum_manager) => {
              if (forum_manager_parse.includes(forum_manager.id)) {
                return forum_manager;
              }
            }
          );
        }

        if (responseData.community) {
          this.form.community = responseData.community.map((item) => {
            return item;
          });
        }
        
        if (responseData.sub_specialities) {
          this.form.sub_specialities = responseData.sub_specialities.map(
            (item) => {
              return item;
            }
          );
        }

        if (responseData.is_open_forum) {
          this.form.is_open_forum = true;
        }

        if (responseData.show_followers) {
          this.form.show_followers = true;
        }

        if (responseData.is_knowledge_academy_active) {
          this.form.is_knowledge_academy_active = true;
        }

        if (responseData.council_experts) {
          const council_experts_parse = responseData.council_experts;
          this.form.council_experts = this.forum_expert.filter((expert) => {
            if (council_experts_parse.includes(expert.id)) {
              return expert;
            }
          });
        }

        if (responseData.other_experts) {
          const other_experts_parse = responseData.other_experts;
          this.form.other_experts = this.forum_expert.filter((expert) => {
            if (other_experts_parse.includes(expert.id)) {
              return expert;
            }
          });
        }

        const privacy_rules = responseData.privacy_rules;
        if (privacy_rules) {
          this.form.privacy_rule = privacy_rules.map((rule) => {
            if (rule.rule_type == "password") {
              this.form.rule_type_password = rule.rule_action;
            }
            return rule.rule_type;
          });
        }

        if(responseData.knowledge_academy_name != "" && responseData.knowledge_academy_name != null){
          this.form.knowledge_academy_name = responseData.knowledge_academy_name;
        }

        if(responseData.knowledge_academy_header_text != "" && responseData.knowledge_academy_header_text != null){  
          this.form.knowledge_academy_header_text =
          responseData.knowledge_academy_header_text;
        }

        if(responseData.knowledge_academy_to_address != "" && responseData.knowledge_academy_to_address != null){
          this.form.knowledge_academy_to_address =
          responseData.knowledge_academy_to_address;
        }

        if(responseData.interested_in_grant_text != "" && responseData != null){
          this.form.interested_in_grant_text =
          responseData.interested_in_grant_text;
        }

        if(responseData.reaching_out_text != "" && responseData.reaching_out_text != null){
          this.form.reaching_out_text = responseData.reaching_out_text;
        }

        if(responseData.external_link != "" && responseData.external_link != null){
          this.form.external_link = responseData.external_link;
        }

        if(responseData.knowledge_academy_thank_you_message != "" && responseData != null){
          this.form.knowledge_academy_thank_you_message =
          responseData.knowledge_academy_thank_you_message;
        }

        this.edit.knowledge_academy_banner_image_url =
          responseData.knowledge_academy_banner_image;
        this.edit.knowledge_academy_banner_image_mobile_url =
          responseData.knowledge_academy_banner_image_mobile;

        this.edit.thumbnail_image_logo_url = responseData.thumbnail_image_logo;
        this.edit.website_banner_image_url = responseData.website_banner_image;
        this.edit.pre_login_image_url = responseData.pre_login_image;
        this.edit.pre_login_image2_url = responseData.pre_login_image2;
        this.edit.thumbnail_image_url = responseData.thumbnail_image;
        this.edit.invitation_file_url = responseData.invitation_file;
        this.edit.image_name_url = responseData.image_name;

        if (responseData.cta_data) {
          this.cta_data = responseData.cta_data;
        }

        if (responseData.forum_tabs) {
          if(typeof responseData.forum_tabs == 'string'){
            this.forum_tabs = JSON.parse(responseData.forum_tabs);
          }
          else{
            this.forum_tabs = responseData.forum_tabs;
          }
        }

        this.oldForm = _.clone(this.form);
      }

      this.$store.commit("loader/updateStatus", false);
    },
    async updateStatus(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = forum.statusUpdate + "/" + id;
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
    async deleteForum(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = forum.forumUrl + "/" + id;
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
    async restoreForum(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = forum.restoreForum + "/" + id;
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
    async fetchAllCommunity(){
      const url = community.fetchAllActiveCommunity;
      const data = await this.getRequest(url);
      if(data.status){
        this.form.community = data.response.data;
      }
    },
    async fetchCommunity(query) {
      let url = community.fetchCommunity;
      const data = await this.getRequest(url + '?search=' + query);
      if (data.status) {
        this.community = data.response.data;
      }
    },
    async fetchUserType() {
      const url = userType.fetchUser;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response;
        this.user_types = responseData;
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
    async fetchExpert() {
      const url = expert.fetchAllActiveExpert;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.forum_expert = responseData;
      }
    },
    async fetchSubSpeciality() {
      const url = subspeciality.fetchAllSubSpeciality;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.forum_subspeciality = responseData;
      }
    },
    async fetchAdminUser() {
      const url = adminUser.adminUrl;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.discussion_forum_manager = responseData;
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
    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return 'n/a'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
      if (i === 0) return `${bytes} ${sizes[i]})`
      return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    },
    // checkk(event){
    //   alert( event.target.files[0].size)
    //   this.checkImageSize(event.target.files[0])
    //   this.$emit('update:modelValue', event.target.files[0]);
    // },
    
    createFormData() {
      this.$store.commit("loader/updateStatus", true);
      let dataAppend = new FormData();
      if(this.image_name){
        dataAppend.append("image_name", this.image_name);
      }
      if(this.website_banner_image){
        dataAppend.append("website_banner_image", this.website_banner_image);
      }
      if(this.pre_login_image){
        dataAppend.append("pre_login_image", this.pre_login_image);
      }
      if(this.pre_login_image2){
        dataAppend.append("pre_login_image2", this.pre_login_image2);
      }
      if(this.thumbnail_image){
        dataAppend.append("thumbnail_image", this.thumbnail_image);
      }
      if(this.thumbnail_image_logo){
        dataAppend.append("thumbnail_image_logo", this.thumbnail_image_logo);
      }
      if(this.knowledge_academy_banner_image){
        dataAppend.append("knowledge_academy_banner_image", this.knowledge_academy_banner_image);
      }
      if(this.knowledge_academy_banner_image_mobile){
        dataAppend.append("knowledge_academy_banner_image_mobile", this.knowledge_academy_banner_image_mobile);
      }
      if(this.knowledge_academy_banner_image){
        dataAppend.append(
          "knowledge_academy_banner_image",
          this.knowledge_academy_banner_image
        );
      }
      if(this.knowledge_academy_banner_image_mobile){
        dataAppend.append(
          "knowledge_academy_banner_image_mobile",
          this.knowledge_academy_banner_image_mobile
        );
      }
      dataAppend.append("invitation_file", this.invitation_file);
      for (var key in this.form) {
        if (
          key != "community" &&
          key != "sub_specialities" &&
          key != "user_types" &&
          key != "council_experts" &&
          key != "other_experts" &&
          key != "forum_manager" &&
          key != "country" &&
          key != "state" &&
          key != "city" &&
          key != "is_open_forum" &&
          key != "show_followers" &&
          key != "is_knowledge_academy_active"
        ) {
          if (key == "privacy_rule") {
            dataAppend.append(key, JSON.stringify(this.form[key]));
          } else {
            dataAppend.append(key, this.form[key]);
          }
        }
      }

      if (this.form.is_open_forum) {
        dataAppend.append("is_open_forum", 1);
      } else {
        dataAppend.append("is_open_forum", 0);
      }
      if (this.form.show_followers) {
        dataAppend.append("show_followers", 1);
      } else {
        dataAppend.append("show_followers", 0);
      }
      if (this.form.is_knowledge_academy_active) {
        dataAppend.append("is_knowledge_academy_active", 1);
      } else {
        dataAppend.append("is_knowledge_academy_active", 0);
      }
      let city = [];
      if (this.form.city != "") {
        if (Array.isArray(this.form.city)) {
          this.form.city.map((key) => {
            city.push(key.city);
          });
        } else {
          city.push(this.form.city);
        }
      }

      let state = [];
      if (this.form.state != "") {
        if (Array.isArray(this.form.state)) {
          this.form.state.map((key) => {
            state.push(key.state);
          });
        } else {
          state.push(this.form.state);
        }
      }

      let country = [];
      if (this.form.country != "") {
        if (Array.isArray(this.form.country)) {
          this.form.country.map((key) => {
            country.push(key.name);
          });
        } else {
          country.push(this.form.country);
        }
      }

      const community = [];
      this.form.community.map((key) => {
        community.push(key.id);
      });
      const sub_specialities = [];
      this.form.sub_specialities.map((key) => {
        sub_specialities.push(key.id);
      });
      const user_types = [];
      this.form.user_types.map((key) => {
        user_types.push(key.value);
      });
      const council_experts = [];
      this.form.council_experts.map((key) => {
        council_experts.push(key.id);
      });
      const other_experts = [];
      this.form.other_experts.map((key) => {
        other_experts.push(key.id);
      });
      const forum_manager = [];
      this.form.forum_manager.map((key) => {
        forum_manager.push(key.id);
      });

      dataAppend.append(
        "country",
        country.length ? JSON.stringify(country) : ""
      );
      dataAppend.append(
        "community",
        community.length > 0 ? JSON.stringify(community) : ""
      );
      dataAppend.append(
        "sub_specialities",
        sub_specialities.length > 0 ? JSON.stringify(sub_specialities) : ""
      );
      dataAppend.append(
        "user_types",
        user_types.length > 0 ? JSON.stringify(user_types) : ""
      );
      dataAppend.append(
        "council_experts",
        council_experts.length > 0 ? JSON.stringify(council_experts) : ""
      );
      dataAppend.append(
        "other_experts",
        other_experts.length > 0 ? JSON.stringify(other_experts) : ""
      );
      dataAppend.append(
        "forum_manager",
        forum_manager.length > 0 ? JSON.stringify(forum_manager) : ""
      );
      dataAppend.append("city", city.length > 0 ? JSON.stringify(city) : "");
      dataAppend.append("state", state.length > 0 ? JSON.stringify(state) : "");
      return dataAppend;
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
        let url = forum.forumUrl;
        let dataAppend = this.createFormData();
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/forum");
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
    async updateData(id) {
      try {
        let url = forum.forumUrl + "/" + id;
        let dataAppend = this.createFormData();
        dataAppend.append("cta_data", JSON.stringify(this.cta_data));
        dataAppend.append("forum_tabs", JSON.stringify(this.forum_tabs));

        dataAppend.append("_method", "put");
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/forum");
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

        if (!this.can("restore-forum")) {
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
           if (!this.can("edit-forum")) {
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

        if (!this.can("edit-forum")) {
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

        if (!this.can("delete-forum")) {
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
    "status"(v){
      if(v==1){
        this.fetchAllCommunity();
      } else {
        if(this.$route.name == 'add-forum'){
          this.form.community = [];
        } else if(this.$route.name == 'edit-forum'){
          this.form.community = this.oldForm.community;
        }
      }
    },
    "form.is_open_forum"(v) {
      if (v == 1) {
        this.form.is_open_forum = true;
      } else {
        this.form.is_open_forum = false;
      }
    },
    "form.show_followers"(v) {
      if (v == 1) {
        this.form.show_followers = true;
      } else {
        this.form.show_followers = false;
      }
    },
    "form.is_knowledge_academy_active"(v) {
      if (v == 1) {
        this.form.is_knowledge_academy_active = true;
      } else {
        this.form.is_knowledge_academy_active = false;
      }
    },
  },
  created() {
    if (this.$route.name == "add-forum" || this.$route.name == "edit-forum") {
      // this.fetchCommunity();
      this.fetchUserType();
      this.fetchExpert();
      this.fetchAdminUser();
      this.fetchSubSpeciality();
      this.fetchAllCountry();
      this.fetchPartner();
      if (this.$route.name == "edit-forum") {
        this.fetchForum(this.$route.params.id);
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
