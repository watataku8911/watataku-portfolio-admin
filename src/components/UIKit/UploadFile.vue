<template>
  <label for="corporation_file" class="btn btn-success">
    画像を設定する
    <input
      type="file"
      class="file_input"
      style="display:none;"
      id="corporation_file"
      mulitple="multiple"
      @change="onDrop"
    />
  </label>
</template>

<script>
export default {
  methods: {
    onDrop(e) {
      const imageFile = e.target.files;
      this.$emit("fileList", imageFile);
    },
  },
};
</script>

<style scoped>
label {
  background-color: #fff;
  padding: 1%;
  width: 40%;
  margin: 0 auto;
  box-shadow: 1px 1px 8px 0px #000;
  display: block;
}
</style>
