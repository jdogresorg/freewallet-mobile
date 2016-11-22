/*
 * Sign.js - View 
 *
 * Handle displaying sign message view
 */
 
Ext.define('FW.view.Sign', {
    extend: 'Ext.form.Panel',
    
    config: {
        id: 'signView',
        layout: 'vbox',
        scrollable: 'vertical',
        cls: 'fw-panel',
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'Sign Message',
            menu: true
        },{
            xtype: 'container',
            layout: 'vbox',
            margin: '5 5 5 5',
            cls: 'no-label-ellipsis',
            items:[{
                xtype: 'fieldset',
                margin: '0 0 0 0',
                defaults: {
                    xtype:'textfield',
                    labelWidth: 70
                },
                items:[{
                    xtype: 'textareafield',
                    label: 'Message',
                    name: 'message',
                    maxRows: 12,
                    listeners: {
                        // Reset signature on any change to message
                        keyup: function(){
                            var me = Ext.getCmp('signView');
                            if(me.isSigned){
                                me.signature.setValue();
                                me.isSigned = false;
                            }
                        }
                    }
                // },{
                //     readOnly: true,
                //     label: 'Address',
                //     name: 'address',
                },{
                    readOnly: true,
                    xtype: 'textareafield',
                    maxrows: 3,
                    label: 'Signature',
                    name: 'signature'
                }]                
            },{
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    margin: '5 0 0 0',
                    xtype: 'button',
                    flex: 1
                },
                items: [{
                    text: 'Sign',
                    itemId: 'sign',
                    iconCls: 'fa fa-edit',
                    ui: 'confirm',
                    handler: function(btn){
                        Ext.getCmp('signView').signMessage();
                    }
                },{
                    margin: '5 0 0 5',
                    text: 'Copy',
                    itemId: 'copy',
                    cls: 'x-copy-button', 
                    iconCls: 'fa fa-copy',
                    ui: 'action',
                    listeners: {
                        // Setup listener on copy button element to copy text to clipboard (non-native/web)
                        // DO NOT specify a handler on the buttons as it causes clipboard to not work properly
                        painted: function(cmp){
                            var me = Ext.getCmp('signView');
                            if(!me.main.isNative){
                                var clipboard = new Clipboard('.x-copy-button',{
                                    text: function(e){
                                        return me.getSignedMessage();
                                    }
                                });
                            }
                        },
                        // Handle copying text to clipboard when user taps button
                        tap: function(cmp){
                            var me  = Ext.getCmp('signView');
                            if(me.main.isNative)
                                me.main.copyToClipboard(me.getSignedMessage());
                        }
                    }
                }]
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
        // Setup aliases to the various fields
        // me.address   = me.down('[name=address]');
        me.message   = me.down('[name=message]');
        me.signature = me.down('[name=signature]');
        me.copyBtn   = me.down('button[itemId=copy]')
        me.signBtn   = me.down('button[itemId=sign]')
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
        // Handle resetting all fields back to default
        if(cfg.reset){
            // me.address.setValue(FW.WALLET_ADDRESS.address);
            me.message.setValue('');
            me.signature.setValue('');
            me.isSigned = false;
        }
        // Pre-populate message field if we have message
        if(cfg.message)
            me.message.setValue(cfg.message);
    },

    // Handle signing message and updating signature field
    signMessage: function(){
        var me   = this,
            addr = FW.WALLET_ADDRESS.address,
            mesg = me.message.getValue();
        if(!mesg){
            Ext.Msg.alert(null,'You must enter a message to sign');
        } else {
            var signature = me.main.signMessage(FW.WALLET_NETWORK, addr, mesg);
            me.signature.setValue(signature);
            me.isSigned = true;
        }
    },

    getSignedMessage: function(){
            var me  = this,
                txt = '';
        if(me.isSigned){
            txt += 'Message : ' + me.message.getValue() + "\n";
            txt += 'Address : ' + FW.WALLET_ADDRESS.address + "\n";
            txt += 'Signature : ' + me.signature.getValue() + "\n";
        }
        return txt;

    },

    // Handle copying message/address/signature to clipboard
    copyMessage: function(){
        var me  = this,
            txt = me.getSignedMessage();
        me.main.copyToClipboard(txt);
    }



});