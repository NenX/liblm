import React, { lazy } from "react";
import { IDoctorEnd_BaseProps } from './Inner'
import { SMchc_Common } from "@lm_fe/service";
const DoctorEnd_Base_ = lazy(() => import('./Inner'))
export function DoctorEnd_Base(props: IDoctorEnd_BaseProps) {

  return <DoctorEnd_Base_  {...props} />
}