const {generateItemRow} = require('./utils');
const values = require('lodash/values');
const {table, getBorderCharacters} = require('table');

const foodDetails = {
  order_id: '12345',
  location: {
    address: 'kovela',
    city: 'Narsapur',
    state: 'AndhraPradesh',
    zip: 534275,
    telephone: '9176567',
  },
  customer: {
    first: 'Minion',
    last: 'Gru',
    telephone: '913367575',
    address: {
      street_number: '123 street',
      street: 'Kovela Street',
      city: 'Narsapuram',
      state: 'AP',
      zipcode: '534275',
    },
  },
  type: 'pickup',
  payment: {
    details: 'GreenLand',
    method: 'cod',
    totals: {
      subtotal: '100',
      tax: '10',
      final: '110',
      discount: '1.00',
      tip: '5.00',
      fee: {
        usage: '6.00',
      },
    },
    order_when: {date: '05/01/2021'},
  },
  local_date: '05/01/2021',
  data: {
    1: {
      cost: {
        quantity: 10,
        cost: {
          final: 50,
        },
        item: {
          item: 'Oranges',
          note: 'fresh',
        },
      },
      cart: {
        prices: {
          1: {
            info: {
              name: 'a note on item',
            },
            modules: [
              {
                name: 'variant one',
                toppings: [
                  {
                    topping: 'top one',
                    chosen: {
                      name: 'topping name',
                      placement: 'top',
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    },
    2: {
      cost: {
        quantity: 20,
        cost: {
          final: 45,
        },
        item: {
          item: 'Apples',
          note: 'natural',
        },
      },
      cart: {
        prices: {
          1: {
            info: {
              name: 'price two',
            },
            modules: [
              {
                name: 'variant two',
                chosen: [
                  {
                    name: 'var one',
                  },
                ],
              },
            ],
          },
        },
      },
    },
    3: {
      cost: {
        quantity: 6,
        cost: {
          final: 15,
        },
        item: {
          item: 'Banana',
          note: 'natural',
        },
      },
      cart: {
        prices: [
          {
            info: {
              name: 'price two',
            },
            modules: [
              {
                name: 'variant three',
                chosen: [
                  {
                    name: 'var one',
                  },
                ],
                toppings: [
                  {
                    topping: 'top one',
                    chosen: {
                      name: 'topping name',
                      placement: 'top',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
};

const getOrderItemsData = () => {
  const details = foodDetails;
  const items = values(details.data);
  let itemsTable = items.map(item => {
    return [
      item.cost.quantity,
      generateItemRow(item),
      `${
        Math.round(
          parseFloat(item.cost.cost.final) *
            parseFloat(item.cost.quantity) *
            100,
        ) / 100
      }`,
    ];
  });

  let data = [['QTY', 'ITEM', 'COST'], ...itemsTable];

  const config = {
    columns: {
      0: {},
      1: {
        width: 31,
      },
      2: {
        alignment: 'right',
      },
    },
    border: getBorderCharacters('void'),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 1,
    },
    drawHorizontalLine: () => {
      return false;
    },
  };
  const priceConfig = {
    columns: {
      0: {
        width: 32,
      },
      1: {
        alignment: 'right',
        width: 12,
      },
    },
    border: getBorderCharacters('void'),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 1,
    },
    drawHorizontalLine: () => {
      return false;
    },
  };

  let output = table(data, config);
  let pricesTable = [
    ['SUBTOTAL', details.payment.totals.subtotal],
    ['TAX', details.payment.totals.tax],
    ['TOTAL', details.payment.totals.final],
  ];
  if (details.payment.totals.discount != '0.00') {
    pricesTable.splice(1, 0, ['DISCOUNT', details.payment.totals.discount]);
  }
  if (details.payment.totals.tip != '0.00') {
    pricesTable.splice(pricesTable.length - 1, 0, [
      'TIPS',
      details.payment.totals.tip,
    ]);
  }
  if (details.payment.totals.fee.usage != '0.00') {
    pricesTable.splice(pricesTable.length - 1, 0, [
      'CONVENIENCE FEE',
      details.payment.totals.fee.usage,
    ]);
  }
  let pricesOutput = table(pricesTable, priceConfig);
  return {
    header: `${details.type === 'pickup' ? 'TAKE-OUT' : 'DELIVERY'} #${
      details.order_id
    }`,
    add1: details.location.address || '',
    add2: details.location.city || '',
    add3: `${details.location.state} ${details.location.zip}` || '',
    tel1: details.location.telephone || '',
    customer: `${details.customer.first} ${details.customer.last}` || '',
    tel2: details.customer.telephone || '',
    custAdd1:
      `${
        details.customer.address ? details.customer.address.street_number : ''
      } ${details.customer.address ? details.customer.address.street : ''}` ||
      '',
    custAdd2:
      `${details.customer.address ? details.customer.address.city : ''}, ${
        details.customer.address ? details.customer.address.state : ''
      } ${details.customer.address ? details.customer.address.zipcode : ''}` ||
      '',
    subtotal: details.payment.totals.subtotal || '',
    tax: details.payment.totals.tax || '',
    total: details.payment.totals.final || '',
    table: output,
    pricesOutput: pricesOutput,
    orderDate: details.local_date || '',
    futureDate: details.payment.order_when.date || '',
    isFutureDate: details.payment.order_when.date ? true : false,
    paymentMethod: `${
      details.payment.method === 'cod'
        ? `Pay on Delivery (${details.payment.details})`
        : 'Pay in Person'
    }`,
    showDelivery: details.payment.method === 'cod' ? true : false,
  };
};

module.exports = {
  foodDetails,
  getOrderItemsData
}