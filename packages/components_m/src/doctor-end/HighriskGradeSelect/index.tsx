import { mchcConfig, mchcEvent } from '@lm_fe/env';
import {
    IMchc_Doctor_OutpatientHeaderInfo, IMchc_HighriskGradeConfig,
    SMchc_Common, SMchc_Doctor, TIdTypeCompatible
} from '@lm_fe/service';

import { LazyAntd } from '@lm_fe/components';
import { request } from '@lm_fe/utils';
import {
    map
} from 'lodash';
import React, { useEffect, useState } from 'react';
import { HighriskGradeColorSpan } from 'src/FU_components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
interface IProps {
    headerInfo?: IMchc_Doctor_OutpatientHeaderInfo
    pregnancyId?: TIdTypeCompatible
}
export function HighRiskGradeSelect(props: IProps) {
    const { headerInfo, pregnancyId, } = props


    const [_headerInfo, set_headerInfo] = useState<IMchc_Doctor_OutpatientHeaderInfo>()
    const [highriskGrade, setHighriskGrade] = useState<string>()

    useEffect(() => {
        if (headerInfo) {
            set_headerInfo(headerInfo)

        } else if (pregnancyId) {

            SMchc_Doctor.getOutpatientHeaderInfo(pregnancyId).then(set_headerInfo)
        }

    }, [headerInfo, pregnancyId])

    useEffect(() => {

        setHighriskGrade(_headerInfo?.highriskLable ?? _headerInfo?.highriskGrade)

    }, [_headerInfo])


    function _onChange(v?: string) {
        setHighriskGrade(v)

        const postData = {
            ...headerInfo,
            gestationalWeek: headerInfo?.gesweek,
            highriskGrade: v,
            outEmrId: headerInfo?.id,

        };


        request.put('/api/doctor/assessHighRisk', postData, { successText: '操作成功' })
            .then(() => {
                mchcEvent.emit('outpatient', { type: '刷新头部', pregnancyId: headerInfo?.id })

            })

    }


    return (

        <HighRiskGradeSelectPure onChange={_onChange} value={highriskGrade} />


    );
}

// value Ⅰ Ⅱ ...
export function HighRiskGradeSelectPure(props: { value?: string, onChange?(v: string): void, disabled?: boolean }) {
    const { value, onChange, disabled } = props

    const [gradeOptions, set_gradeOptions] = useState<IMchc_HighriskGradeConfig[]>([])

    useEffect(() => {
        SMchc_Common.getHighriskGradeConfig()
            .then(set_gradeOptions)

        return () => {

        }
    }, [])





    const is禁止编辑高危等级 = mchcConfig.get('禁止编辑高危等级') || disabled
    return (

        <Select
            disabled={is禁止编辑高危等级}
            onChange={onChange}
            style={{ width: 140 }}
            value={value}
        >
            {map(gradeOptions, (item) => (
                <Select.Option value={item.label}>
                    <HighriskGradeColorSpan level={item.label} />
                    {item.colorText}
                    {/* {item.label} */}

                </Select.Option>
            ))}
        </Select>

    );
}

