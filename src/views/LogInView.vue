<template>
   <AppHeader/>
    <b-container id="Login">       
        <b-row class="justify-content-md-center">
            <b-col cols="6">
                <h1>Witaj w systemie rezerwacji</h1>
                <h3>By rozpocząć, zaloguj się, używając konta Microsoft</h3>
                <div class="col-md-12 text-center">
                    <b-button class="btn btn-light" @click="SignIn()">                            
                        <div id="wpo365OpenIdRedirect" class="wpo365-mssignin-wrapper">
                            <div class="wpo365-mssignin-spacearound">
                                <div class="wpo365-mssignin-button" onclick="window.wpo365.pintraRedirect.toMsOnline()">
                                    <div class="wpo365-mssignin-logo">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                                            <title>MS-SymbolLockup</title>
                                            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                                            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                                            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                                            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                                        </svg>
                                    </div>
                                <div class="wpo365-mssignin-label">Sign in with Microsoft</div>
                            </div>
                        </div>
                    </div>
                </b-button>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import AppHeader from '../components/header-bar-link.vue'
import authAzure from '../services/auth-azure.service';
    export default {
        name: 'Login',
        data() {
        },
        methods: {
            async SignIn() {
                await authAzure.login().then(() => {
                    authAzure.appSignIn()
                    const token = authAzure.accessToken
                    this.authenticateUserOnServer(token)
                })
                this.account = authAzure.user();
                this.$emitter.emit('login', this.account);
            }, 
            async authenticateUserOnServer(token){
                await fetch("http://192.168.196.9:8080/api/authenticate",{
                    headers:  {
                        'Authorization' : 'Bearer ' + token
                    }
                }).then(res => {
                    if(res.status == 200){
                        this.$router.push({ name: "home" });
                    }    
                })
            }    
        },
        components: {
           AppHeader
        }
    }
</script>

<style scoped>
    #Login {
        border: 1px solid #f5f2f2;
        background-color: #fdfdfd;
        margin: auto;
        margin-top: 200px;
        padding: 20px;
        align-content: center;
        box-shadow: 0 4px 8px 0 #f5f2f2 inset, 0 6px 20px 0 #f5f2f2 inset;
        border-radius: 20px;
    }
    h1 {
        font-family: Gotham, Tahoma, sans-serif;
        font-weight: 1000;
        text-align: center;
    }
    h3 {
        color: #5e5e5e;
        font-family: Helvetica, Sans-serif;
        text-align: center;
    }
     .wpo365-mssignin-wrapper {
                    box-sizing: border-box;
                    display: block;
                    width: 100%;
                    padding: 12px 12px 24px 12px;
                    text-align: center;
                }
                .wpo365-mssignin-spacearound {
                    display: inline-block;
                }
                .wpo365-mssignin-wrapper form {
                    display: none;
                }
                .wpo365-mssignin-button {
                    border: 1px solid #8c8c8c;
                    background: #ffffff;
                    display: flex;
                    display: -webkit-box;
                    display: -moz-box;
                    display: -webkit-flex;
                    display: -ms-flexbox;
                    -webkit-box-align: center;
                    -moz-box-align: center;
                    -ms-flex-align: center;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-box-pack: center;
                    -moz-box-pack: center;
                    -ms-flex-pack: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    cursor: pointer;
                    max-height: 41px;
                    min-height: 41px;
                    height: 41px;
                }
                .wpo365-mssignin-logo {
                    padding-left: 12px;
                    padding-right: 6px;
                    -webkit-flex-shrink: 1;
                    -moz-flex-shrink: 1;
                    flex-shrink: 1;
                    width: 21px;
                    height: 21px;
                    box-sizing: content-box;
                    display: flex;
                    display: -webkit-box;
                    display: -moz-box;
                    display: -webkit-flex;
                    display: -ms-flexbox;
                    -webkit-box-pack: center;
                    -moz-box-pack: center;
                    -ms-flex-pack: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                }
                .wpo365-mssignin-label {
                    padding-left: 6px;
                    padding-right: 12px;
                    font-weight: 600;
                    color: #5e5e5e;
                    font-family: "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif;
                    font-size: 15px;
                    -webkit-flex-shrink: 1;
                    -moz-flex-shrink: 1;
                    flex-shrink: 1;
                    height: 21px;
                    line-height: 21px;
                }
</style>
