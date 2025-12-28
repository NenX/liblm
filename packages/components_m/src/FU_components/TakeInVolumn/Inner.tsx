import React from "react"
import { ArrayPanel } from "../ArrayPanel"
import { TCommonComponent } from "../types"
interface TakeInVolumnProps {
    marshal?: boolean
    onBlur?: any
}
const TakeInVolumn: TCommonComponent<TakeInVolumnProps, any> = function TakeInVolumn(props) {
    const { value, onChange, marshal = false, onBlur, disabled } = props

    return <div onBlur={onBlur} style={{ width: 460 }}>

        <ArrayPanel disabled={disabled} value={value} onChange={onChange} marshal={marshal}
            addBtnStyle={{ type: 'default', }}
            actionConfig={{ layout: '1/3', }}
            // targetLabelCol={2}
            formDescriptions={[
                // { inputType: 'MyAutoComplete', label: '类型', name: 'incomingType' },
                { layout: '1/2', inputType: 'MyAutoComplete', label: '内容', name: 'incomingContent', inputProps: { optionKey: '入量s', dropdownStyle: { zIndex: 9999 }, style: { paddingRight: 4 } } },
                { layout: '1/2', inputType: 'input_number', label: 'ml', name: 'incomingML', inputProps: { style: { paddingRight: 4 } } },
            ]}
        />
    </div>
}
export default TakeInVolumn