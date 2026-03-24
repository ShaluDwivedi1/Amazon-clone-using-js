import { getProduct, loadProductsFetch } from '../data/products.js';
import { getDeliveryOption } from '../data/deliveryOptions.js';
import { orders } from '../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from '../scripts/utils/money.js';

async function loadPage() {
  await loadProductsFetch();

  const container = document.querySelector('.js-orders-grid');
  if (!container) {
    console.error('No .js-orders-grid element found');
    return;
  }

  let ordersHTML = '';

  orders.forEach((order) => {
    const orderDate = dayjs(order.orderTime).format('MMMM D');
    const {
      totalPaise,
      taxPaise,
      productPricePaise,
      shippingPricePaise
    } = calculateOrderTotal(order);

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>₹${formatCurrency(totalPaise)}</div>
              <div class="order-breakdown" style="font-size: 0.9em; color: #555; margin-top:4px;">
                <div>Items: ₹${formatCurrency(productPricePaise)}</div>
                <div>Shipping: ₹${formatCurrency(shippingPricePaise)}</div>
                <div>Tax: ₹${formatCurrency(taxPaise)}</div>
              </div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${renderProducts(order)}
        </div>
      </div>
    `;
  });

  container.innerHTML = ordersHTML;
}

function calculateOrderTotal(order) {
  let productPricePaise = 0;
  let shippingPricePaise = 0;

  order.products.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    console.log('Order item:', cartItem);
    console.log('Fetched deliveryOption:', deliveryOption);

    if (!product) {
      console.warn(`Product not found: ${cartItem.productId}`);
    } else {
      productPricePaise += product.pricePaise * cartItem.quantity;
    }

    if (!deliveryOption) {
      console.warn(`Invalid deliveryOptionId: ${cartItem.deliveryOptionId}`);
    } else {
      shippingPricePaise += deliveryOption.pricePaise;
    }
  });

  const totalBeforeTax = productPricePaise + shippingPricePaise;
  const taxPaise = Math.round(totalBeforeTax * 0.1);
  const totalPaise = totalBeforeTax + taxPaise;

  console.log('Totals debug:', {
    items: productPricePaise,
    shipping: shippingPricePaise,
    beforeTax: totalBeforeTax,
    tax: taxPaise,
    total: totalPaise
  });

  return {
    productPricePaise,
    shippingPricePaise,
    taxPaise,
    totalPaise
  };
}

function renderProducts(order) {
  return order.products.map((item) => {
    const product = getProduct(item.productId);
    if (!product) return '';

    const deliveryDate = dayjs(item.estimatedDeliveryTime).format('MMMM D');
    return `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
        <div class="product-quantity">Quantity: ${item.quantity}</div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>
      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${item.productId}">
          <button class="track-package-button button-secondary">Track package</button>
        </a>
      </div>
    `;
  }).join('');
}

loadPage();
