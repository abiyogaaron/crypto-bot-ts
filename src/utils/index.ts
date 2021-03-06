export const formatCurrency = (money: number) => {
  return new Intl.NumberFormat('id-ID',
     { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
   ).format(money); 
}