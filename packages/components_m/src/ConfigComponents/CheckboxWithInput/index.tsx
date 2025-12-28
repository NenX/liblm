import { safe_json_parse, safe_json_stringify } from '@lm_fe/utils';
import { get, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import CheckboxWithInput from '../../GeneralComponents/CheckboxWithInput';
type Option = {
  value?: string;
  label?: string;
  checked?: boolean;
  withInput?: boolean;
  span?: number;
  offset?: number;
  inputSpan?: number;
};
interface IProps {
  [x: string]: any
  myForm?: boolean
  formSection?: boolean
  name?: string
  config: any
}
export function CheckboxWithInput_lm(props: IProps) {
  const { input_props, config, onChange, myForm, formSection, name, value } = props

  const specialConfig = props.specialConfig ?? config?.specialConfig ?? safe_json_parse(config?.special_config) ?? input_props ?? safe_json_parse(config.inputProps);
  const options = get(specialConfig, 'options') as [Option];
  const type = get(specialConfig, 'type') as 'single' | 'multiple';

  const [data, setData] = useState({});

  const hasNote = name?.includes('(Note)')
  const k = hasNote ? name?.replace('(Note)', '') : name
  const KNote = `${k}Note`
  useEffect(() => {
    const valueJson = typeof value === 'string' ? safe_json_parse(value) : value;

    const checkedValues = (myForm ? [valueJson?.[k!]] : (formSection ? [valueJson?.key] : valueJson?.checkedValues)) ?? []
    const withInputValues = (myForm ? safe_json_parse(valueJson?.[KNote]) : (formSection ? safe_json_parse(valueJson?.keyNote) : valueJson?.withInputValues)) ?? {}

    !isEmpty(valueJson) &&
      setData({
        checkedValues,
        withInputValues
      });
  }, [props.value]);

  const handleChange = (data: any) => {

    const { checkedValues = [], withInputValues = {} } = data

    if (myForm && name) {
      if (hasNote) {

        onChange?.({
          [k!]: Array.isArray(checkedValues) ? checkedValues[0] : checkedValues,
          [`${k}Note`]: JSON.stringify(withInputValues)
        });

      } else {
        onChange?.(JSON.stringify(data));

      }
    } else if (formSection) {
      onChange?.({
        key: Array.isArray(checkedValues) ? checkedValues[0] : checkedValues,
        keyNote: JSON.stringify(withInputValues)
      });

    }

    else {
      onChange?.(JSON.stringify(data));

    }

    // let alongValue: any;
    // map(options, (item) => {
    //   if (get(item, 'along')) {
    //     alongValue = get(item, 'value');
    //   }
    // });
    // if (indexOf(get(data, 'checkedValues'), alongValue) > -1) {
    //   const checkedValues = [alongValue];
    //   const withInputValues = { alongValue: get(data, `withInputValues.${alongValue}`) };
    //   !isEmpty(data) &&
    //     setData({
    //       checkedValues,
    //       withInputValues,
    //     });
    // } else {
    //   !isEmpty(data) &&
    //     setData({
    //       checkedValues: get(data, 'checkedValues'),
    //       withInputValues: get(data, 'withInputValues'),
    //     });
    // }
  };

  return <CheckboxWithInput {...props} type={type} options={options} onChange={handleChange} value={data} />;
};
export default CheckboxWithInput_lm