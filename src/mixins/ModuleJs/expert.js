import { community, subspeciality, country, expert } from "../../js/path";
import _ from 'lodash';

export default {
  data() {
    return {
      status: false,
      expert_id: null,
      activeTab: "all",
      table_header: [],
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      tableData: [],
      currentPage: 1,
      params: "",
      key: 0,
      items: [
        {
          text: "Back",
          href: "/expert",
        },
        {
          text: "Data",
        },
      ],
      fields: [
        {
          key: "id",
          sortable: true,
        },
        {
          key: 'image_name',
          label: 'Expert'
        },
        {
          key: "name",
          label: "Expert Name",
        },
        {
          key: "is_active",
          label: "Active",
        },
        {
          key: "discussion_flag",
          label: "Discussion Forum",
        },
        {
          key: 'show_in_home',
          label: 'Visibility'
        },
        {
          key: "edit",
        },
        {
          key: "delete",
        },
      ],
      country: [],
      community: [],
      subspeciality: [],
      oldForm: {},
      form: {
        community_selected: [],
        name: "",
        email: "",
        designation: "",
        working_at: "",
        areas_of_interest: "",
        description: "",
        thumbnail_url: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        nationality: "",
        show_in_home: 0,
        visible_in_cases: 0,
        sub_specialities: [],
      },
      image_name_url: "",
      image_name: "",
      edit: {
        image_name_url: null,
      },
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
    async fetchData(txt) {
      let url = null;
      if (txt == "active") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = expert.expertUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = expert.expertUrl + "?filter=" + txt;
        }
      } else if (txt == "trash") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = expert.expertUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = expert.expertUrl + "?filter=" + txt;
        }
      } else if (txt == "all") {
        this.activeTab = txt;
        if (this.filter != null && this.filter != "") {
          url = expert.expertUrl + "?filter=" + txt + "&search=" + this.filter;
        } else {
          url = expert.expertUrl + "?filter=" + txt;
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
    async fetchExpert(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = expert.expertUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          if(responseData.name != "" && responseData.name != null){
            this.form.name = responseData.name;
          }

          if(responseData.email != '' && responseData.email != null){
            this.form.email = responseData.email;
          }

          if(responseData.working_at != "" && responseData.working_at != null){
            this.form.working_at = responseData.working_at;
          }

          if(responseData.designation != '' && responseData.designation != null){
            this.form.designation = responseData.designation;
          }

          if(responseData.areas_of_interest != "" && responseData.areas_of_interest != null){
            this.form.areas_of_interest = responseData.areas_of_interest;
          }

          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
          }

          if(responseData.url_link != "" && responseData.url_link != null){
            this.form.url_link = responseData.url_link;
          }

          if(responseData.meta_description != "" && responseData.meta_description != null){
            this.form.meta_description = responseData.meta_description;
          }

          if(responseData.meta_keywords != "" && responseData.meta_keywords != null){
            this.form.meta_keywords = responseData.meta_keywords;
          }

          if(responseData.meta_title != "" && responseData.meta_title != null){
            this.form.meta_title = responseData.meta_title;
          }

          if(responseData.nationality != null && responseData.nationality != ''){
            this.form.nationality = responseData.nationality;
          }

          if(responseData.thumbnail_url != null && responseData.thumbnail_url != ""){
            this.form.thumbnail_url = responseData.thumbnail_url;
          }

          this.edit.image_name_url = responseData.image_name;

          if (responseData.show_in_home) {
            this.form.show_in_home = true;
          }
          if (responseData.visible_in_cases) {
            this.form.visible_in_cases = true;
          }

          if (responseData.community_selected != "" && responseData.community_selected != null) {
            this.form.community_selected = responseData.community_selected.map(c => {return {id: c.community_id, title: c.name}});
          }

          // if (responseData.sub_specialities) {
          //   this.form.sub_specialities = [];
          //   responseData.sub_specialities.map((item) => {
          //     this.fetchSingleSubSpeciality(item);
          //   })
          // }
          if (responseData.sub_specialities) {
            this.form.sub_specialities = this.subspeciality.filter((item) => {
              if (responseData.sub_specialities.includes(item.id)) {
                return item;
              }
            });
          }

          this.expert_id = responseData.id;
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
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = expert.statusUpdate + "/" + id;
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
    async updateFlag(id) {
      try {
        let index = this.tableData.data.findIndex((e) => e.id == id);
        const url = expert.flagUpdate + "/" + id;
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
    // async fetchSingleCommunity(id) {
    //   const url = community.fetchCommunity;
    //   const data = await this.getRequest(url + '/' + id);
    //   if(data.status){
    //     this.form.community_selected.push(data.response);
    //   }
    // },
    async fetchNationality() {
      const url = country.fetchAllCountry;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.country = responseData;
      }
    },
    async fetchSubSpeciality() {
      const url = subspeciality.fetchAllSubSpeciality;
      const data = await this.getRequest(url);
      if (data.status) {
        const responseData = data.response.data;
        this.subspeciality = responseData;
      }
    },
    // async fetchSingleSubSpeciality(id){
    //   const url = subspeciality.fetchSubSpeciality;
    //   console.log(url);
    //   const data = await this.getRequest(url + '/' + id);
    //   if(data.status){
    //     this.form.sub_specialities.push(data.response);
    //   }
    // },
    async deleteExpert(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = expert.expertUrl + "/" + id;
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
    async restoreExpert(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = expert.restoreExpert + "/" + id;
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
          this.edit.image_name_url = '';
        }
        return true;
      }
    },
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = expert.expertUrl;
        if(this.$route.name == 'edit-expert'){
          url = expert.expertUrl + '/' + this.expert_id;
        }
        let dataAppend = new FormData();
        if (typeof this.image_name === 'string') {
          if (this.image_name.includes("https://")) {
            this.image_name = "";
          }
        }  
        if(this.image_name){
          dataAppend.append("image_name", this.image_name);
        }
        for (var key in this.form) {
          if (key != "community_selected" && key != "sub_specialities") {
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

        if (this.form.show_in_home) {
          dataAppend.append("show_in_home", 1);
        } else {
          dataAppend.append("show_in_home", 0);
        }
        if (this.form.visible_in_cases) {
          dataAppend.append("visible_in_cases", 1);
        } else {
          dataAppend.append("visible_in_cases", 0);
        }

        dataAppend.append(
          "community_selected",
          JSON.stringify(community_selected)
        );
        dataAppend.append("sub_specialities", JSON.stringify(sub_specialities));
        if (this.$route.name == "edit-expert") {
          dataAppend.append("_method", "put");
        }
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/expert");
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
    //     const url = expert.expertUrl + "/" + id;
    //     let dataAppend = new FormData();
    //     if (this.image_name) {
    //       dataAppend.append("image_name", this.image_name);
    //     }
    //     for (var key in this.form) {
    //       if (key != "community_selected" && key != "sub_specialities") {
    //         dataAppend.append(key, this.form[key]);
    //       }
    //     }
    //     const community_selected = [];
    //     this.form.community_selected.map((key) => {
    //       community_selected.push(key.id);
    //     });

    //     const sub_specialities = [];
    //     this.form.sub_specialities.map((key) => {
    //       sub_specialities.push(key.id);
    //     });

    //     if (this.form.show_in_home) {
    //       dataAppend.append("show_in_home", 1);
    //     } else {
    //       dataAppend.append("show_in_home", 0);
    //     }
    //     if (this.form.visible_in_cases) {
    //       dataAppend.append("visible_in_cases", 1);
    //     } else {
    //       dataAppend.append("visible_in_cases", 0);
    //     }

    //     dataAppend.append(
    //       "community_selected",
    //       JSON.stringify(community_selected)
    //     );
    //     dataAppend.append("sub_specialities", JSON.stringify(sub_specialities));
    //     dataAppend.append("_method", "put");
    //     const data = await this.postRequest(url, dataAppend);
    //     if (data.status) {
    //       this.$store.commit("toast/updateStatus", {
    //         status: true,
    //         icon: "success",
    //         title: data.message,
    //       });
    //       this.$router.push("/expert");
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
          let table_index = this.table_header.findIndex((item) => item == "delete");
          this.table_header[table_index] = "restore";

        } else {
          this.table_header.push("restore");
          this.fields.push({
            key: "restore",
          });
        }

        if (!this.can("restore-expert")) {
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
           if (!this.can("edit-expert")) {
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

        if (!this.can("edit-expert")) {
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

        if (!this.can("delete-expert")) {
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
    "status"(v){
      if(v==1) {
        this.fetchAllCommunity();
      } else {
        if(this.$route.name == 'add-expert'){
          this.form.community_selected = [];
        } else if(this.$route.name == 'edit-expert'){
          this.form.community_selected = this.oldForm.community_selected;
        }
      }
    },
    currentPage: {
      handler: function (value) {
        this.params = `&page=${value}`;
        this.fetchData(this.activeTab);
      },
    },
    "form.visible_in_cases"(v) {
      if (v == 1) {
        this.form.visible_in_cases = true;
      } else {
        this.form.visible_in_cases = false;
      }
    },
    "form.show_in_home"(v) {
      if (v == 1) {
        this.form.show_in_home = true;
      } else {
        this.form.show_in_home = false;
      }
    },
    activeTab(v) {
      if (v) this.tabActive();
    },
  },
  created() {
    if (this.$route.name == "add-expert" || this.$route.name == "edit-expert") {
      // this.fetchCommunity();
      this.fetchSubSpeciality();
      if (this.$route.name == "edit-expert") {
        this.fetchExpert(this.$route.params.id);
      }
    } else {
      this.fetchData("all");
    }
    this.fields.map((item) => {
      this.table_header.push(item.key);
    });
    this.tabActive();
  },
  mounted() {
    this.fetchNationality();
  }
};
