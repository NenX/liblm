import { LazyAntd, SimpleForm } from '@lm_fe/components';
import { event, asRequest as request } from '@lm_fe/utils';
import { Button, Checkbox, Form, Input, InputNumber, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import strategies from './strategies';
import { AnalyseType, tableData } from './tableData';
import { IPv } from './types';
import useSign from './useSign';
// const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface IProps {
    name: string
    hidden?: boolean
    disabled?: boolean
    mark: AnalyseType
    pv?: IPv

    [x: string]: any
}
// function RenderResult({ k, m, disabled }: { k: string, m: AnalyseType, disabled: boolean }) {
//     console.log('zz', k, m, disabled)
//     if (m === 'Cst') {
//         if (k === 'acc') {
//             return (
//                 <Select style={{ width: 100 }}>
//                     <Select.Option value="0">无</Select.Option>
//                     <Select.Option value="1">周期性</Select.Option>
//                     <Select.Option value="2">散在性</Select.Option>
//                 </Select>
//             )
//         }
//     }
//     return <Input disabled={disabled} style={{ width: 44 }} />
// }
const T = function (props: IProps) {
    const { hidden, disabled, mark, pv, } = props

    const [form0] = Form.useForm()
    const [form1] = Form.useForm()
    const [cacheType, setCacheType] = useState<AnalyseType>('Nst')

    const dataSource = tableData[cacheType]
    const deformed = dataSource.deformed


    const { fetchQrCode, qrCodeBase64, modalVisible, setModalVisible } = useSign()
    useEffect(() => {
        function cb(ca: string) {
            if (pv) {
                request.post('/exam/' + pv.exam.id, {
                    ...pv.exam, ca, save: JSON.stringify({
                        ...form0.getFieldsValue(),
                        ...form1.getFieldsValue()
                    })
                })

            }
        }
        event.on('signed', cb)

        return () => {
            event.off('signed', cb)

        };
    }, [pv])
    const columns: any = [
        {
            title: '项目',
            dataIndex: 'name',
            render(a: any) {
                return (
                    <span style={{ whiteSpace: 'nowrap', }}>{a}</span>
                )
            }
        },
        {
            title: deformed ? '正常' : '0分',
            dataIndex: '0',
            render(a) {
                return (
                    <div title={a} style={{ cursor: 'help', fontSize: 12, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 100 }}>{a}</div>
                )
            }
        },
        {
            title: deformed ? '可疑' : '1分',
            dataIndex: '1',
            render(a) {
                return (
                    <div title={a} style={{ cursor: 'help', fontSize: 12, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 160 }}>{a}</div>
                )
            }
        },
        {
            title: deformed ? '异常' : '2分',
            dataIndex: '2',
            render(a) {
                return (
                    <div title={a} style={{ cursor: 'help', fontSize: 12, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 160 }}>{a}</div>
                )
            }
        },
        false ? null : {
            width: deformed ? 180 : undefined,
            title: (
                <Form.Item name={deformed ? 'result' : 'total'} label={deformed ? '结果' : '总分'} style={{ margin: '0 12px', marginBottom: 0, display: 'flex', justifyContent: 'center' }}>
                    <InputNumber disabled style={{ width: 70, marginRight: 0 }} />
                </Form.Item>
            ),
            dataIndex: 'result',
            render(a, { key, R }) {
                return (
                    <Form.Item name={`${key}value`} style={{ margin: -8, marginTop: -8, marginBottom: -8 }}>
                        {
                            R ? <R disabled={disabled} /> : <Input size="small" disabled={disabled} style={{ width: 44 }} />

                        }
                    </Form.Item>
                )
            }
        },
        false ? null : {
            title: deformed ? '类型' : '得分',
            dataIndex: 'score',
            render(a, { key, S }) {
                return (

                    <Form.Item name={`${key}score`} style={{ margin: -8, marginTop: -8, marginBottom: -8, padding: '0 8px' }}>
                        {
                            S ? <S disabled={true} /> : <InputNumber size="small" disabled={true} style={{ width: 44 }} />
                        }
                    </Form.Item>
                )

            }
        },

    ]
        .filter(_ => !!_)
        .map(_ => ({ ..._, align: 'center' }))
    useEffect(() => {
        form1.setFieldsValue({
            type: cacheType
        })
    }, [])
    console.log('qrCodeBase64', qrCodeBase64)
    return (
        <>

            <Form form={form0} size="small" style={{ display: (false && hidden) ? 'none' : 'block', position: 'relative', margin: 12 }}
                initialValues={{ deformed }}
                layout="inline"
                onValuesChange={(a, b) => {
                    const vk = Object.keys(b)
                    const k = Object.keys(a)[0]
                    if (/score$/.test(k)) {
                        const total = vk
                            .filter((k) => /score$/.test(k))
                            .map(_ => b[_])
                            .reduce((a: any, b: any) => a + b, 0)
                        form0.setFieldsValue({ total })
                    }
                    const newData = strategies(mark, form0.getFieldsValue(),)
                    newData && form0.setFieldsValue(newData)

                }}>
                {/* <Form.Item name={deformed ? 'result' : 'total'} label={deformed ? '结果' : '总分'} style={{ position: 'absolute', top: -44, right: 260 }}>
                <InputNumber disabled style={{ width: 120 }} />
            </Form.Item> */}

                <Form.Item name={'deformed'} style={{ display: 'none', visibility: 'hidden' }} valuePropName="checked">
                    <Checkbox />
                </Form.Item>



                <Table bordered size="small" pagination={false} columns={columns} dataSource={dataSource} />
            </Form>
            <SimpleForm
                onValuesChange={(a, b) => {
                    b.type && setCacheType(b.type)
                }}
                form={form1}
                blocks={[
                    {
                        // title: '搜索条件',
                        rows: [
                            {
                                itemsInRow: [
                                    { type: 'Select', outerOptions: { name: 'type', label: '分析方法' }, innerOptions: { allowClear: false, options: ['Nst', 'Krebs', 'Fischer', 'Sogc', 'Cst', 'Cstoct'].map(_ => ({ label: _, value: _ })) } },

                                    { type: 'Select', outerOptions: { name: 'fetal', label: '胎心率' }, innerOptions: { options: ['FHR1', 'FHR2', 'FHR3',].map(_ => ({ label: _, value: _ })) } },
                                ],
                                layoutType: 6
                            },
                            {
                                itemsInRow: [

                                    { type: 'Input', outerOptions: { name: 'uctimes', label: '宫缩次数' }, },
                                    { type: 'Input', outerOptions: { name: 'ucStrong', label: '宫缩强度' }, },
                                    { type: 'Input', outerOptions: { name: 'ucdurationtime', label: '间隔时间' }, },
                                    { type: 'Input', outerOptions: { name: 'uckeeptime', label: '持续时间' }, },
                                    { type: 'Input', outerOptions: { name: 'edtimes', label: '早减' }, },
                                    { type: 'Input', outerOptions: { name: 'ldtimes', label: '晚减' }, },
                                    { type: 'Input', outerOptions: { name: 'vdtimes', label: '变异减速' }, },
                                    { type: 'Select', outerOptions: { name: 'NST', label: 'NST' }, innerOptions: { options: ['正常', '异常', '不典型',].map(_ => ({ label: _, value: _ })) } },
                                    { type: 'Select', outerOptions: { name: 'OCT', label: 'OCT' }, innerOptions: { options: ['阴性', '阳性', '可疑',].map(_ => ({ label: _, value: _ })) } },
                                    { type: 'Select', outerOptions: { name: 'CST', label: 'CST' }, innerOptions: { options: ['Ⅰ类', 'Ⅱ类', 'Ⅲ类',].map(_ => ({ label: _, value: _ })) } },
                                ],
                                layoutType: 6
                            },
                            {
                                itemsInRow: [
                                    { type: 'TextArea', outerOptions: { name: 'ucdurationtime', label: '诊断意见' }, layoutType: 16 },
                                    {
                                        type: 'Custom', customNode: <Button type="primary" style={{ padding: '0 24px', marginRight: 24, float: 'right' }} onClick={e => {
                                            pv && fetchQrCode(pv.exam.note)
                                            console.log(form0.getFieldsValue(), form1.getFieldsValue())
                                        }}>提交</Button>, layoutType: 8
                                    },

                                ],
                            },


                        ]
                    }
                ]}
            />


            <Modal visible={modalVisible} footer={null} title="请扫码" onCancel={() => setModalVisible(false)}>
                <img src={qrCodeBase64} width="480" />

            </Modal>
        </>
    );
}
export default T
