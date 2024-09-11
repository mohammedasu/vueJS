export const state = {
    showLoader: false,
};

export const mutations = {
    updateStatus(state, payload) {
        state.showLoader = payload;    
    },   
};


