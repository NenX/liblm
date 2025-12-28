import { mchcStore } from "src/state";
import { isDev } from "../macro";
import { mchcEnv } from "./MchcEnv";
import { MchcTypes } from "./type";
import { Store } from 'redux';


export * from './MchcEnv';
export * from './type';



export function mchcBoot(config: { name?: MchcTypes, store?: Store }) {
    const { name, store } = config
    if (name) {
        mchcEnv.appName = name
    }

    if (store) {
        mchcStore.store = store
    }
    mchcEnv.isDev = isDev()
    mchcEnv.logger.logBig('lm_fe')
    // do other async work here
    return Promise.resolve(null)
}

