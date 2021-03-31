<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">WorkList</router-link> |
      <router-link to="/about/0">WorkAdd</router-link>
      <button @click="logout()" class="logout">logout</button>
    </div>
    
    <router-view/>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  methods: {
    logout() {
      firebase.auth().signOut()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  margin: auto;
  padding: 10px 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

.logout {
  display: block;
  margin-left: auto;
}
</style>
