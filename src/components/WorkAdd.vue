<template>
  <div class="edit">
    <div class="tweetButton">
      <button @click="changeTweetFlg">ツイート切り替え</button>
      <p v-if="!isTweetFlg">ツイートする</p>
      <p v-else>ツイートしない</p>
    </div>
    <p v-if="isTitleFlg" style="color: red;">タイトルが未入力です</p>
    <p v-if="isDescriptionFlg" style="color: red;">コメントが未入力です</p>
    <p v-if="isDropingFlg" style="color: red;">画像が選択されてない</p>
    <p v-if="isCategoryIdFlg" style="color: red;">カテゴリが未選択です</p>
    <table border="1" class="table" v-show="isLoadingFlg">
      <tbody>
        <tr>
          <th>タイトル&nbsp;<span class="required">必須</span></th>
          <td>
            <input
              type="text"
              id="addWorkWname"
              name="addWorkWname"
              value=""
              size="100"
              v-model="title"
            />
          </td>
        </tr>
        <tr>
          <th>URL&nbsp;<span class="required">必須</span></th>
          <td>
            <input
              type="text"
              id="addWorkUrl"
              name="addWorkUrl"
              value=""
              size="100"
              v-model="url"
            />
          </td>
        </tr>
        <tr>
          <th>コメント&nbsp;<span class="required">必須</span></th>
          <td>
            <textarea
              id="addWorkBody"
              name="addWorkBody"
              cols="100"
              rows="15"
              v-model="description"
            ></textarea>
          </td>
        </tr>
        <tr>
          <th>画像&nbsp;<span class="required">必須</span></th>
          <td>
            <input
              type="file"
              id="addWorkImage"
              name="addWorkImage"
              mulitple="multiple"
              @change="onDrop"
            />
            <p v-if="this.imagePath">
              <img
                :src="this.imagePath"
                width="200"
                height="200"
                :alt="this.imagePath"
                class="editImage"
              />
            </p>
            <p v-if="!this.imagePath" style="height: 200px;">
              画像パスが出来ていません
            </p>
          </td>
        </tr>
        <tr>
          <th>カテゴリー&nbsp;<span class="required">必須</span></th>
          <td>
            <select name="categories" v-model="categoryId">
              <option
                v-for="item in this.categories"
                v-bind:key="item.cetegory_id"
                :value="item.category_id"
              >
                {{ item.category_name }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td colspan="2" class="submit" v-if="id == 0" v-show="isLoadingFlg">
            <input type="submit" value="登録" @click="add()" />
          </td>
          <td colspan="2" class="submit" v-if="id != 0" v-show="isLoadingFlg">
            <input type="submit" value="編集" @click="edit()" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db, storage, FirebaseTimestamp } from "../firebase/index";
import { apiUrl } from "../seacretDirectory/seacret";
import axios from "axios";

