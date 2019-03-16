/*
 * FW.view.PrivateKey.js - View 
 *
 * Handle displaying a address private key
 */

Ext.define('FW.view.PrivateKey', {
    extend: 'Ext.Panel',
    xtype: 'fw-privatekey',

    config: {
        id: 'privateKeyView',
        cls: 'no-rounded-edges',
        modal: true,
        hideOnMaskTap: false,
        centered: true,
        width: '80%',
        // height: (device=='phone') ? '70%' : 400,
        items: [{
            docked: 'top',
            cls: 'fw-panel',
            xtype: 'toolbar',
            title: 'Your private key'
        },{
            // styleHtmlContent: true,
            xtype: 'container',
            layout: 'vbox',
            cls: 'fw-panel',
            margin: '5 5 5 5',
            flex: 1,
            items:[{
                itemId: 'privkey',
                tpl:'<div id="address-privkey" class="wallet-privkey">{privkey}</div>'
            },{
                html:'<hr size=1><p align="justify">Write your private key down and keep it safe.</p>'
            },{
                margin: '10 0 0 0',
                html:'<p align="justify">This private key lets you access your wallet address and the funds it contains.</p>'
            },{
                margin: '10 0 0 0',
                html:'<p align="justify">If someone gets your private key, they gain access to your wallet.</p>'
            }]
        },{
            docked: 'bottom',
            xtype: 'toolbar',
            ui: 'light',
            defaults: {
                xtype: 'button',
                flex: 1
            },
            items:[{
                text: 'Copy',
                iconCls: 'fa fa-copy margin-bottom-4',
                ui: 'action',
                cls: 'x-copy-button',
                listeners: {
                    // Setup listener on copy button element to copy text to clipboard
                    painted: function(cmp){
                        var me = Ext.getCmp('privateKeyView');
                        if(me.main.isNative==false){
                            var clipboard = new Clipboard('.x-copy-button', {
                                text: function(e){
                                    return document.querySelector('.wallet-privkey').innerText;
                                }
                            });
                        }
                    },
                    // Handle copying text to clipboard when user taps button
                    tap: function(cmp){
                        var me  = Ext.getCmp('privateKeyView'),
                            str = me.main.getPrivateKey(FW.WALLET_NETWORK, FW.WALLET_ADDRESS.address);
                        me.main.copyToClipboard(str);
                    }
                }
            },{
                text: 'OK',
                iconCls: 'fa fa-thumbs-up margin-bottom-4',
                ui: 'confirm',
                handler: function(){
                    var me = Ext.getCmp('privateKeyView');
                    me.hide();
                    me.main.showMainView();
                }
            }]
        }]
    },


    initialize: function(){
        var me  = this,
            cfg = me.config;
        me.main = FW.app.getController('Main');
        // Adjust the box to be wider for tablets
        var w  = (me.main.deviceType=='tablet') ? 400 : '90%'
        me.setWidth(w);
        me.privkey = me.down('[itemId=privkey]');
        me.callParent();
        me.updateView(cfg);
    },


    updateView: function(cfg){
        var me = this;
        if(cfg.privkey)
            me.privkey.setData({ privkey: cfg.privkey });
    },







});