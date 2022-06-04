<template>
    <AppHeaderMain/>
    <div id="home">
        <h1>Room reservations</h1>
    </div>

</template>

<script>
import AppHeaderMain from '../components/AppHeaderMain.vue'
import { mapMutations } from 'vuex';
    export default {
        name: 'Home',
        
        data() {
            return {
                account: undefined,
                containers: [],
            };
        },
        created(){
            this.$emitter.on(
            'login', (account) => {
                this.account = account;
                console.log(this.account);
               },
            ).bind(this),
                this.$emitter.on('logout', () => {
                    console.log('logging out');
                    this.account = undefined;
                }
            ).bind(this);
        },
        methods: {
            ...mapMutations(['setAccessToken']),
        },
        components: {
            AppHeaderMain,ś
        }
    }
</script>

<style scoped>
    #secure {
        background-color: #FFFFFF;
        border: 1px solid #CCCCCC;
        padding: 20px;
        margin-top: 10px;
    }
</style>