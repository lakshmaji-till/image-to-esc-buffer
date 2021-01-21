const RECEIPT = `<?xml version="1.0" encoding="UTF-8"?>
<document>
    <line-feed />
    <text-line>Preview:Receipt</text-line>
    <line-feed />
    <underline />
    <line-feed />


    <align mode="center">
        <bold>
            <text-line size="1:1">{{title}}</text-line>
        </bold>
        <line-feed />
        <small>
            <text-line>{{storeNo}}</text-line>
            <line-feed />

            <text-line>{{address}}</text-line>
            <line-feed />

            <text-line>{{storePhone}}</text-line>
            <line-feed />

        </small>
    </align>

    <underline mode="one-point" />

    <align mode="center">

        <text-line>{{orderDetails}}</text-line>
    </align>

    <underline mode="two-point" />

    <align mode="center">

        <text-line>{{orderItems}}</text-line>


        <text-line>{{orderItems}}</text-line>

        <text-line>{{paymentDetails}}</text-line>

    </align>


    <underline mode="two-point" />


    <line-feed />
    <small>
        <align mode="center">
            <text-line>Customer</text-line>
            <line-feed />
            <text-line size="0:1">{{customerName}}</text-line>
            <line-feed />

            <text-line>{{customerPhone}}</text-line>
            <line-feed />
        </align>
    </small>
    <underline mode="two-point" />


    <line-feed />
    <small>
        <align mode="center">
            <text-line>  {{note1}} </text-line>
        </align>
    </small>
    <line-feed />

    <underline mode="two-point">
        <text>hello</text>
    </underline>

    <break-line />
    <line-feed />
    <small>
        <align mode="center">
            <text-line>  {{note2}} </text-line>
        </align>
    </small>
    <line-feed />
</document>
`;

module.exports = {RECEIPT}