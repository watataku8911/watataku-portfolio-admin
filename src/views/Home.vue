<template>
  <div class="home">
    <HelloWorld />
  </div>
</template>

<script>
import { auth } from "../firebase/index";
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld,
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user == null) {
        this.$router.push("/signin");
      }
    });
  },
};
</script>
