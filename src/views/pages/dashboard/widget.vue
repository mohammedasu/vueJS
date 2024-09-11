<!-- <script>
export default {
  data() {
    return {
      dashboard: [
        {
          text: "Admin",
          action: "/admin",
          color: "background:linear-gradient(90deg, rgba(172,221,222,1) 35%, rgba(8,149,152,1) 100%);",
          icon: "ri-account-circle-line",
          can: "admin",
        },
        {
          text: "Ask Expert Management",
          action: "/ask-expert",
          color: "background:#acddde",
          icon: "fa fa-user",
          can: "ask-expert",
        },
        {
          text: "Expert Management",
          action: "/expert",
          color: "background:#e1f8dc",
          icon: "fa fa-chalkboard-teacher",
          can: "expert",
        },
        {
          text: "Partner Management",
          action: "/partner",
          color: "background:#fef8dd",
          icon: "fa fa-envelope",
          can: 'partner'
        },
        {
          text: "Podcast Management",
          action: "/podcast",
          color: "background:#ffe7c7",
          icon: "fa fa-podcast",
          can: 'podcast'
        },
        {
          text: "Page Management",
          action: "/page",
          color: "background:#f7d8ba",
          icon: "fa fa-file",
          can: 'page'
        },
        {
          text: "Country Management",
          action: "/country",
          color: "background:#d8e2dc",
          icon: "fa fa-globe",
          can: 'country'
        },
        {
          text: "CityState Management",
          action: "/cityState",
          color: "background:#fbfaf0",
          icon: "fa fa-globe",
          can: 'cityState'
        },
        {
          text: "Config Management",
          action: "/config",
          color: "background:#ffe9ee",
          icon: "fa fa-cogs",
          can: 'config'
        },
        {
          text: "Speciality Management",
          action: "/speciality",
          color: "background:#ffdde4",
          icon: "fa fa-stethoscope",
          can: 'speciality'
        },
        {
          text: "Community Management",
          action: "/community",
          color: "background:#b0d5d0",
          icon: "fa fa-chart-line",
          can: 'community'
        },
        {
          text: "Article Management",
          action: "/article",
          color: "background:#ddedea",
          icon: "fa fa-envelope",
          can: 'article'
        },
        {
          text: "Role Management",
          action: "/role",
          color: "background:#ffdee5",
          icon: "fa fa-chart-line",
          can: "role"
        },
        {
          text: "Case Management",
          action: "/case",
          color: "background:#e2b1cd",
          icon: "mdi mdi-comment",
          can: 'case'
        },
        {
          text: "Slider Management",
          action: "/slider",
          color: "background:#ff9aa2",
          icon: "fa fa-sliders-h",
          can: 'slider'
        },
        {
          text: "Email Notification",
          action: "/email-notification",
          color: "background:#ffb7b2",
          icon: "fa fa-mail-bulk",
          can: 'email-notification'
        },
        {
          text: "SMS Notification",
          action: "/sms-notification",
          color: "background:#e2f0cb",
          icon: "fa fa-comment",
          can: 'sms-notification'
        },
        {
          text: "Push Notification",
          action: "/push-notification",
          color: "background:#c7ceea",
          icon: "fa fa-bell",
          can: 'push-notification'
        },
        {
          text: "Page Notification",
          action: "/page-notification",
          color: "background:#e2f0cb",
          icon: "fa fa-pager",
          can: 'page-notification'
        },
        {
          text: "Series Management",
          action: "/series",
          color: "background:#e3e3ff",
          icon: "fa fa-chart-line",
          can: 'series'
        },
        {
          text: "Forum Management",
          action: "/forum",
          color: "background:#dff2fd",
          icon: "fa fa-chart-line",
          can: 'forum'
        },
        {
          text: "Master Notification",
          action: "/master-notification",
          color: "background:#fbfaf0",
          icon: "ri-mastercard-fill",
          can: 'master-notification'
        },
        {
          text: "App Notification",
          action: "/app-notification-engagement",
          color: "background:#fcfade",
          icon: "ri-app-store-fill",
          can: 'app-notification-engagement'
        },
        {
          text: "Video Management",
          action: "/video",
          color: "background:#ffdbdb",
          icon: "mdi mdi-video-box",
          can: 'video'
        },
      ],
    };
  },
};
</script>

