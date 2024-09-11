export default [
  {
    path: "/",
    name: "login",
    meta: {
      guest: true,
    },
    component: () => import("../views/pages/account/login"),
  },
  {
    path: "/admin",
    name: "admin",
    meta: {
      authRequired: true,
      permission: "admin-user",
    },
    component: () => import("../views/pages/admin-user/index"),
  },
  {
    path: "/admin/add-admin",
    name: "add-admin",
    meta: {
      authRequired: true,
      permission: "add-admin-user",
    },
    component: () => import("../views/pages/admin-user/addAdmin"),
  },
  {
    path: "/admin/edit-admin/:id",
    name: "edit-admin",
    meta: {
      authRequired: true,
      permission: "edit-admin-user",
    },
    component: () => import("../views/pages/admin-user/addAdmin"),
  },
  {
    path: "/logout",
    name: "logout",
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/ask-expert",
    name: "ask-expert",
    meta: {
      authRequired: true,
      permission: "ask-expert",
    },
    component: () => import("../views/pages/ask-expert/index"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    meta: {
      authRequired: true,
      permission: "dashboard",
    },
    component: () => import("../views/pages/dashboard/index"),
  },
  {
    path: "/expert",
    name: "expert",
    meta: {
      authRequired: true,
      permission: "expert",
    },
    component: () => import("../views/pages/expert/index"),
  },
  {
    path: "/expert/add-expert",
    name: "add-expert",
    meta: {
      authRequired: true,
      permission: "add-expert",
    },
    component: () => import("../views/pages/expert/addExpert"),
  },
  {
    path: "/expert/edit-expert/:id",
    name: "edit-expert",
    meta: {
      authRequired: true,
      permission: "edit-expert",
    },
    component: () => import("../views/pages/expert/addExpert"),
  },
  {
    path: "/partner",
    name: "partner",
    meta: {
      authRequired: true,
      permission: "partner",
    },
    component: () => import("../views/pages/partner/index"),
  },
  {
    path: "/partner/add-partner",
    name: "add-partner",
    meta: {
      authRequired: true,
      permission: "add-partner",
    },
    component: () => import("../views/pages/partner/addPartner"),
  },
  {
    path: "/partner/edit-partner/:id",
    name: "edit-partner",
    meta: {
      authRequired: true,
      permission: "edit-partner",
    },
    component: () => import("../views/pages/partner/addPartner"),
  },
  {
    path: "/podcast",
    name: "podcast-management",
    meta: {
      authRequired: true,
      permission: "podcast",
    },
    component: () => import("../views/pages/podcast/index"),
  },
  {
    path: "/podcast/add-podcast",
    name: "add-podcast",
    meta: {
      authRequired: true,
      permission: "add-podcast",
    },
    component: () => import("../views/pages/podcast/addPodcast"),
  },
  {
    path: "/podcast/edit-podcast/:id",
    name: "edit-podcast",
    meta: {
      authRequired: true,
      permission: "edit-podcast",
    },
    component: () => import("../views/pages/podcast/addPodcast"),
  },
  {
    path: "/page",
    name: "page-management",
    meta: {
      authRequired: true,
      permission: "page",
    },
    component: () => import("../views/pages/page/index"),
  },
  {
    path: "/page/edit-page/:id",
    name: "edit-page",
    meta: {
      authRequired: true,
      permission: "edit-page",
    },
    component: () => import("../views/pages/page/addPage"),
  },
  {
    path: "/country",
    name: "country",
    meta: {
      authRequired: true,
      permission: "country",
    },
    component: () => import("../views/pages/country/index"),
  },
  {
    path: "/country/add-country",
    name: "add-country",
    meta: {
      authRequired: true,
      permission: "add-country",
    },
    component: () => import("../views/pages/country/addCountry"),
  },
  {
    path: "/country/edit-country/:id",
    name: "edit-country",
    meta: {
      authRequired: true,
      permission: "edit-country",
    },
    component: () => import("../views/pages/country/addCountry"),
  },
  {
    path: "/cityState",
    name: "city-state",
    meta: {
      authRequired: true,
      permission: "cityState",
    },
    component: () => import("../views/pages/cityState/index"),
  },
  {
    path: "/config",
    name: "config",
    meta: {
      authRequired: true,
      permission: "config",
    },
    component: () => import("../views/pages/config/index"),
  },
  {
    path: "/config/add-config",
    name: "add-config",
    meta: {
      authRequired: true,
      permission: "add-config",
    },
    component: () => import("../views/pages/config/addConfig"),
  },
  {
    path: "/config/edit-config/:id",
    name: "edit-config",
    meta: {
      authRequired: true,
      permission: "edit-config",
    },
    component: () => import("../views/pages/config/addConfig"),
  },
  {
    path: "/speciality",
    name: "speciality",
    meta: {
      authRequired: true,
      permission: "speciality",
    },
    component: () => import("../views/pages/speciality/index"),
  },
  {
    path: "/speciality/add-speciality",
    name: "add-speciality",
    meta: {
      authRequired: true,
      permission: "add-speciality",
    },
    component: () => import("../views/pages/speciality/addSpeciality"),
  },
  {
    path: "/speciality/edit-speciality/:id",
    name: "edit-speciality",
    meta: {
      authRequired: true,
      permission: "edit-speciality",
    },
    component: () => import("../views/pages/speciality/addSpeciality"),
  },
  {
    path: "/community",
    name: "community",
    meta: {
      authRequired: true,
      permission: "community",
    },
    component: () => import("../views/pages/community/index"),
  },
  {
    path: "/community/add-community",
    name: "add-community",
    meta: {
      authRequired: true,
      permission: "add-community",
    },
    component: () => import("../views/pages/community/addCommunity"),
  },
  {
    path: "/community/edit-community/:id",
    name: "edit-community",
    meta: {
      authRequired: true,
      permission: "edit-community",
    },
    component: () => import("../views/pages/community/addCommunity"),
  },
  {
    path: "/article",
    name: "article",
    meta: {
      authRequired: true,
      permission: "article",
    },
    component: () => import("../views/pages/article/index"),
  },
  {
    path: "/article/add-article",
    name: "add-article",
    meta: {
      authRequired: true,
      permission: "add-article",
    },
    component: () => import("../views/pages/article/addArticle"),
  },
  {
    path: "/article/edit-article/:id",
    name: "edit-article",
    meta: {
      authRequired: true,
      permission: "edit-article",
    },
    component: () => import("../views/pages/article/addArticle"),
  },
  {
    path: "/permission-denied",
    name: "permission-denied",
    meta: {
      guest: true,
    },
    component: () => import("../views/pages/utility/error-403"),
  },
  {
    path: "/role",
    name: "role",
    meta: {
      authRequired: true,
      permission: "role",
    },
    component: () => import("../views/pages/role/index"),
  },
  {
    path: "/role/add-role",
    name: "add-role",
    meta: {
      authRequired: true,
      permission: "add-role",
    },
    component: () => import("../views/pages/role/addRole"),
  },
  {
    path: "/role/edit-role/:id",
    name: "edit-role",
    meta: {
      authRequired: true,
      permission: "edit-role",
    },
    component: () => import("../views/pages/role/addRole"),
  },
  {
    path: "/case",
    name: "case",
    meta: {
      authRequired: true,
      permission: "case",
    },
    component: () => import("../views/pages/case/index"),
  },
  {
    path: "/case/add-case",
    name: "add-case",
    meta: {
      authRequired: true,
      permission: "add-case",
    },
    component: () => import("../views/pages/case/addCase"),
  },
  {
    path: "/case/edit-case/:id",
    name: "edit-case",
    meta: {
      authRequired: true,
      permission: "edit-case",
    },
    component: () => import("../views/pages/case/addCase"),
  },
  {
    path: "/case-question-mcq/:id",
    name: "case-question-mcq",
    meta: {
      authRequired: true,
      permission: "case-question-mcq",
    },
    component: () => import("../views/pages/case/caseQuestionMCQ"),
  },
  {
    path: "/case-question-comment/:id",
    name: "case-question-comment",
    meta: {
      authRequired: true,
      permission: "case-question-comment",
    },
    component: () => import("../views/pages/case/caseQuestionComment"),
  },
  {
    path: "/slider",
    name: "slider",
    meta: {
      authRequired: true,
      permission: "slider",
    },
    component: () => import("../views/pages/slider/index"),
  },
  {
    path: "/slider/add-slider",
    name: "add-slider",
    meta: {
      authRequired: true,
      permission: "add-slider",
    },
    component: () => import("../views/pages/slider/addSlider"),
  },
  {
    path: "/slider/edit-slider/:id",
    name: "edit-slider",
    meta: {
      authRequired: true,
      permission: "edit-slider",
    },
    component: () => import("../views/pages/slider/addSlider"),
  },
  {
    path: "/email-notification",
    name: "email-notification",
    meta: {
      authRequired: true,
      permission: "email-notification",
    },
    component: () => import("../views/pages/notification/email/index"),
  },
  {
    path: "/email-notification/add-email-notification",
    name: "add-email-notification",
    meta: {
      authRequired: true,
      permission: "add-email-notification",
    },
    component: () => import("../views/pages/notification/email/addEmail"),
  },
  {
    path: "/email-notification/edit-email-notification/:template_ref_no",
    name: "edit-email-notification",
    meta: {
      authRequired: true,
      permission: "edit-email-notification",
    },
    component: () => import("../views/pages/notification/email/addEmail"),
  },
  {
    path: "/sms-notification",
    name: "sms-notification",
    meta: {
      authRequired: true,
      permission: "sms-notification",
    },
    component: () => import("../views/pages/notification/sms/index"),
  },
  {
    path: "/sms-notification/add-sms-notification",
    name: "add-sms-notification",
    meta: {
      authRequired: true,
      permission: "add-sms-notification",
    },
    component: () => import("../views/pages/notification/sms/addSMS"),
  },
  {
    path: "/sms-notification/edit-sms-notification/:template_ref_no",
    name: "edit-sms-notification",
    meta: {
      authRequired: true,
      permission: "edit-sms-notification",
    },
    component: () => import("../views/pages/notification/sms/addSMS"),
  },
  {
    path: "/push-notification",
    name: "push-notification",
    meta: {
      authRequired: true,
      permission: "push-notification",
    },
    component: () => import("../views/pages/notification/push/index"),
  },
  {
    path: "/push-notification/add-push-notification",
    name: "add-push-notification",
    meta: {
      authRequired: true,
      permission: "add-push-notification",
    },
    component: () => import("../views/pages/notification/push/addPush"),
  },
  {
    path: "/push-notification/edit-push-notification/:template_ref_no",
    name: "edit-push-notification",
    meta: {
      authRequired: true,
      permission: "edit-push-notification",
    },
    component: () => import("../views/pages/notification/push/addPush"),
  },
  {
    path: "/page-notification",
    name: "page-notification",
    meta: {
      authRequired: true,
      permission: "page-notification",
    },
    component: () => import("../views/pages/notification/page/index"),
  },
  {
    path: "/page-notification/add-page-notification",
    name: "add-page-notification",
    meta: {
      authRequired: true,
      permission: "add-page-notification",
    },
    component: () => import("../views/pages/notification/page/addPage"),
  },
  {
    path: "/page-notification/edit-page-notification/:template_ref_no",
    name: "edit-page-notification",
    meta: {
      authRequired: true,
      permission: "edit-page-notification",
    },
    component: () => import("../views/pages/notification/page/addPage"),
  },
  {
    path: "/series",
    name: "series",
    meta: {
      authRequired: true,
      permission: "series",
    },
    component: () => import("../views/pages/series/index"),
  },
  {
    path: "/series/add-series",
    name: "add-series",
    meta: {
      authRequired: true,
      permission: "add-series",
    },
    component: () => import("../views/pages/series/addSeries"),
  },
  {
    path: "/series/edit-series/:id",
    name: "edit-series",
    meta: {
      authRequired: true,
      permission: "edit-series",
    },
    component: () => import("../views/pages/series/addSeries"),
  },
  {
    path: "/master-notification",
    name: "master-notification",
    meta: {
      authRequired: true,
      permission: "master-notification",
    },
    component: () => import("../views/pages/notification-master/index"),
  },
  {
    path: "/master-notification/add-master-notification",
    name: "add-master-notification",
    meta: {
      authRequired: true,
      permission: "add-master-notification",
    },
    component: () =>
      import("../views/pages/notification-master/addNotificationMaster"),
  },
  {
    path: "/master-notification/edit-master-notification/:notification_master_ref_no",
    name: "edit-master-notification",
    meta: {
      authRequired: true,
      permission: "edit-master-notification",
    },
    component: () =>
      import("../views/pages/notification-master/addNotificationMaster"),
  },
  {
    path: "/forum",
    name: "forum",
    meta: {
      authRequired: true,
      permission: "forum",
    },
    component: () => import("../views/pages/forum/index"),
  },
  {
    path: "/forum/add-forum",
    name: "add-forum",
    meta: {
      authRequired: true,
      permission: "add-forum",
    },
    component: () => import("../views/pages/forum/addForum"),
  },
  {
    path: "/forum/edit-forum/:id",
    name: "edit-forum",
    meta: {
      authRequired: true,
      permission: "edit-forum",
    },
    component: () => import("../views/pages/forum/addForum"),
  },
  {
    path: "/communication",
    name: "communication",
    meta: {
      authRequired: true,
      permission: "communication",
    },
    component: () => import("../views/pages/engagement/app-notification/index"),
  },
  {
    path: "/communication/add-communication",
    name: "add-communication",
    meta: {
      authRequired: true,
      permission: "add-communication",
    },
    component: () =>
      import("../views/pages/engagement/app-notification/addAppNotification"),
  },
  {
    path: "/communication/edit-communication/:id",
    name: "edit-communication",
    meta: {
      authRequired: true,
      permission: "edit-communication",
    },
    component: () =>
      import("../views/pages/engagement/app-notification/addAppNotification"),
  },
  {
    path: "/dataFilters",
    name: "dataFilters",
    meta: {
      authRequired: true,
      permission: "dataFilters",
    },
    component: () => import("../views/pages/data-filters/index"),
  },
  {
    path: "/dataFilters/edit-dataFilters/:id",
    name: "edit-dataFilters",
    meta: {
      authRequired: true,
      permission: "edit-dataFilters",
    },
    component: () => import("../views/pages/data-filters/addDataFilters"),
  },
  {
    path: "/dataFilters/add-dataFilters",
    name: "add-dataFilters",
    meta: {
      authRequired: true,
      permission: "add-dataFilters",
    },
    component: () => import("../views/pages/data-filters/addDataFilters"),
  },
  {
    path: "/video",
    name: "video",
    meta: {
      authRequired: true,
      permission: "video",
    },
    component: () => import("../views/pages/video/index"),
  },
  {
    path: "/video/add-video",
    name: "add-video",
    meta: {
      authRequired: true,
      permission: "add-video",
    },
    component: () => import("../views/pages/video/addVideo"),
  },
  {
    path: "/video/edit-video/:id",
    name: "edit-video",
    meta: {
      authRequired: true,
      permission: "edit-video",
    },
    component: () => import("../views/pages/video/addVideo"),
  },
  {
    path: "/question-bank",
    name: "question-bank",
    meta: {
      authRequired: true,
      permission: "question-bank",
    },
    component: () => import("../views/pages/question-bank/index"),
  },
  {
    path: "/question-bank/add-question-bank",
    name: "add-question-bank",
    meta: {
      authRequired: true,
      permission: "add-question-bank",
    },
    component: () => import("../views/pages/question-bank/addQuestionBank"),
  },
  {
    path: "/question-bank/edit-question-bank/:id",
    name: "edit-question-bank",
    meta: {
      authRequired: true,
      permission: "edit-question-bank",
    },
    component: () => import("../views/pages/question-bank/addQuestionBank"),
  },
  { path: "*", component: () => import("../views/pages/utility/error-404") },
  // {
  //   path: "/certificate",
  //   name: "certificate",
  //   meta: {
  //     authRequired: true,
  //     permission: "certificate",
  //   },
  //   component: () => import("../views/pages/certificate/index"),
  // },
  // {
  //   path: "/certificate/add-certificate",
  //   name: "add-certificate",
  //   meta: {
  //     authRequired: true,
  //     permission: "add-certificate",
  //   },
  //   component: () => import("../views/pages/certificate/addCertificate"),
  // },
  // {
  //   path: "/certificate/edit-certificate/:id",
  //   name: "edit-certificate",
  //   meta: {
  //     authRequired: true,
  //     permission: "edit-certificate",
  //   },
  //   component: () => import("../views/pages/certificate/addCertificate"),
  // },
  {
    path: "/universal-member-upload",
    name: "Universal Member",
    meta: {
      authRequired: true,
      permission: "universal-member-upload",
    },
    component: () => import("../views/pages/universal-member/index"),
  },
  {
    path: "/newsletter",
    name: "newsletter",
    meta: {
      authRequired: true,
      permission: "newsletter",
    },
    component: () => import("../views/pages/newsletter/index"),
  },
  {
    path: "/newsletter/add-newsletter",
    name: "add-newsletter",
    meta: {
      authRequired: true,
      permission: "add-newsletter",
    },
    component: () => import("../views/pages/newsletter/addNewsletter"),
  },
  {
    path: "/newsletter/edit-newsletter/:id",
    name: "edit-newsletter",
    meta: {
      authRequired: true,
      permission: "edit-newsletter",
    },
    component: () => import("../views/pages/newsletter/addNewsletter"),
  },
  {
    path: "/cme",
    name: "cme",
    meta: {
      authRequired: true,
      permission: "cme",
    },
    component: () => import("../views/pages/cme/index"),
  },
  {
    path: "/cme/edit-cme/:id",
    name: "edit-cme",
    meta: {
      authRequired: true,
      permission: "edit-cme",
    },
    component: () => import("../views/pages/cme/addCME"),
  },
  {
    path: "/cme/add-cme",
    name: "add-cme",
    meta: {
      authRequired: true,
      permission: "add-cme",
    },
    component: () => import("../views/pages/cme/addCME"),
  },
  // {
  //   path: '/registration',
  //   name: 'registration',
  //   meta: {
  //     authRequired: true,
  //     permission: 'registration'
  //   },
  //   component: () => import('../views/pages/registration/index')
  // },
  // {
  //   path: '/registration/add-registration',
  //   name: 'add-registration',
  //   meta: {
  //     authRequired: true,
  //     permission: 'add-registration'
  //   },
  //   component: () => import('../views/pages/registration/addRegistration')
  // },
  // {
  //   path: '/registration/edit-registration/:id',
  //   name: 'edit-registration',
  //   meta: {
  //     authRequired: true,
  //     permission: 'edit-registration'
  //   },
  //   component: () => import('../views/pages/registration/addRegistration')
  // }
];
