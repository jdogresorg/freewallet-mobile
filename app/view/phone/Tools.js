/*
 * Tools.js - View
 * 
 * Display list of tools on phone
 */

Ext.define('FW.view.phone.Tools', {
    extend: 'Ext.Container',

    config: {
        itemId: 'tools',
        layout: 'card',
        items: [{
            xtype: 'fw-toolslist'
        },{
            xtype: 'fw-tokeninfo'
        }]
    }

});
