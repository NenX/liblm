import { mchcStore } from '@lm_fe/env';
import React, { useEffect, useState } from 'react';
function HighriskGradeDisplay(props: { data?: string, type: 'contagion' | 'highriskGrade' }) {
  const [contagionColor, setContagionColor] = useState('')


  const { data, type = 'highriskGrade', } = props;
  if (!data || data === '无') return <span>{data}</span>
  useEffect(() => {
    setContagionColor(mchcStore.highriskContagionConfig.color)

    return () => {

    }
  }, [])

  function getGradeColor(grade: any) {
    const config = mchcStore.highriskGradeConfig
    return config.find(_ => _.label === grade);
  };




  let bgcColor = type === 'contagion' ? contagionColor : getGradeColor(data)?.note;



  return <p style={{ color: '#fff', backgroundColor: bgcColor, textAlign: 'center', marginBottom: '3px' }}>
    {type === 'highriskGrade' ? getGradeColor(data)?.colorText : data}
  </p>;
}
export default HighriskGradeDisplay
