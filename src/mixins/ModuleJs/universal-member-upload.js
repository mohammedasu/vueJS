import {
    universal_member_upload
  } from "../../js/path";
  
  export default {
    data() {
      return {
        fields: [{
            key: "upload_file",
            label: "File Name",
            sortable: true
          },
          {
            key: "rows_completed",
            label: "Rows Updated from file",
            sortable: true
          },
        //   {
        //     key: "log_file",
        //     label: "Download LogFile",
        //     sortable: true
        //   },
          {
            key: "status",
            label: "Status",
            sortable: true
          },
          
        ],
        filter: null,
        filterOn: [],
        sortBy: "",
        sortDesc: true,
        statusUpdate: "",
        currentPage: 1,
        tableData: [],
        key: 0,
      };
    },
    methods: {
      search() {
        if (this.filter.length > 1)
          this.fetchData('search');
        else if (this.filter.length == 0)
          this.fetchData('search');
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      async fetchData(pagination = null) {
        this.$store.commit("loader/updateStatus", true);
        try {
          let url = universal_member_upload.fetchUniversalMember;
          if (pagination == 'search') {
            url = universal_member_upload.fetchUniversalMember + '?search=' + this.filter;
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
      async fetchExcel() {
        this.$store.commit("loader/updateStatus", true);
        try {
          const url = universal_member_upload.fetchUniversalMember;
          let dataAppend = new FormData();
          dataAppend.append("excel", this.$refs.file.files[0]);
          const data = await this.postRequest(url, dataAppend);
          if (data.status) {
            this.tableData.data.unshift(data.response);
            this.$store.commit("toast/updateStatus", {
              status: true,
              icon: "success",
              title: "File added successfully",
            });
            this.$refs.file.reset();
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