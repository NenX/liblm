import { mchcEnv } from '@lm_fe/env';
import { lazy } from 'react';
import { IMyAddressProps } from './type';
import React from 'react';
import { MyAddressOld } from './Old';
export * from './Old'

const MyAddressNew_ = lazy(() => import('./Inner'))


function MyAddress(props: IMyAddressProps) {
    if (mchcEnv.in(['建瓯', '广三', '郫都', '广州市八','南医附属'])) {
        return <MyAddressNew_ {...props} />
    }
    return <MyAddressOld {...props} />
}
function MyAddressNew(props: IMyAddressProps) {
    return <MyAddressNew_ {...props} />
}

export { IMyAddressProps, MyAddress, MyAddressNew }