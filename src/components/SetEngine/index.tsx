import style from "./index.module.scss";
import { Alert, Form, Modal, Select, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { state } from "@/renderer/state";
import { type EngineList, engineList, type EngineMap } from "@/compress/define";
import { RowBetween } from "@/components/Flex";
import { reCompress } from "@/renderer/image";

interface FormValues {
  jpeg: EngineMap["jpeg"];
  png: EngineMap["png"];
  webp: EngineMap["webp"];
}

/**
 * 根据类型获取options
 * @param type
 * @param list
 */
function getOptions(type: "jpeg" | "png" | "webp", list: EngineList) {
  return list[type].map((item) => {
    return {
      label: (
        <RowBetween>
          <Typography.Text>{item.name}</Typography.Text>
          <Typography.Text type="secondary">{item.info}</Typography.Text>
        </RowBetween>
      ),
      value: item.value,
    };
  });
}

export const SetEngine = observer(() => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (state.showSetEngin) {
      form.setFieldsValue({
        jpeg: state.jpegEngine,
        png: state.pngEngine,
        webp: state.webpEngine,
      });
    }
  }, [state.showSetEngin]);

  return (
    <Modal
      maskClosable
      width={350}
      visible={state.showSetEngin}
      centered
      title="设置引擎"
      okText="立即应用"
      cancelText="重置为默认"
      forceRender
      closeIcon={
        <svg viewBox="0 0 24 24" className={style.close}>
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      }
      onCancel={() => {
        state.showSetEngin = false;
      }}
      cancelButtonProps={{
        onClick() {
          form.setFieldsValue({
            jpeg: "canvas",
            png: "upng",
            webp: "canvas",
          });
        },
      }}
      onOk={async () => {
        const values = form.getFieldsValue(true);
        state.jpegEngine = values.jpeg;
        state.pngEngine = values.png;
        state.webpEngine = values.webp;
        // 关闭弹框
        state.showSetEngin = false;
        // 立即压缩
        if (state.list.length > 0) {
          await reCompress();
        }
      }}
    >
      <Alert
        type="info"
        className={style.alert}
        message="不同引擎有不同的处理时间和压缩效果，如果不了解相关引擎技术原理，可以试着调整观察不同之处"
      />
      <Form layout="vertical" form={form}>
        <Form.Item label="JPEG" name="jpeg">
          <Select
            placeholder="请选择JPEG图片压缩引擎"
            showArrow
            options={getOptions("jpeg", engineList)}
          />
        </Form.Item>
        <Form.Item label="PNG" name="png">
          <Select
            placeholder="请选择PNG图片压缩引擎"
            showArrow
            options={getOptions("png", engineList)}
          />
        </Form.Item>
        <Form.Item label="WEBP" name="webp">
          <Select
            placeholder="请选择WEBP图片压缩引擎"
            showArrow
            options={getOptions("webp", engineList)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
