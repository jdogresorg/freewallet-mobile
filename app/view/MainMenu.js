/*
 * MainMenu.js - View
 * 
 * Handles displaying currency balances
 */

Ext.define('FW.view.MainMenu', {
    extend: 'Ext.Menu',
    xtype: 'fw-mainmenu',

    config: {
        layout: 'fit',
        width: 211,
        cls: 'fw-panel fw-mainmenu',
        items:[{
            title: 'FreeWallet',
            xtype: 'toolbar',
            height: 37,
            border: 0,
            docked: 'top',
            defaults: {
                ui: 'plain',
                iconMask: true
            },
            items:[{
                xtype: 'spacer'
            },{
                iconCls: 'fa fa-list',
                handler: function(){
                    Ext.Viewport.hideMenu('right');
                }
            }]
        },{ 
            xtype: 'fw-menutree'
        }],
        // Define the menuitems we want in the data store
        storeData: [{
            text: 'Change Wallet Address', 
            icon: 'fa-edit', 
            leaf: true,
            handler: function(){
                FW.app.getController('Main').showAddressListView();
            }
        },{
            text: 'View Wallet Address', 
            icon: 'fa-bitcoin', 
            leaf: true,
            handler: function(){
                FW.app.getController('Main').showQRCodeView({ text: FW.WALLET_ADDRESS.address });
            }
        },{
            text: 'Scan QR Code', 
            icon: 'fa-qrcode', 
            leaf: true,
            handler: function(){
                FW.app.getController('Main').generalQRCodeScan();
            }
        },{
            text: 'Send',
            icon: 'fa-paper-plane',
            leaf: true,
            handler: function(){
                FW.app.getController('Main').showTool('send',{ reset: true });
            }
        },{
            text: 'Receive',
            icon: 'fa-smile-o',
            leaf: true,
            handler: function(){
                FW.app.getController('Main').showTool('receive',{ reset: true });
            }
        },{
            text: 'Issue Token',
            icon: 'fa-bank',
            leaf: true,
            handler: function(){
                FW.app.getController('Main').showTool('issue',{ reset: true });
            }
        },{
            text: 'Broadcast Message',
            icon: 'fa-bullhorn',
            leaf: true,
            handler: function(){
                FW.app.getController('Main').showTool('broadcast',{ reset: true });
            }
        },{
            text: 'Sign Message',
            icon: 'fa-edit',
            leaf: true,
            handler: function(){
                FW.app.getController('Main').showTool('sign',{ reset: true });
            }
        },{
            text: 'Decentralized Exchange',
            icon: 'fa-exchange',
            leaf: true,
            handler: function(){
                FW.app.getController('Main').showTool('exchange',{ reset: true });
            }
        }]
    },


    initialize: function(){
        var me  = this,
            cfg = me.config
        // Setup alias to main controller
        me.main     = FW.app.getController('Main');
        me.menutree = me.down('fw-menutree');
        // Define the data store
        var store = Ext.create('Ext.data.TreeStore', {
            model: 'FW.model.MenuTree',
            defaultRootProperty: 'items',
            root: {
                items: cfg.storeData
            }
        });
        me.menutree.setStore(store);
        me.menutree.doAllExpand();
        // Call parent function
        me.callParent();
    }

});
