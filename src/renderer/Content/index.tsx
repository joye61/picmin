import style from './index.module.scss';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';

interface RowType {
  status: number;
  name: string;
  rate: React.ReactNode;
  oldSize: string;
  newSize: string;
  action: React.ReactNode;
}

const columns: ColumnsType<RowType> = [
  { key: 'status', title: '状态' },
  { key: 'name', title: '名称' },
  { key: 'oldSize', title: '原大小' },
  { key: 'newSize', title: '新大小' },
  { key: 'rate', title: '压缩率' },
  { key: 'action', title: '操作', align: 'right' },
];

export function Content() {
  return (
    <div className={style.container}>
      <Table size="small" columns={columns} />
    </div>
  );
}
