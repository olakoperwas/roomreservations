<template>
  <AppHeaderMain/>
  <div class="container">
    <b-row class="mt-5">
        <g-gantt-chart 
        :chart-start="ganttChartStart"
        :chart-end="ganttChartEnd"
        precision="hour"
        bar-start="myStart"
        bar-end="myEnd"
        >
        <g-gantt-row 
          v-for="row in reservations"
          :key="row.label"
          :label="row.label"
          :bars="row.bars"/>
        </g-gantt-chart>
    </b-row>
    <p>Office plan</p>
    <div class="row justify-content-md-center">
      <div class="col-8" :key="date">
        <v-stage :config="configKonva">
        <v-layer ref="layer">
            <v-rect
              v-for="room in floor_rooms"
              @click="handleClickOnRoom(room.roomId)"
              :key="room.roomId"
              :config="{
                x: room.x,
                y: room.y,
                id: room.roomId + ' ',
                width: room.width,
                height: room.height,
                fill: room.color,
                stroke: room.stroke,
              }"
            ></v-rect>
          </v-layer>
      </v-stage>
      </div>
      <div class="col-4">
        <div>
            <Datepicker v-model="date" @update:modelValue="updatereservations()" range inline/>
        </div>
        <div>
          <b-button v-if="!isLoading" @click="reserveRoom()">Reserve</b-button>
          <b-button v-else variant="primary" disabled>
            <b-spinner small type="grow"></b-spinner>
              Loading...
          </b-button>
        </div>

      </div>
  </div>
  </div>
