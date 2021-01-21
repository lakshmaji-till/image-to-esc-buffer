const {table, getBorderCharacters} = require('table');

const orderData = [
  ['Order No.', ' ', 'AZ-2345'],
  ['Order Date', ' ', '31/10/2020 22:45'],
  ['Order Status', ' ', 'Paid'],
  ['Order Type', ' ', 'Dine In'],
  ['Table No.', ' ', '300'],
  ['Served By', ' ', 'Joanna Leite'],
];
const paymentData = [
  ['Payment Type', ' ', 'Cash'],
  ['Total Paid', ' ', '$0.00'],
];
const options = {
  border: getBorderCharacters('void'), // it hides table borders
  columns: {
    // If you want to set same width for all cells,just remove this property
    0: {
      alignment: 'left',
      // paddingLeft: 3

      // width: 15
    },
    1: {
      alignment: 'center',
      // paddingRight: 3

      // width: 20
    },
    2: {
      alignment: 'right',
    },
  },
};
const getReceiptData = () => {
  const orderDetails = table(orderData, options);
  const paymentDetails = table(paymentData, options);

  return {
    title: 'Park Hyatt',
    storeNo: '0000000000',
    address: '123 Collins St, Melbourne VIC 3000',
    storePhone: '(03) 9234 5678',
    subtitle: 'Subtitle',
    description: 'This is a description',
    date: new Date(),
    price: 1.99,
    condictionA: false,
    condictionB: true,
    barcode: '12345678',
    qrcode: 'hello qrcode',
    underline: 'underline',
    orderDetails,
    note1:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release.",
    note2:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sollicitudin enim nec est mattis condimentum eget vel ipsum. Etiam et.',
    customerName: 'Kari Granleese',
    customerPhone: '04 2345 6789',
    customerAddress: '23 Parliament PI, Melbourne VIC 3002',
    paymentDetails,
  };
};


module.exports = {getReceiptData}