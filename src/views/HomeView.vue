<template>
    <AppHeaderMain/>
    <div id="home">
        <h1>Room reservations</h1>
        <p>

        </p>
        <!-- <DatePicker v-model="date"/> -->
        <button type="button" v-on:click="checkdate()">date</button>
        <button type="button" v-on:click="checktime()">time</button>
        <small>Office hours are 9am to 6pm</small>

        <Datepicker v-model="date" range inline/>
    </div>

</template>

<script>
import AppHeaderMain from '../components/AppHeaderMain.vue'
import Datepicker from '@vuepic/vue-datepicker';
import { ref, onMounted } from 'vue';
//import { Calendar, DatePicker } from 'v-calendar';
    
    export default {
    //     setup() {
    //     const date = ref();

    //     // For demo purposes assign range from the current date
    //     onMounted(() => {
    //         const startDate = new Date();
    //         const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
    //         date.value = [startDate, endDate];
    //     })
        
    //     return {
    //         date,
    //     }
    // },
        name: 'Home',
        
        data() {
            return {
            date: new Date(),
            // date: {
            //     startDate: new Date(),
            //     endDate: new Date(new Date().setDate(startDate.getDate() + 7)),
            // },
            
            input: {
                    startTime: "",
                    endTime: ""
                },
        };
        },
        methods: {
            checkdate() {
                if(this.date !=null) {
                    console.log(this.date)
                }
            },
            checktime() {
                //if(this.startTime !="" && this.endTime !="") {
                    // console.log(this.date.value.startDate)
                    // console.log(this.date.value.endDate)
                    console.log(this.date)
                    console.log(this.date[0])
                    console.log(this.date[0].getDate())
                    console.log(this.date[0].getMonth()+1)
                    console.log(this.date[0].getFullYear())
                    console.log(this.date[0].getUTCMinutes())
                    console.log(this.date[0].getUTCHours())
                //}
            }
        },
        components: {
            AppHeaderMain,
            Datepicker,
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