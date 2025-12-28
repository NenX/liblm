import { getSymbolFromDynamicScript } from "@lm_fe/env"
import { ModelService } from "../../../ModelService"
import { IMchc_FormDescriptions_Field_Nullable_Arr, SMchc_FormDescriptions } from "../FormDescriptions"
import { expect_array, safeGetFromFuncOrData } from "@lm_fe/utils"
import { get, isFunction, set } from "lodash"
import { format_fn_string, make_bf_script_field } from "./utils"
export interface IMchc_TableConfig {
    "id": 16,
    "initialSearchValue": any,
    searchParams: any
    tableColumns: any
    searchConfig: any
    watchScript: any
    "name": string,
    "dept": string,
    "apiPrefix": string,
    "title": string,
    "rowKey": string,
    handleBeforePopup: any
    genColumns: any
    beforeSubmit: any
    "showAction": number,
    "category": null,
    "needSync": number,
    "needPrint": null,
    "showAdd": number,
    "showExport": number,
    "deleteFlag": false
    // new
    "renderExtraBtns": any
}

class Mchc_TableConfig_Service extends ModelService<IMchc_TableConfig> {

    process_remote(config: IMchc_TableConfig, props?: any) {

        const _con = { ...config }

        _con.genColumns = getSymbolFromDynamicScript(config.genColumns, props,)!

        _con.handleBeforePopup = getSymbolFromDynamicScript(config.handleBeforePopup, props,)!
        _con.beforeSubmit = getSymbolFromDynamicScript(config.beforeSubmit, props,)!

        let tableColumns = getSymbolFromDynamicScript(config.tableColumns, props, [])
        _con.tableColumns = safeGetFromFuncOrData(tableColumns)

        const initialSearchValue = getSymbolFromDynamicScript(config.initialSearchValue, props,)
        _con.initialSearchValue = safeGetFromFuncOrData(initialSearchValue)

        const searchParams = getSymbolFromDynamicScript(config.searchParams, props,)
        _con.searchParams = safeGetFromFuncOrData(searchParams)

        const searchConfig = getSymbolFromDynamicScript(config.searchConfig, props,)
        _con.searchConfig = safeGetFromFuncOrData(searchConfig)
        return _con
    }
    async process_local(config: Partial<IMchc_TableConfig>, props?: any) {

        const _con = { ...config }
        const fd = await SMchc_FormDescriptions.extract_form_config(config.tableColumns,)

        const fd_with_safe_fn = this.transfer_fn_to_string(fd)
        _con.tableColumns = make_bf_script_field(fd_with_safe_fn, true)

        _con.genColumns = make_bf_script_field(config.genColumns,)
        _con.handleBeforePopup = make_bf_script_field(config.handleBeforePopup,)
        _con.beforeSubmit = make_bf_script_field(config.beforeSubmit,)
        _con.initialSearchValue = make_bf_script_field(config.initialSearchValue,)
        _con.searchParams = make_bf_script_field(config.searchParams,)

        const searchConfig = await SMchc_FormDescriptions.extract_form_config(config.searchConfig,)
        _con.searchConfig = make_bf_script_field(searchConfig,)







        return _con
    }
    transfer_fn_to_string(fd: IMchc_FormDescriptions_Field_Nullable_Arr) {

        if (!Array.isArray(fd))
            return []


        return fd.map(f => {
            const cloned = { ...f }

            format_fn_string(cloned, 'render')
            format_fn_string(cloned, 'title')
            format_fn_string(cloned, 'processRemote')
            format_fn_string(cloned, 'processLocal')
            format_fn_string(cloned, 'required')
            format_fn_string(cloned, 'disabledDeps')
            format_fn_string(cloned, 'requiredDeps')
            format_fn_string(cloned, 'showDeps')

            if (f?.inputProps) {
                const cloned_ip = { ...f?.inputProps }
                format_fn_string(cloned_ip, 'DisplayFC_render')
                format_fn_string(cloned_ip, 'component')
                format_fn_string(cloned_ip, 'genRowData')
                format_fn_string(cloned_ip, 'onPatientAutoComplete')
                cloned.inputProps = cloned_ip
            }
            if (cloned.children) {
                cloned.children = this.transfer_fn_to_string(cloned.children)
            }

            return cloned
        })


    }

}


export const SMchc_TableConfig = new Mchc_TableConfig_Service({
    n: '/tableConfig',
})

