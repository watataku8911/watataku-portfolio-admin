<template>
  <div class="hello">
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
        <td>{{item[0]}}</td>
        <td>{{item[1].title}}</td>
        <td><a :href="item[1].url" target="_blank">{{item[1].url}}</a></td>
        <td v-html="nl2br(item[1].description)" style="text-align: left"></td>
        <td><img :src="item[1].imagePath" width="80" height="120"/></td>
        <td v-html="categoryName(item[1].category_id)"></td>
        <!-- <td v-html="item[1].category_id"></td> -->
        <td>
          <router-link :to="{ name: 'about', params: { id: item[0] }}" >
            <button>編集</button>
          </router-link>
        </td>
        <td><button @click="deleted(item[0])">削除</button></td>
      </tr>
    </table>
  </div>
</template>

<script>

import {db, FirebaseTimestamp} from "../firebase/index"
export default {
  name: 'HelloWorld',
  data() {
    return {
      isLoadingFlg: false,
      works: []
    }
  },
  
  created() {
    db.collection("works")
    .orderBy("updated_at", "desc")
    .where("deleted_flg", "==", false)
    .get()
    .then((query) => {
      const workList = [];
      query.forEach((doc) => {
        const data = doc.data();
        workList.push([doc.id,data]);
        this.works = workList;
        this.isLoadingFlg = true;
      })
    })
  },
  methods: {
    nl2br(str) {
      str = str.replace(/\r\n/g, "<br />");
      str = str.replace(/(\n|\r)/g, "<br />");
      return str;
    },
    categoryName(categoryId) {
      let categoryName = "";
      switch(categoryId) {
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
    deleted(id) {
      if(confirm("削除しますか？")) {
        db.collection("works").doc(id).update({
          deleted_flg: FirebaseTimestamp.now(),
          deleted_at: true
        })
      }
    }
  }
}
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
