/*
 * FW.view.Passphrase.js - View 
 *
 * Handle displaying a users wallet passphrase
 */

Ext.define('FW.view.Passphrase', {
    extend: 'Ext.Panel',
    xtype: 'fw-passphrase',

    config: {
        id: 'passphraseView',
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
            title: 'Your Wallet Passphrase is'
        },{
            // styleHtmlContent: true,
            xtype: 'container',
            layout: 'vbox',
            cls: 'fw-panel',
            margin: '5 5 5 5',
            flex: 1,
            items:[{
                itemId: 'passphrase',
                tpl:'<div id="wallet-passphrase" class="wallet-passphrase">{phrase}</div>'
            },{
                html:'<hr size=1><p align="justify">Write your passphrase down and keep it safe.</p>'
            },{
                margin: '10 0 0 0',
                html:'<p align="justify">This passphrase lets you access your wallet and the funds it contains.</p>'
            },{
                margin: '10 0 0 0',
                html:'<p align="justify">If you lose this passphrase, you will lose access to your wallet forever.</p>'
            },{
                margin: '10 0 0 0',
                html:'<p align="justify">If someone gets your passphrase, they gain access to your wallet.</p>'
            },{
                margin: '10 0 0 0',
                html:'<p align="justify">We do not store your passphrase and cannot recover it if lost.</p>'
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
                        var me = Ext.getCmp('passphraseView');
                        if(me.main.isNative==false){
                            var clipboard = new Clipboard('.x-copy-button', {
                                text: function(e){
                                    return document.querySelector('.wallet-passphrase').innerText;
                                }
                            });
                        }
                    },
                    // Handle copying text to clipboard when user taps button
                    tap: function(cmp){
                        var me  = Ext.getCmp('passphraseView'),
                            str = me.getPassphase();
                        me.main.copyToClipboard(str);
                    }
                }
            },{
                text: 'OK',
                iconCls: 'fa fa-thumbs-up margin-bottom-4',
                ui: 'confirm',
                handler: function(){
                    var me = Ext.getCmp('passphraseView');
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
        me.passphrase = me.down('[itemId=passphrase]');
        me.callParent();
        me.updateView(cfg);
    },


    updateView: function(cfg){
        var me = this;
        if(cfg.phrase)
            me.passphrase.setData({ phrase: cfg.phrase });
    },

    getPassphase: function(){
        var me = this;
        return me.passphrase.getData().phrase;        
    }





});