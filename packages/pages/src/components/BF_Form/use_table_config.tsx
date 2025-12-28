import { IMchc_TableConfig, SMchc_TableConfig } from '@lm_fe/service';
import { confirm_operation, expect_array } from '@lm_fe/utils';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { config_table_fd } from '../../form_config/config_table';
import { mchcModal__ } from '../../modals';
export interface IBF_props {
    // title: string
    // history_args?: { relationId: any }
    default_conf: Partial<Omit<IMchc_TableConfig, 'title'>> & { title: `${string}-${string}` }
}

export function use_table_config(setting: IBF_props, props?: any) {
    let { default_conf } = setting
    const default_conf_ref = useRef<Partial<IMchc_TableConfig>>({})

    const [loading, setLoading] = useState(false)

    const [config, setConfig] = useState<IMchc_TableConfig>()
    const config_raw = useRef<Partial<IMchc_TableConfig>>()
    async function fetch_config() {
        let __title = default_conf_ref.current.title
        if (!__title) return
        setLoading(true)
        const res = await SMchc_TableConfig
            .page({ params: { 'title.equals': __title, 'deleteFlag.equals': false }, ignore_usr: true })
            .finally(() => setLoading(false))
        const arr = expect_array(res.data)
        if (arr.length > 1) {
            message.warning('存在多份配置')
        }
        const _config = arr[0]
        config_raw.current = { ..._config }
        if (!_config?.tableColumns) return



        // _config.tableColumns = _fd_conf.map(f => f ? formatFormConfig(f, 2) : f);

        setConfig(SMchc_TableConfig.process_remote(_config, props))

    }
    function init_config() {
        edit_config(default_conf_ref.current)
    }
    function recover_config() {
        edit_config({ ...config_raw.current, ...default_conf_ref.current }, true)
    }
    function edit_config(edit_config = config_raw.current, is_recover = false) {
        mchcModal__.open('modal_form', {
            width: '90vw',
            maskClosable: false,
            bodyStyle: { height: '80vh' },
            modal_data: {

                async getInitialData() {
                    return edit_config
                },
                async onSubmit(v) {
                    if (is_recover) {
                        if (!confirm_operation()) {
                            message.warning('输入错误')
                            return 0
                        }
                    }
                    if (v.id) {
                        await SMchc_TableConfig.put(v, { ignore_usr: true })
                    } else {
                        await SMchc_TableConfig.post(v, { ignore_usr: true })
                    }
                    await fetch_config()
                    return 1
                },
                formDescriptions: config_table_fd
            }
        })
    }


    useEffect(() => {

        if (default_conf.title && !config_raw.current) {
            SMchc_TableConfig.process_local(default_conf)
                .then(r => {

                    default_conf_ref.current = r
                    fetch_config()
                })

        }
        return () => { }
    }, [])
    return { config, init_config, edit_config, loading, recover_config }
};