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
                id: room.roomId,
                width: room.width,
                height: room.height,
                fill: room.color,
                stroke: 'black',
              }"
            ></v-rect>
          </v-layer>
      </v-stage>
      </div>
      <div class="col-4">
        <div>
            <Datepicker v-model="date" @update:modelValue="updateColors()" range inline/>
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
            floor_rooms: {},
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
        this.floor.rooms.forEach((r) => {
            this.floor_rooms[r.roomId] = r
            this.floor_rooms[r.roomId].color = 'grey'
        }) 
        console.log(this.floor_rooms)
        console.log('CZYTO JEST WYWOLYWANE')
      } catch(error){
        console.error(error)
      }     
  },
  methods: {
    handleClickOnRoom(roomId) {
        console.log(roomId)
        this.getRoomReservations(roomId)
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
        fetch('http://localhost:8080/api/reservations/room', {
                  method: 'POST',
                  headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
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
      async getColor(roomId) {
        var col = this.getRoomReservations(roomId)
        return col
      },
      updateColors(){
        console.log("wszedlem do update")
        for(const [key, value] of Object.entries(this.floor_rooms)){
          const col = this.getRoomReservations(key)
          // console.log("zwrocony kolor" + col)
          // value['color'] = col
          // this.floor_rooms[key] = value
          console.log(this.floor_rooms[key])
        }
      },   
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
