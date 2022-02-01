import style from './index.module.scss';
import { Alert, Form, Input, Modal, Radio, Slider } from 'antd';
import { observer } from 'mobx-react-lite';
import { state } from '../state';

export const Setting = observer(() => {
  return (
    <Modal
      maskClosable
      width={350}
      visible={state.showSetting}
      centered
      title="压缩选项设置"
      okText="立即应用"
      cancelText="重置选项"
      onCancel={() => {
        state.showSetting = false;
      }}
    >
      <Form layout="vertical">
        <Form.Item
          label="缩放模式"
          name="scaleMode"
          extra={<Alert message="为防止变形，任意模式都会保持原始宽高比" type="info" showIcon/>}
        >
          <Radio.Group>
            <Radio value={1}>缩放到比例</Radio>
            <Radio value={2}>缩放到宽度</Radio>
            <Radio value={3}>缩放到高度</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="缩放到比例" name="percent">
          <Slider defaultValue={30} />
        </Form.Item>
        {/* <Form.Item label="缩放到宽度" name="width">
          <Input placeholder="设置固定宽度，高度自适应" allowClear/>
        </Form.Item>
        <Form.Item label="缩放到高度" name="height">
          <Input placeholder="设置固定高度，宽度度自适应" allowClear/>
        </Form.Item> */}

        <Form.Item label="压缩质量" name="quality">
          <Slider defaultValue={30} />
        </Form.Item>
      </Form>
    </Modal>
  );
});
