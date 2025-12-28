import { OkButton } from "@lm_fe/components_m";
import { BF_Wrap2, MyBaseList } from "@lm_fe/pages";
import { downloadFile, formatDate, request } from "@lm_fe/utils";
import React from "react";


export default function Archive(props: any) {
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '统计管理-建档统计',
            tableColumns: () => import('./table_config'),
            searchConfig: () => import('./serch_config'),
            name: '/api/pregnancies',
            showAction: 0,
            showAdd: 0,
        }
    })
    return <Wrap>
        <MyBaseList
            showAdd={!!config?.showAdd}
            showAction={!!config?.showAction}
            name={config?.name}
            tableColumns={__DEV__ ? () => import('./table_config') : config?.tableColumns}
            searchConfig={config?.searchConfig}
            RenderBtns={ctx => {
                return <OkButton
                    onClick={async e => {
                        const res = await request.get('/api/pregnancies/createPregnancyExport', {
                            params: ctx.getSearchParams(),
                            responseType: 'blob',
                        })
                        downloadFile(res.data, `建档统计表${formatDate()}.xls`, 'application/vnd.ms-excel');
                    }}

                >导出</OkButton>
            }}
        />
    </Wrap>
}