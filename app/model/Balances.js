/*
 * Balances.js - Model
 */
Ext.define('FW.model.Balances', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',       type: 'string'},  // Unique id Address-PREFIX-CURRENCY
            {name: 'prefix',   type: 'string'},  // address prefix
            {name: 'type',     type: 'integer'}, // Address Type (1=Currency, 2=Asset)
            {name: 'currency', type: 'string'},  // Currency (BTC, XCP, A1234567890, BACON)
            {name: 'amount',   type: 'string'}   // Currency Amount (1,234.12345678)
        ],
        idProperty: 'id',
        proxy: {
            type: 'localstorage',
            id: 'Balances'
        }        
    }
});
