import { AutoComplete, ButtonProps, Divider, FormInstance, Input, Radio } from 'antd';
import { get, keyBy } from 'lodash';
import React, { lazy } from 'react';
import DataSelectWithOptionsOrInput from '../../selects/DataSelectWithOptionsOrInput';
import PatientAutoComplete from '../../selects/PatientAutoComplete';

// import RowoftireRecordBaby from '../../others/baby-form';
const BirthCertificateChildren = lazy(() => import('../../BusinessComponents/BirthCertificateChildren'))
const Deathclassification1 = lazy(() => import('../../BusinessComponents/TemplateTexDeathclassification1'))
const Deathclassification2 = lazy(() => import('../../BusinessComponents/TemplateTexDeathclassification2'))
const TemplateTextareav3 = lazy(() => import('../../BusinessComponents/TemplateTextareav3'))
const TemplateTextrootcauseDeath = lazy(() => import('../../BusinessComponents/TemplateTextrootcauseDeath'))
const RevertEditInTable = lazy(() => import('../../ConfigComponents/RevertEditInTable'))
const BorderTitle = lazy(() => import('../../GeneralComponents/border-title/border-title'))
const NativePlace = lazy(() => import('../../selects/NativePlace/NativePlace'))
const CureState = lazy(() => import('../../special-components/cure-state/cure-state'))
const SyphilisTested = lazy(() => import('../../special-components/syphilis-tested/syphilis-tested'))
const DataSelect = lazy(() => import('../../DataSelect'))
const DataSelectWithAutoInput = lazy(() => import('../../DataSelectWithAutoInput'))
const PressureInputV2 = lazy(() => import('../../BusinessComponents/PressureInput/index-v2'))
const TreatmentProgramBaisc = lazy(() => import('../../BusinessComponents/TreatmentProgram/TreatmentProgramBasic'))
const MultiSelector = lazy(() => import('../../GeneralComponents/Select/MultiSelector'))
const SingleSelector = lazy(() => import('../../GeneralComponents/Select/SingleSelector'))
const OptimizeEditInTable = lazy(() => import('../../MyForm/components/MyTable'))
const Appgar = lazy(() => import('../../BusinessComponents/Appgar'))
const BloodAndThalassemia = lazy(() => import('../../BusinessComponents/BloodAndThalassemia'))
const BloodPressure = lazy(() => import('../../BusinessComponents/BloodPressure'))
const BregmaGroup = lazy(() => import('../../BusinessComponents/BregmaGroup'))
const CaesareanChildren = lazy(() => import('../../BusinessComponents/CaesareanChildren'))
const CalculateScoreTable = lazy(() => import('../../BusinessComponents/CalculateScoreTable'))
const Diagnosis = lazy(() => import('../../BusinessComponents/Diagnosis'))
const DiagnosisList = lazy(() => import('../../BusinessComponents/DiagnosisList'))
const DiagnosisListInduced = lazy(() => import('../../BusinessComponents/DiagnosisListInduced'))
const DiagnosisListv2 = lazy(() => import('../../BusinessComponents/DiagnosisListv2'))
const FamilyTumorHistory = lazy(() => import('../../BusinessComponents/FamilyTumorHistory'))
const FetalNTCheck = lazy(() => import('../../BusinessComponents/FetalNTCheck'))
const FetalUltrasound = lazy(() => import('../../BusinessComponents/FetalUltrasound'))
const FoetalAppendage = lazy(() => import('../../BusinessComponents/FoetalAppendage'))
const GynaecologyOperationTemplateTextarea = lazy(() => import('../../BusinessComponents/GynaecologyOperationTemplateTextarea'))
const GynaecologyTemplateTextarea = lazy(() => import('../../BusinessComponents/GynaecologyTemplateTextarea'))
const HighriskSign = lazy(() => import('../../BusinessComponents/HighriskSign'))
const InducedFetus = lazy(() => import('../../BusinessComponents/InducedFetus'))
const InspectionResultTextarea = lazy(() => import('../../BusinessComponents/InspectionResultTextarea'))
const KnowledgeBase = lazy(() => import('../../BusinessComponents/KnowledgeBase'))
const LaborProcess = lazy(() => import('../../BusinessComponents/LaborProcess'))
// const LaborProcess2 = lazy(() => import('../../BusinessComponents/LaborProcess2'))
const MiddleUltsounds = lazy(() => import('../../BusinessComponents/MiddleUltsounds'))
const MiddleUltsoundsSingle = lazy(() => import('../../BusinessComponents/MiddleUltsoundsSingle'))
const NoenateRecord = lazy(() => import('../../BusinessComponents/NoenateRecord'))
const NurseChildren = lazy(() => import('../../BusinessComponents/NurseChildren'))
const NurseChildren2 = lazy(() => import('../../BusinessComponents/NurseChildren2'))
const NursingFetus = lazy(() => import('../../BusinessComponents/NursingFetus'))
const NursingFetusv2 = lazy(() => import('../../BusinessComponents/NursingFetusv2'))
const NursingFetusv3 = lazy(() => import('../../BusinessComponents/NursingFetusv3'))
// const NursingFetusv4 = lazy(() => import('../../BusinessComponents/NursingFetusv4'))
const OxytocinTable = lazy(() => import('../../BusinessComponents/OxytocinTable'))
const PostpartumFetal = lazy(() => import('../../BusinessComponents/PostpartumFetal'))
const PregnancyHistoryV2 = lazy(() => import('../../BusinessComponents/PregnancyHistoryV2'))
const PressureInput = lazy(() => import('../../BusinessComponents/PressureInput'))
const ProcedureCystocentesis = lazy(() => import('../../BusinessComponents/ProcedureCystocentesis'))
const ProcedureIntrauterine = lazy(() => import('../../BusinessComponents/ProcedureIntrauterine'))
const RecordState = lazy(() => import('../../BusinessComponents/RecordState'))
const ReferralRegister = lazy(() => import('../../BusinessComponents/ReferralRegister'))
const ReferralToRegister = lazy(() => import('../../BusinessComponents/ReferralToRegister'))
const ResultTextarea = lazy(() => import('../../BusinessComponents/ResultTextarea'))
const ShiftPatients = lazy(() => import('../../BusinessComponents/ShiftPatients'))
const SurgicalInspectionReport = lazy(() => import('../../BusinessComponents/SurgicalInspectionReport'))
const TemplateTextarea = lazy(() => import('../../BusinessComponents/TemplateTextarea'))
const TemplateTextareav2 = lazy(() => import('../../BusinessComponents/TemplateTextareav2'))
const UltrosoundResultTextarea = lazy(() => import('../../BusinessComponents/UltrosoundResultTextarea'))
const BloodSugarNursingTable = lazy(() => import('../../ConfigComponents/BloodSugarNursingTable'))
const CheckboxGroup = lazy(() => import('../../ConfigComponents/CheckboxGroup'))
const CheckboxWithInput = lazy(() => import('../../ConfigComponents/CheckboxWithInput'))
const CheckboxWithInputv2 = lazy(() => import('../../ConfigComponents/CheckboxWithInputv2'))
const CheckboxWithSingleInput = lazy(() => import('../../ConfigComponents/CheckboxWithSingleInput'))
const CustomEditInTable = lazy(() => import('../../ConfigComponents/CustomEditInTable'))
const InputWithLabel = lazy(() => import('../../ConfigComponents/InputWithLabel'))
const InputWithRange = lazy(() => import('../../ConfigComponents/InputWithRange'))
const InputWithRangTip = lazy(() => import('../../ConfigComponents/InputWithRangTip'))
const MultipleInputWithLabel = lazy(() => import('../../ConfigComponents/MultipleInputWithLabel'))
// const NeonatalCareRecordTable = lazy(() => import('../../ConfigComponents/NeonatalCareRecordTable'))
const NormalCheckboxWithInput = lazy(() => import('../../ConfigComponents/NormalCheckboxWithInput'))
const NormalNursingTable = lazy(() => import('../../ConfigComponents/NormalNursingTable'))
const OxytocinNursingTable = lazy(() => import('../../ConfigComponents/OxytocinNursingTable'))
const PastDeliveryNursingTable = lazy(() => import('../../ConfigComponents/PastDeliveryNursingTable'))
// const PreDeliverNursingTable = lazy(() => import('../../ConfigComponents/PreDeliverNursingTable'))
const ProcedureRecords = lazy(() => import('../../ConfigComponents/ProcedureRecords'))
const PureCheckbox = lazy(() => import('../../ConfigComponents/PureCheckbox'))
const SpecialNursingTable = lazy(() => import('../../ConfigComponents/SpecialNursingTable'))
const TemperatureNursingTable = lazy(() => import('../../ConfigComponents/TemperatureNursingTable'))
const MySearchSelect = lazy(() => import('../../FU_components/MySearchSelect'))
const AsyncAutoComplete = lazy(() => import('../../GeneralComponents/AsyncAutoComplete'))
const Button = lazy(() => import('../../GeneralComponents/Button'))
const CheckAndCancelButton = lazy(() => import('../../GeneralComponents/CheckAndCancelButton'))
const CheckboxGroupObject = lazy(() => import('../../GeneralComponents/CheckboxGroupObject'))
const CustomTreeSelect = lazy(() => import('../../GeneralComponents/CustomTreeSelect'))
const InputWithTitle = lazy(() => import('../../GeneralComponents/FormSectionInput'))
const InputNumber = lazy(() => import('../../GeneralComponents/InputNumber'))
const MultipleInputGroup = lazy(() => import('../../GeneralComponents/MultipleInputGroup'))
const RadioInput = lazy(() => import('../../GeneralComponents/RadioWithInput'))
const RangePicker = lazy(() => import('../../GeneralComponents/RangePicker'))
const TimePicker = lazy(() => import('../../GeneralComponents/TimePicker'))
const UploadFile = lazy(() => import('../../GeneralComponents/UploadFile'))
const UploadFileUrlEdit = lazy(() => import('../../GeneralComponents/UploadFileUrlEdit'))
const AgeSelect = lazy(() => import('../../selects/AgeSelect'))
const ApgarScoreInput = lazy(() => import('../../selects/ApgarScoreInput'))
const AutoCompleteWithRed = lazy(() => import('../../selects/AutoCompleteWithRed'))
const CountrySelect = lazy(() => import('../../selects/CountrySelect'))
const CronSelect = lazy(() => import('../../selects/CronSelect'))
const DeviceStatusSelect = lazy(() => import('../../selects/DeviceStatusSelect'))
const NormalSelect = lazy(() => import('../../selects/NormalSelect'))
const ParentPermissionSelect = lazy(() => import('../../selects/ParentPermissionSelect'))
const PermissionTypeSelect = lazy(() => import('../../selects/PermissionTypeSelect'))
const RadioWithInput = lazy(() => import('../../selects/RadioWithInput'))
const RadioWithInputNumber = lazy(() => import('../../selects/RadioWithInputNumber'))
const ReferralOrganizationSelect = lazy(() => import('../../selects/ReferralOrganizationSelect'))
const SelectTagWithOptions = lazy(() => import('../../selects/SelectTagWithOptions'))
const SelectWithNoneOption = lazy(() => import('../../selects/SelectWithNoneOption'))
const SelectWithOptions = lazy(() => import('../../selects/SelectWithOptions'))
const SurgicalBeforeNurseSelect = lazy(() => import('../../selects/SurgicalBeforeNurseSelect'))
const SurgicalBeforeOperatorSelect = lazy(() => import('../../selects/SurgicalBeforeOperatorSelect'))
const TriggerTypeSelect = lazy(() => import('../../selects/TriggerTypeSelect'))
const DataPickWithCheck = lazy(() => import('../../GeneralComponents/datapick_with_check/datapick_with_check'))
const CusDataTimePicker = lazy(() => import('../../GeneralComponents/DataTimePick'))
const HepatitsNewBabyCom = lazy(() => import('../../newly-component/hepatitis-new-baby'))

