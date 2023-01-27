<template>
  <div style="width: 100%; height: 100%;" v-show="status.sign_show">
    <sign id="sign" @onLoginCallback="onLoginCallback" @onRegisterCallback="onRegisterCallback" @onHideCallback="onSignHideCallback"></sign>
  </div>
  <div class="video-container">
    <div class="video">
      <div></div>
    </div>
    <div class="danmaku">
      <div class="replies-container">
        <div class="reply" v-for="(item, i) in message_queue" :key="i">
          <div>
            <div :class="item.userid === -1 ? 'username username-system' : item.userid === user.userid ? 'username username-highlight' : 'username'">{{ item.username }}</div>
            <div class="time">{{ item.time }}</div>
          </div>
          <div>{{ item.str }}</div>
        </div>
      </div>
      <div class="input-container">
        <el-input
          v-model="danmaku_input"
          maxlength="30"
          placeholder="发送一条弹幕试试！"
          show-word-limit
          type="textarea"
          resize="none"
          class="send-text"
          :disabled="ws === null || !status.live"
        />
        <div class="send-btn">
          <el-button type="success" :disabled="ws === null || !status.live" @click="onDanmakuSend">发送!</el-button>
        </div>
      </div>
    </div>
  </div>
  <div class="fixed-btn">
    <el-button type="primary" @click="onLoginShow" v-show="!status.login">登录 / 注册</el-button>
    <el-button type="danger" @click="onLogoutShow" v-show="status.login">注销 : {{ user.username }}</el-button>
    <el-button @click="onLiveStatusChange" v-show="status.anchor" :type="status.live ? 'warning' : 'success'">{{ status.live ? '下播' : '开播' }}</el-button>
  </div>
</template>

<script setup>
import {ref, inject, computed} from "vue";
import Cookies from 'js-cookie'
import Sign from "@/components/sign.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import { useRoute, useRouter } from 'vue-router'
import WebSocketHandler from "@/api/ws";
import { queue_push, message_queue } from "@/api/message_queue.js";

const global = inject('global')
const route = useRoute()
const router = useRouter()

const danmaku_input = ref('')
const status = ref({
  sign_show: false,  // the sign components show status
  login: false,      // is this user login
  anchor: false,     // is this account anchor
  enable: true,      // indicates this page is normal or not
  live: false,       // the live status of this room
})

const roomid = ref(null)
const user = ref({
  username: null,
  userid: null
})

let timer = null

const ws = ref(null)
function conn_ws() {
  ws.value = new WebSocketHandler("ws://localhost:8001/", () => {
    let token = Cookies.get('token')
    if(roomid.value !== null && token){
      ws.value.send({command: "CLIENT_INIT_ROOMID", roomid: roomid.value, token})
    }
    else{
      ws.value.close()
    }
  }, (data) => {
    if(!(typeof data === "object")){
      console.error("WebSocket消息类型错误")
      return
    }
    let json_data = JSON.parse(data.data)
    switch(json_data.command){
      case "SERVER_INIT_ROOMID": {
        if(!json_data.status){
          queue_push({
            username: "SYSTEM",
            userid: -1,
            str: json_data.msg
          })
          break
        }

        let token = Cookies.get('token')
        if(timer !== null){
          try {
            clearInterval(timer)
          } catch (ignored) { }
          timer = null
        }
        timer = setInterval(() => {
          ws.value.send({command: "CLIENT_HEART_BEAT", roomid: roomid.value, token})
        }, 1000 * 60 * 2)  // 2 minutes to keep alive

        ws.value.send({command: "CLIENT_GET_HISTORY", roomid: roomid.value, token})
        break
      }
      case "SERVER_GET_HISTORY": {
        if(!json_data.status){
          queue_push({
            username: "SYSTEM", userid: -1, str: json_data.msg
          })
          return
        }
        for(let index in json_data.data.data){
          queue_push(json_data.data.data[index])
        }
        break
      }
      case "SERVER_SEND_MESSAGE": {
        if(json_data.status){
          ElMessage.success(json_data.msg)
          danmaku_input.value = ''
        }
        else{
          ElMessage.error(json_data.msg)
        }
        break
      }
      case "SERVER_BROADCAST": {
        if(!("data" in json_data)){
          return
        }
        let broadcast_data = JSON.parse(json_data.data)
        if(broadcast_data.userid === -1){  // system broadcast
          update_live_status(false)
        }
        queue_push(broadcast_data)
        break
      }
    }
  }, () => {
    if(timer !== null){
      try{
        clearInterval(timer)
      } catch (ignored) { }
    }
    console.log("WebSocket连接断开")
  }, (err) => {
    console.error(err)
  })
}

window.onbeforeunload = () => {
  ws.value.close()
}

function onDanmakuSend(){
  if(ws.value === null){
    return
  }
  let token = Cookies.get('token')
  if(!roomid.value || !token){
    return
  }
  ws.value.send({command: "CLIENT_SEND_MESSAGE", token, roomid: roomid.value, message: danmaku_input.value})
}

