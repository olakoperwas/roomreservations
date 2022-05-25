<template>
   <AppHeader/>
    <div id="login">       
        <h1>Login</h1>
        <input type="text" name="username" v-model="input.username" placeholder="Username" />
        <input type="password" name="password" v-model="input.password" placeholder="Password" />
        <button type="button" v-on:click="login()">Login</button>
    </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'
    export default {
        name: 'Login',
        data() {
            return {
                input: {
                    username: "",
                    password: ""
                },
                logs: {
                    email: "",
                    password: ""
                }
            }
        },
        methods: {
            login() {
                this.email = this.input.username
                this.password = this.input.password
                this.logs = {
                    email:this.email,
                    password:this.password
                }
                fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(this.logs)
                })  
                //.then(res => console.log(res.headers.get('Set-Cookie'))) 
                .then(res => {
                    console.log(res)
                    return res.json()
                    })
                          
                //.then(res => this.$cookies.set("accessToken", res.cookie, ))
                //.then(res => console.log(res))
                .then(res => {
                    console.log(res)
                    if (res.status == 'SUCCESS') {
                        this.$emit("authenticated", true);
                        this.$router.replace({ name: "home" });
                    }
                    else {
                        console.log("The username and / or password is incorrect");
                    }
                })                
                //.then(res => this.$emit('log', res))

                // this.logs = {
                // email: '',
                // password: ''
                // }
                

                // if(this.input.username != "" && this.input.password != "") {
                //     if(this.input.username == "stud@localhost.com" && this.input.password == "Stud") {
                //         this.$emit("authenticated", true);
                //         this.$router.replace({ name: "home" });
                //     } else {
                //         console.log("The username and / or password is incorrect");
                //     }
                // } else {
                //     console.log("A username and password must be present");
                // }
            },
        },
        components: {
           AppHeader
        }
    }
</script>

<style scoped>
    #login {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #FFFFFF;
        margin: auto;
        margin-top: 200px;
        padding: 20px;
    }
</style>
