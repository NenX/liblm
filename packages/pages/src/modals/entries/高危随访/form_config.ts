import { IMchc_FormDescriptions_Field } from "@lm_fe/service";
import { formatDate } from "@lm_fe/utils";



export const form_config: IMchc_FormDescriptions_Field[] = [
    {

        label: "分娩日期",
        name: "deliveryDate",
        inputType: 'DatePicker',
        layout: '1/3'
    },
    {

        label: "分娩方式",
        name: "deliveryMode",
        inputType: 'MA',
        inputProps: {
            optionKey: "分娩方式s",
            // memorable: true
        },
        layout: '1/3'

    },
    {

        label: "性别",
        name: "gender",
        inputType: 'MA',
        inputProps: {
            optionKey: "性别3s",
        },
        layout: '1/3'
    },
    {

        label: "体重",
        name: "weight",
        inputType: 'MA',
        inputProps: {
            unit:'g'
        },
        layout: '1/3'
    },
    {
        dataIndex: 'returnTo',
        title: '是否转归',
        inputType: 'MA',
        inputProps: {
            options: '是,否',
        },
        layout: '1/3'

    },
    {

        label: "转归情况",
        children: [
            {

                label: "治愈",
                name: "healed",
                inputType: 'MA',
                inputProps: { options: '是,否' },
                layout: '1/3'
            },
            {

                label: "好转",
                name: "improve",
                inputType: 'MA',
                inputProps: { options: '是,否' },

                layout: '1/3'
            },
            {

                label: "未愈",
                name: "cure",
                inputType: 'MA',
                inputProps: { options: '是,否' },

                layout: '1/3'
            },
            {

                label: "死亡",
                children: [
                    {

                        label: "母",
                        name: "momDeath",
                        inputType: 'MA',
                        inputProps: { options: '是,否' },

                        layout: '1/3'
                    },
                    {

                        label: "婴",
                        name: "babyDeath",
                        inputType: 'MA',
                        inputProps: { options: '是,否' },

                        layout: '1/3'
                    },
                ]
            },
        ]

    },
    {

        label: "产后42天转归",
        children: [
            {

                label: "治愈",
                name: "postpartumHealed",
                inputType: 'MA',
                inputProps: { options: '是,否' },

                layout: '1/3'
            },
            {

                label: "好转",
                name: "postpartumImprove",
                inputType: 'MA',
                inputProps: { options: '是,否' },

                layout: '1/3'
            },
            {

                label: "未愈",
                name: "postpartumCure",
                inputType: 'MA',
                inputProps: { options: '是,否' },

                layout: '1/3'
            },
            {

                label: "其他",
                name: "postpartumOther",
                inputType: 'MA',

                layout: '1/3'
            },
        ]

    },
    {

        label: "追踪随访内容",
        children: [
            {
                name: "followupRecords",
                inputType: "MyEditTable",
                // TODO: 刪除 nurse_children2
                props: {
                    marshal: 0,
                    genRowData(list?: any[]) { return { followupDate: formatDate() } },

                    // showEdit: true,
                    formDescriptions: [
                        {

                            dataIndex: 'followupDate',
                            title: '日期',
                            inputType: 'DatePicker',
                            width: 150,
                            inputProps: {

                            },
                        },
                        {
                            dataIndex: 'followupContent',
                            title: '内容',
                            inputType: 'MA',
                            inputProps: {

                            },
                        },
                        {
                            dataIndex: 'pregnancyCase',
                            title: '妊娠情况',
                            inputType: 'MA',
                            inputProps: {

                            },
                        },



                    ]
                },
                layout: '1/1'
            }
        ]

    },



]