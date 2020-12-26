import React, {useMemo, useState, useEffect} from "react"
import {uuid} from 'uuidv4'

import SelectInput from '../../components/SelectInput'
import ContentHeader from '../../components/ContentHeader'
import HistoryFinanceCard from '../../components/HistoryFinanceCard'

import gains from '../../repositories/gains'
import expenses from '../../repositories/expenses'

import formatCurrency from '../../utils/formatCurrency'
import formatDate from '../../utils/formatDate'
import listOfMonths from '../../utils/months'

import * as S from './styles'

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

  const years = useMemo(() => {
    let uniqueYears: number[] = []

    listData.forEach(item => {
      const date = new Date(item.date)
      const year = date.getFullYear()

      if(!uniqueYears.includes(year)) {
        uniqueYears.push(year)
      }
    })

    uniqueYears.sort().reverse();

    return uniqueYears.map(year => ({
      value: year,
      label: year
    }))
  }, [listData])

  const months = useMemo(() => {
    return listOfMonths.map((month, index) => ({
      value: index + 1,
      label: month
    }))
  }, [])

  useEffect(() => {
    const filteredData = listData.filter(item => {
      const date = new Date(item.date);
      const month = String(date.getMonth() + 1);
      const year = String(date.getFullYear());

      return month === monthSelected && year === yearSelected
    })

    const formattedData = filteredData.map((item, index) => ({
      id: uuid(),
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
