const login = "/login";

const adminUser = {
  adminUrl: "/admin-user",
  restoreAdmin: "/admin-user/restore",
};

const role = {
  roleUrl: "/roles",
  permissionUrl: "permission/get-permissions",
};

const askExpert = {
  fetchAskExpert: "/ask-experts",
  statusUpdate: "/ask-experts/changestatus",
  fileDownload: "/ask-experts/file-download",
};

const expert = {
  expertUrl: "/experts",
  statusUpdate: "/experts/update-status",
  flagUpdate: "/experts/update-discussion-status",
  restoreExpert: "/experts/restore",
  fetchAllActiveExpert: "/experts?filter=active&nopagination",
  expertVisibleInCases: '/experts?filter=visible_in_cases&nopagination'
};

const podcast = {
  podcastUrl: "/podcasts",
  statusUpdate: "/podcasts/update-status",
  restorePodcast: "/podcasts/restore",
};

const partner = {
  partnerUrl: "/partners",
  statusUpdate: "/partners/update-status",
  restorePartner: "/partners/restore",
  fetchAllActivePartner: "/partners?filter=active&nopagination",
};

const forum = {
  fetchAllActiveForum: "/forums?filter=active&nopagination",
  forumUrl: "/forums",
  statusUpdate: "/forums/update-status",
  restoreForum: "/forums/restore",
};

const community = {
  fetchCommunity: "/communities",
  fetchAllActiveCommunity: "/communities?filter=active&nopagination",
  statusUpdate: "/communities/update-status",
  restoreCommunity: "/communities/restore",
};

const country = {
  countryUrl: "/countries",
  fetchAllCountry: "/countries?nopagination",
  fetchCountry: '/master/fetch_country_list'
};
const stateUrl = {
  state: "/master/fetch_state_by_country", // you have to pass the dynamic country here
  fetchState: '/master/fetch_state_by_country/India',
  fetchStateByCountry: '/master/fetch_state_by_countries',
  fetchAllStates:"/master/fetch_all_states"
};
const cityUrl = {
  city: "/master/fetch_city_by_state", // pass dynamic state here
  fetchCityByState: '/master/fetch_city_by_states',
  fetchAllCities:"/master/fetch_all_cities"
};

const subspeciality = {
  fetchSubSpeciality: "/sub-specialities",
  fetchAllSubSpeciality: "/sub-specialities?nopagination",
};

const page = {
  pageUrl: "/pages",
};

const cityState = {
  fetchCityState: "/city_states",
  fetchAllActiveCityState: "/city_states?filter=active&nopagination",
};

const config = {
  configUrl: "/configs",
};

const speciality = {
  specialityUrl: "/specialities",
  statusUpdate: "/specialities/update-status",
  fetchAllSpeciality: "/specialities?nopagination",
  fetchAllActiveSpeciality: "/specialities?filter=active&nopagination",
};

const article = {
  articleUrl: "/articles",
  statusUpdate: "/articles/status",
  importFile: "/articles/import",
};

const cases = {
  caseUrl: "/cases",
  statusUpdate: "/cases/status",
  caseCommentStatusUpdate: "/cases/comment-status",
  deleteCaseMCQ: "/cases/delete-case-question",
  fetchCase: '/cases?nopagination',
  fetchAllActiveCase: '/cases?filter=active&nopagination'
};

const slider = {
  sliderUrl: "/sliders",
  statusUpdate: "/sliders/status",
};

const notification = {
  fetchEmail: "/email-templates?type=email",
  emailStatusUpdate: "/email-templates/status",
  emailUrl: "/email-templates",
  restoreEmail: "/email-templates/restore",

  fetchSMS: "/sms-templates?type=sms",
  smsStatusUpdate: "/sms-templates/status",
  smsUrl: "/sms-templates",
  restoreSMS: "/sms-templates/restore",

  fetchPage: "/page-notification-templates?type=page",
  pageStatusUpdate: "/page-notification-templates/status",
  pageUrl: "/page-notification-templates",
  restorePage: "/page-notification-templates/restore",

  fetchPush: "/push-notification-templates?type=push",
  pushStatusUpdate: "/push-notification-templates/status",
  pushUrl: "/push-notification-templates",
  restorePush: "/push-notification-templates/restore",
};

