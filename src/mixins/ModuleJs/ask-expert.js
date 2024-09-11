import {
  askExpert
} from "../../js/path";

export default {
  data() {
    return {
      fields: [{
          key: "ref_no",
          label: "Reference No.",
          sortable: true
        },
        {
          key: "details",
          sortable: true
        },
        {
          key: "expert.name",
          label: "Expert Name",
          sortable: true
        },
        {
          key: "member",
          label: "Member Name",
          sortable: true
        },
        {
          key: "case_status",
          label: "Case Status",
          sortable: true
        },
        {
          key: "is_active",
          label: "Active Status",
          sortable: true
        },
        
      ],
      case_status: null,
      filter: null,
      filterOn: [],
      sortBy: "ref_no",
      sortDesc: true,
      statusUpdate: "",
      currentPage: 1,
      tableData: [],
      key: 0,
    };
  },
  methods: {
    // search() {
    //   if (this.filter.length > 1)
    //     this.fetchData('search');
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
        let url = askExpert.fetchAskExpert;
        if (pagination == 'search') {
          url = askExpert.fetchAskExpert + '?search=' + this.filter;
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
    async updateStatus(e, ref_no) {
      this.$store.commit("loader/updateStatus", true);
      try {
        const url = askExpert.statusUpdate;
        const data = await this.postRequest(url, {
          refno: ref_no,
          status: e.target.value,
        });
        if (data.status) {
          const responseData = data.response;
          let index = this.tableData.data.findIndex(
            (item) => item.ref_no == responseData.ref_no
          );
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
  },
  watch: {
    tableData(v) {
      if (v) {
        return (this.tableData = v);
      }
    },
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