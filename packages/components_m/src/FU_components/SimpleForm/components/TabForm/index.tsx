import { Tabs, TabsProps } from "antd";
import SimpleForm, { SimpleFormProps } from '../..';
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
export default function TabForm({ value = [], formSchema, onChange, title, style, ...others }: IProps) {
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
