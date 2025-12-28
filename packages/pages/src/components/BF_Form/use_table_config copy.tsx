import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable_Arr, IMchc_TableConfig, SMchc_FormDescriptions, SMchc_TableConfig } from '@lm_fe/service';
import { AnyObject, expect_array, request, safeGetFromFuncOrData } from '@lm_fe/utils';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { mchcModal__ } from '../../modals';
import { get_bf_default } from './utils';
import { config_table_fd } from '../../form_config/config_table';
import { formatFormConfig } from '@lm_fe/components_m';
import { getSymbolFromDynamicScript } from '@lm_fe/env';
export interface IBF_Form_props {
    title: string
    history_args?: { relationId: any }
    default_conf?: Partial<IMchc_TableConfig>
}
interface IHistoryRes {
    data: {
        [x: string]: IMchc_FormDescriptions_Field['history_conf']
    }
    record: AnyObject
}
export function use_table_config({ title, history_args, default_conf }: IBF_Form_props) {
    const [config, setConfig] = useState<IMchc_TableConfig>()
    async function fetch_config() {
        request.get('/api/prenatalExam', { params: { relationId: 1 } })

        const res = await SMchc_TableConfig.page({ params: { title, } })
        const arr = expect_array(res.data)
        if (arr.length > 1) {
            message.warning('存在多份配置')
        }
        const _config = arr[0]

        if (!_config?.tableColumns) return
        // let _fd_conf = expect_array(getSymbolFromDynamicScript<IMchc_FormDescriptions_Field[]>(_config.tableColumns))
        let _fd_conf = getSymbolFromDynamicScript<IMchc_FormDescriptions_Field_Nullable_Arr>(_config.tableColumns)!
        _fd_conf = safeGetFromFuncOrData(_fd_conf)
        _fd_conf = expect_array(_fd_conf)

        const history_url = _config.dept
        if (history_url?.startsWith('/api') && history_args) {
            const h_res = (await request.get<IHistoryRes>(history_url, { params: history_args })).data
            const h_conf = h_res.data
            console.log('h_conf', { h_conf })

            _fd_conf = _fd_conf.map(f => {
                const name = SMchc_FormDescriptions.get_form_item_name_str(f)
                console.log('name', { name })
                return ({
                    ...f,
                    history_conf: h_conf[name],
                    children: f?.children?.map(c => {
                        const c_name = SMchc_FormDescriptions.get_form_item_name_str(c)
                        console.log('c_name', { c_name })

                        return ({ ...c, history_conf: h_conf[c_name] })
                    })
                })
            })

        }
        _config.tableColumns = _fd_conf.map(f => f ? formatFormConfig(f) : f);
        setConfig(_config)

    }
    function init_config() {
        const _default = default_conf ?? get_bf_default()
        SMchc_TableConfig
            .post({ title, ..._default })
            .then(fetch_config)
    }
    function edit_config() {
        mchcModal__.open('modal_form', {
            width: '90vw',
            bodyStyle: { height: '80vh' },
            modal_data: {

                async getInitialData() {
                    return config
                },
                async onSubmit(v) {
                    await SMchc_TableConfig.put(v)
                    await fetch_config()
                    return 1
                },
                formDescriptions: config_table_fd
            }
        })
    }

    useEffect(() => {
        fetch_config()
        return () => { }
    }, [])
    return { config, init_config, edit_config }
};