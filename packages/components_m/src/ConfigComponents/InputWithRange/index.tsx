import { safe_json_parse } from '@lm_fe/utils';
import { get } from 'lodash';
import InputWithRange from '../../GeneralComponents/InputWithRange';
export default (props: any) => {
  const { config, onChange, value } = props;
  const specialConfig = get(config, 'specialConfig') ?? safe_json_parse(get(config, 'special_config'));
  const inputProps = get(config, 'input_props') || {};
  const allProps = { ...specialConfig, ...inputProps };

  return <InputWithRange {...allProps} onChange={onChange} value={value} />;
};