// const PostpartumCarerecordTable2 = lazy(() => import('../../ConfigComponents/PostpartumCarerecordTable2'))
// const ObserMagnesiumsulphateTable = lazy(() => import('../../ConfigComponents/ObserMagnesiumsulphateTable2'))
// const PostUrinaryretentionTable = lazy(() => import('../../ConfigComponents/PostUrinaryretentionTable2'))
// const NeonatalScaleExamination = lazy(() => import('../../ConfigComponents/NeonatalScaleExamination'))
import VaginaStrumentsRecordForm from '../../ConfigComponents/VaginaStrumentsRecordForm';
import CascaderAddress from '../../selects/CascaderAddress';
import SelectWithOptionsOrInput from '../../selects/SelectWithOptionsOrInput';

// import TreatmentProgramTable from '../../BusinessComponents/TreatmentProgram/TreatmentProgramTable'
// import TextareaTemplate from '../../GeneralComponents/TextareaTemplate'
// import ImageEditor from '../../GeneralComponents/ImageEditor'
// import PermissionSelect from '../../selects/PermissionSelect'
// import UploadImg from '../../GeneralComponents/UploadImg'
// import CustomEditor from '../../GeneralComponents/CustomEditor'
import MobileEditor from '../../GeneralComponents/MobileEditor';
// import PregnancyHistory from '../../BusinessComponents/PregnancyHistory'
import { safe_json_parse } from '@lm_fe/utils';
import ImageUploadPreview from '../../GeneralComponents/ImageUploadPreview';
import ImageUploadPreviewIntranet from '../../GeneralComponents/ImageUploadPreviewIntranet';
// import { safe_json_parse } from '@lm_fe/utils';
import { MyImageEditor } from '@lm_fe/components';
import { mchcEvent } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { IMchc_FormDescriptions_FormItemLayout } from '@lm_fe/service/dist/mchc/service/FormDescriptions/types/FormItemLayout';
import { InterceptComponent } from 'src/utils/InterceptComponent';
import { MyRangePicker, RolesPicker } from '../../FU_components';
import MyButton from '../../FU_components/MyButton';
import { getFormSectionComponent } from './FormSectionComponent';

