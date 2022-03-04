import style from "./index.module.scss";
import { Form, Input, Modal, Radio, Slider } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { state } from "@/renderer/state";
import { reCompress } from "@/renderer/image";

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
        <Form.Item label="缩放到比例（0-100）" name="scalePercent">
          <Slider />
        </Form.Item>
      );
    } else if (state.scaleMode === "width") {
      return (
        <Form.Item
          label="缩放到宽度"
          name="scaleWidth"
          rules={[{ pattern: /^([1-9]\d*)?$/, message: "不合法的数字值" }]}
        >
          <Input
            placeholder="设置固定宽度，高度自适应，最长6位数字"
            maxLength={6}
            allowClear
            suffix="px"
          />
        </Form.Item>
      );
    } else if (state.scaleMode === "height") {
      return (
        <Form.Item
          label="缩放到高度"
          name="scaleHeight"
          rules={[{ pattern: /^([1-9]\d*)?$/, message: "不合法的数字值" }]}
        >
          <Input
            placeholder="设置固定高度，宽度自适应，最长6位数字"
            maxLength={6}
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
      title="调整选项"
      okText="立即应用"
      cancelText="重置为默认"
      forceRender
      closeIcon={
        <svg viewBox="0 0 24 24" className={style.close}>
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      }
      onCancel={() => {
        state.showSetting = false;
      }}
      cancelButtonProps={{
        onClick() {
          state.scaleMode = "percent";
          state.scalePercent = 100;
          state.qualityPercent = 75;
          state.scaleWidth = undefined;
          state.scaleHeight = undefined;
          form.setFieldsValue({
            scaleMode: "percent",
            scalePercent: 100,
            qualityPercent: 75,
          });
        },
      }}
      onOk={async () => {
        try {
          const values = await form.validateFields();
          state.qualityPercent = Number(values.qualityPercent);
          if (state.scaleMode === "percent") {
            state.scaleWidth = undefined;
            state.scaleHeight = undefined;
            state.scalePercent = Number(values.scalePercent);
          } else if (state.scaleMode === "width") {
            state.scalePercent = 100;
            state.scaleHeight = undefined;
            state.scaleWidth = values.scaleWidth
              ? Number(values.scaleWidth)
              : undefined;
          } else if (state.scaleMode === "height") {
            state.scalePercent = 100;
            state.scaleWidth = undefined;
            state.scaleHeight = values.scaleHeight
              ? Number(values.scaleHeight)
              : undefined;
          }

          state.showSetting = false;
          await reCompress();
        } catch (error) {}
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
          label="输出图片质量（0-100）"
          name="qualityPercent"
          extra="输出质量值越大，文件体积越大，压缩率越低"
        >
          <Slider />
        </Form.Item>
      </Form>
    </Modal>
  );
});
