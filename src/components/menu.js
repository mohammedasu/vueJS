export const menuItems = [
  {
    id: 1,
    label: "Admin",
    isTitle: true,
  },
  {
    id: 2,
    label: "Dashboard",
    icon: "fa fa-tachometer-alt",
    link: "/dashboard",
    can: "dashboard",
  },
  {
    id: 3,
    label: "Admin User",
    icon: "ri-account-circle-line",
    link: "/admin",
    can: "admin-user",
  },
  {
    id: 30,
    label: "Components",
    isTitle: true,
  },
  {
    id: 4,
    label: "Forum",
    link: "/forum",
    can: "forum",
    icon: "mdi mdi-forum",
  },
  {
    id: 5,
    label: "Ask Expert",
    icon: "fa fa-user",
    link: "/ask-expert",
    can: "ask-expert",
  },
  {
    id: 6,
    label: "Expert",
    icon: "fa fa-chalkboard-teacher",
    link: "/expert",
    can: "expert",
  },
  {
    id: 7,
    label: "Partner",
    icon: "fa fa-envelope",
    link: "/partner",
    can: "partner",
  },
  {
    id: 8,
    label: "Config",
    icon: "fa fa-cogs",
    link: "/config",
    can: "config",
  },
  {
    id: 9,
    label: "Role",
    icon: "fa fa-chart-line",
    link: "/role",
    can: "role",
  },

  {
    id: 10,
    label: "Slider",
    icon: "fa fa-sliders-h",
    link: "/slider",
    can: "slider",
  },
  // {
  //   id: 11,
  //   label: "Templates",
  //   icon: "ri-notification-2-fill",
  //   can: checkPermissions([
  //     "email-notification",
  //     "sms-notification",
  //     "push-notification",
  //     "page-notification",
  //     "master-notification",
  //   ]),
  //   subItems: [
  //     {
  //       id: 12,
  //       label: "Email",
  //       link: "/email-notification",
  //       can: "email-notification",
  //       icon: "fa fa-mail-bulk",
  //     },
  //     {
  //       id: 13,
  //       label: "SMS",
  //       link: "/sms-notification",
  //       can: "sms-notification",
  //       icon: "fa fa-comment",
  //     },
  //     {
  //       id: 14,
  //       label: "Push",
  //       link: "/push-notification",
  //       can: "push-notification",
  //       icon: "fa fa-bell",
  //     },
  //     {
  //       id: 15,
  //       label: "Page",
  //       link: "/page-notification",
  //       can: "page-notification",
  //       icon: "fa fa-pager",
  //     },
  //     {
  //       id: 16,
  //       label: "Master",
  //       link: "/master-notification",
  //       can: "master-notification",
  //       icon: "ri-mastercard-fill",
  //     },
  //     // {
  //     //   id: 17,
  //     //   label: "Certificate",
  //     //   link: "/certificate",
  //     //   can: "certificate",
  //     //   icon: "mdi mdi-certificate",
  //     // },
  //   ],
  // },
  {
    id: 18,
    label: "General",
    icon: "fa fa-chart-line",
    can: checkPermissions([
      "page",
      "country",
      "cityState",
      "speciality",
      "community",
    ]),
    subItems: [
      {
        id: 19,
        label: "Page",
        icon: "fa fa-file",
        link: "/page",
        can: "page",
      },
      {
        id: 20,
        label: "Country",
        icon: "fa fa-globe",
        link: "/country",
        can: "country",
      },
      {
        id: 21,
        label: "CityState",
        icon: "fa fa-globe",
        link: "/cityState",
        can: "cityState",
      },
      {
        id: 22,
        label: "Speciality",
        icon: "fa fa-stethoscope",
        link: "/speciality",
        can: "speciality",
      },
      {
        id: 23,
        label: "Community",
        icon: "ri-community-fill",
        link: "/community",
        can: "community",
      },
    ],
  },
  {
    id: 24,
    label: "Content",
    icon: "mdi mdi-content-copy",
    can: checkPermissions(["cme","video", "case", "article", "series", "podcast", "question-bank","newsletter"]),
    subItems: [
      {
        id: 25,
        label: "CME",
        link: "/cme",
        can: "cme",
        icon: "mdi mdi-file-multiple",
      },
      {
        id: 26,
        label: "Video",
        link: "/video",
        can: "video",
        icon: "mdi mdi-video-box",
      },
      {
        id: 27,
        label: "Case",
        icon: "mdi mdi-comment",
        link: "/case",
        can: "case",
      },
      {
        id: 28,
        label: "Article",
        icon: "fa fa-envelope",
        link: "/article",
        can: "article",
      },
      {
        id: 29,
        label: "Series",
        link: "/series",
        can: "series",
        icon: "mdi mdi-serial-port",
      },
      {
        id: 30,
        label: "Podcast",
        icon: "fa fa-podcast",
        link: "/podcast",
        can: "podcast",
      },
      {
        id: 32,
        label: "Question Bank",
        link: "/question-bank",
        can: "question-bank",
        icon: "mdi mdi-comment-question-outline",
      },
      {
        id: 33,
        label: "Newsletter",
        link: "/newsletter",
        can: "newsletter",
        icon: "mdi mdi-email-newsletter",
      },
    ],
  },
  {
    id: 34,
    label: "Communication",
    can: checkPermissions(["communication"]),
    icon: "mdi mdi-phone-in-talk",
    subItems: [
      // {
      //   id: 35,
      //   label: "Whatsapp",
      //   link: "/whatsapp-engagement",
      //   can: "whatsapp",
      //   icon: "ri-whatsapp-fill",
      // },
      {
        id: 36,
        label: "Notification",
        link: "/communication",
        can: "communication",
        icon: "ri-app-store-fill",
      },
    ],
  },
  {
    id: 37,
    label: 'Data Filters',
    link: '/dataFilters',
    can: 'dataFilters',
    icon: 'mdi mdi-filter'
  },
  {
    id: 38,
    label: 'Universal Member',
    link: '/universal-member-upload',
    can: 'universal-member-upload',
    icon: 'mdi mdi-filter'
  },

  // {
  //   id: 38,
  //   label: "Registration",
  //   link: "/registration",
  //   can: "registration",
  //   icon: "mdi mdi-cash-register",
  // },
];

export function checkPermissions(array) {
  // let array = permissions;
  var CryptoJS = require("crypto-js");
  let element = "";
  const permissions = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).permissions;
  for (let index = 0; index < array.length; index++) {
    if (permissions.includes(array[index])) {
      element = array[index];
    }
  }  
  return element;
}

