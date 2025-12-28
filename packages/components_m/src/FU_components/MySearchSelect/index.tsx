import { mchcEvent } from "@lm_fe/env";
import { Input } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { SearchProps } from 'antd/lib/input';
export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}
const { Search } = Input
function DebounceSelect(props: SearchProps & { id: string }) {

    const {
        name = ' unknow',
        onSearch = v => {

            mchcEvent.emit('my_form', { type: 'onSearch', name, value: { text: v } })

        }, ...rest } = props




    return (
        <Search allowClear onSearch={onSearch} {...rest} />
    );
}
export default DebounceSelect;