import style from "./index.module.scss";
import { Button } from "../Button";
import { showDialog } from "../Dialog";
import { RowEnd } from "../Flex";

export async function showAlert(msg: string, onConfirm?: () => void) {
  const stop = await showDialog(
    <div className={style.container}>
      <div className={style.msg}>{msg}</div>
      <RowEnd className={style.btns}>
        <Button type="outline" onClick={() => stop()}>
          取消
        </Button>
        <Button
          onClick={async () => {
            await stop();
            onConfirm?.();
          }}
        >
          确定
        </Button>
      </RowEnd>
    </div>
  );
}
