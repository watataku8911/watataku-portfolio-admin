<template>
  <div class="about">
    <section>
      <WorkAdd />
    </section>
  </div>
</template>

<script>
import firebase from "firebase"
import WorkAdd from '../components/WorkAdd'
export default {
  components: {
    WorkAdd
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if(user == null) {
        this.$router.push("/signin");
      }
    })

     //1時間後ログアウト
    setTimeout(() => {
      firebase.auth().signOut()
    }, 3600000);
  }
}
</script>
