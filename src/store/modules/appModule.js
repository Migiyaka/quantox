const appModule = {
    namespaced: true,
    state: {
        geolocation: false,
        geolocationLoaded: false,
        userPosition: {}  
    },
    getters: {
        getCoffeeShopCategoryId(state) {
            return '4bf58dd8d48988d1e0931735';
        }    
    },
    actions: {
        getUserPosition(context) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    context.state.geolocation = true;
                    context.state.geolocationLoaded = true;
                    context.state.userPosition = position;
                }, () => {
                    context.state.geolocationLoaded = true;
                });
            }
        },
        findNearbyCoffeeShops(context, { location, radius } = {}) {
            const url = `venues/explore?ll=${location}&radius=${radius}&section=coffee&openNow=1&sortByDistance=1&venuePhotos=1`;
            const payload = { url, method: 'get' };
            
            return context.dispatch('server/http', payload, { root: true })
                .then(response => Promise.resolve(response.data.response.groups[0].items))
                .catch(err => Promise.reject(err));
        }
    }  
};

export default appModule;