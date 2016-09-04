/*
 * Balances.js - View
 * 
 * Display balances list and token info on tablet
 */

Ext.define('FW.view.tablet.Balances', {
    extend: 'Ext.Container',

    config: {
        layout: 'hbox',
        items: [{
            xtype: 'fw-balanceslist',
            width: 320
        },{
            flex: 1,
            xtype: 'container',
            layout: 'card',
            itemId: 'balances',
            cls: 'fw-panel fw-panel-separator',
            items: [{
                // Define placeholder to display before we have any currency selected
                xtype: 'container',
                itemId: 'placeholder',
                scrollable: 'vertical',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'top'
                },
                items:[{
                    xtype: 'fw-toptoolbar',
                    menu: true
                },{
                    margin: '10 0 0 0',
                    html:'<center><img src="resources/images/logo.png" width="90%" style="max-width:350px;"></center>'
                },{
                    margin: '10 0 0 0',
                    cls: 'fw-currencyinfo-instructions',
                    html:'<center>Please select an item<br/>from the list on the left</center>'
                }]
            },{
                xtype: 'fw-tokeninfo',
                flex: 1
            }]
        }]
    }

});
