import style from "./index.module.scss";
import { Form, Input, Modal, Radio, Slider } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { state } from "../state";

interface FormValues {
  scaleMode: "percent" | "width" | "height";
  scalePercent?: number;
  scaleWidth?: number;
  scaleHeight?: number;
  qualityPercent: number;
}

export const Setting = observer(() => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        scaleMode: state.scaleMode,
        scalePercent: state.scalePercent,
        scaleWidth: state.scaleWidth,
        scaleHeight: state.scaleWidth,
        qualityPercent: state.qualityPercent,
      });
    }
  }, [form]);

  const showScale = () => {
    if (state.scaleMode === "percent") {
      return (
        <Form.Item label="缩放到比例" name="scalePercent">
          <Slider />
        </Form.Item>
      );
    } else if (state.scaleMode === "width") {
      return (
        <Form.Item label="缩放到宽度" name="ScalaeWidth">
          <Input
            placeholder="设置固定宽度，高度自适应"
            allowClear
            suffix="px"
          />
        </Form.Item>
      );
    } else if (state.scaleMode === "height") {
      return (
        <Form.Item label="缩放到高度" name="scaleHeight">
          <Input
            placeholder="设置固定高度，宽度度自适应"
            allowClear
            suffix="px"
          />
        </Form.Item>
      );
    }
  };

  return (
    <Modal
      maskClosable
      width={350}
      visible={state.showSetting}
      centered
      title="压缩选项设置"
      okText="立即应用"
      cancelText="重置选项"
      forceRender
      closeIcon={
        <svg viewBox="0 0 24 24" className={style.close}>
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      }
      onCancel={() => {
        state.showSetting = false;
      }}
    >
      <Form
        layout="vertical"
        form={form}
        onValuesChange={(changed) => {
          if (changed.scaleMode) {
            state.scaleMode = changed.scaleMode;
          }
        }}
      >
        <Form.Item
          label="缩放模式"
          name="scaleMode"
          extra="为防止变形，任意模式都会保持原始宽高比"
        >
          <Radio.Group>
            <Radio value="percent">缩放到比例</Radio>
            <Radio value="width">缩放到宽度</Radio>
            <Radio value="height">缩放到高度</Radio>
          </Radio.Group>
        </Form.Item>

        {showScale()}

        <Form.Item
          label="压缩质量"
          name="qualityPercent"
          extra="质量值越大，文件体积越大，压缩率越低"
        >
          <Slider />
        </Form.Item>
      </Form>
    </Modal>
  );
});
