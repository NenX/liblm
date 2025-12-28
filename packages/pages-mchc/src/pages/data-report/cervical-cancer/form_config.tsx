import { defineFormConfig } from "@lm_fe/service";

export const form_config = defineFormConfig(
    [
        { title: '就诊卡号', dataIndex: 'outpatientNO' },
        { title: '姓名', dataIndex: 'name' },
        { title: '电话', dataIndex: 'telephone' },
        { title: '登记日期', dataIndex: 'registerDate' },
        { title: '上报时间', dataIndex: 'uploadDate', },
        { title: '上报状态', dataIndex: 'uploadState', inputType: 'MS', inputProps: { optionKey: '上报状态', marshal: 0 } },
        { title: '结案状态', dataIndex: 'jaFlag', inputType: 'MS', inputProps: { options: '结案,未结案', marshal: 0 } },
        { title: '上报说明', dataIndex: 'uploadMsg', },
    ]
)