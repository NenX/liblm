import { Col, Form, FormInstance, Row, FormProps } from 'antd'
import { ComponentMapping } from './components'
import { AllTypes } from './types/metaTypes'
import { useImperativeHandle, forwardRef } from 'react'
import { Rule } from 'antd/lib/form'
const FormItem = Form.Item
type TLayoutType = 6 | 8 | 12 | 16 | 24
type TFormItemMix = AllTypes & { layoutType?: TLayoutType }
const targetLayoutType = 2
function calcLabelCol(n: TLayoutType) {
    return (24 * targetLayoutType) / n
}
export interface SimpleFormProps {
    onValuesChange?: FormProps['onValuesChange']
    blocks?: {
        title?: string
        rows: IRowSchema[]
    }[]
    disabled?: boolean
    form?: FormInstance
    formProps?: FormProps
    formItems?: AllTypes[]
}
interface IRowSchema {
    itemsInRow: TFormItemMix[]
    layoutType?: TLayoutType
    label?: string
    disabled?: boolean
}
function FormItemsInRow(props: IRowSchema) {
    const { itemsInRow: items, layoutType = 8, disabled } = props

    return (
        <Row className="fuck_row">
            {items
                ?.filter((_) => !!_)
                ?.map((item) => {
                    if (!item) return null
                    const { outerOptions = {}, type = '', innerOptions = {}, customNode, required } = item

                    const options:any = innerOptions

                    const C: any = ComponentMapping[type]
                    const hasCustomNode = customNode !== undefined
                    if (!C && !hasCustomNode) return <Form.Item style={{ margin: 0 }}>{'type error:' + type}</Form.Item>
                    const _layoutType = item.layoutType || layoutType
                    return (
                        <Col className="fuck_col" span={_layoutType}>
                            <FormItem
                                className="fuck_FormItem"
                                rules={required ? SimpleForm.requiredRules : []}
                                {...outerOptions}
                                labelCol={{ span: calcLabelCol(_layoutType) }}
                            >
                                {hasCustomNode ? (
                                    customNode
                                ) : (
                                    <C
                                        disabled={disabled}
                                        allowClear
                                        style={{}}
                                        placeholder={`请输入${outerOptions?.['label']}`}
                                        {...options}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    )
                })}
        </Row>
    )
}
function FormItemCommon(props: { formItems?: AllTypes[]; disabled?: boolean }) {
    const { formItems: items, disabled } = props

    return (
        <>
            {items
                ?.filter((_) => !!_)
                ?.map((item, itemIndex) => {
                    if (!item) return null
                    const { outerOptions = {}, type = '', innerOptions = {}, customNode, required } = item
                    const options:any = innerOptions
                    const C: any = ComponentMapping[type]
                    const key = `${itemIndex}_${type}`
                    const innerStyle = options['stlyle'] || {}
                    const hasCustomNode = customNode !== undefined

                    if (!C && !hasCustomNode)
                        return (
                            <Form.Item key={key} style={{ margin: 0 }}>
                                {'type error:' + type}
                            </Form.Item>
                        )
                    return (
                        <FormItem
                            key={key}
                            className="fuck_FormItem"
                            style={{ marginBottom: 6, ...innerStyle }}
                            rules={required ? SimpleForm.requiredRules : []}
                            {...outerOptions}
                        >
                            {hasCustomNode ? (
                                customNode
                            ) : (
                                <C
                                    disabled={disabled}
                                    allowClear
                                    style={{}}
                                    placeholder={`请输入${outerOptions?.['label']}`}
                                    {...options}
                                />
                            )}
                        </FormItem>
                    )
                }) || null}
        </>
    )
}
const SimpleFormInner = forwardRef<FormInstance, SimpleFormProps>(function SimpleFormRender(
    { blocks, formItems, disabled, form, onValuesChange, formProps = {} },
    ref,
) {
    const [innerForm] = Form.useForm()
    useImperativeHandle(
        ref,
        () => {
            return form || innerForm
        },
        [],
    )
    return (
        <Form form={form || innerForm} onValuesChange={onValuesChange} {...formProps}>
            {blocks?.map(({ rows, title }, blockIndex) => {
                const blockNode = rows.map((rowData, rowIndex) => (
                    <FormItemsInRow key={`${rowIndex}_${rowData.label}`} disabled={disabled} {...rowData} />
                ))

                return title ? (
                    <fieldset
                        key={`${blockIndex}_${title}`}
                        style={{ border: '1px solid #ccc', padding: '12px 12px 0 12px', borderRadius: 2 }}
                    >
                        <legend
                            style={{
                                padding: '0 12px',
                                margin: 0,
                                marginLeft: 12,
                                border: 0,
                                width: 'auto',
                                display: 'inline-block',
                                background: 'transparent',
                                fontSize: 16,
                                color: '#150f55',
                                fontWeight: 'bold',
                            }}
                        >
                            {title}
                        </legend>
                        {blockNode}
                    </fieldset>
                ) : (
                    blockNode
                )
            }) || null}

            {<FormItemCommon formItems={formItems} disabled={disabled} />}
        </Form>
    )
})
type InternalFormType = typeof SimpleFormInner
interface SimpleFormType extends InternalFormType {
    getPresetRules: (name: keyof typeof basicRules, required?: boolean) => Rule[]
    requiredRules: Rule[]
}
//@ts-ignore
export const SimpleForm: SimpleFormType = SimpleFormInner
SimpleForm.getPresetRules = (name, required) => {
    return [
        {
            required,
            ...basicRules[name],
        },
    ]
}
SimpleForm.requiredRules = [{ required: true, message: '' }]
const basicRules = {
    telephone: {
        validator: (_: any, value: any) =>
            /^1([0-9][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(value) ? Promise.resolve() : Promise.reject(),
        message: '请输入手机号',
    },
}
