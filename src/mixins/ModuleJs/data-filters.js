import {
   cityUrl,
   country,
   dataFilters,
   cases,
   partner,
   forum,
   speciality,
   video,
   live_event,
   stateUrl,
} from "../../js/path";

export default {
   data() {
      return {
         count: 0,
         params: "",
         action: "",
         fields: [
            {
               key: "id",
               label: "ID",
               sortable: true,
            },
            {
               key: "name",
               label: "Data Filter Name",
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
            description: "",
            countries_selected: [],
            countries_negative_selected: [],
            zone_selected: [],
            zone_negative_selected: [],
            tier_selected: [],
            tier_negative_selected: [],
            state_selected: [],
            state_negative_selected: [],
            city_selected: [],
            city_negative_selected: [],
            speciality_selected: [],
            speciality_negative_selected: [],
            digiMR_status: [],
            digiMR_negative_status: [],
            whatsapp_active_status: [],
            whatsapp_active_negative_status: [],
            sms_active_status: [],
            sms_active_negative_status: [],
            member_type: [],
            member_negative_type: [],
            last_active_since: 0,
            live_event_partner: "",
            live_event_partner_division_id: "",
            live_event_registered: [],
            live_event_registered_check: false,
            live_event_visited: [],
            live_event_visited_check: false,
            forum_subscription: [],
            forum_subscription_check: false,
            member_is_prime: false,
            video_watched: [],
            video_watched_check: false,
            answered_case: [],
            answered_case_check: false,
         },
         country: [],
         liveEvent: [],
         videos: [],
         cases: [],
         states: [],
         states_negative: [],
         tier: [{
               text: "All",
               value: "all",
            },
            {
               text: "Tier 1",
               value: "tier 1",
            },
            {
               text: "Tier 2",
               value: "tier 2",
            },
         ],
         city_state: [],
         city_state_negative: [],
         specialities: [],
         partner: [],
         forum: [],
         digiMR_status: [],
         whatsapp_active_status: [],
         sms_active_status: [],
         member_types: [],
         tableData: [],
         activeTab: "all",
         key: 0,
         currentPage: 1,
         filter: null,
         filterOn: [],
         sortBy: "id",
         sortDesc: true,
         zone: [{
               text: "All",
               value: "All",
            },
            {
               text: "Central",
               value: "Central",
            },
            {
               text: "East",
               value: "East",
            },
            {
               text: "West",
               value: "West",
            },
            {
               text: "North",
               value: "North",
            },
            {
               text: "South",
               value: "South",
            },
            {
               text: "International",
               value: "International",
            },
            {
               text: "North East",
               value: "North East",
            },
         ],
         isLoading: false,
      };
   },
   computed: {
      liveTypeCheck() {
         const dataSelected = [];
         const memberTypeData = this.form.member_type;
         memberTypeData.some(function (el) {
            dataSelected.push(el.value);
         });
         if (
            dataSelected.includes("app_user") ||
            dataSelected.includes("live_event") ||
            dataSelected.includes("member")
         ) {
            return true;
         }
      },
      memberTypeCheck() {
         const dataSelectedMember = [];
         const memberTypeData = this.form.member_type;

         memberTypeData.some(function (el) {
            dataSelectedMember.push(el.value);
         });
         if (
            dataSelectedMember.includes("app_user") ||
            dataSelectedMember.includes("member")
         ) {
            return true;
         }
      },
   },

   methods: {
      onFiltered(filteredItems) {
         this.totalRows = filteredItems.length;
         this.currentPage = 1;
      },
      async fetchFilter() {
         const url = dataFilters.getFilterContent;
         const data = await this.getRequest(url);
         if (data.status) {
            const responseData = data.response;
            this.member_types = responseData.member_types;
            this.whatsapp_active_status = responseData.whatsapp_active_status;
            this.sms_active_status = responseData.sms_active_status;
            this.digiMR_status = responseData.digiMR_status;
         }
      },
      async fetchCountry(query) {
         const url = country.fetchAllCountry;
         this.isLoading = true;
         const data = await this.getRequest(url + "&search=" + query);
         if (data.status) {
            this.country = data.response.data;
            this.isLoading = false;
         }
      },
      async fetchAllStates(query) {
         const url = stateUrl.fetchAllStates;
         const data = await this.getRequest(url + "?search=" + query);
         if (data.status) {
            const responseData = data.response;
            this.states = responseData;
            this.states_negative = responseData;
         }
      },
      async fetchAllCities(query) {
         const url = cityUrl.fetchAllCities;
         const data = await this.getRequest(url + "?search=" + query);
         if (data.status) {
            const responseData = data.response;
            this.city_state = responseData;
            this.city_state_negative = responseData;
         }
      },
      async fetchSpeciality(query) {
         const url = speciality.specialityUrl;
         const data = await this.getRequest(url + "?search=" + query);
         if (data.status) {
            this.specialities = data.response.data;
         }
      },
      async fetchPartner(query) {
         const url = partner.partnerUrl;
         const data = await this.getRequest(url + "?search=" + query);
         if (data.status) {
            this.partner = data.response.data;
         }
      },
      async fetchSingleCase(id) {
         const url = cases.caseUrl;
         const data = await this.getRequest(url + "/" + id);
         if (data.status) {
            this.form.answered_case.push(data.response);
         }
      },
      async fetchSinglePartner(id) {
         const url = partner.partnerUrl;
         const data = await this.getRequest(url + "/" + id);
         if (data.status) {
            this.form.live_event_partner = data.response;
         }
      },
      async fetchSinglePartnerDivision(id) {
         const url = forum.forumUrl;
         const data = await this.getRequest(url + "/" + id);
         if (data.status) {
            this.form.live_event_partner_division_id = data.response;
         }
      },
      async fetchForum(query) {
         const url = forum.forumUrl;
         const data = await this.getRequest(url + "?search=" + query);
         if (data.status) {
            this.forum = data.response.data;
         }
      },
      async fetchSingleForum(id) {
         const url = forum.forumUrl;
         const data = await this.getRequest(url + "/" + id);
         if (data.status) {
            this.form.forum_subscription.push(data.response);
         }
      },
      async fetchLiveEvent(query) {
         const url = live_event.fetchAllLive_event;
         const data = await this.getRequest(url + "&search=" + query);
         if (data.status) {
            this.liveEvent = data.response.data;
         }
      },
      // async fetchSingleRegisteredLiveEvent(id){
      //    const url = live_event.fetchAllLive_event;
      //    const data = await this.getRequest(url + "/" + id);
      //    if (data.status) {
      //       this.form.live_event_registered.push(data.response);
      //    }
      // },
      // async fetchSingleVisitedLiveEvent(id){
      //    const url = live_event.fetchAllLive_event;
      //    const data = await this.getRequest(url + "/" + id);
      //    if (data.status) {
      //       this.form.live_event_visited.push(data.response);
      //    }
      // },
      async fetchVideo(query) {
         const url = video.videoUrl;
         const data = await this.getRequest(url + "?search=" + query);
         if (data.status) {
            this.videos = data.response.data;
         }
      },
      async fetchSingleVideo(id) {
         const url = video.videoUrl;
         const data = await this.getRequest(url + "/" + id);
         if (data.status) {
            this.form.video_watched.push(data.response);
         }
      },
      async fetchCase(query) {
         const url = cases.caseUrl;
         const data = await this.getRequest(url + "?search=" + query);
         if (data.status) {
            this.cases = data.response.data;
         }
      },
      // search() {
      //    if (this.filter.length > 1) this.fetchData("search");
      //    else if (this.filter.length == 0) this.fetchData("search");
      // },
      search(event) {
         if (this.filter.length > 1) {
           if (event.keyCode == 13) {
             this.fetchData('search');
           }
         }
         else if (this.filter.length == 0) this.fetchData('search');
       },
      async fetchData(pagination = null) {
         this.$store.commit("loader/updateStatus", true);
         try {
            let url = dataFilters.dataFiltersUrl;
            if (pagination == 'search') {
               url = dataFilters.dataFiltersUrl + "?search=" + this.filter;
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
      async fetchDataFilters(id) {
         try {
            const url = dataFilters.dataFiltersUrl + "/" + id;
            const data = await this.getRequest(url);
            if (data.status) {
               const responseData = data.response;
               this.form.title = responseData.name;

               if (
                  responseData.description != null &&
                  responseData.description != ""
               ) {
                  this.form.description = responseData.description;
               }

               if(responseData.universal_filters != "" && responseData.universal_filters != null){
                  if(responseData.universal_filters.last_active_since != "" && responseData.universal_filters.last_active_since != null){   
                     this.form.last_active_since =
                     responseData.universal_filters.last_active_since;
                  }
                  if (
                     responseData.universal_filters.countries_selected != "" &&
                     responseData.universal_filters.countries_selected != null
                  ) {
                     responseData.universal_filters.countries_selected.map(
                        (item) => {
                           this.form.countries_selected.push({
                              name: item,
                           });
                        }
                     );
                  }
                  if (
                     responseData.universal_filters.countries_negative_selected !=
                     "" &&
                     responseData.universal_filters.countries_negative_selected !=
                     null
                  ) {
                     responseData.universal_filters.countries_negative_selected.map(
                        (item) => {
                           this.form.countries_negative_selected.push({
                              name: item,
                           });
                        }
                     );
                  }
                  if (
                     responseData.universal_filters.zone_selected != null &&
                     responseData.universal_filters.zone_selected != ""
                  ) {
                     responseData.universal_filters.zone_selected.map((item) => {
                        this.form.zone_selected.push(
                           ...this.zone.filter((zone) => {
                              if (zone.value == item) return item;
                           })
                        );
                     });
                  }
                  if (
                     responseData.universal_filters.zone_negative_selected !=
                     null &&
                     responseData.universal_filters.zone_negative_selected != ""
                  ) {
                     responseData.universal_filters.zone_negative_selected.map(
                        (item) => {
                           this.form.zone_negative_selected.push(
                              ...this.zone.filter((zone) => {
                                 if (zone.value == item) return item;
                              })
                           );
                        }
                     );
                  }
                  if (
                     responseData.universal_filters.tier_selected != "" &&
                     responseData.universal_filters.tier_selected != null
                  ) {
                     responseData.universal_filters.tier_selected.map((item) => {
                        this.form.tier_selected.push(
                           ...this.tier.filter((tier) => {
                              if (tier.value == item) return item;
                           })
                        );
                     });
                  }
   
                  if (
                     responseData.universal_filters.tier_negative_selected !=
                     null &&
                     responseData.universal_filters.tier_negative_selected != ""
                  ) {
                     responseData.universal_filters.tier_negative_selected.map(
                        (item) => {
                           this.form.tier_negative_selected.push(
                              ...this.tier.filter((tier) => {
                                 if (tier.value == item) return item;
                              })
                           );
                        }
                     );
                  }
                  if (
                     responseData.universal_filters.state_selected != null &&
                     responseData.universal_filters.state_selected != ""
                  ) {
                     this.form.state_selected = [];
                     responseData.universal_filters.state_selected.map((item) => {
                        this.form.state_selected.push({
                           state: item,
                        });
                     });
                  }
   
                  if (
                     responseData.universal_filters.state_negative_selected !=
                     "" &&
                     responseData.universal_filters.state_negative_selected != null
                  ) {
                     this.form.state_negative_selected = [];
                     responseData.universal_filters.state_negative_selected.map(
                        (item) => {
                           this.form.state_negative_selected.push({
                              state: item,
                           });
                        }
                     );
                  }
   
                  if (
                     responseData.universal_filters.city_selected != "" &&
                     responseData.universal_filters.city_selected != null
                  ) {
                     this.form.city_selected = [];
                     responseData.universal_filters.city_selected.map((item) => {
                        this.form.city_selected.push({
                           city: item,
                        });
                     });
                  }
   
                  if (
                     responseData.universal_filters.city_negative_selected != "" &&
                     responseData.universal_filters.city_negative_selected != null
                  ) {
                     this.form.city_negative_selected = [];
                     responseData.universal_filters.city_negative_selected.map(
                        (item) => {
                           this.form.city_negative_selected.push({
                              city: item,
                           });
                        }
                     );
                  }
   
                  if (
                     responseData.universal_filters.speciality_selected != "" &&
                     responseData.universal_filters.speciality_selected != null
                  ) {
                     this.form.speciality_selected = [];
                     responseData.universal_filters.speciality_selected.map(
                        (item) => {
                           this.form.speciality_selected.push({
                              title: item,
                           });
                        }
                     );
                  }
   
                  if (
                     responseData.universal_filters.speciality_negative_selected !=
                     "" &&
                     responseData.universal_filters.speciality_negative_selected !=
                     null
                  ) {
                     this.form.speciality_negative_selected = [];
                     responseData.universal_filters.speciality_negative_selected.map(
                        (item) => {
                           this.form.speciality_negative_selected.push({
                              title: item,
                           });
                        }
                     );
                  }
   
                  if (
                     responseData.universal_filters.digiMR_status != "" &&
                     responseData.universal_filters.digiMR_status != null
                  ) {
                     responseData.universal_filters.digiMR_status.map((item) => {
                        this.form.digiMR_status.push(
                           ...this.digiMR_status.filter((digiMR_status) => {
                              if (digiMR_status == item) return item;
                           })
                        );
                     });
                  }
   
                  if (
                     responseData.universal_filters.digiMR_negative_status != "" &&
                     responseData.universal_filters.digiMR_negative_status != null
                  ) {
                     responseData.universal_filters.digiMR_negative_status.map(
                        (item) => {
                           this.form.digiMR_negative_status.push(
                              ...this.digiMR_status.filter((digiMR_status) => {
                                 if (digiMR_status == item) return item;
                              })
                           );
                        }
                     );
                  }
   
                  if (
                     responseData.universal_filters.whatsapp_active_status != "" &&
                     responseData.universal_filters.whatsapp_active_status != null
                  ) {
                     responseData.universal_filters.whatsapp_active_status.map(
                        (item) => {
                           this.form.whatsapp_active_status.push(
                              ...this.whatsapp_active_status.filter(
                                 (whatsapp_active_status) => {
                                    if (whatsapp_active_status == item)
                                       return item;
                                 }
                              )
                           );
                        }
                     );
                  }
   
                  if (
                     responseData.universal_filters
                     .whatsapp_active_negative_status != "" &&
                     responseData.universal_filters
                     .whatsapp_active_negative_status != null
                  ) {
                     responseData.universal_filters.whatsapp_active_negative_status.map(
                        (item) => {
                           this.form.whatsapp_active_negative_status.push(
                              ...this.whatsapp_active_status.filter(
                                 (whatsapp_active_status) => {
                                    if (whatsapp_active_status == item)
                                       return item;
                                 }
                              )
                           );
                        }
                     );
                  }
   
                  if (
                     responseData.universal_filters.sms_active_status != "" &&
                     responseData.universal_filters.sms_active_status != null
                  ) {
                     responseData.universal_filters.sms_active_status.map(
                        (item) => {
                           this.form.sms_active_status.push(
                              ...this.sms_active_status.filter(
                                 (sms_active_status) => {
                                    if (sms_active_status == item) return item;
                                 }
                              )
                           );
                        }
                     );
                  }
   
                  if (
                     responseData.universal_filters.sms_active_negative_status !=
                     "" &&
                     responseData.universal_filters.sms_active_negative_status !=
                     null
                  ) {
                     responseData.universal_filters.sms_active_negative_status.map(
                        (item) => {
                           this.form.sms_active_negative_status.push(
                              ...this.sms_active_status.filter(
                                 (sms_active_status) => {
                                    if (sms_active_status == item) return item;
                                 }
                              )
                           );
                        }
                     );
                  }
   
                  if (
                     responseData.universal_filters.member_type != "" &&
                     responseData.universal_filters.member_type != null
                  ) {
                     responseData.universal_filters.member_type.map((item) => {
                        this.form.member_type.push(
                           ...this.member_types.filter((member_types) => {
                              if (member_types.value == item) return item;
                           })
                        );
                     });
                  }
   
                  if (
                     responseData.universal_filters.member_negative_type != "" &&
                     responseData.universal_filters.member_negative_type != null
                  ) {
                     responseData.universal_filters.member_negative_type.map(
                        (item) => {
                           this.form.member_negative_type.push(
                              ...this.member_types.filter((member_types) => {
                                 if (member_types.value == item) return item;
                              })
                           );
                        }
                     );
                  }   
               }

               if(responseData.member_filters != "" && responseData.member_filters != null){
                  if (
                     responseData.member_filters.answered_case != "" &&
                     responseData.member_filters.answered_case != null
                  ) {
                     this.form.answered_case = [];
                     responseData.member_filters.answered_case.map(
                        (item) => {
                           this.fetchSingleCase(item);
                        }
                     );
                  }
   
                  if (
                     responseData.member_filters.forum_subscription != "" &&
                     responseData.member_filters.forum_subscription != null
                  ) {
                     this.form.forum_subscription = [];
                     responseData.member_filters.forum_subscription.map(
                        (item) => {
                           this.fetchSingleForum(item);
                        }
                     );
                  }
   
                  if (
                     responseData.member_filters.video_watched != "" &&
                     responseData.member_filters.video_watched != null
                  ) {
                     this.form.video_watched = [];
                     responseData.member_filters.video_watched.map(
                        (item) => {
                           this.fetchSingleVideo(item);
                        }
                     );
                  } 
                  if (responseData.member_filters.answered_case_check) {
                     this.form.answered_case_check = (responseData.member_filters.answered_case_check == 'true');
                  }
   
                  if (responseData.member_filters.forum_subscription_check) {
                     this.form.forum_subscription_check = (responseData.member_filters.forum_subscription_check == 'true');
                  }
   
                  if (responseData.member_filters.video_watched_check) {
                     this.form.video_watched_check = (responseData.member_filters.video_watched_check == 'true');
                  }
   
                  if (responseData.member_filters.member_is_prime) {
                     this.form.member_is_prime = (responseData.member_filters.member_is_prime == 'true');
                  }  
               }

               if(responseData.live_event_filters != "" && responseData.live_event_filters != null){
                  if (
                     responseData.live_event_filters.live_event_registered != "" &&
                     responseData.live_event_filters.live_event_registered != null
                  ) {
                     this.form.live_event_registered = [];
                     responseData.live_event_filters.live_event_registered.map(
                        (item) => {
                           let data = this.liveEvent.filter((c) => c.id == item);
                           if (typeof data[0] != "undefined") {
                              this.form.live_event_registered.push({
                                 id: data[0].id,
                                 title: data[0].title,
                              });
                           }                     
                        }
                     );
                  }
   
                  if (
                     responseData.live_event_filters.live_event_visited != "" &&
                     responseData.live_event_filters.live_event_visited != null
                  ) {
                     this.form.live_event_visited = [];
                     responseData.live_event_filters.live_event_visited.map(
                        (item) => {
                           let data = this.liveEvent.filter((c) => c.id == item);
                           if (typeof data[0] != "undefined") {
                              this.form.live_event_visited.push({
                                 id: data[0].id,
                                 title: data[0].title,
                              });
                           }
                        }
                     );
                  }
   
                  if (
                     responseData.live_event_filters.live_event_partner != "" &&
                     responseData.live_event_filters.live_event_partner != null
                  ) {
                     this.form.live_event_partner = '';
                     responseData.live_event_filters.live_event_partner.map(
                        (item) => {
                           this.fetchSinglePartner(item);
                        }
                     );
                  }
   
                  if (
                     responseData.live_event_filters.live_event_partner_division_id != "" &&
                     responseData.live_event_filters.live_event_partner_division_id != null               
                  ) {
                     this.form.live_event_partner_division_id = '';
                     responseData.live_event_filters.live_event_partner_division_id.map(
                        (item) => {
                           this.fetchSinglePartnerDivision(item);
                        }
                     );
                  }
   
                  if (responseData.live_event_filters.live_event_registered_check) {
                     this.form.live_event_registered_check = (responseData.live_event_filters.live_event_registered_check == 'true');
                  }
   
                  if (responseData.live_event_filters.live_event_visited_check) {
                     this.form.live_event_visited_check = (responseData.live_event_filters.live_event_visited_check == 'true');
                  }
   
               }
            }
         } catch (err) {
            console.log(err);
            this.$store.commit("toast/updateStatus", {
               status: true,
               icon: "error",
               title: "Fetching error!",
            });
         }
      },
      async deleteDataFilters(id) {
         this.$store.commit("loader/updateStatus", true);
         try {
            let index = this.tableData.data.findIndex((e) => e.id === id);
            const url = dataFilters.dataFiltersUrl + "/" + id;
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
      async restoreDataFilters(id) {
         this.$store.commit("loader/updateStatus", true);
         try {
            let index = this.tableData.data.findIndex((e) => e.id === id);
            const url = dataFilters.restoreDataFilter + "/" + id;
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
      async submitData(action) {
         try {
            this.submitted = true;
            this.$v.$touch();
            if (this.$v.$invalid) {
               this.$store.commit("toast/updateStatus", {
                  status: true,
                  icon: "error",
                  title: "Please Fill The Required Fields",
               });
               return false;
            }
            this.action = action;
            this.$store.commit("loader/updateStatus", true);
            const url = dataFilters.dataFiltersUrl;
            const dataAppend = new FormData();

            if (this.form.live_event_registered_check == true) {
               dataAppend.append("live_event_registered_check", true);
            } else {
               dataAppend.append("live_event_registered_check", false);
            }
            if (this.form.live_event_visited_check == true) {
               dataAppend.append("live_event_visited_check", true);
            } else {
               dataAppend.append("live_event_visited_check", false);
            }
            if (this.form.forum_subscription_check == true) {
               dataAppend.append("forum_subscription_check", true);
            } else {
               dataAppend.append("forum_subscription_check", false);
            }
            if (this.form.video_watched_check == true) {
               dataAppend.append("video_watched_check", true);
            } else {
               dataAppend.append("video_watched_check", false);
            }
            if (this.form.answered_case_check == true) {
               dataAppend.append("answered_case_check", true);
            } else {
               dataAppend.append("answered_case_check", false);
            }

            dataAppend.append("action", action);
            dataAppend.append("title", this.form.title);
            dataAppend.append("description", this.form.description);
            if (this.form.live_event_partner_division_id != "") {
               dataAppend.append(
                  "live_event_partner_division_id[]",
                  this.form.live_event_partner_division_id.id
               );
            } else {
               dataAppend.append("live_event_partner_division_id", "");
            }

            if (this.form.live_event_partner != '') {
               dataAppend.append("live_event_partner[]",
                  this.form.live_event_partner.id
               );
            } else {
               dataAppend.append("live_event_partner", "");
            }

            dataAppend.append("last_active_since", this.form.last_active_since);

            for (var key in this.form) {
               if (
                  key != "title" &&
                  key != "description" &&
                  key != "live_event_registered_check" &&
                  key != "live_event_visited_check" &&
                  key != "forum_subscription_check" &&
                  key != "video_watched_check" &&
                  key != "answered_case_check" &&
                  key != "live_event_partner" &&
                  key != "live_event_partner_division_id" &&
                  key != "last_active_since"
               ) {
                  if (this.form[key].length > 0) {
                     if (
                        key == "live_event_registered" ||
                        key == "live_event_visited" ||
                        key == "forum_subscription" ||
                        key == "video_watched" ||
                        key == "answered_case"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].id
                           );
                        }
                     }
                     if (
                        key == "zone_selected" ||
                        key == "zone_negative_selected" ||
                        key == "tier_selected" ||
                        key == "tier_negative_selected" ||
                        key == "member_type" ||
                        key == "member_negative_type"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].value
                           );
                        }
                     }
                     if (
                        key == "digiMR_status" ||
                        key == "digiMR_negative_status" ||
                        key == "whatsapp_active_status" ||
                        key == "whatsapp_active_negative_status" ||
                        key == "sms_active_status" ||
                        key == "sms_active_negative_status"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(key + "[]", this.form[key][index]);
                        }
                     }
                     if (
                        key == "countries_selected" ||
                        key == "countries_negative_selected"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].name
                           );
                        }
                     }
                     if (
                        key == "city_selected" ||
                        key == "city_negative_selected"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].city
                           );
                        }
                     }
                     if (
                        key == "state_selected" ||
                        key == "state_negative_selected"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].state
                           );
                        }
                     }
                     if (
                        key == "speciality_selected" ||
                        key == "speciality_negative_selected"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].title
                           );
                        }
                     }
                  } else {
                     dataAppend.append(key, "");
                  }
               }
            }
            if (this.form.member_is_prime == true) {
               dataAppend.append("member_is_prime", true);
            } else {
               dataAppend.append("member_is_prime", false);
            }
            const data = await this.postRequest(url, dataAppend);
            if (data.status) {
               if (action == "check") {
                  this.count = data.response.data_count;
               } else {
                  this.$store.commit("toast/updateStatus", {
                     status: true,
                     icon: "success",
                     title: data.message,
                  });
                  this.$router.push("/dataFilters");
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
      async updateData(id, action) {
         try {
            this.submitted = true;
            this.$v.$touch();
            if (this.$v.$invalid) {
               this.$store.commit("toast/updateStatus", {
                  status: true,
                  icon: "error",
                  title: "Please Fill The Required Fields",
               });
               return false;
            }
            this.action = action;
            this.$store.commit("loader/updateStatus", true);
            const url = dataFilters.dataFiltersUrl + "/" + id;
            const dataAppend = new FormData();

            if (this.form.live_event_registered_check == true) {
               dataAppend.append("live_event_registered_check", true);
            } else {
               dataAppend.append("live_event_registered_check", false);
            }
            if (this.form.live_event_visited_check == true) {
               dataAppend.append("live_event_visited_check", true);
            } else {
               dataAppend.append("live_event_visited_check", false);
            }
            if (this.form.forum_subscription_check == true) {
               dataAppend.append("forum_subscription_check", true);
            } else {
               dataAppend.append("forum_subscription_check", false);
            }
            if (this.form.video_watched_check == true) {
               dataAppend.append("video_watched_check", true);
            } else {
               dataAppend.append("video_watched_check", false);
            }
            if (this.form.answered_case_check == true) {
               dataAppend.append("answered_case_check", true);
            } else {
               dataAppend.append("answered_case_check", false);
            }

            dataAppend.append("action", action);
            dataAppend.append("title", this.form.title);
            dataAppend.append("description", this.form.description);
            if (this.form.live_event_partner_division_id != "") {
               dataAppend.append(
                  "live_event_partner_division_id[]",
                  this.form.live_event_partner_division_id.id
               );
            } else {
               dataAppend.append("live_event_partner_division_id", "");
            }

            if (this.form.live_event_partner != "") {
               dataAppend.append("live_event_partner[]",
                  this.form.live_event_partner.id
               );
            } else {
               dataAppend.append("live_event_partner", "");
            }

            dataAppend.append("last_active_since", this.form.last_active_since);

            for (var key in this.form) {
               if (
                  key != "title" &&
                  key != "description" &&
                  key != "live_event_registered_check" &&
                  key != "live_event_visited_check" &&
                  key != "forum_subscription_check" &&
                  key != "video_watched_check" &&
                  key != "answered_case_check" &&
                  key != "live_event_partner" &&
                  key != "live_event_partner_division_id" &&
                  key != "last_active_since"
               ) {
                  if (this.form[key].length > 0) {
                     if (
                        key == "live_event_registered" ||
                        key == "live_event_visited" ||
                        key == "forum_subscription" ||
                        key == "video_watched" ||
                        key == "answered_case"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].id
                           );
                        }
                     }
                     if (
                        key == "zone_selected" ||
                        key == "zone_negative_selected" ||
                        key == "tier_selected" ||
                        key == "tier_negative_selected" ||
                        key == "member_type" ||
                        key == "member_negative_type"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].value
                           );
                        }
                     }
                     if (
                        key == "digiMR_status" ||
                        key == "digiMR_negative_status" ||
                        key == "whatsapp_active_status" ||
                        key == "whatsapp_active_negative_status" ||
                        key == "sms_active_status" ||
                        key == "sms_active_negative_status"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(key + "[]", this.form[key][index]);
                        }
                     }
                     if (
                        key == "countries_selected" ||
                        key == "countries_negative_selected"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].name
                           );
                        }
                     }
                     if (
                        key == "city_selected" ||
                        key == "city_negative_selected"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].city
                           );
                        }
                     }
                     if (
                        key == "state_selected" ||
                        key == "state_negative_selected"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].state
                           );
                        }
                     }
                     if (
                        key == "speciality_selected" ||
                        key == "speciality_negative_selected"
                     ) {
                        for (
                           let index = 0; index < this.form[key].length; index++
                        ) {
                           dataAppend.append(
                              key + "[]",
                              this.form[key][index].title
                           );
                        }
                     }
                  } else {
                     dataAppend.append(key, "");
                  }
               }
            }
            if (this.form.member_is_prime == true) {
               dataAppend.append("member_is_prime", true);
            } else {
               dataAppend.append("member_is_prime", false);
            }
            dataAppend.append("_method", "put");
            const data = await this.postRequest(url, dataAppend);
            if (data.status) {
               if (action == "check") {
                  this.count = data.response.data_count;
               } else {
                  this.$store.commit("toast/updateStatus", {
                     status: true,
                     icon: "success",
                     title: data.message,
                  });
                  this.$router.push("/dataFilters");
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
   },
   watch: {
      currentPage: {
         handler: function (value) {
            if (value) {
               this.fetchData(value);
            }
         },
      },
   },
   async created() {
      if (
         this.$route.name == "add-dataFilters" ||
         this.$route.name == "edit-dataFilters"
      ) {
         this.$store.commit("loader/updateStatus", true);
         await Promise.all([
            this.fetchFilter(),
         ]);
         this.$store.commit("loader/updateStatus", false);
         if (this.$route.name == "edit-dataFilters") {
            this.fetchDataFilters(this.$route.params.id);
         }
      } else {
         this.fetchData("all");
      }
   },
};