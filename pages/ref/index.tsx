import React, { useCallback, useState } from 'react'
import Input from '../../components/Input'

interface Inputs {
  name: string;
  miles: string;
  cpf: string;
  cep: string;
  currency: string;
}

const Ref = () => {

  const [ value, setValue ] = useState<Inputs>({} as Inputs)

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.currentTarget.name]: e.currentTarget.value
    })
  }, [value])

  const handleClick = () => {
    console.log(value)
  }

  return (
    <div>

      <Input
        onSet={handleChange}
        name='cep'
        placeholder='Digite seu cep'
        mask='cep'
        warning={false}/>

      <Input
        onSet={handleChange}
        name='currency'
        placeholder='R$ 0,00'
        mask='currency'
        />

        <Input
        onSet={handleChange}
        name='name'
        placeholder='Digite seu nome'
        />

        <Input
        onSet={handleChange}
        name='miles'
        placeholder='Qtde de milhas'
        mask='miles'
        />

        <Input
        onSet={handleChange}
        name='cpf'
        placeholder='Cpf'
        mask='cpf'
        />

        <Input
        onSet={handleChange}
        name='date'
        placeholder='Data de nascimento'
        mask='date'
        />

        <button onClick={handleClick}>Enviar</button>

    </div>
  )
}

export default Ref