import { mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";
export const 其他_config = () => {
    const config: IMchc_FormDescriptions_Field_Nullable = {
        "name": "其他",
        "children": [
            {
                "key": "recordstate",
                "label": "档案状态",
                "inputProps": { "marshal": 0, optionKey: '档案状态', disabled: true },
                "inputType": "MS",

                layout: '1/3',
            },
            {
                "key": "baseInfo.auditorName",
                "label": "审核人",
                "inputProps": { disabled: true },
                inputType: 'input',
                layout: '1/3',
            },
            {
                "key": "baseInfo.auditorName2",
                "label": "审核人2",
                isActive: mchcEnv.in(['广州市八']),
                requiredDeps: {
                    'baseInfo.age': v => v > 45
                },
                "inputProps": {},
                inputType: 'input',
                layout: '1/3',
            },
        ]
    }
    return config
}
