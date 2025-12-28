import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
import { AnyObject } from "@lm_fe/utils";
const React = rt_ctx.React
const mchcEnv = rt_ctx.mchcEnv
export default defineFormConfig(
    [
        {
            title: '姓名',
            dataIndex: ['admission', 'name'],
            ellipsis: true,
            width: 64,
        },
        {
            title: '住院号',
            dataIndex: ['admission', 'inpatientNO'],
            ellipsis: true,
        },
        {
            title: '证件号码',
            dataIndex: ['admission', 'idNO'],
            width: 168,
            render: (text) => {
                if (mchcEnv.is_primary) return text
                let reg = /(\w{4})\w*(\w{4})/g;
                if (text) {
                    return text.replace(reg, '$1****$2');
                }
                return ''
            },
        },
        {
            title: '分娩孕周',
            dataIndex: 'labourWeek',
            width: 80,
        },
        {
            title: '分娩日期',
            dataIndex: 'labourDate',
            width: 90,
        },
        {
            title: '分娩时间',
            dataIndex: 'labourTime',
            width: 90,
        },
        {
            title: '第一产程',
            dataIndex: 'firststage',
            width: 90,
            render: (value, rowData) => {
                return `${Number(rowData.firststageh)} 时 ${Number(rowData.firststagem)}分`
            }
        },
        {
            title: '第二产程',
            dataIndex: 'secondstage',
            width: 90,
            render: (value, rowData) => {
                return `${Number(rowData.secondstageh)} 时 ${Number(rowData.secondstagem)}分`
            }
        },
        {
            title: '第三产程',
            dataIndex: 'thirdstage',
            width: 90,
            render: (value, rowData) => {
                return `${Number(rowData.thirdstageh)} 时 ${Number(rowData.thirdstagem)}分`
            }
        },
        {
            title: '胎儿信息',
            align: 'center',
            children: [
                {
                    title: '性别',
                    dataIndex: ['admission', 'noenateRecords'],
                    key: 'admission.noenateRecords.gender',
                    width: 40,
                    // inputType: 'MC',
                    // inputProps: {
                    //     options: '男,女,不详',
                    //     marshal: 0,
                    // },
                    align: 'center',
                    render: (text: Array<AnyObject>) => {
                        if (mchcEnv.is_primary)
                            return mchcEnv.expect_array(text).map(_ => mchcEnv.get_option_label('性别3', _?.gender))
                        let obj = {
                            1: '男',
                            2: '女',
                            3: '不详'
                        }
                        return text?.map((item) => (
                            <div key={item.id}>
                                {obj[item.gender]}
                            </div>
                        ));
                    },
                },
                {
                    title: '体重(g)',
                    dataIndex: ['admission', 'noenateRecords'],
                    key: 'admission.noenateRecords.weight',
                    width: 60,
                    render: (text: Array<Object>) => {
                        return text?.map((item) => (
                            <div >
                                {item.weight}
                            </div>
                        ));
                    },
                },
                {
                    title: '身长(cm)',
                    dataIndex: ['admission', 'noenateRecords'],
                    key: 'admission.noenateRecords.height',
                    width: 60,
                    render: (text: Array<Object>) => {
                        return text?.map((item) => (
                            <div >
                                {item.height}
                            </div>
                        ));
                    },
                },
                {
                    title: '阿氏评分1',
                    dataIndex: ['admission', 'noenateRecords'],
                    key: 'admission.noenateRecords.apgar1',
                    width: 60,
                    render: (text: Array<Object>) => {
                        return text?.map((item) => (
                            <div >
                                {item.apgar1}
                            </div>
                        ));
                    },
                },
                {
                    title: '阿氏评分2',
                    dataIndex: ['admission', 'noenateRecords'],
                    key: 'admission.noenateRecords.apgar5',
                    width: 60,
                    render: (text: Array<Object>) => {
                        return text?.map((item) => (
                            <div >
                                {item.apgar5}
                            </div>
                        ));
                    },
                },
                {
                    title: '阿氏评分3',
                    dataIndex: ['admission', 'noenateRecords'],
                    key: 'admission.noenateRecords.apgar10',
                    width: 60,
                    render: (text: Array<Object>) => {
                        return text?.map((item) => (
                            <div >
                                {item.apgar10}
                            </div>
                        ));
                    },
                },
                {
                    title: '出生缺陷',
                    dataIndex: ['admission', 'noenateRecords'],
                    key: 'admission.noenateRecords.birthInjury',
                    width: 100,
                    render: (text: Array<Object>) => {
                        return text?.map((item) => (
                            <div >
                                {item.birthInjury}
                            </div>
                        ));
                    },
                },
                {
                    title: '分娩方式',
                    dataIndex: ['admission', 'noenateRecords'],
                    key: 'admission.noenateRecords.deliverytype',
                    // inputType: 'MS',
                    // inputProps: {
                    //     options: mchcEnv.is('郫都') ? '顺产,剖宫产,吸引产,钳产,臀助产,臀引产,胎吸,阴道助产,人工引产,人工流产,药物流产,自然流产' : '',
                    //     optionKey: mchcEnv.is('郫都') ? '' as any : '分娩方式',
                    //     marshal: 0,
                    // },
                    width: 100,
                    render: (text: Array<AnyObject>) => {
                        if (mchcEnv.is_primary)
                            return mchcEnv.expect_array(text).map(_ => mchcEnv.get_option_label('分娩方式', _?.deliverytype)).join(',')
                        let obj = mchcEnv.is('郫都') ?
                            { 1: '顺产', 2: '剖宫产', 3: '胎吸', 4: '钳产', 5: '臀助产', 6: '臀牵引', 7: '阴道助产', 8: '人工引产', 9: '人工流产', 10: '药物流产', 11: '自然流产' }
                            : { 1: '自然产', 2: '剖宫产', 3: '吸引产', 4: '钳产', 5: '臀助产', 6: '臀引产', 7: '其他' };
                        return text?.map((item, index) => {
                            return <div key={item.id}>{obj[item.deliverytype]}</div>;
                        })
                    }
                },
                {
                    title: '胎方位',
                    dataIndex: ['admission', 'noenateRecords'],
                    key: 'admission.noenateRecords.fetalposition',
                    inputType: 'MS',
                    inputProps: {
                        uniqueKey: 'NoenateRecord.fetalposition',
                    },
                    width: 100,
                    render: (text: Array<AnyObject>) => {
                        if (mchcEnv.is_primary)
                            return mchcEnv.expect_array(text).map(_ => mchcEnv.get_option_label('胎方位22', +_?.fetalposition)).join(',')

                        let obj = { 1: '左枕前(LOA)', 2: '左枕横(LOT)', 3: '左枕后(LOP)', 4: '右枕前(ROA)' };
                        return text?.map((item, index) => {
                            return <div key={item.id}>{obj[item.fetalposition]}</div>;
                        })
                    }
                },
            ],
        },
    ]
)