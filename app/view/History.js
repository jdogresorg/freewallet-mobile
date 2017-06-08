/*
 * History.js - View
 * 
 * Handles displaying transaction history
 */

Ext.define('FW.view.History', {
    extend: 'Ext.Container',

    requires:[
        'FW.view.phone.History',
        'FW.view.tablet.History'
    ],

    config: {
        id: 'historyView',
        layout: 'card',
        items:[]
    },


    initialize: function(){
        var me = this;
        // Setup alias to main controller
        me.main  = FW.app.getController('Main');
        // Add view based on device type
        me.add({ xclass:'FW.view.' + me.main.deviceType + '.History' });
        // Setup some aliases to the various components
        me.list  = me.down('fw-transactionslist');
        me.info  = me.down('fw-transactioninfo');
        me.cards = me.down('[itemId=history]');
        // Call parent function
        me.callParent();
    },


    // Handle displaying the currency information
    showTransactionInfo: function(data){
        var me = this;
        var cfg = {
            data: data
        };
        // Set some options for phones
        if(me.main.deviceType=='phone'){
            cfg.back = function(){
                me.cards.setActiveItem(0);
            }
        }
        // Set the currency info view as active
        me.cards.setActiveItem(1);
        // Handle updating the currency info view
        me.info.updateView(cfg);
    }

});