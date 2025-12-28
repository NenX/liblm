import React from "react"
import { ArrayPanel } from "../ArrayPanel"
import { TCommonComponent } from "../types"
interface TakeOutVolumnProps {
    marshal?: boolean
    onBlur?: any
}
const TakeOutVolumn: TCommonComponent<TakeOutVolumnProps, any> = function TakeOutVolumn(props) {
    const { value, onChange, marshal = false, onBlur, disabled } = props
    console.log('safe_value !!', value, typeof value)

    return <div style={{ width: 540 }} onBlur={onBlur}>
        <ArrayPanel disabled={disabled} value={value} onChange={onChange} marshal={marshal}
            addBtnStyle={{ type: 'default', }}

            actionConfig={{ layout: '1/4', }}
            // targetLabelCol={2}
            formDescriptions={[
                { inputType: 'MyAutoComplete', layout: '1/3', label: '内容', name: 'outcomingContent', inputProps: { optionKey: '出量s', dropdownStyle: { zIndex: 9999 }, style: { paddingRight: 4 } } },
                { inputType: 'MyAutoComplete', layout: '1/3', label: '颜色', name: 'outcomingColor', inputProps: { optionKey: '颜色s', dropdownStyle: { zIndex: 9999 }, style: { paddingRight: 4 } } },
                { inputType: 'input_number', layout: '1/3', label: 'ml', name: 'outcomingML', inputProps: { style: { paddingRight: 4 } } },
            ]}
        />
    </div>
}
export default TakeOutVolumn