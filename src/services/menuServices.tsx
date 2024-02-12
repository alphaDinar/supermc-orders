interface Order extends Record<string, any> { }

export const getTripOrderCount = (orders: Order[]) => {
  const totalQuantity = orders.reduce((cat, el) => cat + el.quantity, 0);
  return totalQuantity;
}

export const calcGroupedOrderTotal =(order : Order)=>{
  const extraTotal = order.extraList.reduce((cat : number, el : Order) => cat + parseFloat(el.price), 0);
  var orderTotal = (parseFloat(order.quantity) * parseFloat(order.price)) + (parseFloat(order.quantity) * extraTotal);
  return orderTotal;
}
