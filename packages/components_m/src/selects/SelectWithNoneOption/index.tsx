import React, { useState, useEffect } from 'react';
import { get, map, set, compact, isEmpty, includes, without } from 'lodash';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
interface IProps {
  config: {};
  value?: any;
  onChange?: any;
}
interface IDease {
  value: string;
  label: string;
}
export default (props: IProps) => {
  const [data, setData] = useState([]);
  const config = get(props, 'config.specialConfig') ?? safe_json_parse(get(props, 'config.special_config'))
  const diseases = get(config, 'options') || [];

  useEffect(() => {
    const { value } = props;
    const selectedDiseasesArray: any = map(diseases, (disease: IDease) => {
      if (get(value, disease.value)) {
        return disease.value;
      }
    });
    if (isEmpty(compact(selectedDiseasesArray)) && !isEmpty(value)) {
      setData(['none']);
    } else {
      setData(compact(selectedDiseasesArray));
    }
  }, []);

  const handleChange = (selectedDiseasesArray) => {
    const { onChange } = props;
    const optionsArray: any = map(diseases, (disease) => {
      return disease.value;
    });
    let dataResponse = {};

    if (!isEmpty(selectedDiseasesArray) && includes(selectedDiseasesArray, 'none')) {
      if (selectedDiseasesArray[selectedDiseasesArray.length - 1] === 'none') {
        selectedDiseasesArray = ['none'];
      } else {
        selectedDiseasesArray = without(selectedDiseasesArray, 'none');
      }
    }
    map(optionsArray, (option) => {
      if (includes(selectedDiseasesArray, option)) {
        set(dataResponse, option, true);
      } else {
        set(dataResponse, option, false);
      }
    });
    setData(selectedDiseasesArray);

    onChange && onChange(dataResponse);
  };

  return (
    <>
      <Select mode="multiple" value={data} onChange={handleChange} {...get(props, 'config.inputProps')}>
        {map(diseases, (disease) => {
          return (
            <Select.Option key={get(disease, 'value')} value={get(disease, 'value')}>
              {get(disease, 'label')}
            </Select.Option>
          );
        })}
      </Select>
    </>
  );
};
