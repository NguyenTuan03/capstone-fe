import IntlMessages from '@/@crema/helper/IntlMessages';
import React from 'react';

interface TitleTable {
  id: string;
}
const TitleTable = ({ id }: TitleTable) => {
  return (
    <span className="dragHandler">
      <IntlMessages id={id} />
    </span>
  );
};

export default TitleTable;
