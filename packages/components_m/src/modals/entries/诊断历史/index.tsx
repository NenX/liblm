import { IGlobalModalProps, LazyAntd } from '@lm_fe/components';
import { IMchc_Doctor_OutpatientHeaderInfo, SMchc_Doctor, TIdTypeCompatible } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Button, Modal } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


interface IProps {
    pregnancyId: TIdTypeCompatible
}
export default function Test({ modal_data, visible, onCancel, ...others }: IGlobalModalProps<IProps>) {
    const { pregnancyId, } = modal_data


    const [recordData, setRecordData] = useState([])
    const [headerInfo, set_headerInfo] = useState<IMchc_Doctor_OutpatientHeaderInfo>()
    const printDiagRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (pregnancyId) {
            request.get(`/api/getDiagnosisHistories?pregnancyId=${pregnancyId}`).then(r => setRecordData(r.data))
            SMchc_Doctor.getOutpatientHeaderInfo(pregnancyId).then(set_headerInfo)
        }

        return () => {

        }
    }, [pregnancyId])



    const renderTable = () => {

        const columns = [
            { title: '流水号', dataIndex: 'serialNo', key: 'serialNo', width: 150, align: 'center' as const },
            { title: 'ICD编码', dataIndex: 'diagnosisCode', key: 'diagnosisCode', width: 150, align: 'center' as const },
            {
                title: '前备注',
                dataIndex: 'preNote',
                key: 'preNote',
                align: 'center' as const,
            },
            {
                title: '诊断',
                dataIndex: 'diagnosis',
                key: 'diagnosis',
                align: 'center' as const,
            },
            {
                title: '后备注',
                dataIndex: 'note',
                key: 'note',
                align: 'center' as const,
            },
            { title: '诊断医生', dataIndex: 'doctorName', key: 'doctorName', width: 150, align: 'center' as const },
            { title: '诊断日期', dataIndex: 'createDate', key: 'createDate', width: 200, align: 'center' as const },
        ];
        // {id: 4876, createDate: '2022-02-24', doctor: 'kevin', diagnosis: '涉及骨折板和其他内固定装置的随诊医疗'}
        return <Table className="prenatal-visit-main-table" columns={columns} dataSource={recordData} pagination={false} />;
    };

    const renderPrint = () => {

        return (
            <div className="diag-wrapper" ref={printDiagRef}>
                {/* <div className="diag-first">
            1、G<span className="diag-GP">{get(pregnancyData, 'gravidity')}</span>P
            <span className="diag-GP">{get(pregnancyData, 'parity')}</span>
            妊娠<span className="diag-week">{get(pregnancyData, 'currentGestationalWeek')}</span>周
          </div> */}
                <div style={{ fontWeight: 700, fontSize: '18px', marginTop: '15px', marginLeft: '15px', marginBottom: '15px' }}>
                    <span>{get(headerInfo, 'name')}</span> &nbsp;&nbsp;&nbsp;&nbsp;
                    <span>就诊卡号：{get(headerInfo, 'outpatientNO')}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>年龄：{get(headerInfo, 'age')}</span>
                </div>

                {/* {diagnosesList &&
            diagnosesList.map((item: any, i: number) => (
              <div className="diag-item" key={i + 2}>
                <span>{i + 2}、</span>
                <span>{item.diagnosis}</span>
                <span>{item.note}</span>
              </div>
            ))} */}
                {renderTable()}
            </div>
        );
    };

    const buttons = [
        <ReactToPrint
            trigger={() => <Button type="primary">打印最新诊断</Button>}
            content={() => printDiagRef.current}
        />,
    ];

    return (
        <Modal
            {...others}

            visible={visible}
            width={'80%'}
            footer={buttons}
            onCancel={onCancel}
            style={{ top: '20px' }}
            bodyStyle={{ height: '80vh', overflowY: 'scroll' }}
            destroyOnClose
            className="diag-record-modal"

            title="诊断历史"


        >
            {renderTable()}
            {renderPrint()}
        </Modal>
    );

};