function roomid_alert(msg){
  if(msg === undefined){
    msg = ''
  }
  else{
    msg = ": " + msg
  }
  ElMessage.warning("请求URL出错，请重新进入" + msg)
  status.value.enable = false
}

function renew_token(){
  if(!Cookies.get('token')){
    return
  }
  let token = Cookies.get('token')
  global.axios.post(
    global.backend.value + 'verify/',
    {token}
  ).then((res) => {
    if(!res.data.status){
      ElMessage.warning("登录已失效，请重新登录！")
      Cookies.remove('token')
      status.value.login = false
    }
    else{
      status.value.login = true
      user.value.userid = res.data.data.user_id
      user.value.username = res.data.data.user_name
      check_anchor()
    }
  }).catch((err) => {
    ElMessage.warning("网络错误，请检查网络连接")
  })
}

function check_anchor(){
  if(!Cookies.get('token')){
    return
  }
  let token = Cookies.get('token')
  global.axios.post(
    global.backend.value + 'anchor/',
    {token}
  ).then((res) => {
    if(res.data.status){
      status.value.anchor = (roomid.value === res.data.room)
    }
  })
}

function update_live_status(renew=true){
  global.axios.post(
    global.backend.value + 'status/',  // live status and roomid verify
    {
      roomid: roomid.value
    }
  ).then((res) => {
    if(!res.data.status){
      roomid_alert(res.data.msg)
    }
    else{
      status.value.live = res.data.live.status
    }
  }).catch((err) => {
    console.error(err)
  })
  if(renew){
    renew_token()
  }
}

function onLoginCallback(form){
  global.axios.post(
    global.backend.value + "login/",
    {
      username: form.username,
      password: form.password
    }
  ).then((res) => {
    if(res.data.status){
      ElMessage.success("登录成功")
      Cookies.set('token', res.data.token, { expires: 14 })
      renew_token()
      conn_ws()
    }
    else{
      ElMessage.warning("登录失败！")
      console.log(res)
    }
    onSignHideCallback()
  }).catch((err) => {
    ElMessage.warning("网络错误，请检查网络后重试")
    console.error(err)
    onSignHideCallback()
  })
}

function onRegisterCallback(form){
  if(form.password !== form.password_confirm){
    ElMessage.warning("passwords do not match")
    return
  }
  global.axios.post(
    global.backend.value + "register/",
    {
      username: form.username,
      password: form.password
    }
  ).then((res) => {
    if(res.data.status){
      ElMessage.success("注册成功,请重新登录")
    }
    else{
      ElMessage.warning("注册失败！")
      console.log(res)
    }
    onSignHideCallback()
  }).catch((err) => {
    ElMessage.warning("网络错误，请检查网络后重试")
    console.log(err)
    onSignHideCallback()
  })
}

function onLoginShow() {
  status.value.sign_show = true
}

function onLogoutShow() {
  ElMessageBox.confirm(
    '确定要注销吗，您可以通过账号密码重新登入',
    '注销',
    {
      confirmButtonText: '确定',
      cancelButtonText: '我再想想',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('登出成功，即将刷新页面')
    Cookies.remove('token')
    setTimeout(() => {
      router.go(0)
    }, 1500)
  }).catch(() => {

  })
}

function onSignHideCallback(){
  status.value.sign_show = false
}

function onLiveStatusChange() {  // check live status
  if(!status.value.anchor){
    return
  }
  let token = Cookies.get('token')
  if(!token){
    return
  }
  global.axios.post(
    global.backend.value + 'live/',
    {roomid: roomid.value, token, command: status.value.live ? 'STREAM_STOP' : 'STREAM_START'}
  ).then((res) => {
    if(res.data.status){
      update_live_status(false)
    }
  }).catch((err) => {
    console.error(err)
  })
}

// default running
if(!route.query.roomid){
  roomid_alert()
}
else{
  roomid.value = route.query.roomid
  update_live_status()
  conn_ws()
}
</script>

<style scoped lang="less">
@danmaku-width: 300px;
#sign{
}
.video-container{
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  .video{
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    vertical-align: center;
    justify-content: center;
    &>div{
      max-width: calc(100vw - @danmaku-width);
      aspect-ratio: calc(16/9);
      background: #ccc;
    }
  }
  .danmaku {
    width: @danmaku-width;
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    margin: 20px;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #ccc;
    &>div{
      width: calc(100% - 20px);
      margin: 10px;
    }
    .replies-container{
      flex: 1;
      overflow-y: auto;
      .reply{
        display: flex;
        flex-direction: column;
        font-size: 0.8em;
        &>div{
          display: flex;
          flex-direction: row;
          div{
            margin-right: 3px;
          }
        }
        .username{
          font-weight: bold;
        }
        .username-highlight{
          color: #00dd00;
        }
        .username-system{
          color: #dddd00;
        }
        .time{
          color: #888888;
        }
      }
    }
    .input-container{
      border-top: 1px solid #eee;
      padding-top: 10px;
      height: 120px;
      .send-btn{
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
        margin: 10px 0;
      }
    }
  }
}
.fixed-btn{
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
  flex-direction: row;
}
</style>
