<template>
  <div class="delete-component">
    <div class="load">
      <pulse-loader :loading="loading"></pulse-loader>
    </div>
    <table border="1" v-show="isLoadingFlg">
      <tr>
        <th>ID</th>
        <th>作品タイトル</th>
        <th>URL</th>
        <th>コメント</th>
        <th>画像</th>
        <th>カテゴリ</th>
        <th colspan="2">操作</th>
      </tr>
      <tr v-for="item in this.works" :key="item.id">
        <td>{{ item[0] }}</td>
        <td>{{ item[1].title }}</td>
        <td>
          <a :href="item[1].url" target="_blank">{{ item[1].url }}</a>
        </td>
        <td v-html="nl2br(item[1].description)" style="text-align: left"></td>
        <td><img :src="item[1].imagePath" width="80" height="120" /></td>
        <td v-html="categoryName(item[1].category_id)"></td>
        <td>
          <Button :disabled="false" msg="復活" @push="resurrection(item[0])" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader";
import { db } from "../firebase/index";
import Button from "./UIKit/Button";
export default {
  name: "HelloWorld",
  data() {
    return {
      loading: true,
      isLoadingFlg: false,
      works: [],
    };
  },
  components: {
    Button,
    PulseLoader,
  },
  created() {
    this.getWorks();
  },
  methods: {
    getWorks() {
      db.collection("works")
        .where("deleted_flg", "==", true)
        .get()
        .then((query) => {
          const workList = [];
          query.forEach((doc) => {
            const data = doc.data();
            workList.push([doc.id, data]);
            this.works = workList;
            this.isLoadingFlg = true;
            this.loading = false;
          });
        })
        .catch(() => {
          alert("インターネット接続を確認してからもう一度行ってください");
          this.getWorks();
        });
    },
    nl2br(str) {
      str = str.replace(/\r\n/g, "<br />");
      str = str.replace(/(\n|\r)/g, "<br />");
      return str;
    },
    categoryName(categoryId) {
      let categoryName = "";
      switch (categoryId) {
        case 1:
          categoryName = "WEBサイト";
          break;
        case 2:
          categoryName = "WEBアプリ";
          break;
        case 3:
          categoryName = "スマホアプリ";
          break;
        default:
          categoryName = "その他";
          break;
      }
      return categoryName;
    },
    resurrection(id) {
      if (confirm("復活させますか？")) {
        db.collection("works")
          .doc(id)
          .update({
            deleted_flg: false,
            deleted_at: "",
          });
        this.isLoadingFlg = false;
        this.works = [];
        this.getWorks();
      } else {
        return;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  width: 100%;
}
td {
  font-size: 12px;
}

a {
  color: #42b983;
}
</style>
