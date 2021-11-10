<template>
  <div class="imagePreview">
    <img :src="this.imageUrl" width="50" height="50" alt />
  </div>
</template>

<script>
export default {
  props: ["imageUrl"],
};
</script>
<style scoped>
@media screen and (min-width: 1026px) {
  .imagePreview {
    height: 200px;
    width: 200px;
    background: rgb(240, 240, 240);
    overflow: hidden;
    border-radius: 50%;
    background-position: center center;
    background-size: cover;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    position: relative;
  }

  .imagePreview img {
    height: 200px;
    width: 200px;
  }
}

@media screen and (min-width: 482px) and (max-width: 1025px) {
  .imagePreview {
    height: 100px;
    width: 100px;
    background: rgb(240, 240, 240);
    overflow: hidden;
    border-radius: 50%;
    background-position: center center;
    background-size: cover;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    position: relative;
  }

  .imagePreview img {
    height: 100px;
    width: 100px;
  }
}

@media screen and (max-width: 481px) {
  .imagePreview {
    height: 50px;
    width: 50px;
    background: rgb(240, 240, 240);
    overflow: hidden;
    border-radius: 50%;
    background-position: center center;
    background-size: cover;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    position: relative;
  }

  .imagePreview img {
    height: 50px;
    width: 50px;
  }
}
</style>
