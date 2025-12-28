import { LazyAntd, MyLazyComponent } from '@lm_fe/components';
import { OkButton } from '@lm_fe/components_m';
import { mchcUtils } from '@lm_fe/env';
import { BF_Wrap2, mchcModal__ } from '@lm_fe/pages';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit } from '@lm_fe/service';
import { Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { filter_diagnoses } from '../../../.utils';
import styles from './index.module.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface IProps {
    visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient,
    headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
    setDiagnosesList?(list: IMchc_Doctor_Diagnoses[]): void
    setFormData(v: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>): void

    formData?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>,
    furtherRefresh(): void
}

export default function FurtherTable(props: IProps) {

    const { setFormData, setDiagnosesList, visitsData, headerInfo, formData, } = props;

    const preg_id = mchcUtils.getDoctorEndId(visitsData);



    const [selectKeys, set_selectKeys] = useState<any[]>([])
    const [selectRows, set_selectRows] = useState<any[]>([])

    const printTableRef = useRef<HTMLDivElement>(null)
    const { config, Wrap } = BF_Wrap2({ default_conf: { title: '复诊-产检记录表格', tableColumns: () => import('./config') } })

    useEffect(() => {



    }, [])

    const filtered_rvisits = (visitsData?.rvisits ?? []).filter(_ => _.id)







    async function handlePrint() {

        mchcModal__.open('print_modal', {
            modal_data: {
                requestData: {
                    url: '/api/pdf-preview',
                    id: preg_id,
                    resource: 'prenatalRVisit'
                }
            }
        })
    };








    const renderTable = (isAll = false) => {
        return <Wrap>
            <Table scroll={isAll ? undefined : { y: 160 }} bordered pagination={false} size={isAll ? 'large' : 'small'}
                // rowSelection={{
                //     selectedRowKeys: selectKeys,
                //     onChange(keys, rows) {
                //         mchcLogger.log({ keys, rows })
                //         set_selectKeys(keys)
                //         set_selectRows(rows)
                //     }
                // }}

                onRow={(record) => {

                    return {
                        onClick(event) {
                            set_selectKeys([record.id])
                            set_selectRows([record])

                        },
                        onDoubleClick() {
                            setFormData(record);
                            mchcModal__.pop()
                            const __diagnoses = filter_diagnoses(visitsData?.diagnoses)


                            setDiagnosesList?.(__diagnoses);
                        },

                    };
                }}
                rowClassName={r => {
                    return r.id === formData?.id ? styles['selected-row'] : ''
                }}
                rowKey={'id'}
                dataSource={isAll ? filtered_rvisits : filtered_rvisits.slice(0, 5)}
                columns={config?.tableColumns}
            />
        </Wrap>

    }
    return (
        <div className={styles['FurtherTable']}>
            <MyLazyComponent size='middle'>

                {renderTable()}

                <div className={styles['btn-wrap']}>
                    <span>共 {filtered_rvisits.length} 条记录</span>
                    <Space>
                        <OkButton type="text" size="small" onClick={props.furtherRefresh} >
                            刷新
                        </OkButton>
                        <OkButton type="text" size="small" onClick={handlePrint} >
                            打印
                        </OkButton>
                        <OkButton type='text' size="small" onClick={() => mchcModal__.open('modal_page', { modal_data: { content: renderTable(true) } })}>
                            更多...
                        </OkButton>
                    </Space>
                </div>
            </MyLazyComponent>

        </div>
    );
}
