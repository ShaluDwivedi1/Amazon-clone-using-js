export function formatCurrency(pricePaise){
  return (Math.round(pricePaise)/100).toFixed(2);
}

export default formatCurrency;