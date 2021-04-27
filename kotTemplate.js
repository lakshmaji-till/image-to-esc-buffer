const app = require("./index");
const { getReceiptData } = require("./helpers/receipt/data");
const { RECEIPT } = require("./helpers/receipt/template");
const { EscPos } = require("@tillpos/xml-escpos-helper");
const Network = require("./network");
const fetch = require("cross-fetch");
const { table, getBorderCharacters } = require("table");
const PRINTERS = [{ device_name: "Essae", host: "192.168.0.8", port: 9100 }];

const generateOrderItems = (order) => {
  const _items = [
    {
      id: "12",
      quantity: 3,
      product: {
        name: "Sandwich",
      },
      status: "In progress",
      notes: "high flame",
      taxInclusive: false,
      discounts: [{ amount: 2, type: "FLAT" }],
      discountAmount: 10,
      unitPrice: 80,
      modifiers: [
        {
          product: { name: "Italy green" },
          quantity: 2,
          unitPrice: 16,
          taxes: [],
        },
        {
          product: { name: "Cashew" },
          quantity: 5,
          unitPrice: 12,
          taxes: [],
        },
      ],
      taxes: [],
      costPrice: 43,
      variant: {
        id: "23",
        name: "Avacado",
      },
    },
  ];
  // const itemsTable = _items.map(item => {
  //   return [
  //     item.quantity,
  //     // generateItemDetails(item) ,
  //     'some item name\nvariant one',
  //     '25',
  //     // generateItemPrice(item),
  //   ];
  // });

  const itemsTable = [
    [
      2,
      "Sandwich Sandwich Sandwich Sandwich\nSmall", // product name  + variant name if any
    ],
    [
      "",
      "Add Avocado \nRemove Tomato\nAdd Onions", // modifier names
    ],
    ["", "**Item notes: Cook in low flame"],
    [
      5,
      "Meals", // product name  + variant name if any
    ],
    [
      "",
      "Add curd \nRemove Ghee\nAdd Fry", // modifier names
    ],
    [
      "",
      "**Item notes: Cook in medium flame Cook in medium flame Cook in medium flame Cook in medium flame",
    ],

    ["\n", "**Order Notes"],
  ];

  const data = [["Qty", "Item"], ...itemsTable];

  const options = {
    columns: {
      0: {
        width: 5,
      },
      1: {
        width: 38,
      },
    },
    border: getBorderCharacters("void"),
    columnDefault: {
      // TODO get these from api / our custom hook
      paddingLeft: 0,
      paddingRight: 1,
    },

    drawHorizontalLine: () => {
      return false;
    },
  };
  const output = table(data, options);
  return output;
};
const generateOrderDetails = (order) => {
  const orderDetailsTable = [
    ["Order No.", order.orderNumber || 'SP-34234'],
    ["Order Date", order.createdAt|| '20-Feb-2021'],
    ["Order Status", order.status || 'In Progress'],
    ["Order Type", order.orderType.name],
    [
      "Table No.",
      order.tables.length > 0
        ? order.tables.map((table) => table.name).join(",")
        : undefined,
    ],
    ["Served By", order.createdBy.name || 'Minion'],
  ];

  // page size = 80
  // max no of chars allowed = 37
  // 37-13

  const options = {
    columns: {
      0: {
        width: 12,
      },
      1: {
        alignment: "right",
        width: 31,
      },
    },
    border: getBorderCharacters("void"),
    columnDefault: {
      // TODO get these from api / our custom hook
      paddingLeft: 0,
      paddingRight: 1,
    },
    drawHorizontalLine: () => {
      return false;
    },
  };

  const output = table(orderDetailsTable, options);

  console.log(output)
  return output;
};
const test = async () => {
  try {
    const template = `<?xml version="1.0" encoding="UTF-8"?>
    <document>
        <align mode="center">
    
            <!-- Organization logo -->
            <line-feed />
            <!--<image density="d24">
                {{{orgLogo}}}
                </image> -->
    
            <!-- store name -->
    
            <align mode="center">
                <bold>
                    <text-line size="1:0">{{storeName}}</text-line>
                </bold>
            </align>
            <line-feed />
    
            <!-- Store details -->
            <align mode="center">
                <small>
                    <text-line>{{storeNo}}</text-line>
                    <text-line>{{storeAddress}}</text-line>
                    <text-line>{{storePhone}}</text-line>
                </small>
            </align>
            <line-feed />
            <align mode="center">
    
                <text-line>{{{myDivider}}}</text-line>
            </align>
            <line-feed />
    
            <!-- Order details -->
            <align mode="center">
                <text-line size="0:0">{{orderDetails}}</text-line>
            </align>
    
            <line-feed />
            <align mode="center">
    
                <text-line>{{{myDivider}}}</text-line>
            </align>
            <line-feed />
    
            <!-- Order items -->
            <align mode="center">
                <text-line size="0:0">{{orderItems}}</text-line>
            </align>
    
            <line-feed />
            <align mode="center">
    
                <text-line>{{{myDivider}}}</text-line>
            </align>
            <line-feed />
    
        </align>
        <line-feed />
    
        <!-- <paper-cut /> -->
    </document>
    `;

    const order = {
      subTotal: "20",
      discountAmount: "2",
      taxes: [],
      tip: 1,
      amountDue: 12,
      orderType: { name: "Takeaway" },
      tables: [],
      createdBy: "Minions",
    };

    const customer = {
      customerName: "Gru Illumination",
      customerPhone: "+61 234234234",
      customerAddress: "123 flora street Melbourne, AU",
    };

    const data = {
      storeName: "Park Haytt",
      storeNo: "ABN-223",
      storeAddress: "Melbourne",
      storePhone: "78325742",
      orderDetails: generateOrderDetails(order),
      orderItems: generateOrderItems(order),
      ...customer,
      thankyouNote: "Thank you for shopping at Park",
      promotionalText: "For happy hours, please visit park.com",
      myDivider: Array.from({ length: 40 })
        .map((_, i) => "_")
        .join(""),
    };
    const buffer = EscPos.getBufferFromTemplate(template, data);
    // await Network.NetworkPrint(buffer, PRINTERS[0]);
    // await Network.DgramPrint(buffer, PRINTERS[0]);
    console.log("receipt was sent to printer!");
  } catch (err) {
    console.log("error", err);
    console.error({
      message: "some error",
      err: JSON.stringify(err, null, 2),
    });
  }
};

test();
