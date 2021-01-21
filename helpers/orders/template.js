const ORDER_ITEMS = `
<?xml version="1.0" encoding="UTF-8"?>
<document>
    <line-feed />
    <align mode="center">
        <bold>
            <text-line size="1:0">{{header}}</text-line>
        </bold>
        <line-feed />
        <text-line size="0:0">{{add1}}</text-line>
        <text-line size="0:0">{{add2}}</text-line>
        <text-line size="0:0">{{add3}}</text-line>
        <text-line size="0:0">{{tel1}}</text-line>
    </align>
    <line-feed />
    <bold>
        <text-line size="1:0">CUSTOMER</text-line>
    </bold>
    <break-line lines="2" />
    <text-line size="0:0">{{customer}}</text-line>
    {{# showDelivery}}
    <text-line size="0:0">{{custAdd1}}</text-line>
    <text-line size="0:0">{{custAdd2}}</text-line>
    {{/showDelivery}}
    <text-line size="0:0">{{tel2}}</text-line>
    <line-feed />
    <bold>
        <text-line size="1:0">Payment Method</text-line>
    </bold>
    <break-line lines="2" />
    <text-line size="0:0">{{paymentMethod}}</text-line>
    <line-feed />
    <bold>
        <text-line size="1:0">Order Date</text-line>
    </bold>
    <break-line lines="2" />
    <text-line size="0:0">{{orderDate}}</text-line>
    {{#isFutureDate}}
    <line-feed />
    <bold>
        <text-line size="1:0">Future Order</text-line>
    </bold>
    <break-line lines="2" />
    <text-line size="0:0">{{futureDate}}</text-line>
    {{/isFutureDate}}
    <line-feed />
    <align mode="left">
        <text-line size="0:0">{{table}}</text-line>
    </align>
    <line-feed />
    <text-line size="0:0">{{pricesOutput}}</text-line>
    <line-feed />

    <!-- trying to print horizontal line -->

    <small>
        <text-line size="1:0">---------------------</text-line>
        <text-line size="1:0">523-670-643</text-line>
        <text-line size="1:0">---------------------</text-line>
    </small>


    <line-feed />

    <!-- font size -->

    <bold>
        <text-line size="0:0">Oranges     R$30 </text-line>
        <text-line size="0.5:0">Oranges     R$30 </text-line>
        <text-line size="0:0.5">Oranges     R$30 </text-line>
        <text-line size="0.5:0.5">Oranges     R$30 </text-line>
        <text-line size="0:1">Oranges     R$30 </text-line>
        <text-line size="1:0">Oranges     R$30 </text-line>
        <text-line size="1:1">Oranges     R$30 </text-line>
        <text-line size="2:1">Oranges     R$30 </text-line>
        <text-line size="1:2">Oranges     R$30 </text-line>
        <text-line size="5:2">Oranges     R$30 </text-line>
        <text-line size="1:6">Oranges     R$30 </text-line>
    </bold>
    <line-feed />


    <line-feed />
</document>
`;

module.exports = {ORDER_ITEMS}