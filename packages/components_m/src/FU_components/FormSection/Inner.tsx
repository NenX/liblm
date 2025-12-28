import { SettingOutlined } from '@ant-design/icons';
import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable, IMchc_FormDescriptions_InputProps } from '@lm_fe/service';
import { safe_json_parse } from '@lm_fe/utils';
import { Button, Col, ConfigProvider, Empty, Form, FormItemProps, Popover, Row } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { get, isEmpty, isNil, join, map, omit, set } from 'lodash';
import React, { lazy, useState } from 'react';
import MyCheckbox from 'src/GeneralComponents/CheckboxWithInput_gold';
import { MyLazyComponent } from '../../MyLazyComponent';
import { RenderSection, RenderTab, getFormItemControl, use_form_config } from './helper';
import { IFormSectionProps } from './types';
import { RenderEditItem, formatFormConfig } from './utils';


const RenderFormSectionComponent = lazy(() => import('./RenderFormSectionComponent'))

type c = IMchc_FormDescriptions_Field['containerType']

const typeToText: { [x in NonNullable<c>]: string } = {
  'section(default)': '分块(默认)',
  'plain': '简约',
  'tabs': '标签页',
}
const typeOption = Object.keys(typeToText).map((k) => ({ value: k, label: typeToText[k as NonNullable<c>] }))
function MyFormSection(props: IFormSectionProps) {

  const { needControl } = props

  const [f_config] = use_form_config(props)

  const [dispalyType, setDispalyType] = useState<c>()


  function renderRowAndCol(arr: IMchc_FormDescriptions_Field[] = [], dynamicFormItemProps: FormItemProps = {}) {
    const rowKey = join(map(arr, 'key'), '~')

    return (
      <Row key={rowKey} gutter={24}>
        {map(arr, (_config) => {
          if (!_config) return
          const dependency = _config.inputProps?.dependency
          const showDeps = _config.showDeps
          const disabledDeps = _config.disabledDeps
          const requiredDeps = _config.requiredDeps

          const span = get(_config, 'span') ?? props.span
          const offset = _config.offset ?? 0
          const push = _config.push ?? 0
          const pull = _config.pull ?? 0



          if (dependency || showDeps || disabledDeps || requiredDeps) {
            return (
              <Form.Item noStyle shouldUpdate key={_config.key}>
                {f => {
                  const { getFieldValue } = f
                  const { isShow, isDisabled, isRequired } = getFormItemControl(f as any, _config)


                  let newDescription = { ..._config }
                  if (isDisabled) {
                    let inputProps = get(newDescription, 'inputProps', {})

                    newDescription.inputProps = { ...inputProps, disabled: true }
                  }
                  if (isRequired) {
                    set(newDescription, 'required', true)
                  }

                  if (!isShow) {
                    return null
                  }
                  return (
                    <Col span={span} offset={offset} push={push} pull={pull}>
                      {renderItem(newDescription, dynamicFormItemProps)}
                    </Col>
                  )
                }}
              </Form.Item>
            )
          }
          return (
            <Col span={span} push={push} pull={pull} offset={offset} key={_config.key}>
              {renderItem(_config, dynamicFormItemProps)}
            </Col>
          )
        })}
      </Row>
    )
  }
  function renderTab(arr: IMchc_FormDescriptions_Field[] = [], dynamicFormItemProps: FormItemProps = {}) {
    const rowKey = join(map(arr, 'key'), '~')

    return (
      <RenderTab fds={arr} key={rowKey} form={props.form} renderContent={renderContent}>
      </RenderTab>
    )
  }
  function getLabelCol() {
    const value = props.targetLabelCol ?? 2
    return value as number
  }
  // 返回 renderEditItem 的返回
  function renderItem(_config: IMchc_FormDescriptions_Field<false>, dynamicFormItemProps: FormItemProps = {}) {
    const {
      id,
      data,
      extraData,
      products,
      events,
      form,
      onExtra,
      formName,
      registrationEvents,
      disableAll = false,
      // defaultOptions 
      defaultOptions = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 20,
        },
      }
    } = props

    if (!_config) return null
    const _inputProps = _config.inputProps!
    const parseProps = safe_json_parse<IMchc_FormDescriptions_InputProps>(_inputProps, {})!
    _config.inputProps = (typeof _inputProps === 'object' ? { ..._inputProps } : parseProps)
    _config.inputProps = _config.inputProps ?? {}

    _inputProps.size = props.size
    if ((_config as any).editable === false) {
      _inputProps.disabled = true

    }

    // const renderEditItem = props.renderEditItem ?? _renderEditItemInner(_config, defaultOptions)
    const renderEditItem = _renderEditItemInner(_config, { ...defaultOptions, ...dynamicFormItemProps })

    const option = { formDescription: _config, id, formName, renderEditItem, disableAll, form, registrationEvents, events, products, data, extraData, targetLabelCol: getLabelCol() }
    // 返回 renderEditItem 的返回
    return <RenderFormSectionComponent {...option} />


  }
  function _renderEditItemInner(config: IMchc_FormDescriptions_Field_Nullable, defaultOptions?: FormItemProps<any>) {
    const R = props.renderEditItemInner ?? RenderEditItem
    return (key: string, ReactNode: React.ReactNode, userSetConfig: FormItemProps = {}) => R(config, ReactNode, { ...defaultOptions, ...userSetConfig },)
  }
  function renderContent(fds: IMchc_FormDescriptions_Field_Nullable<false>[], dynamicFormItemProps: FormItemProps = {}) {
    const { inline = false } = props
    let tempArr: IMchc_FormDescriptions_Field[] = []
    let tempTabItemArr: IMchc_FormDescriptions_Field[] = []
    let tempSpan = 0
    const formArray: any[] = []
    const len = fds.length
    const flush = () => {
      if (!isEmpty(tempArr)) {
        formArray.push(renderRowAndCol(tempArr, dynamicFormItemProps))
        tempArr = []
        tempSpan = 0
      }
    }
    const flushTab = () => {
      if (!isEmpty(tempTabItemArr)) {
        formArray.push(renderTab(tempTabItemArr, dynamicFormItemProps))
        tempTabItemArr = []

      }
    }
    let metTabItem = false
    map(fds, (_config, index) => {
      if (!_config) return
      const span = get(_config, 'span') ?? props.span
      const offset = _config.offset ?? 0
      if (!_config.isActive) return
      const children = _config.children

      if (_config.containerType === 'tabs') {
        flush()
        tempTabItemArr.push(_config)

      } else {
        flushTab()
        if (children && !isEmpty(children)) {

          flush()
          const n = renderSection(_config)
          formArray.push(n)

        }
        else if (!isNil(span) && !isNil(offset) && !inline) {


          if (get(_config, 'isNewRow')) {
            flush()
          }


          if (tempSpan < 25 && tempSpan + span + offset < 25) {
            tempSpan = tempSpan + span + offset
            tempArr.push(_config)
            if (Number(index) === len - 1) {
              flush()
            }
          } else {
            flush()

            tempSpan = tempSpan + span + offset

            tempArr.push(_config)
          }
        }
        else {
          // 修改位置！
          flush()
          // 修改位置！

          formArray.push(renderItem(_config, dynamicFormItemProps))
        }
      }

    })
    // 修改位置！

    flushTab()
    flush()



    // 修改位置！
    return <MyLazyComponent>
      {formArray}
    </MyLazyComponent>

  }


  function renderSection(fd: IMchc_FormDescriptions_Field_Nullable) {
    return <RenderSection fd={fd} form={props.form} renderContent={renderContent} />

  };



  function __formatFormConfig(_: IMchc_FormDescriptions_Field, siblings: IMchc_FormDescriptions_Field_Nullable[], defaultData: IMchc_FormDescriptions_Field = {}) {
    const config = formatFormConfig(_, getLabelCol(), { layout: props.defaultFormItemLayout, required: props.defaultRequired, ...defaultData },)
    const formItemName = config.name!
    const requiredKeys = props.requiredKeys ?? {}
    const keys = Object.keys(requiredKeys)
    if (keys.includes(formItemName)) {
      config.required = requiredKeys[formItemName]
    }

    const arr = config.children ?? config.fields

    if (arr) {
      const filterArr = arr.filter(_ => _) as IMchc_FormDescriptions_Field[]

      config.children = filterArr
        .map(c => {
          c.parent = omit(config, ['children', 'fields'])
          return __formatFormConfig(c!, filterArr)
        })
    }
    config.siblings = siblings

    return config
  }

  function render() {
    if (!f_config || isEmpty(f_config)) return <Empty />
    const filterArr: any[] = (f_config ?? []).filter(_ => _)

    const fds = filterArr
      .map(_ => {
        return __formatFormConfig(_!, filterArr, { containerType: dispalyType })
      })
    const node =
      props.sectionName
        ? renderSection({ title: props.sectionName, children: fds })
        : renderContent(fds)
    if (!needControl) return node
    return <div style={{ position: 'relative' }}>
      <div style={{ float: 'right', padding: 6, zIndex: 999, position: 'relative' }}>
        <Popover placement='leftBottom' content={<MyCheckbox marshal={0} value={dispalyType} onChange={v => setDispalyType(v)} options={typeOption} />} title="显示模式">
          <Button icon={<SettingOutlined />} shape='circle' />
        </Popover>
      </div>
      {node}
    </div>
  }

  return <ConfigProvider locale={zhCN}>
    {render()}
  </ConfigProvider>
}

export default MyFormSection

