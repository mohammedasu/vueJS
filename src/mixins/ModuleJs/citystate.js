import {
  cityState
} from "../../js/path";

export default {
  data() {
    return {
      fields: [{
          key: "id",
          label: 'ID',
          sortable: true,
        },
        {
          key: "country",
        },
        {
          key: "state",
        },
        {
          key: "city",
        },
        {
          key: "tier",
        },
        {
          key: "metro_type",
          label: "Metro Type",
        },
        {
          key: "class",
        },
        {
          key: "zone",
        },
      ],
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
    //   if (this.filter.length > 1) {
    //     this.fetchData('search');
    //   } else if (this.filter.length == 0) {
    //     this.fetchData('search');
    //   }
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
        let url = cityState.fetchCityState;
        if (pagination == 'search') {
          url = cityState.fetchCityState + '?search=' + this.filter;
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
  },
  watch: {
    currentPage: {
      handler: function (value) {
        if (value) {
          this.params = `&page=${value}`;
          this.fetchData(value);
        }
      },
    },
  },
  created() {
    this.fetchData();
  },
};