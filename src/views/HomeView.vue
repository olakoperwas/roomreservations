<template>
    <AppHeaderMain/>
    <div id="home">
        <h1>Room reservations</h1>
        <p>

        </p>
        <DatePicker v-model="date"/>
        <button type="button" v-on:click="checkdate()">date</button>
    </div>

</template>

<script>
import AppHeaderMain from '../components/AppHeaderMain.vue'
import { Calendar, DatePicker } from 'v-calendar';
    export default {
        name: 'Home',
        data() {
            return {
            date: new Date(),
        };
        },
        methods: {
            checkdate() {
                if(this.date !=null) {
                    console.log(this.date)
                }
            }
        },
        components: {
            AppHeaderMain,
            Calendar,
            DatePicker,
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