/*
 * MenuTree.js - Menu Tree
 *
 * Display a menu list with collapsible folders
 */

Ext.define('FW.view.MenuTree', {
    extend: 'FW.ux.AccordionList',
    xtype: 'fw-menutree',
    requires:[
        'Ext.data.TreeStore'
    ],

    config: {
        fullscreen: true,
        singleMode: false,
        headerCloseTpl: '<div class="fw-sidemenu header">' + 
                            '<div class="float-left fa {icon}" style="margin-right:5px;"></div>' +
                            '<div class="float-left overflow-hidden" style="width:160px;">{0}</div>' + 
                            '<div class="float-left right" style="margin-right:0px;left: 5px;"></div>' +
                        '</div>',
        headerOpenTpl: '<div class="fw-sidemenu header">' + 
                            '<div class="float-left fa {icon}" style="margin-right:5px;"></div>' +
                            '<div class="float-left overflow-hidden" style="width:160px;">{0}</div>' + 
                            '<div class="float-left down" style="margin-right:0px;"></div>' +
                        '</div>',
        contentItemTpl: '<div class="fw-sidemenu">' + 
                            '<div class="float-left fa {icon}" style="margin-right:5px;"></div>' +
                            '<div class="float-left overflow-hidden nowrap ellipsis height-1-3em" style="width:170px;">{0}</div>' + 
                        '</div>',
        listConfig: {
            itemHeight: 0,
            disableSelection: true
        }
    },

    // Called when the view first initializes
    initialize: function(){
        var me  = this,
            cfg = me.config;
        if(cfg.store)
            me.setStore(cfg.store);
        me.vp   = Ext.Viewport;
        me.main = FW.app.getController('Main');
        me.on('leafitemtap', me.onLeafItemTap, me);
        me.callParent();
    },

    // Handle processing taps on leaf items
    onLeafItemTap: function(list, index, target, rec, e){
        var me   = this,
            o    = rec.raw;
        // Handle hiding the 
        me.vp.toggleMenu('right');
        // Handle user specifying a custom function
        if(typeof o.handler == 'function'){
            o.handler();
        }
    }

});
