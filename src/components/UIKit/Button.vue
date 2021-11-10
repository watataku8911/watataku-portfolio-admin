<template>
  <button class="button" @click="push">
    {{ this.msg }}
  </button>
</template>

<script>
export default {
  props: ["msg"],
  methods: {
    push() {
      this.$emit("push");
    },
  },
};
</script>

<style scoped>
.button {
  border-radius: 10px;
  padding: 1%;
  font-size: 1em;
  background-color: #71ff71;
  color: #111;
  border-style: none;
  box-shadow: 3px 3px 3px 3px #ddd;
}
.button:hover {
  box-shadow: 0px 0px 0px 0px #ddd;
}
.button:disabled {
  box-shadow: 0px 0px 0px 0px #ddd;
  background: #efefef;
  opacity: 0.8;
}
</style>
