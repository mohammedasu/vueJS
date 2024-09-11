import axios from "axios";

export default {
  methods: {
    async postRequest(url, formData, config = {}) {
      return new Promise((resolve) => {
        axios
          .post(url, formData, config)
          .then((response) => {
            let responseData = response.data;
            resolve(responseData);
          })
          .catch((err) => {
            // let title = "Please try again later";

            const errData = err.response;
            // if (typeof errData.data.message != "undefined") {
            //   title = errData.data.message;
            // }
            
            if (typeof errData != "undefined") {
              if (errData.status == "401") {
                localStorage.removeItem("token");
                this.$bvToast.toast(errData.data.message, {
                  title: errData.data.message,
                  variant: "danger",
                  solid: true,
                });
                if (this.$route.name != "login") {
                  this.$router.push({ name: "login" });
                }
              } else if (errData.status == "422") {
                let err = errData.data.response;
                if(!errData.data.response) {
                  err = JSON.parse(errData.data.message);
                }
                for (let [key, value] of Object.entries(
                  err
                )) {
                  key = "Error !";
                  this.$bvToast.toast(value, {
                    title: key,
                    variant: "danger",
                    solid: true,
                  });
                }
              } else {
                this.$store.commit("toast/updateStatus", {
                  status: true,
                  icon: "error",
                  title: errData.data.message.substring(0, 300),
                });
              }
            } else {
              this.$store.commit("toast/updateStatus", {
                status: true,
                icon: "error",
                title: errData.data.message,
              });
            }
            this.$store.commit('loader/updateStatus', false);
            // reject(errData);
          });
      });
    },
    async putRequest(url, formData) {
      return new Promise((resolve, reject) => {
        axios
          .put(url, formData)
          .then((response) => {
            let responseData = response.data;
            resolve(responseData);
          })
          .catch((err) => {
            const errData = err.response;

            // let title = "Please try again later";
            // if (typeof errData.data.message != "undefined") {
            //   title = errData.data.message;
            // }

            if (errData.status == "401") {
              localStorage.removeItem("token");
              if (this.$route.name != "login") {
                this.$router.push({ name: "login" });
              }
            }
            if (errData.status == "422") {
              for (let [key, value] of Object.entries(errData.data.response)) {
                key = "Error !";
                this.$bvToast.toast(value, {
                  title: key,
                  variant: "danger",
                  solid: true,
                });
              }
            } else {
              this.$store.commit("toast/updateStatus", {
                status: true,
                icon: "error",
                title: errData.data.message,
              });
            }
            reject(errData);
          });
      });
    },

    async getRequest(url) {
      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then((response) => {
            const responseData = response.data;
            resolve(responseData);
          })
          .catch((err) => {
            const errData = err.response;
            if (errData.status == "401") {
              localStorage.removeItem("token");
              if (this.$route.name != "login") {
                this.$router.push({ name: "login" });
              }
            }
            reject(errData);
            /* if (errData) {
                            if (errData.status == "422") {
                                errData.data.data.map((message) => {
                                    this.$toast.error(message);
                                });
                            } else {
                                this.$toast.error(errData.data.message);
                            }
                        } */
          });
      });
    },
  },
};
