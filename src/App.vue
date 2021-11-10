<template>
  <div id="app">
    <Button class="logout" :disabled="false" msg="logout" @push="logout" />
    <div id="nav">
      <router-link to="/">WorkList</router-link>｜
      <router-link to="/editor/new">WorkAdd</router-link>｜
      <router-link to="/deleted">WorkDeleted</router-link>
    </div>
    <main class="site-main">
      <router-view />
    </main>
  </div>
</template>

<script>
import { auth } from "./firebase/index";
import Button from "./components/UIKit/Button";

export default {
  components: {
    Button,
  },
  methods: {
    logout() {
      auth.signOut();
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
