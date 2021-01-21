const IMG_TEMPLATE = `
<?xml version="1.0" encoding="UTF-8"?>
<document>
    <align mode="center">
        <bold>
            <text-line size="1:0">{{title}}</text-line>
        </bold>

        
        <image density="d24">
        {{imgData}}
        </image>
        </align>
        
        <break-line lines="5" />
    </document>
`;

module.exports = {
    IMG_TEMPLATE
}