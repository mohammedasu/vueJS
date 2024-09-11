export const state = {
    showToast: false,
    icon:null,
    title:null
};

export const mutations = {
    updateStatus(state, payload) {
        state.showToast = payload.status;
        state.icon = payload.icon;
        state.title = payload.title;
    },   
};


