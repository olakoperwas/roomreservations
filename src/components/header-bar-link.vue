<template>
  <!-- <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
  <h5 class="my-0 mr-md-auto font-weight-normal">Room reservations</h5>
  <nav class="md-auto">
    <p>aaaaaaaa</p>
    <a class="btn btn-outline-primary "><router-link to="/login">Sign In</router-link></a>
    <a class="btn btn-outline-primary"><router-link to="/register">Sign Up</router-link></a>
  </nav>
  </div> 
  -->

  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Room reservations</a>
  </div>
</nav>
</template>


<script>

export default {
  name: 'HeaderBar',
  data() {
    return {
      account: undefined,
      github: 'https://github.com/cmatskas',
      twitter: 'https://twitter.com/christosmatskas',
      signin: 'https://microsoft.com',
    };
  }
};
</script>