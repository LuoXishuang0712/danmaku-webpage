<template>
  <div>
    <div class="sign-container">
      <div>
        <h1>登录</h1>
        <el-input v-model="login_form.username" placeholder="username"></el-input>
        <el-input v-model="login_form.password" placeholder="password" type="password"></el-input>
        <el-button type="primary" @click="handleOnLogin">LOGIN</el-button>
      </div>
      <div>
        <h1>注册</h1>
        <el-input v-model="reg_form.username" placeholder="username"></el-input>
        <el-input v-model="reg_form.password" placeholder="password" type="password"></el-input>
        <el-input v-model="reg_form.password_confirm" placeholder="confirm password" type="password"></el-input>
        <div class="info">随便写个密码就行，不要用常用密码，后端明文存的（</div>
        <el-button type="primary" @click="handleOnRegister">REGISTER</el-button>
      </div>
    </div>
    <div class="sign-background" @click="onBackgroundClick"></div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const emit = defineEmits(['onLoginCallback', 'onRegisterCallback', 'onHideCallback'])

const reg_form = ref({
  username: '',
  password: '',
  password_confirm: ''
})

const login_form = ref({
  username: '',
  password: ''
})

function handleOnLogin(){
  emit("onLoginCallback", login_form.value)
}

function handleOnRegister(){
  emit("onRegisterCallback", reg_form.value)
}

function onBackgroundClick(){
  emit("onHideCallback")
}
</script>

<style scoped lang="less">
@float-width: 500px;
.sign-container{
  width: @float-width;
  min-height: 100px;
  display: flex;
  flex-direction: row;
  padding: 10px 0;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 5px 5px 10px #ccc;
  background: #fff;
  position: fixed;
  left: calc(50vw - (@float-width * 0.5));
  top: 200px;
  z-index: 100;

  &>div{
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    h1{
      margin: 10px 0;
      font-weight: normal;
      font-size: 1.4rem;
      text-align: center;
    }
    *{
      margin: 5px 0;
    }
    .info{
      font-weight: lighter;
      font-size: 0.5rem;
      color: #888;
    }
  }
  &>div:first-child{
    border-right: 1px solid #eee;
  }
}
.sign-background{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #0008;
  z-index: 10;
}
</style>
