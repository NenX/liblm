import { rt_ctx } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field } from "@lm_fe/service";
import { formatDate, formatDateTimeNoSecond } from "@lm_fe/utils";
const ctx = rt_ctx

interface IData {
    "id": 1,
    "filingDay": "2024-10-10",
    "fileType": 1,

    "manName": "笋稳",
    "manAge": 20,
    "manTelephone": "15574005568",

    "womanName": "孙旋",
    "womanAge": 20,
    "womanTelephone": "15574005547",

    "deleteFlag": 0,
    "premaritalCheckArchivesId": 2,
    "followupRecordVMList": [{
        "id": 1,
        "followUpDate": "2024-10-16",
        "followUpFileType": 1,
        "pregnancyEnding": 1,
        "infection": 1,
        "infectionContent": "111",
        "followupContent": "去西藏玩了",
        "followupState": 1,
        "pregnancyStatus": 1
    }]
}


export const form_config: IMchc_FormDescriptions_Field[] = [
    {

        label: "档案类型",
        name: "fileType",
        inputType: 'MC',
        inputProps: {
            optionKey: '性别2',
            marshal: 0
        },
        layout: '1/1'
    },
    {

        label: "女方姓名",
        name: "womanName",
        inputType: 'MA',

        layout: '1/3'
    },

    {
        label: "女方年龄",
        name: "womanAge",
        inputType: 'input_number',
        layout: '1/3'
    },
    {

        label: "女方电话号码",
        name: "womanTelephone",
        inputType: 'MA',

        layout: '1/3'
    },
    {

        label: "男方姓名",
        name: "manName",
        inputType: 'MA',

        layout: '1/3'
    },

    {
        label: "男方年龄",
        name: "manAge",
        inputType: 'input_number',
        layout: '1/3'
    },
    {

        label: "男方电话号码",
        name: "manTelephone",
        inputType: 'MA',

        layout: '1/3'
    },


    {

        label: "追踪随访内容",
        children: [
            {
                name: "followupRecordVMList",
                inputType: "MyEditTable",
                // TODO: 刪除 nurse_children2
                inputProps: {
                    marshal: 0,
                    genRowData(list?: any[]) { return { followupDate: ctx.utils.formatDate() } },


                    // "id" : 1,
                    // "followUpDate" : "2024-10-16",
                    // "followUpFileType" : 1,
                    // "pregnancyEnding" : 1,
                    // "infection" : 1,
                    // "infectionContent" : "111",
                    // "followupContent" : "去西藏玩了",
                    // "followupState" : 1,

                    // showEdit: true,
                    formDescriptions: [
                        { title: '怀孕状态', dataIndex: 'pregnancyStatus', inputType: 'MS', inputProps: { uniqueKey: 'Pregnancy.pregnancyStatus', marshal: 0 } },
                        { title: '传染病内容', dataIndex: 'infectionContent', inputType: 'Input', },
                        { title: '随访内容', dataIndex: 'followupContent', inputType: 'Input', },
                        { title: '随访状态', dataIndex: 'followupState', inputType: 'MS', inputProps: { optionKey: '随访状态', marshal: 0 } },
                    ]
                },
                layout: '1/1'
            }
        ]

    },



]