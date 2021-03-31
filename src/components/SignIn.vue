<template>
    <div>
        <p v-if="isEmailFlg">
        <font color="red">メールアドレスを入力して下さい。</font>
        </p>
        <p v-if="isMachEmailFlg">
        <font color="red">メールアドレスを正しく入力して下さい。</font>
        </p>
         <p v-if="isPasswdFlg">
        <font color="red">パスワードを入力して下さい。</font>
        </p>
        <p v-if="isOkPasswdFlg">
        <font color="red">8文字以上の半角英数字で入力して下さい</font>
        </p>
        <p v-if="isLoginErrFlg">
        <font color="red">ログインに失敗しました。</font>
        </p>
        <h2>ログイン</h2>
        <table border="1">
            <tr>
            <td>
                <input
                type="text"
                placeholder="メールアドレス"
                v-model="email"
                value=""
                class="loginHoge"
                />
            </td>
            </tr>
            <tr>
            <td>
                <p>※8文字以上で半角英数字</p>
                <input
                type="password"
                placeholder="パスワード"
                v-model="password"
                value=""
                class="loginHoge"
                />
            </td>
            </tr>
            <tr>
            <td>
                <button class="login-button" @click="login" v-show="!isLoadingFlg">
                ログイン
                </button>
                <div class="loading">
                <pulse-loader :loading="isLoadingFlg"></pulse-loader>
                </div>
            </td>
            </tr>
        </table>
      </div>
</template>

<script>
import {auth} from "../firebase/index"
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
    components: {
    PulseLoader
  },
  data() {
    return {
      email: "",
      password: "",
      isEmailFlg: false, //メアド未入力フラグ
      isMachEmailFlg: false, //メアドチェックフラグ
      isPasswdFlg: false, //パスワード未入力エラーフラグ
      isOkPasswdFlg: false, //半角英数字チェックフラグ
      isLoginErrFlg: false, //ログインエラーフラグ
      isLoadingFlg: false //ローディングフラグ
    };
  },
  methods: {
    login() {
      const regexp = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
      const halfWidth = /^([a-zA-Z0-9]{8,})$/;
      let errFrg = false;
      if (this.email.length == 0) {
        this.isEmailFlg = true;
        this.isMachEmailFlg = false;
        errFrg = true;
      } else if (!regexp.test(this.email)) {
        this.isEmailFlg = false;
        this.isMachEmailFlg = true;
        errFrg = true;
      } else {
        this.isEmailFlg = false;
        this.isMachEmailFlg = false;
        this.isLoginErrFlg = false;
      }
      if (this.password.length == 0) {
        this.isPasswdFlg = true;
        this.isOkPasswdFlg = false;
        errFrg = true;
      } else if (!halfWidth.test(this.password)) {
        this.isPasswdFlg = false;
        this.isOkPasswdFlg = true;
        errFrg = true;
      } else {
        this.isPasswdFlg = false;
        this.isOkPasswdFlg = false;
        this.isLoginErrFlg = false;
      }
      if (!errFrg) {
        this.isLoadingFlg = true;
        auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            // ログインしたら飛ぶページを指定
            this.$router.push("/");
          })
          .catch(() => {
            this.isLoginErrFlg = true;
            this.isLoadingFlg = false;
          });
      }
    }
  }

}
</script>

<style scoped>
table {
    width: 100px;
    margin: 0 auto;
}
</style>