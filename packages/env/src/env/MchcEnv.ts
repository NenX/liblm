import { AppEnv, expect_array, getSearchParamsValue } from "@lm_fe/utils";
import { mchcStore } from "src/state";
import { getMacroValue } from "../macro";
import { getOptionLabel, getOptionValue, getOtherOptions, getPresetOptions, merge_preset_options_inner } from "../select_options";
import { all_env, Common_Form_Config_Names, MchcTypes } from "./type";


import { all_files } from '@lm_fe/static';
import { mchcEvent } from "src/event";


const env_to_key_map: { [x in MchcTypes]?: string } = {
    '广三': 'gysy',
    '建瓯': 'jianou',
    '广州市八': 'gzs8',
    '南医增城': 'zcyy',
    '越秀妇幼': 'yxfy'
}


class MchcEnv<T> extends AppEnv<T> {
    gs(cb: (a: typeof all_files) => string) {
        return `${getMacroValue('PUBLIC_PATH')}${cb(all_files)}`
    }

    _fd_handers: { [x in Common_Form_Config_Names]?: { conf: any, handler: any } } = {}
    constructor(appName?: T) {
        super(appName)
    }
    _sys_name?: T
    public get appName() {
        if (this._sys_name) {
            return this._sys_name
        }
        const sys_name = mchcStore.state?.system?.config?.系统环境
        if (sys_name) {
            return this._sys_name = sys_name
        }
        return super.appName
    }
    public set appName(value: T | undefined) {
        super.appName = value;
    }
    get is_single() {
        return location.pathname.startsWith('/single')
    }
    get env_key() {
        return env_to_key_map[this.appName as MchcTypes]
    }
    get is_primary() {
        const all: MchcTypes[] = ['广三', '广州市八', '建瓯', '南医附属', '南医增城', '越秀妇幼', '华医', 'mf']
        return all.includes(this.appName as MchcTypes)
    }
    event = mchcEvent
    get_options = getPresetOptions
    get_other_options = getOtherOptions
    merge_options = merge_preset_options_inner
    get_option_label = getOptionLabel
    get_option_value = getOptionValue
    expect_array = expect_array
    all_env = all_env
    setEnvFormConfig(confs: { name: Common_Form_Config_Names, conf: any, handler?: any }[]) {
        confs.forEach(({ name, handler, conf }) => {
            const old = this._fd_handers[name]
            if (old) {
                alert('已经存在表单配置')
                return
            }
            this._fd_handers[name] = { conf, handler }
        })
    }

    getEnvFormConfig(fd_name: Common_Form_Config_Names) {

        return this._fd_handers[fd_name]
    }



    in_group(...gs: string[]) {
        const u = this.userData
        return u?.groups?.some?.(_ => gs.includes(_.name?.toLowerCase()))
    }
    get userData() {
        const store = mchcStore.state
        return store?.user?.userData
    }

    get isAdmin() {
        const state = this.in_group('admin') || getSearchParamsValue('admin') === '1' || false
        return !!state
    }
}

export const mchcEnv = (window.mchcEnv = new MchcEnv<MchcTypes>(getMacroValue('appName') ?? 'mchc'))
