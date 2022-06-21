<template>
    <AppHeaderMain/>
    <b-container>
        <b-row class="mt-5">
            <b-table-simple>
            <caption>
                Your reservations
            </caption>
            <b-thead>
                <b-tr>
                    <b-th>Resertion No.</b-th>
                    <b-th>Room</b-th>
                    <b-th>Start Date</b-th>
                    <b-th>End Date</b-th>
                </b-tr>
            </b-thead>
            <b-tbody>
                <b-tr v-if="!isLoading" v-for="reservation in reservations">
                    <b-td>{{reservation.id}}</b-td>
                    <b-td>{{reservation.room.number}} : {{reservation.room.name}}</b-td>
                    <b-td>{{reservation.startDate}}</b-td>
                    <b-td>{{reservation.endDate}}</b-td>
                </b-tr>
                <b-tr v-else>
                        <b-th>
                             <b-spinner small type="grow"></b-spinner>
                            Loading..
                        </b-th>
                </b-tr>
            </b-tbody>
    </b-table-simple>
        </b-row>
    </b-container>
</template>

<script>
    import AppHeaderMain from '../components/AppHeaderMain.vue'
    import authAzure from '../services/auth-azure.service';
    export default {
        name: "My reservations",
        data() {
            return {
                reservations: [],
                isLoading: false
            }
        },
        async mounted() {
            this.getReservations()
        },
        methods:{
            async getReservations(){
                this.isLoading = true
                fetch("http://localhost:8080/api/reservations/user", {
                    method: 'GET',
                    headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' + authAzure.accessToken
                    },
                    credentials: 'same-origin',
                  })
                  .then(response => response.json())
                  .then(responce => this.reservations = responce)
                  .then(() => this.isLoading = false)
                  .catch((error) => {
                    this.isLoading = false
                    console.log(error)
                    })
            }
        }
        ,    
        components: {
            AppHeaderMain
        }
    }
</script>