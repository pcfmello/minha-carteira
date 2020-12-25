import React, {useMemo} from 'react'

import emojis from '../../utils/emojis'
import Toggle from '../Toggle'

import * as S from './styles'


const MainHeader: React.FC = () => {
  const emoji = useMemo(() => {
    const indice = Math.floor(Math.random() * emojis.length)
    return emojis[indice];
  }, [])

  return (
    <S.Container>
      <Toggle />

      <S.Profile>
        <S.Welcome>Olá, {emoji}</S.Welcome>
        <S.UserName>Paulo Cesar</S.UserName>
      </S.Profile>
    </S.Container>
  )
}

export default MainHeader
