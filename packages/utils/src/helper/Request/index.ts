
import { Axios, AxiosInstance } from 'axios';

import { Request } from './Request';
//@ts-ignore
import bind from 'axios/lib/helpers/bind';
//@ts-ignore

import utils from 'axios/lib/utils';

export * from './types';
export { codeMessage } from './constant'


function createInstance(defaultConfig = {}) {
    var instance = bind(Axios.prototype.request, request.ins);
    utils.extend(instance, Axios.prototype, request.ins);
    utils.extend(instance, request.ins);
    return instance as AxiosInstance;
}

export { Request }

export const request = new Request;


export const rawRequest = createInstance({})

export const asRequest = new Request({ config: { baseURL: '/as' } })
export const fubaoRequest = new Request({ config: { baseURL: '/' } })




