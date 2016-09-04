/*
 * History.js - View
 * 
 * Display transaction history info on phone
 */

Ext.define('FW.view.tablet.History', {
    extend: 'Ext.Container',

    config: {
        layout: 'hbox',
        items: [{
            xtype: 'fw-transactionslist',
            width: 320
        },{
            flex: 1,
            xtype: 'container',
            layout: 'card',
            itemId: 'history',
            cls: 'fw-panel fw-panel-separator',
            items: [{
                // Define placeholder panel to display before we have any transaction selected
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
                    html:'<center>Please select a transaction<br/>from the list on the left</center>'
                }]
            },{
                xtype: 'fw-transactioninfo',
                flex: 1
            }]
        }]
    }

});

