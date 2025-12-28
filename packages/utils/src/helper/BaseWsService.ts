import { EventEmitter, MyLog } from "@noah-libjs/utils";
import { isString } from "lodash";
import ReconnectingWebSocket from "reconnecting-websocket";
import { WebSocketEventListenerMap } from "reconnecting-websocket/dist/events";
import { appEnv } from "./AppEnv";




// {name: KKK, c: T }
export class BaseWsService<T = any> extends EventEmitter<{ [x in keyof WebSocketEventListenerMap]: Parameters<WebSocketEventListenerMap[x]> } & { data: [T], }> {
    wsService?: ReconnectingWebSocket;
    protected _url!: string
    protected _logger = new MyLog('BaseWsService')
    constructor(url: string,) {

        super()
        this._url = url

    }
    get isOpen() {
        return this.wsService?.readyState === WebSocket.OPEN
    }
    protected _send(data: any) {

        if (this.isOpen) {
            this.wsService?.send(isString(data) ? data : JSON.stringify(data))
        } else {
            this._logger.error('未连接')
        }

    }
    send(data: any) {
        this._send(data)
    }
    protected _messageHandler(e: WebSocketEventMap['message']) {
        const rawData = e.data
        this._logger.log('message', { rawData, ins: this })

        let data = null
        try {
            data = JSON.parse(rawData)
        } catch (e) {
            this._logger.error({ e, type: 'JSON.parse' })
        }
        this.emit('message', e)
        this.emit('data', data)
    }
    connect() {
        this._logger.log('connect', { ins: this })
        if (this.isOpen) {
            return Promise.resolve(this)
        }
        return new Promise<BaseWsService<T>>((res, rej) => {
            if (!appEnv.rawToken) {
                rej()
            }
            this._logger.log('开始连接')
            const options = {
                connectionTimeout: 10000,
            };

            this.wsService = new ReconnectingWebSocket(this._url, [], options);
            this.wsService.addEventListener('open', (e) => {
                this.emit('open', e)
                this._logger.log('open', { e, ins: this })

                res(this)
            });
            this.wsService.addEventListener('error', (e) => {
                // this._logger.log('error', { e, ins: this })

                this.emit('error', e)
                rej()
            });
            this.wsService.addEventListener('close', (e) => {
                // this._logger.log('close', { e, ins: this })

                this.emit('close', e)
                rej()
            });

            this.wsService.addEventListener('message', this._messageHandler.bind(this))
        })
    }


}

