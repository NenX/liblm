import { lazy } from 'react'
export * from './Preeclampsia'
export * from './ScarredUterus'

// export * from './HeaderInfoLayout'
// export * from './HeaderInfo'

// export * from './HighRiskTableEntry'
export * from './HighriskGradeSelect'

// 从 DoctorEnd_DiagnosesTemplate 导入
// const DiagnosesTemplate = lazy(() => import('./Diagnoses/template'))
const GestationalWeekProjectTree = lazy(() => import('./GestationalWeekProjectTree'))
export { GestationalWeekProjectTree } 