export function cep(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 9;
  let value = e.currentTarget.value;
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  
  e.currentTarget.value = value;
  return e;
}

export function currency(e: React.FormEvent<HTMLInputElement>) {
  let value = e.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d)(\d{2})$/, '$1,$2');
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');
  value = value.replace(/^(\d)/, ('R$ $1'))

  e.currentTarget.value = value;
  return e;
}

export function miles(e: React.FormEvent<HTMLInputElement>) {
  let value = e.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d)(?=(\d{3})+\b)/g, '$1.');

  e.currentTarget.value = value;
  return e;
}

export function cpf(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 14;
  let value = e.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1-$2');

  e.currentTarget.value = value;
  return e;
}

export function date(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 10;
  let value = e.currentTarget.value;
  value = value.replace(/(\D)/g, '')
  value = value.replace(/(\d{2})(\d)/, '$1/$2')
  value = value.replace(/(\d{2})(\d)/, '$1/$2')
  value = value.replace(/(\d)(\d{4})/, '$1')
  
  e.currentTarget.value = value;
  return e;
}

export function percentage(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 3;
  let value = e.currentTarget.value;
  value = value.replace(/(\D)/g, '')

  e.currentTarget.value = value;
  return e;
}

export function decimal(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 3;
  let value = e.currentTarget.value;
  value = value.replace(/(\D)/g, '')
  value = value.replace(/(\d{1})(\d{1})/, '$1,$2')

  e.currentTarget.value = value;
  return e;
}

export function twoDigits(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 2;
  let value = e.currentTarget.value;
  value = value.replace(/(\D)/g, '')
  value = value.replace(/(\d{2})/, '$1')

  e.currentTarget.value = value;
  return e;
}