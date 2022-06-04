import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      msalConfig: {
        auth: {
          clientId: 'f328ddee-9192-414d-a86a-1da6769b2202',
          authority:
            'https://login.microsoftonline.com/f757dd37-d403-4fbc-8e26-6c3a256405d0',
        },
        cache: {
          cacheLocation: 'localStorage',
        },
      },
      accessToken: ''
    };
  },
  mutations :{
    setAccessToken(state, token){
      state.accessToken = token;
    }
  }
});

export default store;