export default {
  data() {
    return {
      id: this.$route.params.id,
      title: "",
      description: "",
      url: "",
      imagePath: "",
      categoryId: "",

      categories: [],

      isTitleFlg: false,
      isDescriptionFlg: false,
      isDropingFlg: false,
      isCategoryIdFlg: false,
      isLoadingFlg: false,
      isTweetFlg: false,
    };
  },
  created() {
    db.collection("categories")
      .orderBy("category_id")
      .get()
      .then((query) => {
        const categoryList = [];
        query.forEach((doc) => {
          const data = doc.data();
          categoryList.push(data);
          this.categories = categoryList;
          this.isLoadingFlg = true;
        });
      });
  },
  mounted() {
    if (this.id != 0) {
      db.collection("works")
        .doc(this.id)
        .get()
        .then((query) => {
          const data = query.data();
          this.title = data.title;
          this.url = data.url;
          this.description = data.description;
          this.imagePath = data.imagePath;
          this.categoryId = data.category_id;
          this.isLoadingFlg = true;
        });
    }
  },
  methods: {
    onDrop(event) {
      //画像データ取得
      const fileList = event.target.files || event.dataTransfer.files;
      this.imageName = fileList[0].name;
      let errFlg;
      let blob;
      if (fileList[0].type == "image/png") {
        blob = new Blob(fileList, { type: "image/png" });
        errFlg = false;
      } else if (fileList[0].type == "image/jpg") {
        blob = new Blob(fileList, { type: "image/jpg" });
        errFlg = false;
      } else if (fileList[0].type == "image/jpeg") {
        blob = new Blob(fileList, { type: "image/jpeg" });
        errFlg = false;
      } else if (fileList[0].type == "image/gif") {
        blob = new Blob(fileList, { type: "image/gif" });
        errFlg = false;
      } else {
        errFlg = true;
      }
      if (!errFlg) {
        //this.isLoadingFlg = true;
        this.uploadImage(blob, fileList);
      }
    },
    uploadImage(blob, fileList) {
      const storageRef = storage.ref();
      const mountainsRef = storageRef.child(fileList[0].name);
      mountainsRef.put(blob).then(() => {
        mountainsRef.getDownloadURL().then((url) => {
          this.imagePath = url;
        });
      });
    },
    add() {
      this.isLoadingFlg = false;
      let errFlg = this.validation();
      if (!errFlg) {
        this.isLoadingFlg = false;
        db.collection("works")
          .add({
            title: this.title,
            url: this.url,
            description: this.description,
            imagePath: this.imagePath,
            category_id: this.categoryId,
            created_at: FirebaseTimestamp.now(),
            updated_at: FirebaseTimestamp.now(),
            deleted_flg: false,
            deleted_at: "",
          })
          .then((doc) => {
            if (!this.isTweetFlg) {
              axios
                .post(apiUrl(doc.id))
                .then(() => {
                  this.$router.push("/");
                })
                .catch((err) => {
                  alert(err);
                });
            } else {
              this.$router.push("/");
            }
          });
      } else {
        this.isLoadingFlg = true;
      }
    },
    edit() {
      this.isLoadingFlg = false;
      let errFlg = this.validation();

      if (!errFlg) {
        db.collection("works")
          .doc(this.id)
          .update({
            title: this.title,
            url: this.url,
            description: this.description,
            imagePath: this.imagePath,
            category_id: this.categoryId,
            updated_at: FirebaseTimestamp.now(),
          })
          .then(() => {
            if (!this.isTweetFlg) {
              axios
                .put(apiUrl(this.id))
                .then(() => {
                  this.$router.push("/");
                })
                .catch((err) => {
                  alert(err);
                });
            } else {
              this.$router.push("/");
            }
          });
      } else {
        this.isLoadingFlg = true;
      }
    },
    validation() {
      let errFlg = false;
      if (this.title.length == 0) {
        this.isTitleFlg = true;
        errFlg = true;
      } else {
        this.isTitleFlg = false;
      }
      if (this.description.length == 0) {
        this.isDescriptionFlg = true;
        errFlg = true;
      } else {
        this.isDescriptionFlg = false;
      }
      if (this.imagePath.length == 0) {
        this.isDropingFlg = true;
        errFlg = true;
      } else {
        this.isDropingFlg = false;
      }
      if (this.categoryId.length == 0) {
        this.isCategoryIdFlg = true;
        errFlg = true;
      } else {
        this.isCategoryIdFlg = false;
      }
      return errFlg;
    },
    changeTweetFlg() {
      if (!this.isTweetFlg) {
        this.isTweetFlg = true;
      } else {
        this.isTweetFlg = false;
      }
    },
  },
};
</script>

<style scoped>
.edit {
  width: 100%;
}
.tweetButton {
  position: absolute;
}
.table {
  margin: 20px auto;
}
td {
  width: 100px;
}
.editImage {
  border: 1px solid #000;
  border-radius: 50%;
}
</style>
