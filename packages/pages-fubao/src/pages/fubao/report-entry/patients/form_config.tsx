import { defineFormConfig } from "@lm_fe/service";

export default defineFormConfig(
    [
        {
            "title": "姓名",
            "dataIndex": "name"
        },
        {
            "title": "证件号",
            "dataIndex": "idNO"
        },
        {
            "title": "年龄",
            "dataIndex": "age",
    
        },
        {
            "title": "性别",
            "dataIndex": "gender",
            inputType: 'MS',
            "inputProps": {
                "optionKey": "性别2"
            }
        },
        {
            "title": "申请日期",
            "dataIndex": "applicationDate"
        },
        {
            "title": "申请医生",
            "dataIndex": "applicationDoctor"
        },
        {
            "title": "科室",
            "dataIndex": "dept"
        }
    ]
)