</template>
<script>
import AppHeaderMain from '../components/AppHeaderMain.vue'
import Datepicker from '@vuepic/vue-datepicker';
import authAzure from '../services/auth-azure.service';
import {ref} from "vue";
    export default {
        name: 'About',       
        data() {
          return {
            id:1,
            date: [new Date(), new Date()],
            sDate: new Date(),
            eDate: "",
            floor: null,
            floor_rooms: {},
            configKonva: {
              width: 800,
              height: 800
            },
            isLoading: false,
            selectedRoom: null,
            ganttChartStart: "2020-03-01 07:00",
            ganttChartEnd: "2020-03-01 17:00",
            reservations: {}
              // {
              //   label: "Room 1",
              //   bars: ref([
              //     {
              //       myStart: "2020-03-01 13:00",
              //       myEnd: "2020-03-01 14:00",
              //       ganttBarConfig: {
              //         id: "unique id 1",
              //         hasHandless: true,
              //         label: "Room 1 Date 1",
              //         style: {
              //           background: "3e09b69",
              //           borderRadius: "20px",
              //           color: "balck"
              //         }
              //       }
              //     },
              //       {
              //       myStart: "2020-03-01 15:00",
              //       myEnd: "2020-03-02 16:30",
              //       ganttBarConfig: {
              //         id: "unique id 2",
              //         hasHandless: true,
              //         label: "Room 1 Date 1",
              //         style: {
              //           background: "3e09b69",
              //           borderRadius: "20px",
              //           color: "balck"
              //         }
              //       }
              //     }
              //   ])
              // }
          };
        },
  async mounted() {
    this.token = await authAzure.acquireToken()
        await fetch("http://192.168.196.9:8080/api/floor?number=1", {
          headers: {
            'Accept': 'application/json',
            'X-My-Custom-Header': 'value-v',
            'Authorization' : 'Bearer ' + this.token
            }
          //  credentials: 'same-origin'
          })
          .then(response => response.json())
          .then(data => {
            this.floor = data
            this.floor.rooms.forEach((r) => {
                this.floor_rooms[r.roomId] = r
                this.floor_rooms[r.roomId].color = 'grey'
                this.floor_rooms[r.roomId].stroke = 'white'
            })
          })
          .then(() =>this.updatereservations() )
          .catch(err => console.log(err))  

  },
  methods: {
    handleClickOnRoom(roomId) {
        if(this.selectedRoom){
          this.floor_rooms[this.selectedRoom].stroke = 'white'
        }
        this.selectRoom(roomId)
        this.floor_rooms[roomId].stroke = 'black'
       // this.getRoomReservations(roomId)
    },
  async getRoomReservations(room_id){
        this.ganttChartStart = this.date[0].getFullYear()+'-'+("0"+(this.date[0].getMonth()+1)).slice(-2)+'-'+("0" + this.date[0].getDate()).slice(-2)+ " 00:01"
        this.ganttChartEnd = this.date[1].getFullYear()+'-'+("0"+(this.date[1].getMonth()+1)).slice(-2)+'-'+("0" + this.date[1].getDate()).slice(-2) + " 23:59"
        if(this.date[1]!=null) {
          const bodyRes = {
                roomId:room_id,
                startDate: this.ganttChartStart + ':00',
                endDate: this.ganttChartEnd + ':00',
          }
        console.log(this.ganttChartStart)
        console.log(this.ganttChartEnd)
        console.log(room_id)
        await fetch('http://192.168.196.9:8080/api/reservations/room', {
                  method: 'POST',
                  headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  'Authorization' : 'Bearer ' + this.token
                  },
                  credentials: 'same-origin',
                  body: JSON.stringify(bodyRes)
                  })
              .then(res => res.json())
              .then(res => {
                  const barsColl = res.map( r => {
                        return {
                          myStart: r.startDate.slice(0, -3),
                          myEnd: r.endDate.slice(0, -3),
                          ganttBarConfig: {
                            id: r.id,
                            hasHandless: false,
                            label: r.ownerEmail
                          }
                        }
                  })
                  this.reservations[room_id] = {
                    label: this.floor_rooms[room_id].name,
                    bars: ref(barsColl)
                  }
                  console.log(this.reservations)
                })
              .catch(error => console.log(error))
        }
      },
  async updatereservations(){
    this.updateReservationsState()
    this.floor.rooms.forEach((r) =>
        this.getRoomReservations(r.roomId)
    )
  },
  async updateReservationsState(){
      if(this.date[1]!=null) {
        const reservationFrame = {
              floorNumber: this.floor.number,
              startDate: this.date[0].getFullYear()+'-'+("0"+(this.date[0].getMonth()+1)).slice(-2)+'-'+("0" + this.date[0].getDate()).slice(-2)+' '+("0" + this.date[0].getUTCHours()).slice(-2)+':'+("0" + this.date[0].getUTCMinutes()).slice(-2)+':'+"00",
              endDate: this.date[1].getFullYear()+'-'+("0"+(this.date[1].getMonth()+1)).slice(-2)+'-'+("0" + this.date[1].getDate()).slice(-2)+' '+("0" + this.date[1].getUTCHours()).slice(-2)+':'+("0" + this.date[1].getUTCMinutes()).slice(-2)+':'+"00"
        }
        await fetch('http://192.168.196.9:8080/api/reservations/floor',{
            method: 'POST',
            headers:{
              'Authorization' : 'Bearer ' + this.token,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationFrame)
        })
        .then(res => res.json())
        .then(res => {
          for(const [key, value] of Object.entries(res)){
            var color = 'grey'
            const isBooked = value.isReserved;
            color = isBooked ? 'red' : 'green'
            console.log("roomId: " , value.roomId)
            console.log("isBooked: ", isBooked)
            console.log("color: ", color)
            this.floor_rooms[value.roomId].color = color
          }
        }) 
      }
  },
  async reserveRoom(){
    this.isLoading = true;
    console.log("ładuje się")
    const body = {
        roomId: this.selectedRoom,
        participantUsers: [],
        startDate: this.date[0].getFullYear()+'-'+("0"+(this.date[0].getMonth()+1)).slice(-2)+'-'+("0" + this.date[0].getDate()).slice(-2)+' '+("0" + this.date[0].getUTCHours()).slice(-2)+':'+("0" + this.date[0].getUTCMinutes()).slice(-2)+':'+"00",
        endDate: this.date[1].getFullYear()+'-'+("0"+(this.date[1].getMonth()+1)).slice(-2)+'-'+("0" + this.date[1].getDate()).slice(-2)+' '+("0" + this.date[1].getUTCHours()).slice(-2)+':'+("0" + this.date[1].getUTCMinutes()).slice(-2)+':'+"00"
    }
    await fetch('http://192.168.196.9:8080/api/reservation/save',{
      method: 'POST',
      headers: {
        'Authorization' : 'Bearer ' + this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(() => {
        this.updateReservationsState()
        this.getRoomReservations(body.roomId)
    }).then(()=>this.isLoading = false)
    .catch((error) => {
      this.isLoading = false
    })
  },
  selectRoom(room_id){
    this.selectedRoom = room_id
  }
      // async getColor(roomId) {
      //   var col = this.getRoomReservations(roomId)
      //   return col
      // },
      // updateColors(){
      //   for(const [key, value] of Object.entries(this.floor_rooms)){
      //     const col = this.getRoomReservations(key)
      //     // console.log("zwrocony kolor" + col)
      //     // value['color'] = col
      //     // this.floor_rooms[key] = value
      //     console.log(this.floor_rooms[key])
      //   }
      // },   
    },    
        components: {
            AppHeaderMain,
            Datepicker
        }
    }
</script>

<style>
#kanva {
border: 1px solid black;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
