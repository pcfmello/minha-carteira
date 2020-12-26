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
  const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1)
  const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear())
  const [frequencyFilterSelected, setFrequencyFilterSelected] = useState<string[]>(['recorrente', 'eventual'])
  
  const movimentType = match.params.type;
  
  const headerData = useMemo(() => {
    return movimentType === 'entry-balance' ? {
      title: 'Entradas',
      lineColor: '#f7931b'
    } : {
      title: 'Saídas',
      lineColor: '#e44c4e'
    }
  }, [movimentType])

  const listData = useMemo(() => {
    return movimentType === 'entry-balance' ? gains : expenses
  }, [movimentType])

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

  const handleFrequencyClick = (frequency: string): void => {
    const alreadySelected = frequencyFilterSelected.findIndex(item => item === frequency)

    if (alreadySelected >= 0) {
      const filtered = frequencyFilterSelected.filter(item => item !== frequency)
      setFrequencyFilterSelected(filtered)
    } else {      
      setFrequencyFilterSelected(prev =>([...prev, frequency]))
    }
  }

  const handleMonthSelected = (month: string) => {
    try {
      const parseMonth = Number(month)
      setMonthSelected(parseMonth)
    } catch(error) {
      throw new Error('Invalid month value. Is accept 0 - 24')
    }
  }

  const handleYearSelected = (year: string) => {
    try {
      const parseYear = Number(year)
      setYearSelected(parseYear)
    } catch(error) {
      throw new Error('Invalid year value. Is accept 1 - 12')
    }
  }

  useEffect(() => {
    const filteredData = listData.filter(item => {
      const date = new Date(item.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return month === monthSelected && year === yearSelected && frequencyFilterSelected.includes(item.frequency)
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
  }, [listData, monthSelected, yearSelected, frequencyFilterSelected])

  return (
    <S.Container>
      <ContentHeader title={headerData.title} lineColor={headerData.lineColor}>
        <SelectInput options={months} onChange={e => handleMonthSelected(e.target.value)} defaultValue={monthSelected} />
        <SelectInput options={years} onChange={e => handleYearSelected(e.target.value)} defaultValue={yearSelected} />
      </ContentHeader>

      <S.Filters>
        <button 
          type="button" 
          className={`tag-filter tag-filter-recurrent ${frequencyFilterSelected.includes('recorrente') && 'tag-actived' }`} 
          onClick={() => handleFrequencyClick('recorrente')}>
            Recorrentes
          </button>
        <button 
          type="button" className={`tag-filter tag-filter-eventuals ${frequencyFilterSelected.includes('eventual') && 'tag-actived' }`} 
          onClick={() => handleFrequencyClick('eventual')}>
            Eventuais
          </button>
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
