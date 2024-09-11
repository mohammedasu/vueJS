<template>
  <section></section>
</template>

<script>
import Swal from "sweetalert2";

export default {
  created() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
    Toast.fire({
      icon: this.$store.state.toast.icon,
      title: this.$store.state.toast.title,
    });
    setTimeout(this.changeToastState(), 3000);
  },
  methods: {
    changeToastState() {
      this.$store.commit("toast/updateStatus", {
        status: false,
        icon: null,
        title: null,
      });
    },
  },
};
</script>