/*
 * Transactions.js - Model
 */
Ext.define('FW.model.Transactions', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',       type: 'string'},  // Unique id Transaction-TXPREFIX
            {name: 'prefix',   type: 'string'},  // address prefix
            {name: 'type',     type: 'string'},  // Transaction Type (Bet, Send, Issuance, etc)
            {name: 'hash',     type: 'string'},  // Transaction Hash
            {name: 'asset',    type: 'string'},  // Asset (BTC, XCP, A1234567890, BACON)
            {name: 'quantity', type: 'string'},  // Asset Quantity (1,234.12345678)
            {name: 'time',     type: 'string'}   // Transaction time
        ],
        idProperty: 'id'
    }
});
