<template>
  <AppHeaderMain/>
  <div class="container">
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
            <Datepicker v-model="date" @update:modelValue="updateReservationsState()" range inline/>
        </div>
        <div>
          <b-button @click="reserveRoom()">Reserve</b-button>
        </div>

      </div>
  </div>
  </div>
</template>
<script>
import AppHeaderMain from '../components/AppHeaderMain.vue'
import Datepicker from '@vuepic/vue-datepicker';
import authAzure from '../services/auth-azure.service';
import store from '../store/index'
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
            reservation: {
              roomId: "",
              startDate: "",
              endDate: ""
            },
            selectedRoom: null,
          };
        },
  async mounted() {
    this.token = await authAzure.acquireToken()
    try{
        const response = await fetch("http://192.168.196.9:8080/api/floor?number=1", {
          headers: {
            'Accept': 'application/json',
            'X-My-Custom-Header': 'value-v',
            'Authorization' : 'Bearer ' + this.token
            }
          //  credentials: 'same-origin'
          })
        const data = await response.json()
        this.floor = data
        this.floor.rooms.forEach((r) => {
            this.floor_rooms[r.roomId] = r
            this.floor_rooms[r.roomId].color = 'grey'
            this.floor_rooms[r.roomId].stroke = 'white'
        }) 
        console.log(this.floor_rooms)
        console.log('CZYTO JEST WYWOLYWANE')
      } catch(error){
        console.error(error)
      }    
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
        var color = 'grey'
        if(this.date[1]!=null) {
        this.reservation = {
              roomId:room_id,
              startDate: this.date[0].getFullYear()+'-'+("0"+(this.date[0].getMonth()+1)).slice(-2)+'-'+("0" + this.date[0].getDate()).slice(-2)+' '+("0" + this.date[0].getUTCHours()).slice(-2)+':'+("0" + this.date[0].getUTCMinutes()).slice(-2)+':'+"00",
              endDate: this.date[1].getFullYear()+'-'+("0"+(this.date[1].getMonth()+1)).slice(-2)+'-'+("0" + this.date[1].getDate()).slice(-2)+' '+("0" + this.date[1].getUTCHours()).slice(-2)+':'+("0" + this.date[1].getUTCMinutes()).slice(-2)+':'+"00"
        }}
        console.log(room_id)
        fetch('http://192.168.196.9:8080/api/reservations/room', {
                  method: 'POST',
                  headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  'Authorization' : 'Bearer ' + this.token
                  },
                  credentials: 'same-origin',
                  body: JSON.stringify(this.reservation)
                  })
              .then(res => {
                      console.log(res)
                      return res.json()
                    })
              .then(res => {
                      console.log(res)                
                      if(res.length == 0){
                        color = 'green'
                      }
                      else
                        color = 'red'
                      this.floor_rooms[room_id].color = color
                      console.log(this.floor_rooms[room_id])
                    })
              .catch(error => conosle.log(error))
          return color
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
