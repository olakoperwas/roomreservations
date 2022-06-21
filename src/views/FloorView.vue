<template>
  <AppHeaderMain/>
  <div class="container">
    <b-row>
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

<!-- <v-stage >
    <v-group
      v-for="room in floor_rooms"
      :key="room.roomId"
      :config="{
        x: room.x,
        y: room.y,
      }"
    >
  <v-rect
    :key="room.roomId"
    :config="{
      width: room.width,
      height: room.height,
      fill: room.color,
      stroke: 'black',
      strokeWidth: 3,
    }"
  />
  <v-text
    :config="{
      text: 'oooo',
    }"
  />
</v-group>
</v-stage> -->

    <div class="row justify-content-md-center">
      
      <div class="col-8" :key="date">
        <div class="konva">
        <v-stage :config="configKonva">
        <v-layer ref="layer">
          <v-group
          v-for="room in floor_rooms"
            :key="room.roomId">
            
            <v-rect
             
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
            >
            </v-rect>
            <v-text
    :config="{
      x: room.x +4,
      y: room.y + 4,
      text: room.name,
    }"
  />
</v-group>
          </v-layer>
      </v-stage>
      </div>
      </div>
      <div class="col-4">
        <div>
            <Datepicker v-model="date" @update:modelValue="updatereservations()" range inline/>
        </div>
        <div>
          <b-button @click="reserveRoom()">Reserve</b-button>
        </div>

      </div>
        <!-- <b-button v-b-modal.modal-1>Launch demo modal</b-button>

  <b-modal id="modal-1" title="BootstrapVue">
    <p class="my-4">Hello from modal!</p>
  </b-modal> -->
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
            date: new Date(),
            sDate: new Date(),
            eDate: "",
            floor: null,
            floor_rooms: {},
            configKonva: {
              width: 800,
              height: 800
            },
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
        await fetch("http://localhost:8080/api/floor?number=1", {
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
                this.floor_rooms[r.roomId].name = r.name
            })
          })
          .catch(err => console.log(err))  
  },
  methods: {
    handleClickOnRoom(roomId) {
        if(this.selectedRoom){
          this.floor_rooms[this.selectedRoom].stroke = 'white'
        }
        this.selectRoom(roomId)
        this.floor_rooms[roomId].stroke = 'black'
    },
  async getRoomReservations(room_id){
        if(this.date[1]!=null) {
          const bodyRes = {
                roomId:room_id,
                startDate: this.date[0].getFullYear()+'-'+("0"+(this.date[0].getMonth()+1)).slice(-2)+'-'+("0" + this.date[0].getDate()).slice(-2)+' '+("0" + this.date[0].getUTCHours()).slice(-2)+':'+("0" + this.date[0].getUTCMinutes()).slice(-2)+':'+"00",
                endDate: this.date[1].getFullYear()+'-'+("0"+(this.date[1].getMonth()+1)).slice(-2)+'-'+("0" + this.date[1].getDate()).slice(-2)+' '+("0" + this.date[1].getUTCHours()).slice(-2)+':'+("0" + this.date[1].getUTCMinutes()).slice(-2)+':'+"00",
          }
        this.ganttChartEnd = bodyRes.endDate.slice(0, -8) + "23:59"
        this.ganttChartStart = bodyRes.startDate.slice(0, -8) + "00:01"
        console.log(this.ganttChartStart)
        console.log(this.ganttChartEnd)
        console.log(room_id)
        await fetch('http://localhost:8080/api/reservations/room', {
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
                            hasHandless: true,
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
              .catch(error => conosle.log(error))
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
        await fetch('http://localhost:8080/api/reservations/floor',{
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
    const body = {
        roomId: this.selectedRoom,
        participantUsers: [],
        startDate: this.date[0].getFullYear()+'-'+("0"+(this.date[0].getMonth()+1)).slice(-2)+'-'+("0" + this.date[0].getDate()).slice(-2)+' '+("0" + this.date[0].getUTCHours()).slice(-2)+':'+("0" + this.date[0].getUTCMinutes()).slice(-2)+':'+"00",
        endDate: this.date[1].getFullYear()+'-'+("0"+(this.date[1].getMonth()+1)).slice(-2)+'-'+("0" + this.date[1].getDate()).slice(-2)+' '+("0" + this.date[1].getUTCHours()).slice(-2)+':'+("0" + this.date[1].getUTCMinutes()).slice(-2)+':'+"00"
    }
    await fetch('http://localhost:8080/api/reservation/save',{
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
.konva {
background-color: beige;
height: 500px;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
