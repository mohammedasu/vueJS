<template>
  <div id="app">
    <router-view />
    <toast v-if="$store.state.toast.showToast"></toast>
    <loader v-if="$store.state.loader.showLoader"></loader>
  </div>
</template>

<script>
import appConfig from "@/app.config";
import toast from "./views/common/toast";
import loader from "./views/common/loader";
export default {
  name: "app",
  components: {
    toast,
    loader
  },
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === "function" ? title(this.$store) : title;
      return title ? `${title} | ${appConfig.title}` : appConfig.title;
    },
  },
};
</script>