import { mchcConfig, mchcUtils } from '@lm_fe/env';
import { ThrombusDefault } from './Default/ThrombusDefault';
import { IProps } from './types';
import { ThrombusGysy } from './2015RCOG降低妊娠及产褥期静脉血栓栓塞的风险_广三/ThrombusGysy'
import React from 'react';
export default function Thrombus(props: IProps) {

  const type = mchcConfig.get('VTE预防用药筛查表')
  if (type?.includes('广三')) {
    return <ThrombusGysy {...props} />
  }
  return (
    <ThrombusDefault {...props} />
  );
}




