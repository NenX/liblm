import React, { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react/dist/index';
import { getMonacoLoaderPath } from '@lm_fe/env'
loader.config({ paths: { vs: getMonacoLoaderPath() } });
interface IProps {
    value?: string
    defaultValue?: string
    onChange?(e?: string): void
    language?: 'json' | 'javascript'
    defaultLanguage?: string
    height?: string
    theme?: "vs-dark" | 'light'
}
function MyMonaco({ value, onChange, language, defaultValue, height = '400px', theme = "vs-dark" }: IProps) {
    const [inner_value, set_inner_value] = useState(value)
    const inited = useRef(false)
    useEffect(() => {
        if (value) {
            if (inited.current) return
            inited.current = true;
            set_inner_value(value)
        }

        return () => {

        }
    }, [value])

    return <Editor theme={theme} onChange={onChange} height={height} defaultLanguage={language} defaultValue={defaultValue} value={inner_value} ></Editor>
}
export default MyMonaco