const values = require('lodash/values');

const generateItemRow = item => {
  return `${item.cost.item.item}\n${cartInfo(item.cart)}\n${
    item.cost.item.note.length > 0 && `\nCUSTOMER NOTE\n ${item.cost.item.note}`
  }`;
};

const cartInfo = cart => {
  return values(cart.prices)
    .map(cp => {
      return `\n${cp.info.name.length > 0 ? `**${cp.info.name}**\n` : ''}\n${
        cp.modules.length !== 0 ? toppingsInfo(cp.modules) : '*'
      }`;
    })
    .join('\n');
};

const toppingsInfo = toppings => {
  if (toppings.length != 0) {
    const toppingsArray = Object.values(toppings);
    return toppingsArray
      .map(top => {
        return `${top.name}\n${
          top.chosen
            ? values(top.chosen)
                .map(chosen => {
                  return ` ${chosen.name}`;
                })
                .join('\n')
            : values(top.toppings)
                .map(t => {
                  return ` ${t.topping} (${t.chosen.placement})`;
                })
                .join('\n')
        }`;
      })
      .join('\n');
  }
};

module.exports = {
  generateItemRow
}