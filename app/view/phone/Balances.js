/*
 * Balances.js - View
 * 
 * Display balances list and token info on phone
 */
Ext.define('FW.view.phone.Balances', {
    extend: 'Ext.Container',

    config: {
        itemId: 'balances',
        layout: 'card',
        items: [{
            xtype: 'fw-balanceslist'
        },{
            xtype: 'fw-tokeninfo'
        }]
    }

});
