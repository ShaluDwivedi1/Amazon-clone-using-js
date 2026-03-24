import {cart,calculateCartQuantity} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';
import {addOrder} from '../../data/orders.js'

export function renderPaymentSummary(){
  let productPricePaise = 0;
  let shippingPricePaise = 0;

  cart.forEach((cartItem)=>{
   const product = getProduct(cartItem.productId);
   productPricePaise += product.pricePaise * cartItem.quantity;

  const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
  shippingPricePaise += deliveryOption.pricePaise;
  });

  const totalBeforeTaxPaise = productPricePaise + shippingPricePaise;
  const taxPaise = totalBeforeTaxPaise * 0.1;
  const totalPaise = totalBeforeTaxPaise+ taxPaise;

  let cartQuantity = 0;

  cart.forEach((cartItem)=>{
    cartQuantity += cartItem.quantity;
  });

  const paymentSummaryHTML = `
  <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items ${cartQuantity}:</div>
            <div class="payment-summary-money">
            ₹${formatCurrency(productPricePaise)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">₹${formatCurrency(shippingPricePaise)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">₹${formatCurrency(totalBeforeTaxPaise)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">₹${formatCurrency(taxPaise)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">₹${formatCurrency(totalPaise)}
            </div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
  
  document.querySelector('.js-place-order').addEventListener('click' , async () =>{
    try{
     const response = await fetch('https://supersimplebackend.dev/orders',{
      method:'POST',
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify({
        cart: cart
      })
    });
    
    const order = await response.json();
    console.log(order);
    addOrder(order);
    } catch(error){
      console.log('Unexpected error.Try again later.')
    }
    
    window.location.href = 'orders.html';
  });
}
