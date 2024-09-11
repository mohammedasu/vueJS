import { speciality, subspeciality, community } from "../../js/path";

export default {
  data() {
    return {
      speciality_id: null,
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "title",
          label: 'Speciality Title'
        },
        {
          key: "is_available_for_registration",
          label: "Is Available For Registration",
        },
        {
          key: "is_active",
          label: "Active",
        },
        {
          key: "edit",
        },
      ],
      community: [],
      subspeciality: [],
      form: {
        title: "",
        communityMap: [],
        subSpeciality: [],
        is_available_for_registration: 0,
        description: "",
        member_type: "",
        community_id: "",
      },
      activeCommunity: [],
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      tableData: [],
      key: 0,
      currentPage: 1,
      params: "",
    };
  },
  methods: {
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
        let url = speciality.specialityUrl;
        if (pagination == "search") {
          url = speciality.specialityUrl + "?search=" + this.filter;
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
    async fetchSpeciality(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = speciality.specialityUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.title != "" && responseData.title != null){
            this.form.title = responseData.title;
          }

          if(responseData.description != "" && responseData.description != null){
            this.form.description = responseData.description;
          }

          if(responseData.member_type != "" && responseData.member_type != null){
            this.form.member_type = responseData.member_type;
          }

          if(responseData.community_id != "" && responseData.community_id != null){
            this.form.community_id = responseData.community_id;
          }

          if (responseData.is_available_for_registration) {
            this.form.is_available_for_registration = true;
          }

          this.form.communityMap = responseData.communityMap.filter(item => {
            if(item != null)
              return item;
          });
        
          if (responseData.subSpeciality) {
            this.form.subSpeciality = responseData.subSpeciality.map((item) => {
              return item;
            });
          }

          this.speciality_id = responseData.id;
          
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
        let index = this.tableData.data.findIndex((e) => e.id == id);
        const url = speciality.statusUpdate + "/" + id;
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
    async submitData() {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = speciality.specialityUrl;
        if(this.$route.name == 'edit-speciality'){
          url = speciality.specialityUrl + '/' + this.speciality_id;
        }
        let dataAppend = new FormData();
        for (var key in this.form) {
          if (key != "communityMap" && key != "subSpeciality") {
            dataAppend.append(key, this.form[key]);
          }
        }
        const community = [];
        this.form.communityMap.map((key) => {
          community.push(key.id);
        });
        const subSpeciality = [];
        this.form.subSpeciality.map((key) => {
          subSpeciality.push(key.id);
        });

        if (this.form.is_available_for_registration) {
          dataAppend.append("is_available_for_registration", 1);
        } else {
          dataAppend.append("is_available_for_registration", 0);
        }
        dataAppend.append("community_selected", JSON.stringify(community));
        dataAppend.append("sub_specialities", JSON.stringify(subSpeciality));

        if (this.$route.name == "edit-speciality") {
          dataAppend.append("_method", "put");
        }

        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/speciality");
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
    //     const url = speciality.specialityUrl + "/" + id;
    //     let dataAppend = new FormData();
    //     for (var key in this.form) {
    //       if (key != "communityMap" && key != "subSpeciality") {
    //         dataAppend.append(key, this.form[key]);
    //       }
    //     }
    //     const community = [];
    //     this.form.communityMap.map((key) => {
    //       community.push(key.id);
    //     });

    //     const subSpeciality = [];
    //     this.form.subSpeciality.map((key) => {
    //       subSpeciality.push(key.id);
    //     });

    //     if (this.form.is_available_for_registration) {
    //       dataAppend.append("is_available_for_registration", 1);
    //     } else {
    //       dataAppend.append("is_available_for_registration", 0);
    //     }

    //     dataAppend.append("community_selected", JSON.stringify(community));
    //     dataAppend.append("sub_specialities", JSON.stringify(subSpeciality));
    //     dataAppend.append("_method", "put");
    //     const data = await this.postRequest(url, dataAppend);
    //     if (data.status) {
    //       this.$store.commit("toast/updateStatus", {
    //         status: true,
    //         icon: "success",
    //         title: data.message,
    //       });
    //       this.$router.push("/speciality");
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
    async fetchActiveCommunity(){
      const url = community.fetchAllActiveCommunity;
      const data = await this.getRequest(url);
      if (data.status) {
        this.activeCommunity = data.response.data;
      }
    },
    async fetchCommunity(query) {
      const url = community.fetchCommunity;
      const data = await this.getRequest(url + '?search=' + query);
      if (data.status) {
        this.community = data.response.data;
      }
    },
    // async fetchSingleCommunity(id){
    //   const url = community.fetchCommunity;
    //   const data = await this.getRequest(url + '/' + id);
    //   if(data.status){
    //     this.form.communityMap.push(data.response);
    //   }
    // },
    async fetchSubSpeciality(query) {
      const url = subspeciality.fetchSubSpeciality;
      const data = await this.getRequest(url + '?search=' + query);
      if (data.status) {
        this.subspeciality = data.response.data;
      }
    },
    // async fetchSingleSubSpeciality(id){
    //   const url = subspeciality.fetchSubSpeciality;
    //   const data = await this.getRequest(url + '/' + id);
    //   if(data.status){
    //     this.form.subSpeciality.push(data.response);
    //   }
    // },
  },
  watch: {
    "form.is_available_for_registration"(v) {
      if (v == 1) {
        this.form.is_available_for_registration = true;
      } else {
        this.form.is_available_for_registration = false;
      }
    },
    currentPage: {
      handler: function (value) {
        if (value) {
          this.fetchData(value);
        }
      },
    },
  },
  created() {
    if (
      this.$route.name == "add-speciality" ||
      this.$route.name == "edit-speciality"
    ) {
      this.fetchActiveCommunity();
      // this.fetchSubSpeciality();
      if (this.$route.name == "edit-speciality") {
        this.fetchSpeciality(this.$route.params.id);
      }
    } else {
      this.fetchData();
    }
  },
};
