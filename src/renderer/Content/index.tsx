import style from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { ColCenter, ColStart, RowCenter } from '../Flex';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { RowType, state } from '../state';
import { Typography } from 'antd';

interface ColType {
  key: keyof RowType;
  title: string;
  className?: string;
  render?(row?: RowType): React.ReactNode;
}

const columns: ColType[] = [
  {
    key: 'status',
    title: '状态',
    className: style._status,
    render(item) {
      let icon = <CheckCircleOutlined className={style.statusDone} />;
      if (item!.status === 0) {
        icon = <LoadingOutlined className={style.statusActive} />;
      }
      return icon;
    },
  },
  { key: 'name', title: '名称', className: style._name },
  { key: 'oldSize', title: '原大小', className: style._oldSize },
  { key: 'newSize', title: '新大小', className: style._newSize },
  { key: 'rate', title: '压缩率', className: style._rate },
  { key: 'action', title: '操作', className: style._action },
];

function createColGroupByColumns() {
  return (
    <colgroup>
      {columns.map((item) => {
        return <col key={item.key} className={item.className} />;
      })}
    </colgroup>
  );
}

/**
 * 从数据源创建列表
 * @returns
 */
function createListByDataSource() {
  return state.list.map((row) => {
    const cols = columns.map((col) => {
      let value: React.ReactNode = row[col.key];
      if (typeof col.render === 'function') {
        value = col.render(row);
      }
      return <td key={col.key}>{value}</td>;
    });
    return <tr key={row.key}>{cols}</tr>;
  });
}

export const Content = observer(() => {
  return (
    <ColStart className={style.container}>
      {/* 标题栏 */}
      <table className={style.ttitle}>
        {createColGroupByColumns()}
        <thead>
          <tr>
            {columns.map((item) => {
              return <th key={item.key}>{item.title}</th>;
            })}
          </tr>
        </thead>
      </table>
      <div className={style.list}>
        {/* <table>
          {createColGroupByColumns()}
          <tbody>{createListByDataSource()}</tbody>
        </table> */}

        {/* 没有数据时显示的逻辑 */}
        <ColCenter className={style.dragZone}>
          <FileImageOutlined className={style.icon}/>
          <Typography.Title level={2}>
            拖拽或选取要压缩的图片到这里
          </Typography.Title>
          <p>支持JPG/JPEG/PNG/APNG/GIF/WEBP/SVG格式</p>
        </ColCenter>
      </div>
    </ColStart>
  );
});
