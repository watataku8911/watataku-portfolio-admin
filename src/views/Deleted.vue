<template>
  <DeletedComponent />
</template>

<script>
import { auth } from "../firebase/index";
import DeletedComponent from "../components/DeletedComponent.vue";
export default {
  components: {
    DeletedComponent,
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

<style scoped></style>
