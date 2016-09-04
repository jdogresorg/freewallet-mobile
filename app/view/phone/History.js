/*
 * History.js - View
 * 
 * Display transaction history info on phone
 */

Ext.define('FW.view.phone.History', {
    extend: 'Ext.Container',

    config: {
        itemId: 'history',
        layout: 'card',
        items: [{
            xtype: 'fw-transactionslist'
        },{
            xtype: 'fw-transactioninfo'
        }]
    }

});
