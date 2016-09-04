/*
 * Dividened.js - View 
 *
 * Handles displaying dividend form
 */

Ext.define('FW.view.Dividend', {
    extend: 'Ext.Container',
    
    config: {
        id: 'dividendView',
        layout: 'vbox',
        scrollable: 'vertical',
        cls: 'fw-panel',
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'Pay Dividend',
            menu: true
        },{
            xtype: 'container',
            layout: 'vbox',
            margin: '5 5 5 5',
            items:[{
                margin: '10 0 0 0',
                html:'<center><img src="resources/images/logo.png" width="90%" style="max-width:350px;"></center>'
            },{
                margin: '10 0 0 0',
                cls: 'fw-placeholder-instructions',
                html:'<center>Coming Soon</center>'
            }]
        }]
    },
    
    // Handle initializing the screen
    initialize: function(){
        var me  = this,
            cfg = me.config;
        // Setup alias to main controller
        me.main = FW.app.getController('Main');
        me.tb   = me.down('fw-toptoolbar');
        // Call parent
        me.callParent();
    },

    // Handle updating the view with passed config info
    updateView: function(cfg){
        var me = this;
        // Back button
        if(cfg.back){
            me.tb.backBtn.show();
            if(typeof cfg.back === 'function')
                me.tb.onBack = cfg.back;
        } else {
            me.tb.backBtn.hide();
        }
    }

});