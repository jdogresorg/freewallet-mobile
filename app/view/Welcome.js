/*
 * Welcome.js - View 
 *
 * Welcome screen to help users get wallet setup
 */

Ext.define('FW.view.Welcome', {
    extend: 'Ext.Container',

    config: {
        id: 'welcomeView',
        layout: 'vbox',
        scrollable: true,
        cls: 'fw-panel',
        items:[{
            xtype: 'toolbar',
            docked: 'top',
            title: 'Welcome to'
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
                margin: '10 0 10 0',
                html:'<p align="justify">Please click a button below to indicate if you would like to generate a new wallet, or use an existing wallet passphrase.'
            },{
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    flex: 1
                },
                items:[{
                    iconCls: 'fa fa-spinner',
                    text: 'New Wallet',
                    ui: 'confirm',
                    handler: function(btn){
                        Ext.getCmp('welcomeView').createWallet();
                    }
                },{
                    iconCls: 'fa fa-keyboard-o margin-bottom-4',
                    text: 'Existing Wallet',
                    ui: 'action',
                    margin: '0 0 0 5',
                    handler: function(btn){
                        Ext.getCmp('welcomeView').existingWallet();
                    }
                }]
            },{
                xtype: 'container',
                margin: '10 0 10 0',
                html:'<p align="justify">You should only have to complete this wallet setup process once, after which your wallet is encrypted and saved to your device or browser.</p>'
            },{
                xtype: 'container',
                margin: '10 0 10 0',
                itemId: 'spinner',
                hidden: true,
                html:'<center><i class="fa fa-5x fa-spin fa-spinner"></i><div style="font-weight: bold;margin-top: 10px;">Generating Wallet...</div></center>'
            }]
        }]
    },


    initialize: function(){
        var me = this;
        me.main = FW.app.getController('Main');
        me.spinner = me.down('[itemId=spinner]')
        me.callParent();
    },


    // Handle creating a wallet, and displaying it to the user
    createWallet: function(phrase){
        var me = this;
        if(me.loadingWallet)
            return;
        me.loadingWallet = true;
        me.spinner.show();
        // Define callback to process response from generateWallet()
        var cb = function(p){
            // If a passphrase was specified, then just load the wallet
            if(phrase){
                me.loadingWallet = false;
                me.main.showMainView();
            } else {
                me.main.showPassphraseView({ phrase:p });
            }
            me.spinner.hide();
        }
        // Defer by 1/2 a second to allow screen to update and show spinner
        Ext.defer(function(){
            me.main.generateWallet(phrase, cb);
        },500)
    },


    // Handle setting up existing wallet using passphrase
    existingWallet: function(){
        var me = this;
        // Define callback to process response from promptWalletPassphrase()
        var cb = function(phrase){
            me.createWallet(phrase);
        }
        me.main.promptWalletPassphrase(cb);

    }

});


