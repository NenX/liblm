import { mchcStore } from "@lm_fe/env"
import { IMchc_HighriskGradeConfig } from "@lm_fe/service"
import React, { useState, useEffect } from "react"
export function HighriskGradeColorSpan(props: { level: string }) {

    const [gradeOptions, set_gradeOptions] = useState<IMchc_HighriskGradeConfig[]>([])

    useEffect(() => {
        set_gradeOptions(mchcStore.highriskGradeConfig)

        return () => {

        }
    }, [])
    function getGradeColor(label: any) {
        label = label ?? 'I';

        const target = gradeOptions.find(_ => _.label === label)
        return target?.note;
    };
    return <span
        style={{
            background: getGradeColor(props.level),
            display: 'inline-block',
            width: '12px',
            height: '12px',
            margin: '0 10px',
        }}
    ></span>
}