import DatePickerCus from '../../GeneralComponents/DatePicker';
interface IProps {
    formDescription: IMchc_FormDescriptions_Field,
    id: String | Number | undefined,
    renderEditItem: (key: string, ReactNode: React.ReactNode, others?: any) => any,
    disableAll: boolean,
    form?: FormInstance,
    registrationEvents: any,
    events: any,
    products: any,
    data: any,
    extraData: any
    formName?: string
    targetLabelCol: number
}
function RenderFormSectionComponent(props: IProps) {

    const { formDescription, id, renderEditItem, disableAll, form, registrationEvents, formName, events, products, data, extraData } = props


    function renderC(config: IMchc_FormDescriptions_Field) {
        const {
            label,
            formItemLayout = {} as IMchc_FormDescriptions_FormItemLayout,
            styles,
            key,
            inputProps = {},
            special_config,
            specialConfig,
        } = config
        const formDescriptionKey = config.key as any
        const formDescriptionPath = get(config, 'path') as any
        const inputType = get(config, 'inputType') as any
        const formDescriptionSpecialConfig = safe_json_parse(specialConfig,) ?? safe_json_parse(special_config, {})
        const formItemOthers = { disabled: disableAll, }
        switch (inputType) {
            case 'id':
                return renderEditItem(
                    formDescriptionKey,
                    <InputNumber min={0} {...formItemOthers} {...inputProps} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                        hidden: true
                    }
                );
            case 'null':
                return renderEditItem(
                    formDescriptionKey,
                    null,
                );
            case 'title':
                // 显示小标题
                return (
                    <div style={{ padding: '4px 0', fontWeight: (inputProps?.bold ?? true) ? 'bold' : '', fontSize: (inputProps.bold ?? true) ? 18 : 14, color: '#666', ...styles }}>
                        {inputProps.title || label}
                    </div>
                );
            case 'subdevice_id':
                return (
                    id &&
                    renderEditItem(formDescriptionKey, <InputWithTitle {...formItemOthers} {...inputProps} />)
                );
            case 'radio':
                return renderEditItem(
                    formDescriptionKey,
                    <Radio.Group {...formItemOthers}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'radio_group':
                return renderEditItem(
                    get(config, 'key'),
                    <Radio.Group {...formItemOthers} {...get(config, 'inputProps')} />,
                    {
                        ...formItemLayout,
                        styles: get(config, 'styles'),
                    }
                );
            case 'normal_select':
                return renderEditItem(
                    formDescriptionKey,
                    <NormalSelect
                        type={get(formDescriptionSpecialConfig, 'type')}
                        showSearch={get(formDescriptionSpecialConfig, 'showSearch')}
                        autoWrite={get(formDescriptionSpecialConfig, 'autoWrite')}
                        dropdownMatchSelectWidth={get(formDescriptionSpecialConfig, 'dropdownMatchSelectWidth')}
                        {...formItemOthers}
                        {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'dictionary_select':
            //     return renderEditItem(formDescriptionKey, <ConfigComponents_DictionarySelect {...formItemOthers} config={config} />, {
            //         ...formItemLayout,
            //         styles,
            //     });
            case 'country_select':
                return renderEditItem(
                    formDescriptionKey,
                    <CountrySelect {...formItemOthers} language="zh-CN" placeholder="请选择国籍" />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'dysmenorrhea_radio':
                return renderEditItem(
                    formDescriptionKey,
                    <Radio.Group {...formItemOthers}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'true_or_false_radio':
                return renderEditItem(
                    formDescriptionKey,
                    <Radio.Group {...formItemOthers}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'pregnant_radio':
                return renderEditItem(
                    formDescriptionKey,
                    <Radio.Group {...formItemOthers}>
                        <Radio value={false}>否</Radio>
                        <Radio value={true}>是</Radio>
                    </Radio.Group>,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'radio_with_input':
                return renderEditItem(formDescriptionKey, <RadioWithInput {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'radio_input':
                return renderEditItem(
                    formDescriptionKey,
                    <RadioInput name={config.name} {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'checkbox_with_input':
                return renderEditItem(formDescriptionKey, <CheckboxWithInput {...formItemOthers} config={config} formSection />, {
                    ...formItemLayout,
                    styles,
                });
            case 'checkbox_with_inputv2':
                return renderEditItem(
                    formDescriptionKey,
                    <CheckboxWithInputv2 {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );





            case 'checkbox_with_single_input':
                return renderEditItem(
                    get(config, 'key'),
                    <CheckboxWithSingleInput {...formItemOthers} config={config} />,
                    formItemLayout
                );
            case 'pure_checkbox':
                return renderEditItem(
                    get(config, 'key'),
                    <PureCheckbox {...formItemOthers} config={config} />,
                    formItemLayout
                );
            case 'checkbox_group':
                return renderEditItem(formDescriptionKey, <CheckboxGroup {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'select_with_none_option':
                return renderEditItem(
                    formDescriptionKey,
                    <SelectWithNoneOption {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'select_with_options':
                return renderEditItem(formDescriptionKey, <SelectWithOptions {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'radio_with_input_number':
                return renderEditItem(
                    formDescriptionKey,
                    <RadioWithInputNumber {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'pregnancy_history':
            //   return renderEditItem(
            //     formDescriptionKey,
            //     <PregnancyHistory {...formItemOthers} config={formDescription} form={form} />,
            //     {
            //       ...formItemLayout,
            //       styles,
            //     },
            //   );
            case 'pregnancy_history_v2':
                return renderEditItem(
                    formDescriptionKey,
                    <PregnancyHistoryV2 {...formItemOthers} {...inputProps} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'highrisk_sign':
                return renderEditItem(
                    formDescriptionKey,
                    <HighriskSign {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'referral_register':
                return renderEditItem(
                    formDescriptionKey,
                    <ReferralRegister {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'referral_to_register':
                return renderEditItem(
                    formDescriptionKey,
                    <ReferralToRegister {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'record_state':
                return renderEditItem(
                    formDescriptionKey,
                    <RecordState {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'pressure':
                return renderEditItem(
                    formDescriptionKey,
                    <PressureInput {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'pressure-v2':
                return renderEditItem(
                    formDescriptionKey,
                    <PressureInputV2 name={config.name} {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'divider':
                return <Divider {...inputProps} />;
            case 'blank_part':
                return <div style={styles}>{get(config, 'label')}</div>;



            case 'fetus_appendages':
                return renderEditItem(
                    formDescriptionKey,
                    <FoetalAppendage
                        {...formItemOthers}
                        {...inputProps}
                        renderEditItem={renderEditItem}
                        form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'noenate_record':
                return renderEditItem(
                    formDescriptionKey,
                    <NoenateRecord
                        {...formItemOthers}
                        {...inputProps}
                        renderEditItem={renderEditItem}
                        form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'multiple_input_with_label':
                return renderEditItem(
                    formDescriptionKey,
                    <MultipleInputWithLabel {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'input_with_label':
                return renderEditItem(formDescriptionKey, <InputWithLabel {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'input_with_range':
                return renderEditItem(formDescriptionKey, <InputWithRange {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'input_with_range_tip':
                return renderEditItem(formDescriptionKey, <InputWithRangTip {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'id_number_input':
                return renderEditItem(
                    formDescriptionKey,
                    <InputWithTitle
                        {...formItemOthers}
                        {...inputProps}
                        onChange={get(events, 'handleIDNumberChange')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'cron':
                return renderEditItem(formDescriptionKey, <CronSelect {...formItemOthers} {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'trigger_type_select':
                return renderEditItem(
                    formDescriptionKey,
                    <TriggerTypeSelect {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'text_area':
            case 'TextArea':
                return renderEditItem(
                    formDescriptionKey,
                    <Input.TextArea {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'tree_select':
            //   return renderEditItem(formDescriptionKey, <PermissionSelect {...inputProps} />, {
            //     ...formItemLayout,
            //     styles,
            //   });
            case 'parent_select':
                return renderEditItem(
                    formDescriptionKey,
                    <ParentPermissionSelect {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'password':
                return renderEditItem(
                    formDescriptionKey,
                    <Input.Password {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'auto_complete':
                return renderEditItem(formDescriptionKey, <AutoComplete {...formItemOthers} {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'auto_complete_with_red':
                return renderEditItem(
                    formDescriptionKey,
                    <AutoCompleteWithRed {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'async_autoComplete':
                // console.log('-------测试-------', formItemOthers, inputProps);
                return renderEditItem(formDescriptionKey, <AsyncAutoComplete {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'validdate':
                return renderEditItem(
                    formDescriptionKey,
                    <DataSelect
                        {...formItemOthers}
                        dataSource={[
                            { id: 30, name: '30天' },
                            { id: 60, name: '60天' },
                            { id: 90, name: '90天' },
                            { id: 280, name: '一个孕周' },
                        ]}
                        valueKey="id"
                        labelKey="name" />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'editor':
            //   return renderEditItem(formDescriptionKey, <CustomEditor {...inputProps} />, {
            //     ...formItemLayout,
            //     styles,
            //   });
            case 'product':
                return get(config, 'viewOnly')
                    ? renderEditItem(
                        formDescriptionKey,
                        <span>{get(keyBy(products, 'id'), `${get(data, formDescriptionPath)}.name`)}</span>
                    )
                    : renderEditItem(
                        formDescriptionKey,
                        <DataSelect
                            {...formItemOthers}
                            url="/products"
                            valueKey="id"
                            labelKey="name"
                            {...inputProps} />,
                        {
                            ...formItemLayout,
                            styles,
                        }
                    );
            case 'roles':
                return renderEditItem(
                    formDescriptionKey,
                    // <DataSelect
                    //     {...formItemOthers}
                    //     url="/groups"
                    //     valueKey="id"
                    //     labelKey="nickname"
                    //     mode="multiple"
                    //     {...inputProps} />,
                    <RolesPicker {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'common_labels_select':
                return renderEditItem(
                    formDescriptionKey,
                    <DataSelect
                        {...formItemOthers}
                        url="/common-labels?page=0&size=50"
                        valueKey="id"
                        labelKey="name"
                        mode="multiple"
                        {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'tube_bed_doctor_select':
                return renderEditItem(
                    formDescriptionKey,
                    <DataSelectWithAutoInput {...formItemOthers} {...inputProps} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'device_status':
                return renderEditItem(
                    formDescriptionKey,
                    <DeviceStatusSelect {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'address':
                return renderEditItem(
                    formDescriptionKey,
                    <CascaderAddress

                        needStreet={get(formDescriptionSpecialConfig, 'needStreet')}
                        onExtra={get(events, 'handleIDNumberChange')}
                        {...formItemOthers}
                        {...inputProps}
                        name={formDescriptionKey}
                    />,

                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'permission_type':
                return renderEditItem(
                    formDescriptionKey,
                    <PermissionTypeSelect {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'upload_img':
            //   return renderEditItem(formDescriptionKey, <UploadImg {...inputProps} allowUploadImages={10} />, {
            //     ...formItemLayout,
            //     styles,
            //   });TimePicker
            case 'single_date_picker':
                return renderEditItem(
                    formDescriptionKey,
                    <DatePickerCus {...formItemOthers} {...inputProps} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'data_picker_checkbox':
                return renderEditItem(
                    formDescriptionKey,
                    <DataPickWithCheck {...formItemOthers} {...inputProps} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'range_date_picker':
                return renderEditItem(formDescriptionKey, <RangePicker {...formItemOthers} {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'RangePicker':
                return renderEditItem(formDescriptionKey, <MyRangePicker {...formItemOthers} {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'single_time_picker':
                return renderEditItem(formDescriptionKey, <TimePicker {...formItemOthers} {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'date_time_picker':
                return renderEditItem(
                    formDescriptionKey,
                    <CusDataTimePicker {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'apgar_score_input':
                return renderEditItem(
                    formDescriptionKey,
                    <ApgarScoreInput {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'mobile_editor':
                return renderEditItem(
                    formDescriptionKey,
                    <MobileEditor {...formItemOthers} config={formDescription} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );
            case 'image_upload_preview':
                return renderEditItem(
                    formDescriptionKey,
                    <ImageUploadPreview {...formItemOthers} />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );
            case 'image_upload_preview_Intranet':
                return renderEditItem(
                    formDescriptionKey,
                    <ImageUploadPreviewIntranet
                        {...formItemOthers}
                        form={form}
                        outputParamType={get(formDescription, 'input_props.outputParamType')}
                        actionApi={get(formDescription, 'input_props.actionApi')}
                        {...inputProps}
                    />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );
            case 'upload_file':
                return renderEditItem(
                    formDescriptionKey,
                    <UploadFile {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'upload_file_url_edit':
                return renderEditItem(
                    formDescriptionKey,
                    <UploadFileUrlEdit {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'blood_and_thalassemia':
                return renderEditItem(
                    formDescriptionKey,
                    <BloodAndThalassemia {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'template_textarea':
                return renderEditItem(
                    formDescriptionKey,
                    <TemplateTextarea
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'template_textareav2':
                return renderEditItem(
                    formDescriptionKey,
                    <TemplateTextareav2
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'template_textareav3':
                return renderEditItem(
                    formDescriptionKey,
                    <TemplateTextareav3
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'template_textrootcauseDeath':
                return renderEditItem(
                    formDescriptionKey,
                    <TemplateTextrootcauseDeath
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'template_textDeath1':
                return renderEditItem(
                    formDescriptionKey,
                    // Deathclassification
                    <Deathclassification1
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'template_textDeath2':
                return renderEditItem(
                    formDescriptionKey,
                    // Deathclassification
                    <Deathclassification2
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'gynaecology_template_textarea':
                return renderEditItem(
                    formDescriptionKey,
                    <GynaecologyTemplateTextarea
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'operation_template_textarea':
                return renderEditItem(
                    formDescriptionKey,
                    <GynaecologyOperationTemplateTextarea
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'result_textarea':
                return renderEditItem(
                    formDescriptionKey,
                    <ResultTextarea {...formItemOthers} {...inputProps} form={form} patientId={data?.id} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'inspection_result_textarea':
                // 产时保健-入院登记-B超(超声检查)
                return renderEditItem(
                    formDescriptionKey,
                    <InspectionResultTextarea
                        {...formItemOthers}
                        {...inputProps}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        pregnancyId={get(data, 'pregnancy.id')}
                        admissionId={get(data, 'id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'ultrosound_result_textarea':
                // 产时保健-入院登记-检验(检验检查)
                return renderEditItem(
                    formDescriptionKey,
                    <UltrosoundResultTextarea
                        {...formItemOthers}
                        {...inputProps}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        pregnancyId={get(data, 'pregnancy.id')}
                        admissionId={get(data, 'id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'middle_ultsounds':
                return renderEditItem(
                    formDescriptionKey,
                    <MiddleUltsounds {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'post_partumFetal':
                return renderEditItem(
                    formDescriptionKey,
                    <PostpartumFetal {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'post_partum_carerecord_Table2':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <PostpartumCarerecordTable2 {...formItemOthers} config={config} {...props} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            // case 'obser_magnesium_sulphate_Table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <ObserMagnesiumsulphateTable {...formItemOthers} config={config} {...props} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            // case 'post_urinary_retention_Table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <PostUrinaryretentionTable {...formItemOthers} config={config} {...props} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            case 'middle_ultsounds_single':
                return renderEditItem(
                    formDescriptionKey,
                    <MiddleUltsoundsSingle {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'calculate-score-table':
                return renderEditItem(
                    formDescriptionKey,
                    <CalculateScoreTable {...formDescriptionSpecialConfig} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'fetal_nt_check':
                return renderEditItem(
                    formDescriptionKey,
                    <FetalNTCheck {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'blood_pressure':
                return renderEditItem(
                    formDescriptionKey,
                    <BloodPressure {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'edit_in_table':
                return renderEditItem(
                    formDescriptionKey,
                    <CustomEditInTable {...formItemOthers} {...inputProps} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'revert_edit_in_table':
                // todo: 未完成 竖向编辑的表格
                return renderEditItem(
                    formDescriptionKey,
                    <RevertEditInTable {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'normal_nursing_table':
                return renderEditItem(
                    formDescriptionKey,
                    <NormalNursingTable
                        {...formItemOthers}
                        config={config}
                        data={props.data}
                        form={form}
                        onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'pre_deliver_nursing_Table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <PreDeliverNursingTable
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'past_delivery_nursing_table':
                return renderEditItem(
                    formDescriptionKey,
                    <PastDeliveryNursingTable
                        {...formItemOthers}
                        config={config}
                        form={form}
                        onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'special_nursing_table':
                return renderEditItem(
                    formDescriptionKey,
                    <SpecialNursingTable {...formItemOthers} config={config} form={form} onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'oxytocin_nursing_table':
                return renderEditItem(
                    formDescriptionKey,
                    <OxytocinNursingTable
                        {...formItemOthers}
                        config={config}
                        form={form}
                        onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'neonatal_care_table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <NeonatalCareRecordTable
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'blood_sugar_nursing_Table':
                return renderEditItem(
                    formDescriptionKey,
                    <BloodSugarNursingTable
                        {...formItemOthers}
                        config={config}
                        form={form}
                        onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'temperature_nursing_Table':
                return renderEditItem(
                    formDescriptionKey,
                    <TemperatureNursingTable
                        {...formItemOthers}
                        config={config}
                        form={form}
                        onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'procedure_records':
                return renderEditItem(
                    formDescriptionKey,
                    <ProcedureRecords {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'procedure_cystocentesis_records':
                return renderEditItem(
                    formDescriptionKey,
                    <ProcedureCystocentesis {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'procedure_intrauterine_records':
                return renderEditItem(
                    formDescriptionKey,
                    <ProcedureIntrauterine {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'select_tag_with_options':
                return renderEditItem(
                    formDescriptionKey,
                    <SelectTagWithOptions {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'select_with_options_or_input':
                return renderEditItem(
                    formDescriptionKey,
                    <SelectWithOptionsOrInput {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );


  
            case 'referral_organization_select':
                return renderEditItem(
                    formDescriptionKey,
                    <ReferralOrganizationSelect {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'age_select':
                return renderEditItem(
                    formDescriptionKey,
                    <AgeSelect {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'tree_select_v2':
                return renderEditItem(
                    formDescriptionKey,
                    <CustomTreeSelect {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'diagnosis':
                return renderEditItem(
                    formDescriptionKey,
                    <Diagnosis {...formItemOthers} {...formDescriptionSpecialConfig} patientId={get(extraData, 'patient.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'image_editor':
            //   return renderEditItem(
            //     formDescriptionKey,
            //     <ImageEditor {...formItemOthers} {...formDescriptionSpecialConfig} />,
            //     {
            //       ...formItemLayout,
            //       styles,
            //     },
            //   );
            case 'gynaecology_image_editor':
                return renderEditItem(
                    formDescriptionKey,
                    <MyImageEditor {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );
            case 'MyImageEditor':
                return renderEditItem(
                    formDescriptionKey,
                    <MyImageEditor {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );
            case 'inspection_report':
                return renderEditItem(
                    formDescriptionKey,
                    <SurgicalInspectionReport {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'appgar':
                return renderEditItem(
                    formDescriptionKey,
                    <Appgar {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'nurse_children':
                return renderEditItem(
                    formDescriptionKey,
                    <NurseChildren {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'nurse_children2':
                return renderEditItem(
                    formDescriptionKey,
                    <NurseChildren2 {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'caesarean_children':
                return renderEditItem(
                    formDescriptionKey,
                    <CaesareanChildren {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'birth_certificate_children':
                return renderEditItem(
                    formDescriptionKey,
                    <BirthCertificateChildren {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'shift_patients':
                console.log(props, '222233344');
                return renderEditItem(
                    formDescriptionKey,
                    <ShiftPatients
                        {...formItemOthers}
                        {...formDescriptionSpecialConfig}
                        {...extraData}
                        {...props.data}
                        form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'neonatal_scale_examination':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <NeonatalScaleExamination
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             defaultInputData={extraData}
            //             onRef={get(events, 'onRef')}
            //         />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            case 'vagina_struments_record_form':
                return <VaginaStrumentsRecordForm {...formItemOthers} config={config} form={form} />;
            case 'family_tumor_history':
                return renderEditItem(
                    formDescriptionKey,
                    <FamilyTumorHistory {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // 催产素的表格
            case 'oxytocin_table':
                return renderEditItem(
                    formDescriptionKey,
                    <OxytocinTable {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'fetal_ultrasound':
                return renderEditItem(
                    formDescriptionKey,
                    <FetalUltrasound {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'checkbox_group_object':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <CheckboxGroupObject {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'labor_process':
                return renderEditItem(
                    formDescriptionKey,
                    <LaborProcess {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'labor_processV2':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <LaborProcess2 {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'nursing_fetus':
                return renderEditItem(
                    formDescriptionKey,
                    <NursingFetus {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'nursing_fetusv2':
                return renderEditItem(
                    formDescriptionKey,
                    <NursingFetusv2
                        {...formItemOthers}
                        {...formDescriptionSpecialConfig}
                        {...inputProps}
                        {...extraData}
                        onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'nursing_fetusv3':
                return renderEditItem(
                    formDescriptionKey,
                    <NursingFetusv3
                        {...formItemOthers}
                        {...formDescriptionSpecialConfig}
                        {...extraData}
                        onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'nursing_fetusv4':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <NursingFetusv4
            //             {...formItemOthers}
            //             {...formDescriptionSpecialConfig}
            //             {...extraData}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'knowledge_base':
                return renderEditItem(
                    formDescriptionKey,
                    <KnowledgeBase {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'optimize_edit_in_table':
                const input_props = { input_props: formDescriptionSpecialConfig };
                return renderEditItem(formDescriptionKey, <OptimizeEditInTable {...formItemOthers} {...input_props} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'induced_fetus':
                return renderEditItem(
                    formDescriptionKey,
                    <InducedFetus {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'diagnosis_list':
                return renderEditItem(
                    formDescriptionKey,
                    <DiagnosisList {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'diagnosis_list_v2':
                return renderEditItem(
                    formDescriptionKey,
                    <DiagnosisListv2 {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'diagnosis_list_induced':
                return renderEditItem(
                    formDescriptionKey,
                    <DiagnosisListInduced {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'bregma_group':
                return renderEditItem(
                    formDescriptionKey,
                    <BregmaGroup {...config} {...formDescriptionSpecialConfig} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'multiple_input_group':
                // 多字段多表单聚集
                return renderEditItem(
                    formDescriptionKey,
                    <MultipleInputGroup {...config} {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'single_selector':
                return renderEditItem(
                    formDescriptionKey,
                    <SingleSelector {...config} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'multi_selector':
                return renderEditItem(
                    formDescriptionKey,
                    <MultiSelector {...config} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'button':
                return renderEditItem(
                    '',
                    <Button {...config} {...formDescriptionSpecialConfig} {...inputProps} onClick={get(events, 'handleButton')} />
                );
            case 'MyButton':
                const btnProps = inputProps as ButtonProps
                return renderEditItem(
                    '',
                    <MyButton onClick={() => mchcEvent.emit('my_form', {
                        type: 'onClick',
                        btnName: formDescriptionKey,
                        values: form?.getFieldsValue(),
                        setValue(k: string, v: any) { form?.setFieldsValue({ [k]: v }) }
                    }
                    )} {...btnProps} {...formItemOthers} btnText={label ?? btnProps.btnText} />
                );

            case 'node':
                return inputProps.standalone ? (inputProps?.node ?? null) : renderEditItem(
                    formDescriptionKey,
                    inputProps?.node ?? null
                );
            case 'component':
                const C1 = inputProps?.component
                return inputProps.standalone ? (C1 ? <C1 {...inputProps} /> : null) : renderEditItem(
                    formDescriptionKey,
                    C1 ? <C1 {...inputProps} form={form} /> : null
                );
            case 'check_invert_button':

                return renderEditItem(
                    formDescriptionKey,
                    <CheckAndCancelButton
                        form={form}
                        {...config}
                        {...inputProps}
                        onClick={get(events, 'handleButton')} />
                );
            case 'view_only':
                return renderEditItem(formDescriptionKey, <span>{get(data, formDescriptionPath)}</span>);
            // 产前诊断-术前记录
            case 'surgical_before_operator_select':
                return renderEditItem(
                    formDescriptionKey,
                    <SurgicalBeforeOperatorSelect {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // 产前诊断-术前记录
            case 'surgical_before_nurse_select':
                return renderEditItem(
                    formDescriptionKey,
                    <SurgicalBeforeNurseSelect {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'treatment_program':
                return renderEditItem(
                    formDescriptionKey,
                    <TreatmentProgramBaisc {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'treatment_program_table':
            //   return renderEditItem(
            //     formDescriptionKey,
            //     <TreatmentProgramTable
            //       {...formItemOthers}
            //       config={formDescription}
            //       form={form}
            //       programData={data}
            //     // projectId={get(data, 'id')}
            //     />,
            //     {
            //       ...formItemLayout,
            //       styles,
            //     },
            //   );
            case 'hepatitis-new-baby':
                return renderEditItem(
                    formDescriptionKey,
                    <HepatitsNewBabyCom
                        {...formItemOthers}
                        {...formDescriptionSpecialConfig}
                        {...extraData}
                        config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'border_title':
                return renderEditItem(
                    formDescriptionKey,
                    <BorderTitle {...formItemOthers} {...formDescriptionSpecialConfig} config={config} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'cure-state':
                return renderEditItem(
                    formDescriptionKey,
                    <CureState {...formItemOthers} {...formDescriptionSpecialConfig} config={config} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'syphilis-tested':
                return renderEditItem(
                    formDescriptionKey,
                    <SyphilisTested
                        {...formItemOthers}
                        {...formDescriptionSpecialConfig}
                        config={config}
                        {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'native-place':
                return renderEditItem(
                    formDescriptionKey,
                    <NativePlace {...formItemOthers} {...formDescriptionSpecialConfig} config={config} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'normal_checkbox_with_input':
                return renderEditItem(
                    formDescriptionKey,
                    <NormalCheckboxWithInput
                        config={config}

                    />,
                    {
                        ...formItemLayout,
                    },
                );
            case 'c':
                return renderEditItem(
                    formDescriptionKey,
                    <NormalCheckboxWithInput {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                    }
                );

            case 'data_select_with_options_or_input':
                return renderEditItem(
                    formDescriptionKey,
                    <DataSelectWithOptionsOrInput
                        {...formItemOthers}
                        {...inputProps}
                        config={config}
                        form={form}
                        programData={data} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'search_select':
                return renderEditItem(
                    formDescriptionKey,
                    <MySearchSelect
                        name={formDescriptionKey}
                        {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'rowoftire_record_baby':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <RowoftireRecordBaby
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //         // projectId={get(data, 'id')}
            //         />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            default:
                const C: any = getFormSectionComponent(inputType)
                const node: any = <InterceptComponent
                    {...formDescriptionSpecialConfig}
                    {...formItemOthers}
                    C={C}
                    formName={formName}
                    config={config}
                    form={form}
                />
                return config?.plainForm ? node : renderEditItem(
                    formDescriptionKey,
                    node,
                    {
                        ...formItemLayout,
                        styles,
                    }
                )
        }
    }

    return renderC(formDescription)
}


export default RenderFormSectionComponent