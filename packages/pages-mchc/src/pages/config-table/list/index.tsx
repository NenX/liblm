import { LoadingPlaceholder, } from "@lm_fe/components_m"
import React from "react"
// import { message } from "antd"
import { EditOutlined } from "@ant-design/icons"
import { MyBaseList } from "@lm_fe/pages"
import { SLocal_State } from "@lm_fe/service"
import { Button } from "antd"
import { useEffect } from "react"
import { ICommonProps, useConfigHook } from "../utils"
function MyConfigTable(props: ICommonProps) {

    useEffect(() => {

        return () => {
        }
    }, [])
    const [config, model, edit_config, loading] = useConfigHook(props)
    const isAdmin = SLocal_State.isAdmin
    if (loading || !config) return <LoadingPlaceholder />
    return <div style={{ position: 'relative', background: '#fff' }}>
        <MyBaseList
            baseTitle={config?.title as any}
            {...props}
            showExport
            isJSONConfig
            size="small"
            // name="/syphilis-quality-control"
            modalFormConfig={{
                width: '80vw',
                modal_data: {
                    targetLabelCol: 4
                }
            }}
            {...config}
        />

        {
            isAdmin ? <div style={{ position: 'absolute', top: 6, right: 6, cursor: 'help' }} >
                <Button size="small" icon={<EditOutlined />} onClick={() => {
                    edit_config()
                }} />
            </div> : null
        }

    </div>
}
export default MyConfigTable