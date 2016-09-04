/*
 * TopToolbar.js - View
 *
 * Define a top toolbar which is used by most views
 */

Ext.define('FW.view.TopToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'fw-toptoolbar',
    
    config: {
        docked: 'top',
        ui: 'dark',
        height: 35,
        defaults: {
            xtype: 'button',
            ui: 'plain'
        },
        items: [{
            iconCls: 'back',
            itemId: 'backButton',
            hidden: true,
            handler: function(cmp){
                var me = cmp.up('fw-toptoolbar');
                if(typeof me.onBack === 'function')
                    me.onBack();
            }
        },{
            iconCls: 'fa fa-refresh',
            itemId: 'refreshButton',
            hidden: true,
            handler: function(cmp){
                var me = cmp.up('fw-toptoolbar');
                if(typeof me.onRefresh === 'function')
                    me.onRefresh();
            }
        },{
            xtype:'spacer'
        },{
            iconMask: true,
            iconCls: 'fa fa-plus',
            itemId: 'plusButton',
            hidden: true,
            handler: function(cmp){
                var me = cmp.up('fw-toptoolbar');
                if(typeof me.onPlus === 'function')
                    me.onPlus();
            }
        },{
            iconMask: true,
            iconCls: 'fa fa-list',
            itemId: 'menuButton',
            hidden: true,
            handler: function(cmp){
                FW.app.getController('Main').showMainMenu();
            }
        }]
    },

    // Called when the view first initializes
    initialize: function(){
        var me  = this,
            cfg = me.config;
        // Setup some aliases for simple button hide/show later
        me.vp         = Ext.Viewport;
        me.backBtn    = me.getComponent('backButton');
        me.menuBtn    = me.getComponent('menuButton');
        me.refreshBtn = me.getComponent('refreshButton');
        me.plusBtn    = me.getComponent('plusButton');
        if(cfg.back)
            me.backBtn.show();
        if(cfg.onBack)
            me.onBack = cfg.onBack;
        if(cfg.menu)
            me.menuBtn.show();
        if(cfg.refresh)
            me.refreshBtn.show();
        if(cfg.onRefresh)
            me.onRefresh = cfg.onRefresh;
        if(cfg.plus)
            me.plusBtn.show();
        if(cfg.onPlus)
            me.onPlus = cfg.onPlus;
    }

});
