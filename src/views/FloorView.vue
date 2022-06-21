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
          <h3>Office plan</h3>
        <v-stage :config="configKonva">
        <v-layer ref="layer">
            <v-group
              v-for="room in floor_rooms"
              :key="room.roomId"  @click="handleClickOnRoom(room.roomId)">
              <v-rect
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
                  x: room.x + 4,
                  y: room.y + 4,
                  text: room.number,
                  fontSize: 15,
                  fontStyle: 'bold',
                  padding: 10,
                  color: 'white'
                }"
              />
              <v-text
                :config="{
                  offsetY: -25, 
                  x: room.x + 4,
                  y: room.y + 4,
                  text: room.name,
                  fontSize: 15,
                  fontStyle: 'italic',
                  padding: 10,
                  height: room.height,
                  width: room.width,
                  align: 'center'
                }"
              />
            </v-group>
          </v-layer>
      </v-stage>
      </div>
      </div>
      <div class="col-4">
        <p>Choose date and time from calendar</p>
        <div>
            <Datepicker v-model="date" @update:modelValue="updatereservations()" range inline/>
        </div>
        <p>


        </p>
        <div>
          <b-button v-if="!isLoading" @click="reserveRoom()">Reserve</b-button>
          <b-button v-else variant="primary" disabled>
            <b-spinner small type="grow"></b-spinner>
              Loading...
          </b-button>
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
            reservations: {},
            username: authAzure.user().username,
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
                this.floor_rooms[r.roomId].name = r.name
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
                        const backgroundColor = r.ownerEmail == this.username ? "Gold" : "SteelBlue"
                        return {
                          myStart: r.startDate.slice(0, -3),
                          myEnd: r.endDate.slice(0, -3),
                          ganttBarConfig: {
                            id: r.id,
                            hasHandless: false,
                            label: r.ownerEmail,
                            style: {
                              borderRadius: "20px",
                              color: "black",
                              background: backgroundColor,
                            }
                          }
                        }
                  })
                  this.reservations[room_id] = {
                    label: this.floor_rooms[room_id].name,
                    bars: ref(barsColl)
                  }
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
            color = isBooked ? 'tomato' : 'limeGreen'
            this.floor_rooms[value.roomId].color = color
          }
        }) 
      }
  },
  async reserveRoom(){
    this.isLoading = true;
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
    })
    .then((response) => {
        console.log(response)
      if (response.status == 201){
          console.log(response.status)
          this.$notify({
            title: "Your reservation is done.",
            type: 'success',
          });
        this.updateReservationsState()
        this.getRoomReservations(body.roomId)
      }
      if(response.status == 409){
        this.$notify({
          text: "Cannot make reservation",
          type: 'error',
        });
      }
    })
    .then(()=> {
      this.isLoading = false
    })
    .catch((error) => {
      console.log(error)
      this.isLoading = false
        this.$notify({
        title: error.response,
        type: 'error',
      });
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
height: 540px;
}
h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
