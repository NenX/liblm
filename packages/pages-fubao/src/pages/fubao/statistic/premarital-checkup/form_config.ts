import { IMchc_FormDescriptions_Field } from "@lm_fe/service";
import { formatDate, formatDateTimeNoSecond } from "@lm_fe/utils";


interface IFollowupData {
    "id": 4,
    "name": "孙文",
    "age": 16,
    "telephone": "15574005542",
    "idNO": "450721199806033026",
    "dob": "2024-09-30",
    "lmd": "2024-09-25",
    "conceived": 1,
    "parity": 1,
    "twoCancerScreeningId": 16,

    "twoCancerFollowupRecordVMList": {
        "id": 1,
        "followUpDate": "2024-10-08",
        "pregnancyEnding": 2,
        "infection": 1,
        "infectionContent": "癌症病",
        "followupContent": "注意一下",
        "followupState": 2,
        "pregnancyStatus": 3
    }[]
}


export const form_config: IMchc_FormDescriptions_Field[] = [
    {

        label: "姓名",
        name: "name",
        inputType: 'MA',
        inputProps: {
        },
        layout: '1/3'
    },
    {

        label: "孕次",
        name: "conceived",
        inputType: 'input_number',
        inputProps: {
        },
        layout: '1/3'
    },
    {

        label: "产次",
        name: "parity",
        inputType: 'input_number',
        inputProps: {
        },
        layout: '1/3'
    },


    {

        label: "出生日期",
        name: "dob",
        inputType: 'DatePicker',
        layout: '1/3'
    },

    {
        label: "年龄",
        name: "age",
        inputType: 'input_number',
        layout: '1/3'
    },
    {

        label: "电话号码",
        name: "telephone",
        inputType: 'MA',
        inputProps: {
        },
        layout: '1/3'
    },


    {

        label: "追踪随访内容",
        children: [
            {
                name: "twoCancerFollowupRecordVMList",
                inputType: "MyEditTable",
                // TODO: 刪除 nurse_children2
                props: {
                    marshal: 0,
                    genRowData(list?: any[]) { return { followupDate: formatDate() } },


                    // "id": 1,
                    // "followUpDate": "2024-10-08",
                    // "pregnancyEnding": 2,
                    // "infection": 1,
                    // "infectionContent": "癌症病",
                    // "followupContent": "注意一下",
                    // "followupState": 2,
                    // "pregnancyStatus": 3

                    // showEdit: true,
                    formDescriptions: [
                        { title: '癌症类型', dataIndex: 'cancerType', inputType: 'MS', inputProps: { options: '乳腺癌,宫颈癌', marshal: 0 } },
                        { title: '癌症内容', dataIndex: 'infectionContent', inputType: 'Input', },
                        { title: '随访内容', dataIndex: 'followupContent', inputType: 'Input', },
                        { title: '随访状态', dataIndex: 'followupState', inputType: 'MS', inputProps: { optionKey: '随访状态', marshal: 0 } },
                    ]
                },
                layout: '1/1'
            }
        ]

    },



]