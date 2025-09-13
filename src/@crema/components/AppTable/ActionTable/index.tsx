import IntlMessages from '@/@crema/helper/IntlMessages';
import { ButtonProps } from 'antd';

interface TableActionButtonProps extends ButtonProps {
  label: string;
}

const TableActionButton = ({ label, ...props }: TableActionButtonProps) => {
  return (
    <div
      className={`width: 100%;
  &:hover {
    opacity: 0.7 !important;
    transform: translateY(-1px);
    transition: all 0.2s ease-in-out;
    background-color: #e9e9e9 !important;
  }

  &:active {
    opacity: 0.5 !important;
    transform: translateY(0px);
  }

  transition: all 0.2s ease-in-out;`}
      type="link"
      {...props}
    >
      <span style={{ fontSize: 13 }}>
        <IntlMessages id={label} />
      </span>
    </div>
  );
};

export default TableActionButton;
