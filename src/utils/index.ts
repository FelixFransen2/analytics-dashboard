import {format, subDays} from 'date-fns';

export const getDate = (sub: number = 0) => {
  const date = subDays(new Date(), sub);

  return format(date, 'dd/MM/yyyy');
}