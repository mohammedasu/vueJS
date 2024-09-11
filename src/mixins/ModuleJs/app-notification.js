import {
  appNotification,
  reading_material,
  dataFilters,
  cases,
  video
} from "../../js/path";
import moment from "moment";

export default {
  data() {
    return {
      count: 0,
      is_check: false,
      fields: [{
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: 'engagement_name',
          label: 'Engagement Name'
        },
        {
          key: "notification_type",
          label: "Notification Type",
        },
        {
          key: "scheduled_time",
          label: "Scheduled At",
        },
        {
          key: 'is_processed',
          label: 'Is Processed'
        },
        {
          key: 'edit'
        },
        {
          key: "delete",
        },
      ],
      actionType: [],
      deviceType: [{
          text: "Android",
          value: "android",
        },
        {
          text: "IOS",
          value: "ios",
        },
        {
          text: "All",
          value: "all"
        }
      ],
      params: "",
      tableData: [],
      key: 0,
      currentPage: 1,
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      attachType: [],
      attachment: [],
      form: {
        engagement_name: "",
        scheduled_time: "",
        notification_type: "whatsapp",
        // whatsapp_type: 0,
        // app_notification_type: 0,
        send_to_medium: "",
        mobile_numbers: '',
        action_type: '',
        action_id: '',
        content: '',
        device_type: '',
        contentParams: '',
        image: '',
        data_filter_id: '',
        notification_title: '',
        notification_description: '',
      },
      csv_file: "",
      image: '',
      image_url: '',
      edit: {
        csv_file_url: null,
        image_url: null
      },
      isDataFilter: false,
      isTestMob: false,
      isCSV: false,
      dataFilter: [],
      action_type: [],
      action_key: 0,
      typeOpt: [{
          text: 'Whatsapp',
          value: 'whatsapp',
        },
        {
          text: 'App Notification',
          value: 'app_notification'
        },
        {
          text: 'SMS',
          value: 'sms',
          disabled: true
        },
        {
          text: 'Email',
          value: 'email',
          disabled: true
        }
      ],
      sendToMedium: []
    };
  },
  methods: {
    setActionType(){
      this.actionType = [{
        text: "Newsletter",
        value: "newsletter",
      },
      {
        text: 'Case',
        value: 'case'
      },
      {
        text: 'Video',
        value: 'video'
      },
      {
        text: "Custom",
        value: "custom",
      }]
    },
    setSendToMedium(){
      this.sendToMedium = [{
        text: "Test",
        value: "test",
      },
      {
        text: "Data Filter",
        value: "data_filter",
      },
      {
        text: "CSV",
        value: "csv",
      },
      ]
    },
    readFile(e, txt) {
      if (txt == 'csv_file') {
        this.csv_file = e.target.files[0]
      } else if (txt == 'image') {
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
      }
    },
    changeNotificationType() {
      this.submitted = false;
      if (this.form.notification_type == 'app_notification') {
        let actionTypeIndex = this.actionType.findIndex((a) => a === 'custom')
        this.actionType.splice(actionTypeIndex, 1);
        let sendToMediumIndex = this.sendToMedium.findIndex((a) => a ==='csv')
        this.sendToMedium.splice(sendToMediumIndex, 1);
        // let sendToMediumNone = this.sendToMedium.findIndex((a) => a == 'none')
        this.sendToMedium.push('None');
        this.action_key += 1;
        if (this.$route.name == 'add-communication') {
          this.form.engagement_name = '';
          this.action_type = null;
          this.form.action_id = null;
          this.form.action_type = '';
          this.form.send_to_medium = '';
          this.form.notification_title = '';
          this.form.notification_description = '';
          this.form.device_type = '';
          this.isTestMob = false;
          this.isDataFilter = false;
          this.isCSV = false;
          this.form.contentParams = '';
          this.edit.csv_file_url = '';
          this.image_url = '';
          this.image = '';
          this.form.mobile_numbers = '';
          this.form.scheduled_time = '';
          this.form.data_filter_id = '';
        }
      } else if (this.form.notification_type == 'whatsapp') {
        this.setActionType();
        this.setSendToMedium();
        if (this.$route.name == 'add-communication') {
          this.form.engagement_name = '';
          this.action_type = null;
          this.form.action_id = null;
          this.form.action_type = '';
          this.form.send_to_medium = '';
          this.isTestMob = false;
          this.isDataFilter = false;
          this.isCSV = false;
          this.form.content = '';
          this.form.image = '';
          this.image = '';
          this.image_url = '';
          this.edit.csv_file_url = '';
          this.form.mobile_numbers = '';
          this.form.scheduled_time = '';
          this.form.data_filter_id = '';
          this.action_key += 1;
        }
      }
    },
    changeSendType(val = null) {
      if (val == "data_filter") {
        this.isDataFilter = true;
        this.isCSV = false;
        this.isTestMob = false;
      } else if (val == "csv") {
        this.isDataFilter = false;
        this.isCSV = true;
        this.isTestMob = false;
      } else if (val == 'test') {
        this.isDataFilter = false;
        this.isCSV = false;
        this.isTestMob = true;
      } else if(val == 'None'){
        this.isDataFilter = false;
        this.isCSV = false;
        this.isTestMob = false;
      }
    },
    changeType(val) {
      this.action_type = [];
      this.form.action_id = null;
      this.fetchAttachment(val);
    },
    async fetchAttachment(val) {
      if (val == "newsletter") {
        const url = reading_material.fetchAllActiveReadingMaterial;
        this.$store.commit('loader/updateStatus', true);
        const data = await this.getRequest(url);
        this.$store.commit('loader/updateStatus', false);
        if (data.status) {
          const responseData = data.response;
          this.action_type = responseData.data;
        }
      } else if (val == "case") {
        const url = cases.fetchAllActiveCase;
        this.$store.commit('loader/updateStatus', true);
        const data = await this.getRequest(url);
        this.$store.commit('loader/updateStatus', false);
        if (data.status) {
          const responseData = data.response.data;
          this.action_type = responseData;
        }
      } else if (val == "video") {
        const url = video.fetchAllActiveVideo;
        this.$store.commit('loader/updateStatus', true);
        const data = await this.getRequest(url);
        this.$store.commit('loader/updateStatus', false);
        if (data.status) {
          const responseData = data.response.data;
          this.action_type = responseData;
        }
      }
    },
    async fetchDataFilter() {
      const url = dataFilters.fetchAllDataFilter;
      this.$store.commit('loader/updateStatus', true);
      const data = await this.getRequest(url);
      this.$store.commit('loader/updateStatus', false);
      if (data.status) {
        const responseData = data.response;
        this.dataFilter = responseData.data;
      }
    },
    // search() {
    //   if (this.filter.length > 1)
    //     this.fetchData("search");
    //   else if (this.filter.length == 0)
    //     this.fetchData('search');
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
        let url = appNotification.appNotificationUrl;
        if (pagination == "search") {
          url = appNotification.appNotificationUrl + "?search=" + this.filter;
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
    async fetchAppNotification(id, scheduled_time) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = appNotification.appNotificationUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;
          if (responseData.engagement_name != null && responseData.engagement_name != "") {
            this.form.engagement_name = responseData.engagement_name;
          }

          this.form.scheduled_time = moment(scheduled_time).format("YYYY-MM-DDTHH:mm");

          if(responseData.action_type != '' && responseData.action_type != null){
          this.form.action_type = responseData.action_type;
          }
          if(responseData.action_id != null && responseData.action_id != ""){
            this.form.action_id = responseData.action_id;
          }
          if (responseData.payload.content != null && responseData.payload.content != "") {
            this.form.content = responseData.payload.content;
          }
          if(responseData.payload.notification_title != null && responseData.payload.notification_title != "" ){
          this.form.notification_title = responseData.payload.notification_title;
          }
          if(responseData.payload.notification_description != null && responseData.payload.notification_description != ""){
          this.form.notification_description = responseData.payload.notification_description;
          }
          this.edit.image_url = responseData.payload.image;
          // this.image = responseData.image;
          this.form.device_type = responseData.device_type;

          this.form.notification_description = responseData.payload.notification_description;

          if (responseData.payload.send_to_medium != "" && responseData.payload.send_to_medium != null) {
            this.form.send_to_medium = responseData.payload.send_to_medium;
          }
          if (responseData.data_filter_id != '' && responseData.data_filter_id != null) {
            this.form.data_filter_id = responseData.data_filter_id;
          }
          this.edit.csv_file_url = responseData.import_csv;

          this.form.mobile_numbers = responseData.payload.mobile_numbers;
          if (responseData.notification_type != null && responseData.notification_type != "") {
            this.form.notification_type = responseData.notification_type;
          }

          // if(responseData.notification_title != null && responseData.notification_title != ""){
          //   this.form.notification_title = responseData.notification_title;
          // }
          // if(responseData.notification_description != null && responseData.notification_description != ""){
          //   this.form.notification_description = responseData.notification_description;
          // }
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
    async deleteAppNotification(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let index = this.tableData.data.findIndex((e) => e.id === id);
        const url = appNotification.appNotificationUrl + "/" + id;
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
    async checkData() {
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
        const url = appNotification.checkApp;
        let dataAppend = new FormData();
        dataAppend.append('engagement_name', this.form.engagement_name);
        dataAppend.append('scheduled_time', this.form.scheduled_time);
        dataAppend.append('notification_type', this.form.notification_type);

        // if(this.form.action_type == 'reading_material'){
        // dataAppend.append('action_type', "newsletter");
        // }else{
        dataAppend.append('action_type', this.form.action_type);
        // }
        dataAppend.append('action_id', this.form.action_id);

        dataAppend.append('content', this.form.content);
        dataAppend.append('image', this.image);
        dataAppend.append('device_type', this.form.device_type);
        dataAppend.append('notification_title', this.form.notification_title);
        dataAppend.append('notification_description', this.form.notification_description);
        dataAppend.append('send_to_medium', this.form.send_to_medium);
        dataAppend.append('csv_file', this.csv_file);
        dataAppend.append('mobile_numbers', this.form.mobile_numbers);
        dataAppend.append('data_filter_id', this.form.data_filter_id);

        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          const responseData = data.response;
          if (this.form.notification_type == 'whatsapp') {
            this.form.contentParams = responseData.contentParams;
            this.form.image = responseData.image;
          } else if (this.form.notification_type == 'app_notification') {
            this.form.notification_title = responseData.notification_title;
            this.form.notification_description = responseData.notification_description;
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
        this.$store.commit('loader/updateStatus', true);
        const url = appNotification.appNotificationUrl;
        let dataAppend = new FormData();
        dataAppend.append('engagement_name', this.form.engagement_name);
        dataAppend.append('scheduled_time', this.form.scheduled_time);
        dataAppend.append('notification_type', this.form.notification_type);
        dataAppend.append('send_to_medium', this.form.send_to_medium);
        dataAppend.append('data_filter_id', this.form.data_filter_id);
        dataAppend.append('csv_file', this.csv_file);
        dataAppend.append('mobile_numbers', this.form.mobile_numbers);
        dataAppend.append('notification_title', this.form.notification_title);
        dataAppend.append('notification_description', this.form.notification_description);
        // if(this.form.action_type == 'reading_material'){
        // dataAppend.append('action_type', "newsletter");
        // }else{
        dataAppend.append('action_type', this.form.action_type);
        // }
        dataAppend.append('action_id', this.form.action_id);
        dataAppend.append('content', this.form.content);
        dataAppend.append('image', this.image);
        dataAppend.append('device_type', this.form.device_type);
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit('toast/updateStatus', {
            status: true,
            icon: 'success',
            title: data.message
          })
        }
      } catch (err) {
        this.$store.commit('toast/updateStatus', {
          status: true,
          title: err.data ? err.data.message : 'Please try again!',
          icon: 'error'
        })
      }
      this.$store.commit('loader/updateStatus', false);
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
        this.$store.commit('loader/updateStatus', true);
        const url = appNotification.appNotificationUrl + '/' + id;
        let dataAppend = new FormData();
        dataAppend.append('engagement_name', this.form.engagement_name);
        dataAppend.append('scheduled_time', this.form.scheduled_time);
        dataAppend.append('notification_type', this.form.notification_type);
        dataAppend.append('send_to_medium', this.form.send_to_medium);
        dataAppend.append('data_filter_id', this.form.data_filter_id);
        dataAppend.append('csv_file', this.csv_file);
        dataAppend.append('mobile_numbers', this.form.mobile_numbers);
        // if(this.form.action_type == 'reading_material'){
        // dataAppend.append('action_type', "newsletter");
        // }else{
        dataAppend.append('action_type', this.form.action_type);
        // }
        dataAppend.append('action_id', this.form.action_id);
        dataAppend.append('content', this.form.content);
        dataAppend.append('image', this.image);
        dataAppend.append('device_type', this.form.device_type);
        dataAppend.append('notification_title', this.form.notification_title);
        dataAppend.append('notification_description', this.form.notification_description);
        dataAppend.append('_method', 'put');
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit('toast/updateStatus', {
            status: true,
            icon: 'success',
            title: data.message
          });
        }
      } catch (err) {
        this.$store.commit('toast/updateStatus', {
          status: true,
          icon: 'error',
          title: err.data ? err.data.message : 'Please try again!'
        })
      }
      this.$store.commit('loader/updateStatus', false);
    }
  },
  watch: {
    currentPage: {
      handler: function (value) {
        this.params = `page=${value}`;
        this.fetchData(value);
      },
    },
    "form.action_type"(v) {
      this.action_type = [];
      // this.form.action_id = null;
      this.fetchAttachment(v);
    },
    "form.all_selected"(v) {
      if (v == 1) {
        this.form.all_selected = true;
      } else {
        this.form.all_selected = false;
      }
    },
  },
  created() {
    this.setActionType();
    this.setSendToMedium();
    if (
      this.$route.name == "add-communication" ||
      this.$route.name == "edit-communication"
    ) {
      if (this.$route.name == "edit-communication") {
        this.fetchAppNotification(this.$route.params.id);
      }
      this.fetchDataFilter();
    } else {
      this.fetchData();
    }
  },
};