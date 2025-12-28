import React from 'react'
import { MountGlobalModal, GlobalModal } from '@lm_fe/components'
import { routesData } from './meta'
export const mchcModal__ = new GlobalModal<typeof routesData>()
export function MountMchcModal() {
    return <MountGlobalModal meta={routesData} globalModal={
        mchcModal__} />
}

