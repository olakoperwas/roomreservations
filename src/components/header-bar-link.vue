<template>
  <!-- <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
  <h5 class="my-0 mr-md-auto font-weight-normal">Room reservations</h5>
  <nav class="md-auto">
    <p>aaaaaaaa</p>
    <a class="btn btn-outline-primary "><router-link to="/login">Sign In</router-link></a>
    <a class="btn btn-outline-primary"><router-link to="/register">Sign Up</router-link></a>
  </nav>
  </div> 
  -->

  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Room reservations</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
            <div v-if="account">
                <div class="level">
                    <div class="level-item title">
                        You are logged in as {{ account.name }}
                    </div>
                </div>
            </div>
          <router-link to="/login"><b-button variant="dark" class="me-1" @click="SignIn()">Sign In</b-button></router-link>
        </li>
        <li class="nav-item">
          <router-link to="/register"><b-button variant="dark">Sign Up</b-button></router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>


<script>
import { PublicClientApplication } from '@azure/msal-browser';

export default {
  name: 'HeaderBar',
  data() {
    return {
      account: undefined,
      github: 'https://github.com/cmatskas',
      twitter: 'https://twitter.com/christosmatskas',
      signin: 'https://microsoft.com',
    };
  },
  async created() {
    this.$msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig,
    );
    console.log(this.$msalInstance);
  },
  mounted() {
   // await msalInstance.handleRedirectPromise();
    const accounts = this.$msalInstance.getAllAccounts();
    if (accounts.length == 0) {
      return;
    }
    this.account = accounts[0];
    this.$emitter.emit('login', this.account);
  },
  methods: {
    async SignIn() {
      await this.$msalInstance.loginPopup({})
        .then(() => {
          const myAccounts = this.$msalInstance.getAllAccounts();
          this.account = myAccounts[0];
          this.$emitter.emit('login', this.account);
        })
        .catch(error => {
          console.error(`error during authentication: ${error}`);
        });
    },
    async SignOut() {
      await this.$msalInstance
        .logout({})
        .then(() => {
          this.$emitter.emit('logout', 'logging out');
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
};
</script>