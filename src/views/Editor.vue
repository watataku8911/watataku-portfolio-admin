<template>
  <div class="about" style="text-align: -webkit-center">
    <section>
      <WorkAdd />
    </section>
  </div>
</template>

<script>
import { auth } from "../firebase/index";
import WorkAdd from "../components/WorkAdd";

export default {
  components: {
    WorkAdd,
  },
  data() {
    return {
      id: "",
    };
  },
  mounted() {
    const id = window.location.pathname.split("/about/")[1];
    this.id = id;

    auth.onAuthStateChanged((user) => {
      if (user == null) {
        this.$router.push("/signin");
      }
    });
  },
};
</script>
