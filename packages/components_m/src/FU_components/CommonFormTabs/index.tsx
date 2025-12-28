import { Form } from "antd";
import { isEmpty } from "lodash";
import { lazy, useRef } from "react";
import { DisplayFC } from "./DisplayFC";
export * from './types';
const _FormTabs = lazy(() => import('./Inner'))
const CommonFormTabs = lazy(() => import('./CommonFormTabs'))
export function useFormTabs(n = 10) {
    const forms = useRef(Array(n).fill(0).map(_ => Form.useForm()[0]))
    function getFormsData() {
        return forms.current.map(form => form.getFieldsValue()).filter(_ => !isEmpty(_))
    }
    return [forms.current, getFormsData] as const
}
const FormTabs = Object.assign(_FormTabs, { DisplayFC })

export { CommonFormTabs, FormTabs };
