<template>
    <AppHeaderMain/>
    <div id="home">
        <h1>Room reservations</h1>
    </div>

</template>

<script>
import AppHeaderMain from '../components/AppHeaderMain.vue'
    
    export default {
        name: 'Home',
        
        data() {
            return {

        };
        },
        methods: {
        },
        components: {
            AppHeaderMain,
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