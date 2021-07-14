<template>
  <div class="home">
    <HelloWorld />
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld,
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user == null) {
        this.$router.push("/signin");
      }
    });
    //1時間後ログアウト
    setTimeout(() => {
      firebase.auth().signOut();
    }, 3600000);
  },
};
</script>
