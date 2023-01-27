export default class WebSocketHandler{
    constructor(ws_path, onOpen, onMessage, onClose, onError) {
        onOpen = onOpen || function () {console.log("WebSocket connected")}
        onMessage = onMessage || function (msg, isBin) {console.log(isBin ? msg.toString() : msg)}
        onClose = onClose || function () {console.log("WebSocket closed")}
        onError = onError || function (err) {console.error("WebSocket error: " + err)}

        this.ws = new WebSocket(ws_path)

        this.ws.onopen = onOpen
        this.ws.onmessage = onMessage
        this.ws.onclose = onClose
        this.ws.onerror = onError
    }

    send(msg){
        if(typeof msg === 'object'){
            msg = JSON.stringify(msg)
        }

        this.ws.send(msg)
    }

    close(){
        if(this.ws && this.ws.readyState !== this.ws.CLOSED && this.ws.readyState !== this.ws.CLOSING){
            this.ws.close()
        }
    }
}
