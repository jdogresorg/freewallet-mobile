/*
 * Transactions.js - Model
 */
Ext.define('FW.model.Transactions', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',       type: 'string'},  // Unique id Transaction-TXPREFIX
            {name: 'prefix',   type: 'string'},  // address prefix
            {name: 'type',     type: 'integer'}, // Transaction Type (1=Send, 2=Broadcast, 3=Issuance)
            {name: 'hash',     type: 'string'},  // Transaction Hash
            {name: 'currency', type: 'string'},  // Currency (BTC, XCP, A1234567890, BACON)
            {name: 'amount',   type: 'string'},  // Currency Amount (1,234.12345678)
            {name: 'time',     type: 'string'}   // Transaction time
        ],
        idProperty: 'id'
        // proxy: {
        //     type: 'localstorage',
        //     id: 'Transactions',
        // }
    }
});
