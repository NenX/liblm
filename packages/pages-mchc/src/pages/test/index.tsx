import { request } from "@lm_fe/utils";
import { Col, Row } from "antd";
import React, { useEffect } from "react";

export default function () {
  useEffect(() => {
      request.get('/api/report-templates')
  
    return () => {
      
    }
  }, [])
  
  return <div>
    <div>配置练习场</div>
    <Row>
      <Col span={12}>
      </Col>
      <Col span={12}>
      </Col>
    </Row>
  </div>
}