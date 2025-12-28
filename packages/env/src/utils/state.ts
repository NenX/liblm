import { AnyObject } from "@lm_fe/utils";
import { Dispatch } from "redux";
import { mchcEnv } from "src/env"
import { mchcStore } from "src/state";

interface ICache {
  _globalState?: AnyObject
  _globalHistory?: {
    push(k: any, state?: any): void;
    replace(k: any, state?: any): void
  }
  _globalDispatch?: Dispatch
}

export function getGlobalState() {
  mchcStore.logger.warn('废弃的操作，请使用 mchcStore 的接口')
  return mchcStore.state
  // const state: ICache['_globalState'] = mchcEnv.getGlobalCache('_globalState')
  // return state ?? {}
};
export function setGlobalState(getter: () => any) {
  mchcStore.logger.warn('废弃的操作，请使用 mchcStore 的接口')

  // mchcEnv.defineGlobalCacheProperty('_globalState', { get: getter })
  mchcStore.__getState = getter

};

export function getGlobalDispatch() {
  mchcStore.logger.warn('废弃的操作，请使用 mchcStore 的接口')

  return mchcStore.dispatch
  // const state: ICache['_globalDispatch'] = mchcEnv.getGlobalCache('_globalDispatch')
  // return state ?? null
};

export function setGlobalDispatch(getter: () => any) {
  mchcStore.logger.warn('废弃的操作，请使用 mchcStore 的接口')

  // mchcEnv.defineGlobalCacheProperty('_globalDispatch', { get: getter })
  mchcStore.__getDispatch = getter

};


export function getGlobalHistory() {

  const state: ICache['_globalHistory'] = mchcEnv.getGlobalCache('_globalHistory')
  return state ?? {
    push: () => { console.error('push', '失败') },
    replace: () => { console.error('replace', '失败') },
  }
};


export function setGlobalHistory(getter: () => any) {
  mchcEnv.defineGlobalCacheProperty('_globalHistory', { get: getter })
};


