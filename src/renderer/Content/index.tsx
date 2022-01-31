import style from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { Key } from 'react';
import { ColStart } from '../Flex';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface RowType {
  key: Key;
  status: 0 | 1; // 0,正在压缩，1压缩完成
  name: React.ReactNode;
  oldSize: React.ReactNode;
  newSize: React.ReactNode;
  rate: React.ReactNode;
  action?: React.ReactNode;
}
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

// 测试数据
const dataSrouce: RowType[] = [
  {
    key: 1,
    status: 1,
    name: 'a.png',
    oldSize: 1234,
    newSize: 234,
    rate: '75%',
  },
  {
    key: 2,
    status: 1,
    name: 'a.png',
    oldSize: 1234,
    newSize: 234,
    rate: '75%',
  },
  {
    key: 3,
    status: 0,
    name: 'a.png',
    oldSize: 1234,
    newSize: 234,
    rate: '75%',
  },
  {
    key: 4,
    status: 0,
    name: 'a.png',
    oldSize: 1234,
    newSize: 234,
    rate: '75%',
  },
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
  return dataSrouce.map((row) => {
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
        <table>
          {createColGroupByColumns()}
          <tbody>{createListByDataSource()}</tbody>
        </table>
      </div>
    </ColStart>
  );
});
