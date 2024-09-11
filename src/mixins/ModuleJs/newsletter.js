import { newsletter,community, country, partner, forum ,knowledgeCategory, subspeciality,} from "../../js/path";
import moment from "moment";
import _ from 'lodash';

export default {
  data() {
    return {
      status: false,
      oldForm: {},
      table_header: [],
      newsletter_id: null,
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
          label: 'Newsletter Title'
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
      params: "",
      tableData: [],
      activeTab: "all",
      key: 0,
      currentPage: 1,
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      form: { 
        translation: {
          indonesia: {
            title: '',
            reference_no: '',
            description: '',
            html_content: '',
            meta_title: '',
            meta_keywords: '',
            meta_description: ''
          }
        },
        community_selected: [],
        country: [],
        tags: [],
        knowledge_category: [],
        sub_specialities: [],
        partner_id: "",
        partner_division_id: "",
        title: "",
        newsletter_timestamp: "",
        month_added: "",
        description: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        send_to_email: 0,
        is_open_newsletter: 0,
        is_active: 0,
        newsletter_schedule: 0,
        newsletter_show: 0,
        html_content: "",
        ip_address: 0,
        reference_no: "",
      },
      image_name: "",
      preview: "",
      file_name: "",
      email_file: "",
      // image: '',
      image_name_url: "",
      preview_url: "",
      email_file_url: "",
      image_name_indonesia_url: '',
      image_name_indonesia: '',
      edit: {
        image_name_url: null,
        preview_url: null,
        file_name_url: null,
        email_file_url: null,
        image_name_indonesia_url: null
      },
      community: [],
      knowledgeCategories: [],
      subspecialities: [],
      allCountry: [],
      partners: [],
      forums: [],
      html_images: [],
      IsSendToEmail: false,
      monthAdded: [
        {
          text: "January",
          value: "01",
        },
        {
          text: "February",
          value: "02",
        },
        {
          text: "March",
          value: "03",
        },
        {
          text: "April",
          value: "04",
        },
        {
          text: "May",
          value: "05",
        },
        {
          text: "June",
          value: "06",
        },
        {
          text: "July",
          value: "07",
        },
        {
          text: "August",
          value: "08",
        },
        {
          text: "September",
          value: "09",
        },
        {
          text: "October",
          value: "10",
        },
        {
          text: "November",
          value: "11",
        },
        {
          text: "December",
          value: "12",
        },
      ],
    };
  },
  methods: {
    changeSendtoEmail(val) {
      if (val) {
        this.IsSendToEmail = true;
      } else {
        this.IsSendToEmail = false;
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
    async fetchForum() {
      const url = forum.fetchAllActiveForum;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.forums = responseData;
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
    async fetchData(pagination = null) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = newsletter.newsletterUrl;
        if (pagination == "search") {
          if (this.filter != null && this.filter != "") {
            url = newsletter.newsletterUrl + "?search=" + this.filter;
          } else {
            url = newsletter.newsletterUrl;
          }
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
    async fetchNewsletter(id, newsletter_timestamp) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = newsletter.newsletterUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.partner_id != "" && responseData != null){
            this.form.partner_id = responseData.partner_id;
          }

          if(responseData.partner_division_id != "" && responseData.partner_division_id != null){
            this.form.partner_division_id = responseData.partner_division_id;
          }
          
          if(responseData.title != "" && responseData.title != null){
            this.form.title = responseData.title;
          }
          
          if (responseData.sub_specialities) {
            this.form.sub_specialities = this.subspecialities.filter((item) => {
              if (responseData.sub_specialities.includes(item.id)) {
                return item;
              }
            });
          }

          // if (responseData.community) {
          //   responseData.community.map(cat => {
          //     this.form.community_selected.push(...this.community.filter((item) => {
          //       return cat.community_id == item.id;
          //     }));
          //   });
          // }
          if(responseData.community != "" && responseData.community != null){
            this.form.community_selected = responseData.community.map(c => {return {id: c.community_id, title: c.name}});
          }

          if (responseData.knowledge_category) { 
            responseData.knowledge_category.map(cat => {
              this.form.knowledge_category.push(...this.knowledgeCategories.filter((item) => {
                return cat.knowledge_category_id == item.id;
              }));
            }); 
          }

          if (responseData.country) {
            this.form.country = this.allCountry.filter((item) => {
              if (responseData.country.includes(item.name)) {
                return item;
              }
            });
          }
          
          if (responseData.tags != null && responseData.tags != "") {
            this.form.tags =  responseData.tags;
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
          
          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
          }
          
          if(responseData.month_added != "" && responseData.month_added != null){
            this.form.month_added = responseData.month_added;
          }
          
          if(responseData.html_content != "" && responseData.html_content != null){
            this.form.html_content = responseData.html_content;
          }
          
          if(responseData.ip_address != "" && responseData.ip_address != null){
            this.form.ip_address = responseData.ip_address;
          }
          
          if(responseData.reference_no != "" && responseData.reference_no != null){
            this.form.reference_no = responseData.reference_no;
          }

          this.edit.image_name_url = responseData.image_name;
          if(responseData.image_name)
          this.image_name = responseData.image_name;

          this.edit.preview_url = responseData.preview;
          this.preview = responseData.preview;

          this.edit.file_name_url = responseData.file_name;
          this.file_name = responseData.file_name;

          this.edit.email_file_url = responseData.email_file;
          this.email_file = responseData.email_file;

          this.form.newsletter_timestamp =
            moment(newsletter_timestamp).format("YYYY-MM-DDTHH:mm");

          if (responseData.send_to_email) {
            this.form.send_to_email = true;
          }
          if (responseData.is_open_newsletter) {
          
            this.form.is_open_newsletter = true;
          }
          if (responseData.is_active) {
            this.form.is_active = true;
          }
          if (responseData.newsletter_schedule) {
            this.form.newsletter_schedule = true;
          }
          if (responseData.newsletter_show) {
            this.form.newsletter_show = true;
          }
          if (
            responseData.html_images != "" &&
            responseData.html_images != null
          ) {
            this.html_images = responseData.html_images.html_images;
          }
          this.form.html_images_path = responseData.html_images_path;
          this.newsletter_id = responseData.id;

          if(responseData.translation != "" && responseData.translation != null){
            this.form.translation = responseData.translation;
            this.edit.image_name_indonesia_url = responseData.translation.indonesia.image ? responseData.translation.indonesia.image : '';
          }
          this.oldForm = _.clone(this.form);
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
        const url = newsletter.statusUpdate;
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
    async deleteNewsletter(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = newsletter.newsletterUrl + "/" + id;
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
      } else if (txt == "preview") {
        this.preview = e.target.files[0];
         if (this.preview.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.preview.reset();
          this.preview_url = '';
          this.edit.preview_url = '';
          this.preview = '';
          return false;
        } else {
          this.preview_url = URL.createObjectURL(this.preview);
          this.edit.preview_url = '';
        }
        return true;
      } else if (txt == "file_name") {
        this.file_name = e.target.files[0];
      } else if (txt == "email_file") {
        this.email_file = e.target.files[0];
         if (this.email_file.size > 2 * 1000 * 1000) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "error",
            title: "Uploaded File is More than 2MB"
          });
          this.$refs.email_file.reset();
          this.email_file_url = '';
          this.edit.email_file_url = '';
          this.email_file = '';
          return false;
        } else {
          this.email_file_url = URL.createObjectURL(this.email_file);
          this.edit.email_file_url = '';
        }
        return true;
      } else if(txt == 'image'){
          this.image = e.target.files[0];
          if (this.image.size > 2 * 1000 * 1000) {
            this.$store.commit("toast/updateStatus", {
              status: true,
              icon: "error",
              title: "Uploaded File is More than 2MB"
            });
            this.$refs.newsletter_image.reset();
          }
          return true;
        } else if(txt == 'image_name_indonesia'){
          this.image_name_indonesia = e.target.files[0];
          if(this.image_name_indonesia.size > 2* 1000 * 1000){
            this.$store.commit("toast/updateStatus", {
              status: true,
              icon: 'error',
              title: 'Uploaded File is More than 2MB'
            });
            this.$refs.image_name_indonesia.reset();
            this.image_name_indonesia_url = '';
            this.image_name_indonesia = '';
            this.edit.image_name_indonesia_url = '';
            return false;
          }
          else{
            this.image_name_indonesia_url = URL.createObjectURL(this.image_name_indonesia);
            this.edit.image_name_indonesia_url = '';
          }
          return true;
        }
    },
    
    // async updateData(id) {
    //   try {
    //     this.submitted = true;
    //     this.$v.$touch();
    //     if (this.$v.$invalid) {
    //       this.$store.commit("toast/updateStatus", {
    //         status: true,
    //         icon: "error",
    //         title: "Please Fill The Required Fields"
    //       });
    //       return false;
    //     }
    //     this.$store.commit("loader/updateStatus", true);
    //     const url = newsletter.newsletterUrl + "/" + id;
    //     let dataAppend = new FormData();
    //     // if (this.image_name.includes("https://")) {
    //     //   this.image_name = "";
    //     // }
    //     if (this.image_name) {
    //       dataAppend.append("image_name", this.image_name);
    //     }

    //     if (this.preview) {
    //       dataAppend.append("preview", this.preview);
    //     }

    //     // if (this.file_name) {
    //     //   dataAppend.append("file_name", this.file_name);
    //     // }
    //     // if (this.file_name.includes("https://")) {
    //     //   this.file_name = "";
    //     // }

    //     if (this.email_file) {
    //       dataAppend.append("email_file", this.email_file);
    //     }
    //     // if (this.email_file.includes("https://")) {
    //     //   this.email_file = "";
    //     // }

    //     if (this.$refs.newsletter_image.files.length > 0) {
    //       for (
    //         let index = 0;
    //         index < this.$refs.newsletter_image.files.length;
    //         index++
    //       ) {
    //         dataAppend.append(
    //           "html_images[" + index + "]",
    //           this.$refs.newsletter_image.files[index]
    //         );
    //       }
    //     }

    //     if (this.form.send_to_email) {
    //       dataAppend.append("send_to_email", 1);
    //     } else {
    //       dataAppend.append("send_to_email", 0);
    //     }
    //     if (this.form.is_open_newsletter) {
    //       dataAppend.append("is_open_newsletter", 1);
    //     } else {
    //       dataAppend.append("is_open_newsletter", 0);
    //     }
    //     if (this.form.is_active) {
    //       dataAppend.append("is_active", 1);
    //     } else {
    //       dataAppend.append("is_active", 0);
    //     }
    //     if (this.form.newsletter_show) {
    //       dataAppend.append("newsletter_show", 1);
    //     } else {
    //       dataAppend.append("newsletter_show", 0);
    //     }
    //     if (this.form.newsletter_schedule) {
    //       dataAppend.append("newsletter_schedule", 1);
    //     } else {
    //       dataAppend.append("newsletter_schedule", 0);
    //     }
    //     for (var key in this.form) {
    //       if (
    //         key != "send_to_email" &&
    //         key != "is_active" &&
    //         key != "newsletter_show" &&
    //         key != "newsletter_schedule" &&
    //         key != "is_open_newsletter"
    //       )
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
    //       this.$router.push("/newsletter");
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
        if (!this.can("restore-newsletter")) {
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
        if (!this.can("delete-newsletter")) {
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
        this.community = data.response.data;
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
        let url = newsletter.newsletterUrl;
        if (this.$route.name == "edit-newsletter") {
          url = newsletter.newsletterUrl + "/" + this.newsletter_id;
        }
        
        let dataAppend = new FormData();
        if(this.image_name){
          dataAppend.append("image_name", this.image_name);
        }
        if(this.preview){
          dataAppend.append("preview", this.preview);
        }
        if(this.file_name){
          dataAppend.append("file_name", this.file_name);
        }
        if(this.email_file){
          dataAppend.append("email_file", this.email_file);
        }
        if(this.image_name_indonesia){
          dataAppend.append('image_name_indonesia', this.image_name_indonesia);
        }
        if (this.$refs.newsletter_image.files.length > 0) {
          for (
            let index = 0;
            index < this.$refs.newsletter_image.files.length;
            index++
          ) {
            dataAppend.append(
              "html_images[" + index + "]",
              this.$refs.newsletter_image.files[index]
            );
          }
        }
        if (this.form.send_to_email) {
          dataAppend.append("send_to_email", 1);
        } else {
          dataAppend.append("send_to_email", 0);
        }
        if (this.form.is_open_newsletter) {
          dataAppend.append("is_open_newsletter", 1);
        } else {
          dataAppend.append("is_open_newsletter", 0);
        }
        if (this.form.is_active) {
          dataAppend.append("is_active", 1);
        } else {
          dataAppend.append("is_active", 0);
        }
        if (this.form.newsletter_show) {
          dataAppend.append("newsletter_show", 1);
        } else {
          dataAppend.append("newsletter_show", 0);
        }
        if (this.form.newsletter_schedule) {
          dataAppend.append("newsletter_schedule", 1);
        } else {
          dataAppend.append("newsletter_schedule", 0);
        }
        for (var key in this.form) {
          if (
            key != "send_to_email" &&
            key != "is_active" &&
            key != "newsletter_show" &&
            key != "newsletter_schedule" &&
            key != "is_open_newsletter" &&
            key != "sub_specialities" &&
            key != "community_selected" &&
            key != "country" &&
            key != "knowledge_category" && 
            key != "tags" &&
            key != "translation"
          ) {
            dataAppend.append(key, this.form[key]);
          }  
        }
        const community_selected = [];
        this.form.community_selected.map((key) => {
          community_selected.push(key.id);
        });
        
        const sub_specialities = [];
        this.form.sub_specialities.map((key) => {
          sub_specialities.push(key.id);
        });

        const country = this.form.country.map((key) =>key.name);
        const knowledge_category = this.form.knowledge_category.map((key) => key.id);
        const tags = this.form.tags.map((key) => key);

        dataAppend.append("community_selected",JSON.stringify(community_selected));
        dataAppend.append("sub_specialities", JSON.stringify(sub_specialities));
        dataAppend.append("translation", JSON.stringify(this.form.translation));
        
        country.forEach(l => dataAppend.append("country[]",l));
        knowledge_category.forEach(k => dataAppend.append("knowledge_categories[]",k));
        tags.forEach(t => dataAppend.append("tags[]",t));

        if (this.$route.name == "edit-newsletter") {
          dataAppend.append("_method", "put");
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/newsletter");
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
    "status"(v){
      if(v==1){
        this.fetchAllCommunity();
      } else {
        if(this.$route.name == 'add-newsletter'){
          this.form.community = [];
        } else if(this.$route.name == 'edit-newsletter') {
          this.form.community_selected = this.oldForm.community_selected;
        }
      } 
    },
    currentPage: {
      handler: function (value) {
        this.params = `page=${value}`;
        this.fetchData(value);
      },
    },
    "form.send_to_email"(v) {
      if (v == 1) {
        this.form.send_to_email = true;
      } else {
        this.form.send_to_email = false;
      }
    },
    "form.is_open_newsletter"(v) {
      if (v == 1) {
        this.form.is_open_newsletter = true;
      } else {
        this.form.is_open_newsletter = false;
      }
    },
    "form.is_active"(v) {
      if (v == 1) {
        this.form.is_active = true;
      } else {
        this.form.is_active = false;
      }
    },
    "form.newsletter_show"(v) {
      if (v == 1) {
        this.form.newsletter_show = true;
      } else {
        this.form.newsletter_show = false;
      }
    },
    "form.newsletter_schedule"(v) {
      if (v == 1) {
        this.form.newsletter_schedule = true;
      } else {
        this.form.newsletter_schedule = false;
      }
    },
    activeTab(v) {
      if (v) this.tabActive();
    },
  },
  created() {
    if (this.$route.name == "add-newsletter" || this.$route.name == "edit-newsletter") {
      this.fetchCommunity();
      this.fetchAllCountry();
      this.fetchSubSpeciality();
      this.fetchKnowledgeCategory();
      this.fetchPartner();
      this.fetchForum();
      if (this.$route.name == "edit-newsletter") {
        this.fetchNewsletter(this.$route.params.id);
      }
    } else {
      this.fetchData();
    }
    this.fields.map((item) => {
      this.table_header.push(item.key);
    });
    this.tabActive();
  },
};
