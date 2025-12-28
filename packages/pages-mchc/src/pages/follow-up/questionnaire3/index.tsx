import Questionnaire from './Inner';
import { SMchc_Questionnaire, IMchc_Questionnaire } from '@lm_fe/service';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';


// import { Questionnaire, message } from 'antd';
export default function questionnaire2() {



  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
      <Questionnaire

      // onEditorUpload={handleUpload}
      />
    </div>
  );
}
