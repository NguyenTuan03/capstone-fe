import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDragListView from 'react-drag-listview';
import Table, { ColumnsType, TableProps } from 'antd/es/table';
import { AnyObject } from 'antd/es/_util/type';
import { TableRowSelection } from 'antd/es/table/interface';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import { PAGE_SIZE_LIST } from '@/@crema/constants/AppConst';
import { usePathname } from 'next/navigation';

interface Column {
  title: React.ReactNode;
  dataIndex?: string | string[];
  key?: React.Key;
  width?: number;
  onHeaderCell?: (column: Column) => any;
}

interface ListTableProps {
  initColumns: ColumnsType<any>;
  dataSource: any[];
  currPage: number;
  currPageSize: number;
  total: number;
  handlePageChange: (page: number, pageSize: number) => void;
  loading: boolean;
  scrollX?: string;
  filterData?: any;
  handleSortChange: (newFilterData: Record<string, any>) => void;
  filterHeight?: number;
  rowSelection?: TableRowSelection<any>;
  expandable?: TableProps<any>['expandable'];
  /** khoảng trừ thêm chiều cao ngoài filter (header/footer, action bar, etc.) */
  extraOffsetPx?: number; // default 270
  /** id (hoặc key) để persist layout cột theo từng bảng */
  tableId?: string; // default: pathname
}

const ResizableTitle: React.FC<any> = (props) => {
  const { onResize, width, ...restProps } = props;
  if (!width) return <th {...restProps} />;
  return (
    <Resizable
      width={typeof width === 'number' ? width : Number(width)}
      height={0}
      handle={<span className="react-resizable-handle" onClick={(e) => e.stopPropagation()} />}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const ListTable: React.FC<ListTableProps> = ({
  initColumns,
  dataSource,
  currPage,
  currPageSize,
  total,
  handlePageChange,
  loading,
  handleSortChange,
  filterHeight,
  rowSelection,
  expandable,
  extraOffsetPx = 270,
  tableId,
}) => {
  const pathname = usePathname();
  const [sortOrder, setSortOrder] = useState<any>(null);
  const [columns, setColumns] = useState<ColumnsType<AnyObject>>(initColumns ?? []);

  // ---- Persist layout (order + width) ----
  const storageKey = useMemo(() => {
    const base = tableId || pathname || 'table';
    return `tbl_layout:${base}`;
  }, [pathname, tableId]);

  useEffect(() => {
    if (!initColumns) return;
    // áp width + order đã lưu (nếu có)
    const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (!raw) {
      setColumns(initColumns);
      return;
    }
    try {
      const saved: Record<string, { width?: number; order: number }> = JSON.parse(raw);
      const withWidth = initColumns.map((c: any) => {
        const k = String(c.key ?? c.dataIndex ?? '');
        return saved[k]?.width ? { ...c, width: saved[k].width } : c;
      });
      // sort theo order đã lưu
      withWidth.sort((a: any, b: any) => {
        const ka = String(a.key ?? a.dataIndex ?? '');
        const kb = String(b.key ?? b.dataIndex ?? '');
        return (saved[ka]?.order ?? 0) - (saved[kb]?.order ?? 0);
      });
      setColumns(withWidth);
    } catch {
      setColumns(initColumns);
    }
  }, [initColumns, storageKey]);

  useEffect(() => {
    // lưu mỗi khi columns đổi
    const payload: Record<string, { width?: number; order: number }> = {};
    columns.forEach((c: any, idx) => {
      const key = String(c.key ?? c.dataIndex ?? '');
      payload[key] = { width: c.width as number | undefined, order: idx };
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    }
  }, [columns, storageKey]);

  // ---- Drag columns ----
  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const newColumns = [...columns];
      const item = newColumns.splice(fromIndex, 1)[0];
      newColumns.splice(toIndex, 0, item);
      setColumns(newColumns);
    },
    nodeSelector: 'th',
    handleSelector: '.dragHandler',
    ignoreSelector: '.react-resizable-handle', // FIX: có dấu chấm
  };

  // ---- Resize columns ----
  const handleResize = useCallback(
    (index: number) =>
      (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
        setColumns((prevColumns) => {
          const next = [...prevColumns];
          next[index] = {
            ...next[index],
            width: Math.max(100, size.width), // chặn nhỏ hơn 100px
          };
          return next;
        });
      },
    [],
  );

  const mappedColumns = useMemo(() => {
    return (columns ?? []).map((col: any, index: number) => {
      const minWidth = 120;
      const currentWidth = col?.width || minWidth;
      const colKey = String(col.key ?? col.dataIndex ?? index);
      return {
        ...col,
        key: colKey, // đảm bảo có key
        width: currentWidth,
        ellipsis: false,
        sortOrder: sortOrder?.columnKey === colKey ? sortOrder?.order : null,
        onHeaderCell: (column: Column) => ({
          width: column.width,
          onResize: handleResize(index),
        }),
        // thêm class tailwind để handle kéo (đặt lên title nếu muốn)
        title: <div className="dragHandler select-none cursor-move">{col.title}</div>,
      };
    });
  }, [columns, sortOrder, handleResize]);

  return (
    <div className="relative">
      <style jsx>{`
        .react-resizable-handle {
          position: absolute;
          width: 10px;
          height: 100%;
          right: -5px;
          bottom: 0;
          cursor: col-resize;
          z-index: 1;
        }
      `}</style>

      <div className="w-full">
        <ReactDragListView.DragColumn {...dragProps}>
          <Table
            components={{ header: { cell: ResizableTitle } }}
            columns={mappedColumns as any}
            dataSource={dataSource}
            rowKey="id"
            rowSelection={rowSelection}
            expandable={expandable}
            loading={loading}
            className="
              w-full overflow-x-auto overflow-y-auto
              [&_.ant-table]:table-fixed
              [&_.ant-table-thead_tr_th]:text-center
              [&_.ant-table-thead_tr_th]:text-[13px]
              [&_.ant-table-thead_tr_th]:font-semibold
              [&_.ant-table-thead_tr_th]:px-3 [&_.ant-table-thead_tr_th]:py-2
              [&_.ant-table-tbody_tr_td]:text-[13px]
              [&_.ant-table-tbody_tr_td]:px-2 [&_.ant-table-tbody_tr_td]:py-1.5
              [@media(max-width:767px)]:w-full
            "
            pagination={{
              current: currPage,
              pageSize: currPageSize,
              total,
              position: ['bottomCenter'],
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_LIST,
              onChange: handlePageChange,
            }}
            onChange={(_p: any, _f: any, sorter: any) => {
              setSortOrder(sorter);
              const colKey = sorter?.columnKey;
              const order = sorter?.order;
              if (!colKey || !order) {
                // clear sort
                handleSortChange({ order_by: undefined, order_direction: undefined });
                return;
              }
              handleSortChange({
                order_by: String(colKey),
                order_direction: order === 'ascend' ? 'asc' : 'desc',
              });
            }}
            sticky
            scroll={{
              x: 'max-content',
              y: `calc(100dvh - ${Number(filterHeight ?? 0) + Number(extraOffsetPx)}px)`,
            }}
          />
        </ReactDragListView.DragColumn>
      </div>
    </div>
  );
};

export default ListTable;