<template>
  <div class="row mt-3">
    <template v-for="(data, index) in dashboard">
      <div class="col-md-3 mb-3" :key="index" v-can="data.can">
        <div class="card" 
        style="background: #fff;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)!important;
                border-radius: 0.75rem;">
          <div class="card-body p-3">
            <div class="">
              <router-link :to="data.action" class="text-dark d-flex justify-content-end">
                <b-button class="btn-sm" variant="outline-secondary"> View Details </b-button>
              </router-link>
            </div>
          </div>
          <div class="card-body border-top">
            <div class="media-body overflow-hidden">
              <div class="text-dark" style="font-size: 18px;font-weight: 700;">{{ data.text }}</div>
            </div>
            <div class="text-dark font-size-24 " :style="data.color"
              style="
              display: flex;
              align-items: center;
              justify-content: center;
              height: 64px;
              width: 64px;
              min-width: 48px;
              position: absolute;
              left: 15px;
              top: -20px;
              box-shadow: 0 4px 20px 0 rgba(0,0,0,.14),0 7px 10px -5px rgba(64,64,64,.4)!important;
              border-radius: 0.75rem;">
                <i style="color:#000;" :class="data.icon"></i>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template> -->

<script>
/**
 * Widget Component
 */
export default {
  data() {
    return {
      statData: [
        {
          title: "Videos",
          icon: "ri-stack-line",
          value: "281",
          subvalue: " +55% ",
          background: "background: darkmagenta",
          text: "than one week",
        },
        {
          title: "Today's User",
          icon: "ri-store-2-line",
          value: "2,300",
          subvalue: " +3% ",
          background: "background: darkslateblue",
          text: "than last week",
        },
        {
          title: "Engagement",
          icon: "ri-briefcase-4-line",
          value: "34k",
          subvalue: " +1% ",
          background: "background: deeppink",
          text: "than yesterday",
        },
        {
          title: "Time Spent:",
          icon: "ri-chat-follow-up-fill",
          value: "12 min 32 sec",
          subvalue: " 2.4% ",
          background: "background: orchid",
          text: "Just updated",
        },
      ],
    };
  },
};
</script>

<template>
  <div class="row mt-4">
    <div class="col-md-3" v-for="(data, index) in statData" :key="index">
      <div
        class="card"
        style="
          box-shadow: 0 4px 6px -1pxrgba (0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06) !important !important;
          border-radius: 0.75rem;
        "
      >
        <div class="card-body">
          <div class="media">
            <div class="media-body overflow-hidden">
              <h5 class="text-truncate font-size-14 mb-2">{{ data.title }}</h5>
              <h4 class="mb-0">{{ data.value }}</h4>
            </div>
            <div
              class="text-dark font-size-24"
              :style="data.background"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 64px;
                width: 64px;
                min-width: 48px;
                position: absolute;
                right: 15px;
                top: -20px;
                box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
                  0 7px 10px -5px rgba(64, 64, 64, 0.4) !important;
                border-radius: 0.75rem;
              "
            >
              <i style="color: #fff" :class="data.icon"></i>
            </div>
          </div>
        </div>

        <div class="card-body border-top py-3">
          <div class="text-truncate d-flex">
            <h6 class="text-success" style="font-weight: bold">
              <!-- <i class="mdi mdi-menu-up"></i> -->
              {{ data.subvalue }}
            </h6>
            <h6 class="text-muted ml-2">{{ data.text }}</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end row -->
</template>
