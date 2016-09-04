/*
 * Tools.js - View
 * 
 * Display list of tools on tablet
 */

Ext.define('FW.view.tablet.Tools', {
    extend: 'Ext.Container',

    config: {
        layout: 'hbox',
        items: [{
            xtype: 'fw-toolslist',
            width: 320
        },{
            flex: 1,
            xtype: 'container',
            layout: 'card',
            cls: 'fw-panel-separator',
            itemId: 'tools',
            items:[{
                cls: 'fw-panel',
                scrollable: 'vertical',
                xtype: 'container',
                itemId: 'placeholder',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'top'
                },
                items:[{
                    xtype:'fw-toptoolbar',
                    menu: true
                },{
                    margin: '10 0 0 0',
                    html:'<center><img src="resources/images/logo.png" width="90%" style="max-width:350px;"></center>'
                },{
                    margin: '10 0 0 0',
                    cls: 'fw-currencyinfo-instructions',
                    html:'<center>Please select a tool<br/>from the list on the left</center>'
                }]
            }]
        }]
    }

});
