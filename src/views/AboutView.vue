<template>
  <AppHeaderMain/>
  <div class="about">
    <h1></h1>
  </div>

  <v-stage :config="configKonva" id="kanva">
    <v-layer>
      <v-circle :config="configCircle"></v-circle>
    </v-layer>
  </v-stage>
  <b-button @click="getFloor" class="custom-btn">pokoje</b-button>
</template>
<script>
import AppHeaderMain from '../components/AppHeaderMain.vue'

    export default {
        name: 'About',
        
        data() {
    return {
      floor: null,
      login: {
        email: 'stud@localhost.com',
        password: 'Stud'
      },
      configKonva: {
        width: 800,
        height: 1000
      },
      configCircle: {
        x: 500,
        y: 500,
        radius: 70,
        fill: "green",
        stroke: "black",
        strokeWidth: 4
      }
    };
  },
  methods: {
    handleSubmit() {
  
               fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
                credentials: 'same-origin',
                body: JSON.stringify(this.login)
                }).then(res => res.json())
                .then(res => console.log(res))
                .then(res => this.$emit('login', res));
                console.log(this.login)
                this.login = {
                email: '',
                password: ''
                }
            },
async getFloor(){
      try{
        const response = await fetch("http://localhost:8080/api/floors/get/?number=1", {
          credentials: 'same-origin'
        })
        const data = await response.json()
        this.floor = data
      } catch(error){
        console.error(error)
      }
    },
  },
        components: {
            AppHeaderMain
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
