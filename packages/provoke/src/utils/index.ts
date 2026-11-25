import { generate } from "@ant-design/colors"
import { ISystemConfig, mchcConstant, mchcEnv, mchcLogger, selectOptionMap, TLevelType } from "@lm_fe/env"
import { IMchc_Dictionaries, IMchc_Dictionaries_Enumeration, IMchc_HighriskGradeConfig, SMchc_Dictionaries } from "@lm_fe/service"
import { AnyObject, clone, get, identity, isArray, isInt, isNil, request, shake } from "@lm_fe/utils"
import { SystemState } from "src/slices/system"
import { DARK_COLOR, LIGHT_COLOR, MixState, THEME } from "../types"
export const default_primary = '#91a400'
export function calc_colors(color?: string) {
    if (!color) return null
    const colors = generate(color)
    return {
        primary: color,
        light: colors.slice(0, 5) as LIGHT_COLOR,
        dark: colors.slice(6) as DARK_COLOR
    }
}

export function calc_theme(config_styles: ISystemConfig['styles'] = {}): THEME {
    const styles = clone(config_styles)
    const dark = styles.darkTheme
    let bg_color = dark ? '#000' : '#fff'
    let theme_bg_color = dark ? '#222' : '#fff'
    let primary = styles.colorPrimary ?? default_primary


    const colors = calc_colors(primary,)!

    theme_bg_color = dark ? '#222' : colors.light[0]
    return { colors, bg_color, theme_bg_color, ...styles }
}

export function save_config(state: MixState, config?: ISystemConfig): Partial<SystemState> {
    if (!config) return {}

    const theme = shake(calc_theme(config.styles), v => isNil(v))



    return { sys_theme: { ...state.sys_theme, ...theme }, config }
}
export function format_highriskGrade_enum(arr: IMchc_Dictionaries_Enumeration[], version: number): IMchc_HighriskGradeConfig[] {
    if (!arr || !isArray(arr)) return []
    return arr.map(_ => {
        const note_arr = (_.note || '').split('@').filter(identity)
        const color_t = note_arr[1] ? note_arr[1] : mchcConstant.get_level_color_text(version, _.label as TLevelType)
        return { ..._, color: note_arr[0], levelText: _.label!, colorText: color_t }
    })
}
export function write_preset_options_to_dics(all: AnyObject<IMchc_Dictionaries>) {

    let is_exist = all['uniqueKey.init']
    if (!is_exist && mchcEnv.token) {
        Object.keys(selectOptionMap).forEach(key => {
            const value = selectOptionMap[key]()
            if (value) {
                SMchc_Dictionaries.post({
                    key,
                    module: 'uniqueKey',
                    // note: `${mchcEnv.appName}`,
                    type: 9527,
                    enumerations: value.map(_ => ({ label: _.label, note: _.value?.toString(), value: isInt(_.value) ? _.value : undefined, })),
                })
            }
        })
        SMchc_Dictionaries.post({
            key: 'init',
            module: 'uniqueKey',
            // note: `${mchcEnv.appName}`,
            type: 9527,
            enumerations: [],
        })
    }
    mchcLogger.log('is_exist', is_exist)
    return is_exist
}

