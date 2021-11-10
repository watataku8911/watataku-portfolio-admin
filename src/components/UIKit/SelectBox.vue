<template>
  <select :name="this.name" @input="updateValue" :value="this.categoryId">
    <option disabled value="">選択してください</option>
    <option
      v-for="(option, index) in this.options"
      :key="index"
      :value="index + 1"
      >{{ option.category_name }}</option
    >
  </select>
</template>

<script>
export default {
  props: {
    categoryId: { type: Number, required: true },
    name: { type: String, required: true },
    options: { type: Array, required: true },
  },
  methods: {
    updateValue(e) {
      this.$emit("input", e.target.value);
    },
  },
};
</script>
