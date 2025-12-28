
import axios, { Axios, AxiosError, AxiosInstance, AxiosResponse } from 'axios';

//@ts-ignore
import utils from 'axios/lib/utils';
import { AppEnv, appEnv } from '../AppEnv';
import { get_global_happy_arg } from '../happyParse';
import { codeMessage } from './constant';
import { IRequest_AxiosRequestConfig, IRequest_ResponseError, IRequest_SpawnConfig, TRequest_PreReq, TRequest_SimpleReq } from './types';
import { AnyObject, EventEmitter, MyLog } from '@noah-libjs/utils';
export * from './types';

export class Request extends EventEmitter<{ beforeRequest: any, afterResponse: any, responseErr: any, message: [boolean, string, any] }> {
    ins!: AxiosInstance
    constructor(config: IRequest_SpawnConfig = {}) {
        super()
        this.spawn(config)
    }
    static CONFIG = { successCode: [200, 1, 0] }

    static logger = new MyLog('Request')
    static checkRTCode(res?: AxiosResponse<any>) {
        if (!res) return false
        const headerCode = res.headers['lm-code']
        const rawCode = res.data?.id ? 200 : res.data?.code
        // 某些数据返回 status
        const rawStatus = res.data?.id ? 200 : res.data?.status
        const _code = typeof rawCode === 'number' ? rawCode : (rawStatus ?? 1)
        const code = headerCode ? Number(headerCode) : _code
        // console.log('isSuccessful', { headerCode, _code,h:res.headers})

        return Request.CONFIG.successCode.includes(code)
    }
    static genErrMsg(res?: AxiosResponse<any>, error?: AxiosError) {
        const status = (res?.status || -1) as 200
        const rawMessage = error?.message === 'Network Error' ? '网络连接异常   ' : ''
        const msg: string = Request.getMsg(res) ?? codeMessage[status] ?? rawMessage ?? '未知错误'
        return msg
    }
    static createErr(res?: AxiosResponse<any>, error?: AxiosError): IRequest_ResponseError {
        return {
            error,
            msg: Request.genErrMsg(res, error),
            url: res?.config?.url,
            data: res?.data,
            status: res?.status
        }
    }
    static getMsg(res?: AxiosResponse<{ data?: any, code?: number, msg?: string, message?: string, title?: string }>) {
        if (!res) return ''
        const { showMsg = true, successText, errText } = res?.config as IRequest_AxiosRequestConfig
        const remoteMsg = showMsg ? Request.getRemoteMessage(res) : ''
        const isSuccessful = Request.checkRTCode(res)
        const configMsg = isSuccessful ? successText : errText
        return configMsg ?? remoteMsg
    }
    static getRemoteMessage(res?: AxiosResponse<any>) {
        const headerMessage = Request.getHeaderMessage(res)
        const remoteMsg = res?.data?.msg ?? res?.data?.detail ?? res?.data?.message ?? res?.data?.title
        return headerMessage ?? remoteMsg
    }
    static getHeaderMessage(res?: AxiosResponse<any>) {
        if (!res) return
        const headerMessageRaw = res.headers['lm-message']
        const headerMessage = headerMessageRaw ? decodeURIComponent(headerMessageRaw) : undefined

        return headerMessage
    }

    displayMsg(res: AxiosResponse<{ data?: any, code?: number, msg?: string }>) {
        const isSuccessful = Request.checkRTCode(res)
        const msg = Request.getMsg(res)

        if (!msg) return
        this.emit('message', isSuccessful, msg, res)
        // if (isSuccessful) {
        //     message.success(msg)
        // } else {
        //     message.warning(msg)
        // }
    }

    spawn(spawnConfig: IRequest_SpawnConfig = {},) {
        const ins = this.gen(spawnConfig)
        this.ins = ins
        utils.extend(this, Axios.prototype, this.ins);
        return this.ins
    }
    gen(spawnConfig: IRequest_SpawnConfig = {},) {
        const { config = {} as IRequest_AxiosRequestConfig, onRequest = value => value, onResponse = value => value, onRejected = error => Promise.reject(error) } = spawnConfig
        const ins = axios.create(config)

        const _onErr = (e: IRequest_ResponseError) => {
            this.emit('responseErr', e)
            config.logger && Request.logger.error(e)
            return onRejected(e)
        }
        ins.interceptors.request.use((config: IRequest_AxiosRequestConfig) => {
            this.emit('beforeRequest', config)
            // TODO: remove
            config.headers!.Authorization = config.headers!.Authorization || appEnv.token || '';
            const params = (config.params = config.params ?? {})
            // params.pathname = location.pathname
            if (!config.ignore_usr) {
                params.usr1 = get_global_happy_arg('usr1')
                params.usr2 = get_global_happy_arg('usr2')

            }
            if (!config.ignore_env && window.mchcEnv) {
                const env_key = window.mchcEnv.env_key
                params.lmenv = env_key
                config.headers!.Lmenv = env_key
            }

            return onRequest(config);
        })

        ins.interceptors.response.use(
            (response) => {
                const { config: axiosConfig, headers } = response
                const config = axiosConfig as IRequest_AxiosRequestConfig
                const { url, data, params, method, logger, unboxing } = config
                this.displayMsg(response)
                if (Request.checkRTCode(response)) {

                    logger && Request.logger.log({ url, data, params, method, }, response.data)
                    this.emit('afterResponse', response)
                    const isSameOrigin = url?.startsWith('http') ? new URL(url).origin === location.origin : true
                    if (isSameOrigin) {
                        const token = headers['Authorization'] || headers['authorization']
                        appEnv.token = token
                        AppEnv.singleton.token = token
                    }
                    if (unboxing) {
                        response.data = doUnboxing(response.data)
                    }
                    return onResponse(response)
                }
                const e = Request.createErr(response)
                return _onErr(e);
            },
            (error: AxiosError) => {
                Request.logger.error('请求出错：', { error })
                const response = error?.response
                const e = Request.createErr(response, error)
                return _onErr(e)
            },
        )
        return ins
    }
    get!: TRequest_SimpleReq
    delete!: TRequest_SimpleReq
    head!: TRequest_SimpleReq
    post!: TRequest_PreReq
    put!: TRequest_PreReq

}
function doUnboxing(res: any) {
    const isBoxing = typeof res?.code === 'number' && !!res.data
    if (isBoxing) {
        return res.data
    }
    return res
}

