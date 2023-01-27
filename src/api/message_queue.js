import {ref} from "vue";

export const message_queue = ref([])

function time_format(time) {
    return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}

export function queue_push(msg){
    let username = "username" in msg ? msg.username : "匿名用户"
    let userid = "userid" in msg ? msg.userid : 0  // -1 for system, 0 for no uid user
    let str = "str" in msg ? msg.str : "msg" in msg ? msg.msg : "没有任何消息"
    let time = "time" in msg ? msg.time : time_format(new Date())
    message_queue.value.push({userid, username, str, time})
    while(message_queue.value.length >= 30){
        message_queue.value.splice(0, 1)
    }
}
