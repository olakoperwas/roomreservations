<template>
<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Room reservations</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
            <router-link class="nav-link" :to="{ path: 'home' }" :class="{active: $route.name==='home'}">Home</router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link" :to="{ path: 'reservations' }" :class="{active: $route.name==='reservations'}">My reservations</router-link>
        </li>
        <li class="nav-item">
          <b-button variant="dark" @click="logout()">Sign Out</b-button>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>
<script>
import authAzure from '../services/auth-azure.service';
    export default {
        name: 'Login',
        data() {
        },
        methods: {
            async logout() {
                await authAzure.logout().then( () => {
                   console.log("user is logout")
                    this.account = null;
                    this.$emitter.emit('login', null);
                    this.$router.push('Login') 
                })
              },      
        },
    }
</script>