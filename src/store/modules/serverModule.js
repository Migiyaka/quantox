import axios from 'axios';

const serverModule = {
    namespaced: true,
    state: {
        server: null
    },
    getters: {
        getServerAPI(state) {
            return 'https://api.foursquare.com/v2/';  
        },
        getClientId(state) {
            return 'Y5PKRTNKYG1OFY0JMCLHBIT5RGH4X0Y4LT55MAKVJH2XELLS';
        },
        getClientSecret(state) {
            return 'APSU1PEU1H0E0W03EP0FNSWPPNARBKN42PN5NTP4LCGQDOEX';
        },
        getCurrentDate(state) {
            let date = (new Date()).toISOString();
            date = date.split('T')[0];
            date = date.split('-').join('');
            
            return date;
        }
    },
    actions: {
        createServer(context) {
            if (context.state.server === null) {
                context.state.server = axios.create({
                    baseURL: context.getters.getServerAPI,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        },
        http(context, { method, data, url }) {
            const urlWithAuth = `${url}${(url.indexOf('?') > 0) ? '&' : '?'}client_id=${context.getters.getClientId}&client_secret=${context.getters.getClientSecret}&v=${context.getters.getCurrentDate}`;
            const serverOptions = { method, data, url: urlWithAuth };
            
            return context.state.server(serverOptions)
                .then(response => Promise.resolve(response))
                .catch(err => Promise.reject(err.response));
        }
    }
};

export default serverModule;