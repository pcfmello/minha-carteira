import React, {useMemo, useState, useEffect} from "react";

import SelectInput from '../../components/SelectInput'
import ContentHeader from '../../components/ContentHeader'
import HistoryFinanceCard from '../../components/HistoryFinanceCard'

import gains from '../../repositories/gains'
import expenses from '../../repositories/expenses'
import formatCurrency from '../../utils/formatCurrency'
import formatDate from '../../utils/formatDate'

import * as S from './styles';

interface IRouteParams {
  match: {
    params: {
      type: string
    }
  }
}

interface IData {
  id: string;
  description: string;
  amountFormatted: string;
  frequency: string;
  dateFormatted: string;
  tagColor: string;
}

const List: React.FC<IRouteParams> = ({match}) => {
  const [data, setData] = useState<IData[]>([])
  const [monthSelected, setMonthSelected] = useState<string>(String(7))
  const [yearSelected, setYearSelected] = useState<string>(String(new Date().getFullYear()))
  
  const {type} = match.params;
  
  const headerData = useMemo(() => {
    return type === 'entry-balance' ? {
      title: 'Entradas',
      lineColor: '#f7931b'
    } : {
      title: 'Saídas',
      lineColor: '#e44c4e'
    }
  }, [type])

  const listData = useMemo(() => {
    return type === 'entry-balance' ? gains : expenses
  }, [type])

  const months = [
    {value: 1, label: 'Janeiro'},
    {value: 2, label: 'Fevereiro'},
    {value: 3, label: 'Março'},
    {value: 4, label: 'Abril'},
    {value: 5, label: 'Maio'},
    {value: 6, label: 'Junho'},
    {value: 7, label: 'Julho'}    
  ]

  const years = [
    {value: 2020, label: '2020'},
    {value: 2019, label: '2019'},
    {value: 2018, label: '2018'},
  ]

  useEffect(() => {
    const filteredData = listData.filter(item => {
      const date = new Date(item.date);
      const month = String(date.getMonth() + 1);
      const year = String(date.getFullYear());

      return month === monthSelected && year === yearSelected
    })

    const formattedData = filteredData.map((item, index) => ({
      id: String(new Date().getTime() + index),
      description: item.description,
      amountFormatted: formatCurrency(Number(item.amount)),
      frequency: item.frequency,
      dateFormatted: formatDate(item.date),
      tagColor: item.frequency === 'recorrente' ? '#4e41f0' : '#e44c4e'

    }))
    setData(formattedData)
  }, [listData, monthSelected, yearSelected])

  return (
    <S.Container>
      <ContentHeader title={headerData.title} lineColor={headerData.lineColor}>
        <SelectInput options={months} onChange={e => setMonthSelected(e.target.value)} defaultValue={monthSelected} />
        <SelectInput options={years} onChange={e => setYearSelected(e.target.value)} defaultValue={yearSelected} />
      </ContentHeader>

      <S.Filters>
        <button type="button" className="tag-filter tag-filter-recurrent">Recorrentes</button>
        <button type="button" className="tag-filter tag-filter-eventuals">Eventuais</button>
      </S.Filters>

      <S.Content>
        {data.map(item => (
          <HistoryFinanceCard
            key={item.id}          
            tagColor={item.tagColor} 
            title={item.description}
            subtitle={item.dateFormatted}
            amount={item.amountFormatted}
          />
        ))
          }          
      </S.Content>
    </S.Container>
  );
};

export default List;
