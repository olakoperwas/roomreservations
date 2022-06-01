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
                id: 'room.room_id',
                width: room.width,
                height: room.height,
                fill: getColor(room.roomId),
                stroke: 'black',
              }"
            ></v-rect>
          </v-layer>
      </v-stage>
      </div>
      <div class="col-4">
        <div>
            <Datepicker v-model="date" range inline/>
            <button type="button" v-on:click="checkDate()">date</button>
        </div>
      </div>
  </div>
  </div>
</template>
<script>
import AppHeaderMain from '../components/AppHeaderMain.vue'
import Datepicker from '@vuepic/vue-datepicker';
    export default {
        name: 'About',       
        data() {
          return {
            id:1,
            date: new Date(),
            sDate: new Date(),
            eDate: "",
            floor: null,
            floor_rooms: [],
            configKonva: {
              width: 800,
              height: 800
            },
            reservation: {
              roomId: "",
              startDate: "",
              endDate: ""
            }
          };
        },
  async mounted() {
    try{
        const response = await fetch("http://localhost:8080/api/floor?number=1", {
        headers: {'Accept': 'application/json'}})
        const data = await response.json()
        this.floor = data
        this.floor_rooms = this.floor.rooms
      } catch(error){
        console.error(error)
      }     
  },
  methods: {
    handleClickOnRoom(roomId) {
        console.log(roomId)
        this.getRoomReservations(roomId)
    },
    getColor(roomId) {
    //    this.getRoomReservations(roomId)
     return this.getRoomReservations(roomId)
    },
    checkDate() {
      //to trzeba do jednej zmiennej jako stringa wrzucic ladnie zlozonego
      this.sDate = new Date(this.date[0].getFullYear(),this.date[0].getMonth()+1, this.date[0].getDate(), this.date[0].getUTCHours(), this.date[0].getUTCMinutes())
      //this.eDate = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
  //  d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) 
      this.eDate = this.date[1].getFullYear()+'-'+("0"+(this.date[1].getMonth()+1)).slice(-2)+'-'+("0" + this.date[1].getDate()).slice(-2)+' '+("0" + this.date[1].getUTCHours()).slice(-2)+':'+("0" + this.date[1].getUTCMinutes()).slice(-2)+':'+"00"
      console.log(this.date)
      console.log(this.date[0])
      console.log(this.date[0].getDate())
      console.log(this.date[0].getMonth()+1)
      console.log(this.date[0].getFullYear())
      console.log(this.date[0].getUTCMinutes())
      console.log(this.date[0].getUTCHours())

      console.log(this.sDate)
      console.log(this.eDate)
      console.log(this.date[0].toLocaleDateString())
    },
async getFloor(){
      try{
        const response = await fetch("http://localhost:8080/api/floors/get/?number=1", {
        headers: {'Accept': 'application/json'}})
        const data = await response.json()
        this.floor = data
        this.floor_rooms = this.floor.rooms
      } catch(error){
        console.error(error)
      }      
    },
 getRoomReservations(room_id){
   var color ='grey'
      console.log(this.date)
      if(this.date[1]!=null) {
        console.log('weszlo')
      this.reservation = {
            roomId:room_id,
            startDate: this.date[0].getFullYear()+'-'+("0"+(this.date[0].getMonth()+1)).slice(-2)+'-'+("0" + this.date[0].getDate()).slice(-2)+' '+("0" + this.date[0].getUTCHours()).slice(-2)+':'+("0" + this.date[0].getUTCMinutes()).slice(-2)+':'+"00",
            endDate: this.date[1].getFullYear()+'-'+("0"+(this.date[1].getMonth()+1)).slice(-2)+'-'+("0" + this.date[1].getDate()).slice(-2)+' '+("0" + this.date[1].getUTCHours()).slice(-2)+':'+("0" + this.date[1].getUTCMinutes()).slice(-2)+':'+"00"
      }}
      
      console.log(this.id)
      fetch('http://localhost:8080/api/reservations/room', {
                method: 'POST',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(this.reservation)
                }).then(res => {
                    console.log(res)
                    return res.json()
                    }).then(res => {
                    console.log(res)                
                    console.log('colorek '+color)
                    if(res.length == 0)
                      color = 'green'
                    else
                      color = 'red'})
                      
      console.log(this.id)
    
      
console.log(color)      
        return color
      }
      // else
      //   return 'grey'      
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
