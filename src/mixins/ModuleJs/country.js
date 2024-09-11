import {
  country
} from "../../js/path";

export default {
  data() {
    return {
      fields: [{
          key: "id",
          label: "ID",
          sortable: true,
        },
        {
          key: "sortname",
        },
        {
          key: "name",
        },
        {
          key: "phonecode",
        },
        {
          key: "edit",
        },
      ],
      form: {
        name: "",
        sortname: "",
        phonecode: "",
        flag: null,
      },
      tableData: [],
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: true,
      key: 0,
      currentPage: 1,
      params: "",
    };
  },
  methods: {
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
        let url = country.countryUrl;
        if (pagination == "search") {
          url = country.countryUrl + "?search=" + this.filter;
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
    async fetchCountry(id) {
      this.$store.commit("loader/updateStatus", true);
      try {
        let url = country.countryUrl + "/" + id;
        const data = await this.getRequest(url);
        if (data.status) {
          const responseData = data.response;

          if(responseData.name != "" && responseData.name != null){
            this.form.name = responseData.name;
          }

          if(responseData.sortname != "" && responseData.sortname != null) {
            this.form.sortname = responseData.sortname;
          }

          if(responseData.phonecode != "" && responseData != null){
            this.form.phonecode = responseData.phonecode;
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
        const url = country.countryUrl + "/" + id;
        let dataAppend = new FormData();
        dataAppend.append('name', this.form.name);
        dataAppend.append('sortname', this.form.sortname);
        dataAppend.append('phonecode', this.form.phonecode);
        dataAppend.append('_method', 'put');
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/country");
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
        this.$store.commit("loader/updateStatus", true);
        const url = country.countryUrl;
        let dataAppend = new FormData();
        dataAppend.append('name', this.form.name);
        dataAppend.append('sortname', this.form.sortname);
        dataAppend.append('phonecode', this.form.phonecode);
        const data = await this.postRequest(url, dataAppend);
        if (data.status) {
          this.$store.commit("toast/updateStatus", {
            status: true,
            icon: "success",
            title: data.message,
          });
          this.$router.push("/country");
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
  created() {
    if (
      this.$route.name == "add-country" ||
      this.$route.name == "edit-country"
    ) {
      if (this.$route.name == "edit-country") {
        this.fetchCountry(this.$route.params.id);
      }
    } else {
      this.fetchData();
    }
  },
};