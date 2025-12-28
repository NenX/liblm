import { QuestionCircleOutlined } from '@ant-design/icons';
import { InputNumber, Tooltip } from 'antd';
import { get } from 'lodash';
import classnames from 'classnames';
import { safe_json_parse } from '@lm_fe/utils';
import styles from './index.module.less';
export default function BloodPressure(props: any) {
  const { value, onChange, config, ...rest } = props;
  // const [data, setData] = useState(value);
  const data = value;
  const specialConfig = get(config, 'specialConfig') ?? safe_json_parse(get(config, 'special_config'))
  const systolicMin = get(props, 'systolicMin') || get(specialConfig, 'systolicMin') || 90;
  const systolicMax = get(props, 'systolicMax') || get(specialConfig, 'systolicMax') || 139;
  const diastolicMin = get(props, 'diastolicMin') || get(specialConfig, 'diastolicMin') || 60;
  const diastolicMax = get(props, 'diastolicMax') || get(specialConfig, 'diastolicMax') || 89;

  const handleSystolicChange = (value) => {
    const newData = {
      ...data,
      systolic: value,
    };
    // setData(newData);
    onChange && onChange(newData);
  };

  const handleDiastolicChange = (value) => {
    const newData = {
      ...data,
      diastolic: value,
    };
    // setData(newData);
    onChange && onChange(newData);
  };

  return (
    <div className={styles["blood-pressure"]}>
      <InputNumber
        {...rest}
        className={classnames({
          [styles['blood-pressure-issue']]: get(data, 'systolic') < systolicMin || get(data, 'systolic') > systolicMax,
        })}
        value={get(data, 'systolic')}
        onChange={handleSystolicChange}
      />
      &nbsp;/&nbsp;
      <InputNumber
        {...rest}
        className={classnames({
          [styles['blood-pressure-issue']]: get(data, 'diastolic') < diastolicMin || get(data, 'diastolic') > diastolicMax,
        })}
        value={get(data, 'diastolic')}
        onChange={handleDiastolicChange}
      />
      <Tooltip
        className={styles["blood-pressure__tip"]}
        title={`收缩压在${systolicMin}～${systolicMax}mmHg之间，舒张压${diastolicMin}～${diastolicMax}mmHg`}
      >
        <QuestionCircleOutlined />
      </Tooltip>
    </div>
  );
}
