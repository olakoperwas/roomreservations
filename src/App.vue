<template>
    <div id="app">
        <!-- <div id="nav">
            <router-link v-if="authenticated" to="/login" v-on:click="logout()" replace>Logout</router-link>
        </div> -->
        <router-view @authenticated="setAuthenticated" />
        <notifications />
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                authenticated: false,
                mockAccount: {
                    username: "ola",
                    password: "haslo"
                }
            }
        },
        mounted() {
            if(!this.authenticated) {
                this.$router.replace({ name: "login" });
            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            },
            logout() {
                this.authenticated = false;
            }
        }
    }
</script>

<style>
    body {
         /* background-image: url("grey.jpg"); */
         background-position: center;
         background-repeat: no-repeat;
         background-size: cover;
    }
</style>