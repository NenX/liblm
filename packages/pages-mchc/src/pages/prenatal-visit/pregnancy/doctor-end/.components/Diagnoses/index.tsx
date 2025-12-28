import { MyLazyComponent } from "@lm_fe/components";
import React from "react";
import { lazy } from "react";
import { IDiagnosesprops } from "./types";

const Inner = lazy(() => import('./Inner'))
export default function DoctorEnd_Diagnoses(props: IDiagnosesprops) {
  return <MyLazyComponent>
    <Inner {...props} />
  </MyLazyComponent>
}
