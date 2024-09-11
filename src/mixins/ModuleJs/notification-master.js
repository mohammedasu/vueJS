import {
	notification_master,
	notification
} from "../../js/path";

export default {
	data() {
		return {
			table_header: [],
			form: {
				event_name: "",
				email_template_ref_no: null,
				sms_template_ref_no: null,
				push_notification_template_ref_no: null,
				page_notification_template_ref_no: null,
			},
			page: [],
			push: [],
			sms: [],
			email: [],
			fields: [{
					key: "notification_master_ref_no",
					label: "Reference No.",
				},
				{
					key: "event_name",
					label: "Event Name",
				},
				{
					key: "email_template_name",
					label: "Email Template Name",
				},
				{
					key: "sms_template_name",
					label: "SMS Template Name",
				},
				{
					key: "push_template_name",
					label: "Push Template Name",
				},
				{
					key: "page_template_name",
					label: "Page Template Name",
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
			tableData: [],
			sortBy: "notification_master_ref_no",
			sortDesc: true,
			filter: null,
			filterOn: [],
			params: "",
			currentPage: 1,
			activeTab: "all",
			key: 0,
		};
	},
	methods: {
		search() {
			if (this.filter.length > 1)
				this.fetchData("search");
			else if (this.filter.length == 0)
				this.fetchData('search');
		},
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length;
			this.currentPage = 1;
		},
		async fetchData(txt) {
			let url = null;
			if (txt == "active") {
				this.activeTab = txt;
				url = notification_master.notificationMasterUrl + "?filter=" + txt;
			} else if (txt == "trash") {
				this.activeTab = txt;
				url = notification_master.notificationMasterUrl + "?filter=" + txt;
			} else if (txt == "search") {
				this.activeTab = txt;
				url = notification_master.notificationMasterUrl + "?search=" + this.filter;
			} else {
				this.activeTab = txt;
				url = notification_master.notificationMasterUrl + "?";
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
		async updateStatus(notification_master_ref_no) {
			this.$store.commit("loader/updateStatus", true);
			try {
				let index = this.tableData.data.findIndex(
					(e) => e.notification_master_ref_no === notification_master_ref_no
				);
				const url = notification_master.statusUpdate;
				const data = await this.postRequest(url, {
					is_active: !this.tableData.data[index].is_active,
					notification_master_ref_no: notification_master_ref_no,
				});
				if (data.status) {
					this.tableData.data[index].is_active = !this.tableData.data[index].is_active;
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
		async fetchNotificationMaster(notification_master_ref_no) {
			this.$store.commit("loader/updateStatus", true);
			try {
				let url =
					notification_master.notificationMasterUrl +
					"/" +
					notification_master_ref_no;
				const data = await this.getRequest(url);
				if (data.status) {
					const responseData = data.response;
					this.form.event_name = responseData.event_name;
					this.form.email_template_ref_no = responseData.email_template_ref_no;
					this.form.sms_template_ref_no = responseData.sms_template_ref_no;
					this.form.push_notification_template_ref_no =
						responseData.push_notification_template_ref_no;
					this.form.page_notification_template_ref_no =
						responseData.page_notification_template_ref_no;
				}
			} catch (err) {
				this.$store.commit("toast/updateStatus", {
					status: true,
					icon: "error",
					title: err.data ? err.data.message : "Fetching error!",
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
				const url = notification_master.notificationMasterUrl;
				const data = await this.postRequest(url, this.form);
				if (data.status) {
					this.$store.commit("toast/updateStatus", {
						status: true,
						icon: "success",
						title: data.message,
					});
					this.$router.push("/master-notification");
				}
			} catch (err) {
				this.$store.commit("toast/updateStatus", {
					status: true,
					icon: "error",
					title: err.data ? err.data.message : "Fetching error!",
				});
			}
			this.$store.commit("loader/updateStatus", false);
		},
		async updateData(notification_master_ref_no) {
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
				const url =
					notification_master.notificationMasterUrl +
					"/" +
					notification_master_ref_no;
				const data = await this.putRequest(url, this.form);
				if (data.status) {
					this.$store.commit("toast/updateStatus", {
						status: true,
						icon: "success",
						title: data.message,
					});
					this.$router.push("/master-notification");
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
		async deleteNotificationMaster(notification_master_ref_no) {
			this.$store.commit("loader/updateStatus", true);
			try {
				let index = this.tableData.data.findIndex(
					(e) => e.notification_master_ref_no === notification_master_ref_no
				);
				const url =
					notification_master.notificationMasterUrl +
					"/" +
					notification_master_ref_no;
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
					title: err.data ? err.data.message : "Fetching error!",
				});
			}
			this.$store.commit("loader/updateStatus", false);
		},
		async restoreNotificationMaster(notification_master_ref_no) {
			this.$store.commit("loader/updateStatus", true);
			try {
				let index = this.tableData.data.findIndex(
					(e) => e.notification_master_ref_no === notification_master_ref_no
				);
				const url =
					notification_master.restoreNotificationMaster +
					"/" +
					notification_master_ref_no;
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
					title: err.data ? err.data.message : "Fetching error!",
				});
			}
			this.$store.commit("loader/updateStatus", false);
		},
		async fetchSMS() {
			const url = notification.fetchSMS;
			const data = await this.getRequest(url);
			if (data.status) {
				const responseData = data.response.data;
				this.sms = responseData;
			}
		},
		async fetchPage() {
			const url = notification.fetchPage;
			const data = await this.getRequest(url);
			if (data.status) {
				const responseData = data.response.data;
				this.page = responseData;
			}
		},
		async fetchPush() {
			const url = notification.fetchPush;
			const data = await this.getRequest(url);
			if (data.status) {
				const responseData = data.response.data;
				this.push = responseData;
			}
		},
		async fetchMail() {
			const url = notification.fetchEmail;
			const data = await this.getRequest(url);
			if (data.status) {
				const responseData = data.response.data;
				this.email = responseData;
			}
		},
		tabActive() {
			if (this.activeTab == "trash") {
				if (!this.can("restore-master-notification")) {
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
							key: "delete"
						});
					}
				}
				let index = this.fields.findIndex((item) => item.key == "edit");
				this.fields.splice(index, 1);
				let table_index = this.table_header.findIndex((item) => item == "edit");
				this.table_header.splice(table_index, 1);
			} else {
				if (!this.can("delete-master-notification")) {
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
							key: "delete"
						});
					}
				}
				if (!this.table_header.includes("edit")) {
					this.table_header.push("edit");
					this.fields[7] = {
						key: "edit"
					};
					this.fields[8] = {
						key: "delete"
					};
				}
			}
		},
	},
	watch: {
		currentPage: {
			handler: function (value) {
				this.params = `&page=${value}`;
				this.fetchData(this.activeTab);
			},
		},
		activeTab(v) {
			if (v) this.tabActive();
		},
	},
	created() {
		if (
			this.$route.name == "add-master-notification" ||
			this.$route.name == "edit-master-notification"
		) {
			this.fetchMail();
			this.fetchPage();
			this.fetchPush();
			this.fetchSMS();
			if (this.$route.name == "edit-master-notification") {
				this.fetchNotificationMaster(
					this.$route.params.notification_master_ref_no
				);
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