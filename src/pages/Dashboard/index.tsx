import React from "react";

import SelectInput from '../../components/SelectInput'
import ContentHeader from '../../components/ContentHeader'

import * as S from './styles';

const Dashboard: React.FC = () => {
  const options = [
    {value: 'Paulo', label: 'Paulo'},
    {value: 'Maria', label: 'Maria'},
    {value: 'Ana', label: 'Ana'},
  ]

  return (
    <S.Container>
      <ContentHeader title="Dashboard" lineColor="#f7931b">
        <SelectInput options={options} onChange={() => {}} />
      </ContentHeader>
    </S.Container>
  );
};

export default Dashboard;
