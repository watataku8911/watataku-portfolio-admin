<template>
  <div class="about" style="text-align: -webkit-center">
    <section>
      <WorkAdd />
    </section>
  </div>
</template>

<script>
import firebase from "firebase";
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
    //console.log(this.id);

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
