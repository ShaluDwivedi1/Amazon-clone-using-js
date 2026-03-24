export const deliveryOptions=[{
  id:'1',
  deliveryDays:7,
  pricePaise:0
},{
  id:'2',
  deliveryDays:3,
  pricePaise:4009
},{
  id:'3',
  deliveryDays:1,
  pricePaise:9090
}];

export function getDeliveryOption(deliveryOptionId){
  let deliveryOption;

  deliveryOptions.forEach((option)=>{
    if(option.id === deliveryOptionId){
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOptions[0];
}