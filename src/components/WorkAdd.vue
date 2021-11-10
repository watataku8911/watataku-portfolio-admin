<template>
  <div class="edit">
    <div class="load">
      <pulse-loader :loading="loading"></pulse-loader>
    </div>
    <table border="1" class="table" v-show="isLoadingFlg">
      <tbody>
        <tr>
          <th>タイトル&nbsp;<span class="required">必須</span></th>
          <td>
            <TextInput
              v-model="title"
              type="text"
              placeholder="タイトルを入力してください。"
              name="addWorkWname"
              :value="title"
            />
          </td>
        </tr>
        <tr>
          <th>URL</th>
          <td>
            <TextInput
              v-model="url"
              type="text"
              placeholder="URLを入力してください。"
              name="addWorkUrl"
              :value="url"
            />
          </td>
        </tr>
        <tr>
          <th>コメント&nbsp;<span class="required">必須</span></th>
          <td>
            <TextArea
              v-model="description"
              name="addWorkBody"
              placeholder="コメントを入力してください"
              cols="100"
              rows="15"
              :value="description"
            />
          </td>
        </tr>
        <tr>
          <th>画像&nbsp;<span class="required">必須</span></th>
          <td>
            <div class="imgContent">
              <ImagePreview :imageUrl="imageUrl" />
              <div class="module--spacing--largeSmall"></div>
              <UploadFile @fileList="setFileList" />
            </div>
          </td>
        </tr>
        <tr>
          <th>カテゴリー&nbsp;<span class="required">必須</span></th>
          <td>
            <SelectBox
              :categoryId="this.categoryId"
              name="selectBox"
              :options="this.categories"
              @input="setCategoryId"
            />
          </td>
        </tr>
        <tr>
          <th>ツイート</th>
          <td
            style="display: flex; justify-content: space-around; width: 100%;"
          >
            <p v-if="!isTweetFlg">ツイートする</p>
            <p v-else>ツイートしない</p>
            <Button
              :disabled="false"
              msg="ツイートの切り替え"
              @push="changeTweetFlg"
            />
          </td>
        </tr>
        <tr>
          <td
            colspan="2"
            class="submit"
            v-if="id == 'new'"
            v-show="isLoadingFlg"
          >
            <Button :disabled="false" msg="登録" @push="add" />
          </td>
          <td colspan="2" class="submit" v-else v-show="isLoadingFlg">
            <Button :disabled="false" msg="編集" @push="edit" />
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="isTitleFlg" style="color: red;">タイトルが未入力です</p>
    <p v-if="isDescriptionFlg" style="color: red;">コメントが未入力です</p>
    <p v-if="isDropingFlg" style="color: red;">画像が選択されてない</p>
    <p v-if="isCategoryIdFlg" style="color: red;">カテゴリが未選択です</p>
  </div>
</template>

<script>
import { db, storage, FirebaseTimestamp } from "../firebase/index";
import { apiUrl } from "../seacretDirectory/seacret";
import { genalateRandomFileName } from "../functions/common";
import axios from "axios";

import TextInput from "./UIKit/TextInput";
import TextArea from "./UIKit/TextArea";
import ImagePreview from "./UIKit/ImagePreview";
import UploadFile from "./UIKit/UploadFile";
import SelectBox from "./UIKit/SelectBox";
import Button from "./UIKit/Button";
import PulseLoader from "vue-spinner/src/PulseLoader";

