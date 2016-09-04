/*
 * Balances.js - View
 * 
 * Display balances list
 */

Ext.define('FW.view.Balances', {
    extend: 'Ext.Container',

    requires:[
        'FW.view.phone.Balances',
        'FW.view.tablet.Balances'
    ],

    config: {
        id: 'balancesView',
        layout: 'card',
        items:[]
    },


    initialize: function(){
        var me = this;
        // Setup alias to main controller
        me.main  = FW.app.getController('Main');
        // Add view based on device type
        me.add({ xclass:'FW.view.' + me.main.deviceType + '.Balances' });
        // Setup some aliases to the various components
        me.list  = me.down('fw-balanceslist');
        me.info  = me.down('fw-tokeninfo');
        me.cards = me.down('[itemId=balances]');
        // Call parent function
        me.callParent();
    },

    // Handle displaying the token information
    showTokenInfo: function(data){
        var me = this;
        var cfg = {
            html:'stuff here',
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
