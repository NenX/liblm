import { mchcEnv } from "@lm_fe/env"

const 建瓯_config = {
    "needNotThisTime": false,
    "ignoreKeys": [
        "children.childGender",
        "children.childLiving",
        "children.childDeathTime",
        "children.childDeathNote",
        "children.sequelaNote",
        "children.neonateWeight"
    ],
    "tableColumns": [
        { "key": "gravidityindex", "title": "孕次", "width": 30, "editor": { "input_type": "input" } },
        { "key": "year", "title": "年-月", "width": 50, "editor": { "input_type": "filterDateInput" } },

        { "key": "term", "title": "足月产", "width": 40, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "preterm", "title": "早产", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "inducedLabor", "title": "引产", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "surgicalAbortion", "title": "人工", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "medicalAbortion", "title": "药流", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "naturalAbortion", "title": "自然流产", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "ectopicPregnancy", "title": "异位妊娠", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "hydatidMole", "title": "葡萄胎", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "fetusdeath", "title": "死胎", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "stillbirth", "title": "死产", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
        { "key": "neonateDeath", "title": "新生儿死亡", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },



        {
            "title": "小孩情况", "children": [

                {
                    "key": "children.childGender", "title": "性别", "width": 30,
                    "editor": {
                        "input_type": "select", "input_props": {
                            "options": [
                                { "label": "男", "value": 1 }, { "label": "女", "value": 2 }, { "label": "未知", "value": 3 }]
                        }
                    }
                },
                {
                    "key": "children.childLiving", "title": "生存", "width": 30, "editor":
                        { "input_type": "select", "input_props": { "options": [{ "label": "健在", "value": true }, { "label": "死亡", "value": false }] } }
                },
                {
                    "key": "children.childDeformity", "title": "畸形", "width": 30, "editor":
                        { "input_type": "select", "input_props": { "options": [{ "label": "是", "value": "是" }, { "label": "否", "value": "否" }] } }
                },
                // {
                //     "key": "children.childGender", "title": "性别", "width": 30,
                //     "editor": {
                //         "input_type": "select", "input_props": {
                //             "options": [
                //                 { "label": "男", "value": 1 }, { "label": "女", "value": 2 }, { "label": "未知", "value": 3 }]
                //         }
                //     }
                // },
            ]
        },
        {
            "title": "分娩方式", "children": [
                {
                    "key": "vaginalDelivery", "title": "顺产", "width": 30,
                    "editor": { "input_type": "checkbox", "input_props": { "type": "default" } }
                },
                {
                    "key": "operationType", "title": "手术产式", "width": 50, "editor": {
                        "input_type": "select",
                        "input_props": { "options": [{ "label": " ", "value": " " }, { "label": "剖宫产", "value": "cesareanSection" }, { "label": "吸引产", "value": "vacuumAssisted" }, { "label": "钳产", "value": "forceps" }, { "label": "臀助产", "value": "breechMidwifery" }] }
                    }
                }
            ]
        },
        {
            "key": "hemorrhage", "title": "产后出血", "width": 30,
            "editor": { "input_type": "checkbox", "input_props": { "type": "default" } }
        },





        { "key": "exceptionalcase", "title": "其他", "width": 200, "editor": { "input_type": "input" } }
    ]
}


export function getConfig() {
    if (mchcEnv.is('建瓯')) {
        return 建瓯_config
    }
    return {
        "pregnancyId": 0,
        "needNotThisTime": false,
        "ignoreKeys": ["children.childGender", "children.childLiving", "children.childDeathTime", "children.childDeathNote", "children.sequelaNote", "children.neonateWeight"],
        "tableColumns":
            [
                { "key": "gravidityindex", "title": "孕次", "width": 30, "editor": { "input_type": "input" } },
                { "key": "year", "title": "年-月", "width": 70, "editor": { "input_type": "filterDateInput" } },
                {
                    "title": "流产",
                    "children": [
                        { "key": "naturalAbortion", "title": "自然", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                        { "key": "medicalAbortion", "title": "药物", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                        { "key": "surgicalAbortion", "title": "人工", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                        { "key": "currettage", "title": mchcEnv.in(['郫都']) ? "宫外孕" : "清宫", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } }
                    ]
                },
                { "key": "biochemicalAbortion", "title": "生化妊娠", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                { "key": "inducedLabor", "title": "引产", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                { "key": "fetusdeath", "title": "死胎", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                mchcEnv.in(['郫都']) && { "key": "stillbirth", "title": "死产", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                mchcEnv.in(['郫都']) && { "key": "malformation", "title": "出生缺陷", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                { "key": "preterm", "title": "早产", "width": 30, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                { "key": "term", "title": "足月产", "width": 40, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } },
                { "key": "gestationalWeek", "title": "孕周", "width": 40, "editor": { "input_type": "input" } },
                {
                    "title": "分娩方式",
                    "children": [
                        {
                            "key": "vaginalDelivery", "title": "顺产", "width": 30,
                            "editor": { "input_type": "checkbox", "input_props": { "type": "default" } }
                        },
                        {
                            "key": "operationType", "title": "手术产式", "width": 50, "editor": {
                                "input_type": "select", "input_props": {
                                    "options": [
                                        { "label": " ", "value": " " },
                                        { "label": "剖宫产", "value": "cesareanSection" },
                                        { "label": "吸引产", "value": "vacuumAssisted" },
                                        { "label": "钳产", "value": "forceps" },
                                        { "label": "臀助产", "value": "breechMidwifery" }
                                    ]
                                }
                            }
                        }]
                }, {
                    "title": "产后情况", "children": [
                        {
                            "key": "hemorrhage", "title": "出血", "width": 30,
                            "editor": {
                                "input_type": "checkbox", "input_props": { "type": "default" }
                            }
                        },
                        { "key": "puerperalFever", "title": "产褥热", "width": 40, "editor": { "input_type": "checkbox", "input_props": { "type": "default" } } }
                    ]
                },
                { "key": "fetalcount", "title": "胎数", "width": 35, "editor": { "input_type": "input", "input_props": { "type": "number" }, "controls": false } },
                {
                    "title": "小孩情况",
                    "children": [
                        {
                            "key": "children.childGender", "title": "性别", "width": 30,
                            "editor": {
                                "input_type": "select",
                                "input_props": {
                                    "options": [{ "label": "男", "value": 1 }, { "label": "女", "value": 2 }, { "label": "未知", "value": 3 }]
                                }
                            }
                        },
                        { "key": "children.neonateWeight", "title": mchcEnv.in(['广三']) ? "出生体重(g)" : "出生体重(kg)", "width": 60, "editor": { "input_type": "input", "input_props": { "type": "number" }, "controls": false } },
                        {
                            "key": "children.childLiving",
                            "title": "生存",
                            "width": 30,
                            "editor": {
                                "input_type": "select", "input_props": { "options": [{ "label": "健在", "value": true }, { "label": "死亡", "value": false }] }
                            }
                        },
                        { "key": "children.childDeathTime", "width": 100, "title": "死亡时间", "editor": { "input_type": "filterDateInput" } },
                        { "key": "children.childDeathNote", "width": 100, "title": "死亡原因", "editor": { "input_type": "input" } },
                        { "key": "children.sequelaNote", "title": "后遗症", "width": 30, "editor": { "input_type": "input" } }
                    ]
                },
                { "key": "hospital", "title": "分娩医院", "width": 80, "editor": { "input_type": "input" } },
                { "key": "exceptionalcase", "title": "特殊情况", "width": 200, "editor": { "input_type": "input" } }
            ]
    }
}