const series = {
  fetchSeries: "/series?nopagination",
  statusUpdate: "/series/status",
  seriesUrl: "/series",
  restoreSeries: "/series/restore",
  fetchAllSeries: '/series?nopagination',
  fetchAllActiveSeries: '/series?filter=active&nopagination'
};

const knowledgeCategory = {
  fetchKnowledgeCategory: "/knowledge-categories?nopagination",
  fetchAllActiveKnowledgeCategory: "/knowledge-categories?filter=active&nopagination",
};

const notification_master = {
  statusUpdate: "/notification-masters/status",
  notificationMasterUrl: "/notification-masters",
  restoreNotificationMaster: "/notification-masters/restore",
};

const userType = {
  fetchUser: "/master/fetch_user_types",
};

const whatsapp = {
  fetchWhatsapp: "/notification?notification_type=whatsapp",
  whatsappUrl: "/notification",
};

const imageBank = {
  getImage: "/image-banks?nopagination",
};

const appNotification = {
  appNotificationUrl: "/notification",
  checkApp: '/notification/check-content'
};

const dataFilters = {
  fetchDataFilters: "/datafilters",
  fetchAllDataFilter: '/datafilters?nopagination',
  dataFiltersUrl: "/datafilters",
  updateStatus: '/datafilters/update-status',
  restoreDataFilter: '/datafilters/restore',
  getFilterContent: '/datafilters/get-content',
};

const video = {
  videoUrl: "/videos",
  restoreVideo: "/videos/restore",
  statusUpdate: "/videos/update-status",
  fetchAllVideo: "/videos?nopagination",
  fetchAllActiveVideo: "/videos?filter=active&nopagination",
};

const questionBankUrl = {
  questionBank: "/question-banks",
  fetchAllQuestion: "/question-banks?nopagination",
};

const masterUrl = {
  getQuestionBankTypes: "/master/fetch-question-bank-types",
  getAttachmentType: "/master/fetch-attachment-types",
  getAttachment: "/master/fetch-attachments?nopagination",
};
const newsletter = {
  newsletterUrl: "/newsletter",
  statusUpdate: "/newsletter/status",
  fetchActiveNewsletter: '/newsletter?filter=active&nopagination'
};

const cme = {
  cmeUrl: "/cme",
  statusUpdate: "/cme/status",
};

const certificate = {
  certificateUrl: "/certificates",
  fetchAllCertificate: "/certificates?nopagination",
  fetchActiveCertificate: '/certificates?filter=active&nopagination'
};

const registration = {
  registrationUrl: "/registration-templates",
  fetchAllRegistration: "/registration-templates?nopagination",
};

const live_event = {
  fetchAllLive_event: "/master/fetch-attachments?type=live_event",
  fetchLiveEvent: '/master/fetch-attachments?type=live_event&nopagination=1'
};

const reading_material = {
  fetchAllActiveReadingMaterial: '/master/fetch-attachments?type=reading_material&nopagination=1'
}

const universal_member_upload = {
  fetchUniversalMember: '/universal/members'
}

export {
  askExpert,
  expert,
  podcast,
  partner,
  community,
  country,
  page,
  subspeciality,
  cityState,
  config,
  speciality,
  login,
  article,
  adminUser,
  role,
  cases,
  slider,
  forum,
  notification,
  series,
  knowledgeCategory,
  notification_master,
  userType,
  whatsapp,
  appNotification,
  dataFilters,
  video,
  stateUrl,
  cityUrl,
  masterUrl,
  questionBankUrl,
  imageBank,
  newsletter,
  certificate,
  cme,
  registration,
  live_event,
  reading_material,
  universal_member_upload
};
