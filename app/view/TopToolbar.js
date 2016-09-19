/*
 * TopToolbar.js - View
 *
 * Define a top toolbar which is used by most views
 */

Ext.define('FW.view.TopToolbar', {
    // extend container instead of toolbar to fix sencha touch scrollbar issue (iOS native)
    // extend: 'Ext.Toolbar',
    extend: 'Ext.Container',
    xtype: 'fw-toptoolbar',
    
    config: {
        layout: 'fit',
        docked: 'top',
        height: 37,
        items:[{
            xtype: 'toolbar',
            ui: 'dark',
            height: 37,
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
        }]

    },

    // Called when the view first initializes
    initialize: function(){
        var me  = this,
            cfg = me.config;
        // Setup some aliases for simple button hide/show later
        me.vp         = Ext.Viewport;
        me.tb         = me.down('toolbar');
        me.backBtn    = me.down('[itemId=backButton]');
        me.menuBtn    = me.down('[itemId=menuButton]');
        me.refreshBtn = me.down('[itemId=refreshButton]');
        me.plusBtn    = me.down('[itemId=plusButton]');
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
        if(cfg.title)
            me.tb.setTitle(cfg.title);
    }

});
