import { Col, Form, FormInstance, Row, FormProps, Tabs, TabsProps } from "antd";
import { ComponentMapping } from "./components";
import { AllTypes } from "./types/metaTypes";
import { useImperativeHandle, forwardRef } from 'react'
import { Rule, RuleObject } from "antd/lib/form";
const FormItem = Form.Item
export interface SimpleFormProps {
    onValuesChange?: FormProps['onValuesChange']
    blocks?: {
        title?: string
        rows: IRowSchema[]
    }[]
    disabled?: boolean
    form?: FormInstance
    formProps?: FormProps
    formItems?: (AllTypes | undefined | boolean)[]
}
interface IRowSchema {
    itemsInRow: (AllTypes | null)[],
    layoutType?: 8 | 16 | 24
    label?: string
    disabled?: boolean
}
function FormItemsInRow(props: IRowSchema) {
    const { itemsInRow: items, layoutType = 8, disabled, } = props

    return <Row className="fuck_row">
        {
            items?.filter(_ => !!_)?.map((_) => {
                if (!_ || typeof _ === 'boolean') return null
                const { outerOptions = {}, type = "", innerOptions = {}, customNode } = _
                const C: any = type === 'TabForm' ? TabForm : ComponentMapping[type]

                if (!C && !customNode) return (
                    <Form.Item style={{ margin: 0, }}>{"type error:" + type}</Form.Item>
                )
                return <Col className="fuck_col" span={layoutType} >
                    <FormItem className="fuck_FormItem" {...outerOptions} labelCol={{ span: layoutType === 8 ? 6 : (layoutType === 16 ? 3 : 2) }}>
                        {
                            customNode ? customNode : <C disabled={disabled} allowClear style={{}} {...innerOptions} />

                        }
                    </FormItem>

                </Col>
            })
        }
    </Row>
}
function FormItemCommon(props: { formItems?: AllTypes[], disabled?: boolean }) {
    const { formItems: items, disabled } = props

    return <>
        {
            items?.filter(_ => !!_)?.map(({ outerOptions = {}, type = "", innerOptions = {}, customNode }, itemIndex) => {
                const C: any = type === 'TabForm' ? TabForm : ComponentMapping[type]

                const key = `${itemIndex}_${type}`
                if (!C && !customNode) return (
                    <Form.Item key={key} style={{ margin: 0, }}>{"type error:" + type}</Form.Item>
                )
                return <FormItem key={key} className="fuck_FormItem" {...outerOptions} >
                    {
                        customNode ? customNode : <C disabled={disabled} allowClear style={{}} {...innerOptions} />
                    }
                </FormItem>


            }) || null
        }
    </>

}
const SimpleFormInner = forwardRef<FormInstance, SimpleFormProps>(function SimpleFormRender({ blocks, formItems, disabled, form, onValuesChange, formProps = {} }, ref) {
    const [innerForm] = Form.useForm()
    useImperativeHandle(ref, () => {
        return form || innerForm
    }, [])
    return (
        <Form form={form || innerForm} onValuesChange={onValuesChange} {...formProps}>
            {
                blocks?.map(({ rows, title }, blockIndex) => {

                    const blockNode = rows.map((rowData, rowIndex) => <FormItemsInRow key={`${rowIndex}_${rowData.label}`} disabled={disabled} {...rowData} />)

                    return title ?
                        (
                            <fieldset key={`${blockIndex}_${title}`} style={{ border: '1px solid #ccc', margin: 12, padding: '12px 24px 0 0', borderRadius: 2 }}>
                                <legend style={{ padding: '0 12px', margin: 0, marginLeft: 12, border: 0, width: 'auto', display: 'inline-block', background: 'transparent', fontSize: 16, color: '#150f55', fontWeight: 'bold' }}>{title}</legend>
                                {
                                    blockNode
                                }
                            </fieldset>
                        ) :
                        blockNode
                }) || null
            }

            {
                <FormItemCommon formItems={formItems} />
            }
        </Form>
    )
})
type InternalFormType = typeof SimpleFormInner;
interface SimpleFormType extends InternalFormType {
    getPresetRules: (name: keyof typeof basicRules, required?: boolean) => Rule[]
    requiredRules: Rule[]
}
//@ts-ignore
const SimpleForm: SimpleFormType = SimpleFormInner
SimpleForm.getPresetRules = (name, required) => {
    return [
        {
            required,
            ...basicRules[name]
        }
    ]
}
SimpleForm.requiredRules = [{ required: true }]
const basicRules = {
    telephone: {
        validator: (_: any, value: any) => /^1([0-9][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(value) ? Promise.resolve() : Promise.reject(),
        message: '请输入手机号'
    }

}
export default SimpleForm;
interface IItem {
    _id: number
    [x: string]: any
}
interface IProps extends Omit<TabsProps, 'onChange'> {
    value?: IItem[]
    title: string
    onChange?: (v: IItem[]) => void
    formSchema: SimpleFormProps
}
export function TabForm({ value = [], formSchema, onChange, title, style, ...others }: IProps) {
    const actions = {
        add(e) {
            onChange?.([...value, { _id: +new Date() }])

        },
        remove(_id: number) {
            const index = value.findIndex(_ => _._id == _id)
            if (index > -1) {
                const isOk = confirm('确定删除吗？')
                if (!isOk) return
                value.splice(index, 1)
                onChange?.([...value])
            }
        }
    }
    return (
        <Tabs size="small" type="editable-card" onEdit={(e, action) => actions[action](e as any)}
            style={{ background: '#fff', border: '1px dashed #ccc', padding: 12, ...style }}
            {...others}>
            {
                value.map((_, idx) => {
                    return <Tabs.TabPane key={_._id} tab={title + (idx + 1)}>
                        <SimpleForm {...formSchema} onValuesChange={(a, values) => {
                            value.splice(idx, 1, Object.assign(value[idx], values))
                            onChange?.([...value])
                        }} />
                    </Tabs.TabPane>
                })
            }
        </Tabs>
    )
}
