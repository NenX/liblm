import { BaseEditPanelFormFC, MyMonaco, OkButton } from "@lm_fe/components_m";
import { safe_get_object_symbol } from "@lm_fe/env";
import { BF_Wrap2, ErrorBoundarySmall } from "@lm_fe/pages";
import { defineFormConfig, SMchc_TableConfig } from "@lm_fe/service";
import { Card, Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";

export default function (props) {
  const form = Form.useForm()
  const [script, setScript] = useState<string>()
  const [fd, setFd] = useState<any[]>([])
  const { config, Wrap } = BF_Wrap2({
    default_conf: {
      title: '配置-demo',
      tableColumns: defineFormConfig([

      ])
    }
  })
  useEffect(() => {
    SMchc_TableConfig
      .clippy_local(() => import('./form_config'))
      .then(s => {
        setScript(s)
        run(s)
      })

    return () => {

    }
  }, [])
  async function run(s?: string) {

    setFd(safe_get_object_symbol(s, props, []))
  }
  return <Card styles={{ body: { padding: 12, margin: 0 } }} style={{ height: '100%', overflowY: 'auto' }}>
    <div style={{}}>配置练习场 (Shif+Alt+F 格式化)  <OkButton onClick={() => run(script)} btn_text="运行" size="small" primary /></div>
    <Row>
      <Col span={12}>
        {
          script
            ? <MyMonaco onChange={v => setScript(v)} height="80vh" defaultValue={script} language='javascript' />
            : null
        }
      </Col>
      <Col span={12} style={{ height: '80vh', overflow: 'auto' }}>
        <ErrorBoundarySmall>
          <BaseEditPanelFormFC targetLabelCol={4} formDescriptions={fd} />
        </ErrorBoundarySmall>
      </Col>
    </Row>
  </Card>
}