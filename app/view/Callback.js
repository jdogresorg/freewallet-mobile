/*
 * FW.view.Callback.js - View 
 *
 * Handle confirming callback details with user and making callback
 */

Ext.define('FW.view.Callback', {
    extend: 'Ext.Panel',
    xtype: 'fw-callback',

    config: {
        id: 'callbackView',
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
            title: 'Send data to remote server?'
        },{
            xtype: 'container',
            cls: 'fw-panel',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            margin: '5 5 5 5',
            items:[{
                xtype: 'image',
                itemId: 'icon',
                width: 48,
                height: 48,
                margin: '0 10 0 5'
            },{
                itemId: 'hostinfo',
                tpl: new Ext.XTemplate('<div style="display:inline-block; margin-top:5px;">' +
                            '<div class="fw-callback-hostname nowrap">{[this.getHostname(values)]}</div>' +
                            '<div class="fw-callback-protocol {[this.getColor(values)]}">{[this.getProtocol(values)]}</div>' +
                        '</div>',{
                    getHostname: function(values){
                        return values.url.replace(/^(http|https):\/\//,'').split('/')[0];
                    },
                    getProtocol: function(values){
                        var str = 'HTTP (Not Encrypted)';
                        if(/^https:/.test(values.url))
                            str = 'HTTPS/SSL (Encrypted)';
                        return str;
                    },
                    getColor: function(values){
                        if(/^https:/.test(values.url))
                            return 'green';
                        return 'red';
                    }
                })
            }]
        },{
            xtype: 'fieldset',
            layout: 'vbox',
            cls: 'fw-panel no-rounded-edges',
            margin: '0 0 0 0',
            defaults: {
                xtype: 'textfield',
                readOnly: true,
                labelWidth: 70
            },
            items:[{
                label: 'Message',
                name: 'message'
            },{
                label: 'Address',
                name: 'address'
            },{
                label: 'Signature',
                name: 'signature'
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
                text: 'Yes',
                iconCls: 'fa fa-thumbs-up margin-bottom-4',
                ui: 'confirm',
                handler: function(btn){
                    var me  = Ext.getCmp('callbackView'),
                        cfg = me.lastConfig;
                    me.hide();
                    var params = {
                        address: cfg.address,
                        message: cfg.message,
                        signature: cfg.signature
                    };
                    // Send callback to server, we don't care if it succeeds or fails
                    me.main.serverCallback(cfg.callback, params, 'POST');
                }
            },{
                text: 'No',
                iconCls: 'fa fa-thumbs-down margin-bottom-4',
                ui: 'decline',
                handler: function(btn){
                    Ext.getCmp('callbackView').hide();
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
        // Setup aliases to various components/fields
        me.icon       = me.down('[itemId=icon]');
        me.hostinfo   = me.down('[itemId=hostinfo]');
        me.address    = me.down('[name=address]');
        me.message    = me.down('[name=message]');
        me.signature  = me.down('[name=signature]');
        me.callParent();
        me.updateView(cfg);
    },


    updateView: function(cfg){
        var me = this;
        me.lastConfig = cfg;
        if(cfg.message)
            me.message.setValue(cfg.message);
        if(cfg.address)
            me.address.setValue(cfg.address);
        if(cfg.signature)
            me.signature.setValue(cfg.signature);
        if(cfg.callback)
            me.hostinfo.setData({ url: cfg.callback });
        if(cfg.icon){
            me.icon.setSrc(cfg.icon);
            me.icon.show();
        } else {
            me.icon.hide();
        }
    }

});