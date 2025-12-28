import { useObisDoctorWs } from "@lm_fe/components_m";
import { mchcEvent, mchcLogger, mchcUtils } from "@lm_fe/env";
import { useEffect, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
const getDoctorEndId = mchcUtils.getDoctorEndId
import React from "react";
import { mchcModal__ } from "@lm_fe/pages";
export function Ws() {
    const pid = getDoctorEndId()
    // const [receiveData, setReceiveData] = useState<any[]>([])
    const dataCache = useRef<any[]>([])
    const modalId = useRef(1)
    const ins = useRef<ReconnectingWebSocket>()
    useObisDoctorWs(pid);
    useEffect(() => {
        const rm = mchcEvent.on_rm('ws_event', e => {
            if (e.type !== 'obis-doctor') return
            ins.current = e.ins
            if (e.event === 'message' && e.data) {
                const { ins, data } = e
                if (data.type === 'RiskMark' || data.type === 'DiagnosisRemind') {
                    dataCache.current = [...dataCache.current, data]
                }

                if (e.data.type === 'clean-msg') {
                    mchcLogger.log('ssbb', e.data, dataCache.current)

                    e.data.isShow && setTimeout(openModal, 800)
                }
            }
        })
        return rm
    }, [])

    function openModal() {

        mchcModal__.openOne(modalId.current, '预警提醒_高危快讯', {
            modal_data: {
                makeSure(data: any) { ins.current?.send(JSON.stringify(data)) },
                websocketDataSum: dataCache.current,
                websocketData: dataCache.current,
                id: getDoctorEndId(),
            },

        })

        dataCache.current = []

    }
    return <div></div>

}