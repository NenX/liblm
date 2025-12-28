import { BaseWsService } from "@lm_fe/utils";
import { message } from "antd";
import { get, isObject, isString } from "lodash";
import { mchcEnv } from "src/env";
import { TDirver_Event, check_is_readcard, parse_readcard_data } from "./types/mchc_driver";
export * from './types/mchc_driver'





class MchcDriver extends BaseWsService<TDirver_Event> {
    download() {
        window.location.href = mchcEnv.gs(_ => _.lm_files["LMCSSetup.msi"]);
    }
    protected _messageHandler(e: WebSocketEventMap['message']) {
        const rawData = e.data
        this._logger.log('message', { rawData, ins: this })

        let data = null
        try {
            data = JSON.parse(rawData)
        } catch (e) {
            this._logger.error({ e, type: 'JSON.parse' })
            if (isString(rawData)) {
                message.warning(rawData)
            }
        }

        this.checkType(data)
    }
    private send_id = ''
    send(data: { data?: any, name?: string, token?: string, command?: string, send_id?: string }) {
        if (data.send_id) {
            this.send_id = data.send_id
        }
        if (!this.isOpen) {
            message.warning('外接设备初始化失败，请联系管理员')
            return
        }
        this._send(data)
    }

    private checkType(data: any) {
        let send_id = this.send_id
        this.send_id = ''
        if (!data || !isObject(data)) return
        let msg = get(data, 'msg')
        if (msg) {
            message.warning(msg)
        }

        const is_read_IdNO = check_is_readcard(data)
        if (is_read_IdNO) {
            const __personal = parse_readcard_data(data)
            if (!__personal) {
                message.error('读取到错误的身份证号码 !');
                return
            }
            message.success(`读取到${__personal.name}的信息 !`)
            this.emit('data', { type: 'ReadCard', data: __personal, send_id })
            return
        }
        // fallback
        this.emit('data', { type: 'Raw', data })
    }

}

export const mchcDriver = new MchcDriver('ws://127.0.0.1:8087/Laputa')

