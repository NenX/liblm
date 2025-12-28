import { lazy } from "react";
import HighriskGradeDisplay from "./BusinessComponents/HighriskGrade";

export * from "./GeneralComponents/CustomIcon";
export * from './BaseTable'
// export * from './BaseList'
export * from './MyForm'
export * from './doctor-end'

export * from './modals'

export * from './ConfigComponents/CheckboxWithInput'

export * from './MyForm/components/business/PregnancyHistory'
export * from './ConfigComponents/DictionarySelect'
export { GeneralComponents_DictionarySelect, GeneralComponents_DictionarySelect_Display } from './GeneralComponents/DictionarySelect'
export { GeneralComponents_InputWithLabel, } from './GeneralComponents/InputWithLabel'
export { default as CheckAndCancelButton } from './GeneralComponents/CheckAndCancelButton'

// export { default as LaborProcess2 } from './BusinessComponents/LaborProcess2';
export { FormSection, DynamicForm } from './BaseModalForm'
export * from './FU_components/FormSection'
export { MyFormSectionForm } from './FU_components/FormSection/FormSectionForm'

export { default as BaseEditPanel, BaseEditPanelIProps } from './BaseEditPanel'
// export { FormSectionForm } from './BaseModalForm/FormSectionForm'
export { MyFormSectionForm as FormSectionForm } from './FU_components/FormSection/FormSectionForm'
export { default as BaseEditPanelForm } from './BaseEditPanel/BaseEditPanelForm'
export { default as generateModalForm } from './BaseModalForm'
export { default as PanelWithChildFC, PanelTitle, PanelTitleWrapper } from './BaseEditPanel/PanelWithChildFC'
export { default as PanelWithChild, IPanelWithChildProps } from './BaseEditPanel/PanelWithChild'
export { default as BaseQuery } from './BaseQuery'

export { default as observePatientData } from './utils/observePatientData'

export { GeneralComponents_EditInTable_Inner } from './GeneralComponents/EditInTable';
export { default as MyDatePicker } from './GeneralComponents/DatePicker'
export { default as CaseTempleteEdit } from './GeneralComponents/CaseTemplete'
export * from './FU_components'
export * from './FB_components'

export * from './utils/constants'
export * from './utils/levelOptions'
export * from './utils'

export * from './hooks'
export * from './utils/adapter'
export * from './utils/utils'
export * from './utils/format'
export * from './utils/defaultMethod'
export { default as DataSelect } from './DataSelect'
export { default as BaseTableOld } from './BaseTableOld'
export { default as BaseListOld } from './BaseListOld'
export { default as CascaderAddress } from './selects/CascaderAddress';

export * from './common_field_item'

export { default as PatientAutoComplete, usePatientAutoComplete } from './selects/PatientAutoComplete'
export * from './layout'
export * from './curve'
export { PDFPreview_View } from './PDFPreview'
const BaseEditPanelFormFC = lazy(() => import('./BaseEditPanel/BaseEditPanelFormFC'))

export { BaseEditPanelFormFC }

export { default as PressureInput } from './BusinessComponents/PressureInput';
export { default as InputWithRange } from './GeneralComponents/InputWithRange';

export { HighriskGradeDisplay }

export { default as PermissionSelect } from './selects/PermissionSelect'
export { default as ApiPermissionSelect } from './selects/ApiPermissionSelect'

export * from '@lm_fe/components'

export { get_check_invert_values } from "./GeneralComponents/CheckboxWithInput_gold/utils"
export * from './utils/preload_components'

export { MyBaseListComponents } from './FU_components/MyBaseList'
export { MyComponent } from './MyForm'

export { default as NativePlace } from './selects/NativePlace/NativePlace'