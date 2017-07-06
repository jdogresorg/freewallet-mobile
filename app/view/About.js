/*
 * About.js - View
 * 
 * Displaying information about the wallet, website, developers, etc.
 */

 Ext.define('FW.view.About', {
    extend: 'Ext.Container',

    config: {
        id: 'aboutView',
        layout: 'vbox',
        scrollable: 'vertical',
        cls: 'fw-panel',
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'About',
            menu: true
        },{
            xtype: 'container',
            margin: '0 5 0 5',
            items:[{
                xtype: 'image',
                src: 'resources/images/logo.png',
                height: '120px',
                margin: '10 0 10 0'
            },{
                xtype: 'container',
                margin: '10 0 5 0',
                html:'<p align="justify">FreeWallet is a free open-source mobile wallet which supports Bitcoin and tokens. FreeWallet uses public APIs available from blocktrail.com, blockr.io, coindaddy.io, chain.so, and xchain.io.</p>'
            },{
                margin: '10 0 0 0',
                html:'<p align="justify"><b>Send a donation to support FreeWallet hosting and development.</b></p>' + 
                     '<p align="justify">FreeWallet is non-profit, self-funded, open source and community supported project. We appreciate any donations, and all donations go directly towards supporting future development.</p>'
            },{
                xtype: 'button',
                text: 'Make a Donation to FreeWallet',
                iconCls: 'fa fa-btc',
                itemId: 'donate',
                ui: 'confirm',
                margin: '5 0 0 0',
                handler: function(){
                    var me = Ext.getCmp('aboutView');
                    me.main.showTool('send', {
                        reset: true,
                        currency: 'BTC',
                        address: '17AXerXeWPMg5xiZ4XiC8QWS93aePuEzNr'
                    });
                }
            },{
                xtype: 'container',
                layout: 'hbox',
                margin: '5 0 5 0',
                defaults: {
                    xtype: 'button',
                    ui: 'action',
                    flex: 1
                },
                items:[{
                    iconCls: 'fa fa-github',
                    text: 'Source Code',
                    handler: function(){
                        var me = Ext.getCmp('aboutView');
                        me.main.openUrl('http://github.com/jdogresorg/FreeWallet');
                    }
                },{
                    iconCls: 'fa fa-info-circle',
                    text: 'FreeWallet.io',
                    margin: '0 0 0 5',
                    handler: function(){
                        var me = Ext.getCmp('aboutView');
                        me.main.openUrl('http://freewallet.io');
                    }
                }]
            }]
        }]
    },

    initialize: function(){
        var me = this;
        // Setup alias to main controller
        me.main = FW.app.getController('Main');
        me.donate = me.down('[itemId=donate]');


    }


});
