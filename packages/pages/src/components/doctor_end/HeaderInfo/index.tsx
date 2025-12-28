import React, { lazy } from 'react';
import { IHeaderInfoProps } from './types';
import { MyLazyComponent } from '@lm_fe/components';
const HeaderInfoInner = lazy(() => import('./Inner'))
export { IHeaderInfoProps }
export function DoctorEnd_HeaderInfo(props: IHeaderInfoProps) {
  return <MyLazyComponent size='tiny'>
    <HeaderInfoInner {...props} />
  </MyLazyComponent>
}




