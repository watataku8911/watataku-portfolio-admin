<template>
  <textarea
    class="textarea"
    :placeholder="this.placeholder"
    :cols="this.cols"
    :rows="this.rows"
    :name="this.name"
    @input="updateValue"
    :value="this.value"
  >
  </textarea>
</template>

<script>
export default {
  props: {
    placeholder: { type: String },
    cols: { type: String },
    rows: { type: String },
    name: { type: String },
    value: { type: String },
  },
  methods: {
    updateValue(e) {
      this.$emit("input", e.target.value);
    },
  },
};
</script>

<style scoped>
.textarea {
  width: 100%;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  font-size: 2vh;
}
</style>