export default {
  data() {
    return {
      id: this.$route.params.id,
      title: "",
      description: "",
      url: "",
      fileList: null,
      imageUrl: "",
      categoryId: "",
      categories: [],
      isSelected: false,

      isTitleFlg: false,
      isDescriptionFlg: false,
      isDropingFlg: false,
      isCategoryIdFlg: false,
      isLoadingFlg: false,
      isTweetFlg: false,
      loading: true,
    };
  },
  components: {
    TextInput,
    TextArea,
    ImagePreview,
    UploadFile,
    SelectBox,
    Button,
    PulseLoader,
  },
  created() {
    if (this.id != "new") {
      this.getCategories();
      this.findByPk();
    } else {
      this.getCategories();
    }
  },
  methods: {
    // 画像がドロップされた時に実行
    setFileList(fileList) {
      this.fileList = fileList;
      const imageUrl = URL.createObjectURL(fileList[0]);
      this.imageUrl = imageUrl;
    },
    setCategoryId(input) {
      this.categoryId = input;
    },

    // セレクトボックス生成メソッド
    async getCategories() {
      await db
        .collection("categories")
        .orderBy("category_id")
        .get()
        .then((query) => {
          const categoryList = [];
          query.forEach((doc) => {
            const data = doc.data();
            categoryList.push(data);
            this.categories = categoryList;

            this.isLoadingFlg = true;
            this.loading = false;
          });
        })
        .catch(() => {
          alert("インターネット接続を確認してからもう一度行ってください");
          this.getCategories();
        });
    },

    // 主キー検索メソッド
    async findByPk() {
      await db
        .collection("works")
        .doc(this.id)
        .get()
        .then((query) => {
          const data = query.data();

          this.title = data.title;
          this.url = data.url;
          this.description = data.description;
          this.imageUrl = data.imagePath;
          this.categoryId = data.category_id;

          this.isLoadingFlg = true;
          this.loading = false;
        })
        .catch(() => {
          alert("インターネット接続を確認してからもう一度行ってください");
          this.findByPk();
        });
    },

    // 追加ボタンが押されたら実行するメソッド
    add() {
      this.loading = true;
      this.isLoadingFlg = false;
      let errFlg = this.validation();
      if (!errFlg) {
        let blob = new Blob(this.fileList, { type: "image/jpeg" });
        let fileName;
        fileName = genalateRandomFileName();
        const uploadRef = storage.ref("images").child(fileName);
        const uploadTask = uploadRef.put(blob);
        uploadTask
          .then(() => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.addWork(downloadURL);
            });
          })
          .catch(() => {
            alert("インターネット接続を確認してからもう一度行ってください");
          });
      } else {
        this.isLoadingFlg = true;
        this.loading = false;
      }
    },

    // 編集ボタンが押されたら実行するメソッド
    edit() {
      this.loading = true;
      this.isLoadingFlg = false;
      let errFlg = this.validation();

      if (!errFlg) {
        if (this.fileList == null) {
          this.editWork(this.imageUrl);
        } else {
          let blob = new Blob(this.fileList, { type: "image/jpeg" });
          let fileName;
          fileName = genalateRandomFileName();
          const uploadRef = storage.ref("images").child(fileName);
          const uploadTask = uploadRef.put(blob);
          uploadTask
            .then(() => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                this.editWork(downloadURL);
              });
            })
            .catch(() => {
              alert("インターネット接続を確認してからもう一度行ってください");
            });
        }
      } else {
        this.isLoadingFlg = true;
        this.loading = false;
      }
    },

    // バリデーションメソッド
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
      if (this.imageUrl == "") {
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

    // ツイートするか否かのメソッド
    changeTweetFlg() {
      if (!this.isTweetFlg) {
        this.isTweetFlg = true;
      } else {
        this.isTweetFlg = false;
      }
    },

    // work情報追加
    addWork(downloadURL) {
      db.collection("works")
        .add({
          title: this.title,
          url: this.url,
          description: this.description,
          imagePath: downloadURL,
          category_id: Number(this.categoryId),
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
    },

    // work情報編集
    editWork(downloadURL) {
      db.collection("works")
        .doc(this.id)
        .update({
          title: this.title,
          url: this.url,
          description: this.description,
          imagePath: downloadURL,
          category_id: Number(this.categoryId),
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
    },
  },
};
</script>

<style scoped>
.required {
  color: red;
}

.table {
  width: 1000px;
}

td {
  text-align: center;
}
@media screen and (min-width: 1026px) {
  .imgContent {
    width: 90%;
    max-width: 700px;
    height: 35vh;
    margin: auto;
    margin-bottom: 10px;
    background-color: #ccc;
    padding-top: 5%;
  }
}

@media screen and (min-width: 482px) and (max-width: 1025px) {
  .imgContent {
    width: 90%;
    max-width: 700px;
    height: 20vh;
    margin: auto;
    margin-bottom: 10px;
    background-color: #ccc;
    padding-top: 5%;
  }
}

@media screen and (max-width: 481px) {
  .imgContent {
    width: 90%;
    max-width: 700px;
    height: 200px;
    margin: auto;
    margin-bottom: 10px;
    background-color: #ccc;
    padding-top: 5%;
  }
}
</style>
