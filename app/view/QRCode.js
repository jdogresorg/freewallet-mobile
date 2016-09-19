/*
 * FW.view.QRCode - View 
 *
 * Handle displaying a qrcode
 */

Ext.define('FW.view.QRCode', {
    extend: 'Ext.Panel',
    xtype: 'fw-qrcode',

    config: {
        id: 'qrcodeView',
        cls: 'no-rounded-edges',
        modal: true,
        hideOnMaskTap: false,
        centered: true,
        width: '300',
        items: [{
            // styleHtmlContent: true,
            xtype: 'container',
            layout: 'vbox',
            cls: 'fw-panel',
            margin: '5 5 5 5',
            flex: 1,
            items:[{
                html:'<div id="address-qrcode" class="qrcode"></div>'
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
                    // Setup listener on copy button element to copy text to clipboard (non-native/web)
                    // DO NOT specify a handler on the buttons as it causes clipboard to not work properly
                    painted: function(cmp){
                        var me = Ext.getCmp('qrcodeView');
                        if(!me.main.isNative){
                            var clipboard = new Clipboard('.x-copy-button', {
                                text: function(e){
                                    return me.text;
                                }
                            });
                        }
                    },
                    // Handle copying text to clipboard when user taps button (native)
                    tap: function(cmp){
                        var me  = Ext.getCmp('qrcodeView');
                        if(me.main.isNative)
                            me.main.copyToClipboard(me.text);
                    }
                }
            },{
                text: 'OK',
                iconCls: 'fa fa-thumbs-up margin-bottom-4',
                ui: 'confirm',
                handler: function(){
                    var me = Ext.getCmp('qrcodeView');
                    me.hide();
                    me.main.showMainView();
                }
            }]
        },{
            docked: 'bottom',
            xtype:'panel',
            itemId: 'address',
            cls: 'x-qrcode-text'
        }],
        listeners: {
            painted: function(cmp){
                Ext.getCmp('qrcodeView').showQRCode();
            }
        }
    },


    initialize: function(){
        var me  = this,
            cfg = me.config;
        me.main = FW.app.getController('Main');
        me.address = me.down('[itemId=address]');
        // Adjust the box to be wider for tablets
        me.callParent();
        me.updateView(cfg);
    },


    updateView: function(cfg){
        var me = this;
        if(cfg.text)
            me.text = cfg.text;
        me.address.setHtml(me.text);
    },


    // Handle displaying a QR code 
    showQRCode: function(){
        var me   = this,
            text = (me.text) ? me.text : FW.WALLET_ADDRESS.address;
        $('#address-qrcode > canvas').remove();
        $('#address-qrcode').qrcode({
            text: text,
            height: 250,
            width: 250
        });
        // // Display messagebox with QR code
        // Ext.Msg.show({
        //     hideOnMaskTap: true,
        //     message: '<div id="address-qrcode" class="qrcode"></div><div class="address-qrcode-text">' + FW.WALLET_ADDRESS.address + '</div>',
        //     buttons:[{
        //         text: 'Done',
        //         ui:'decline'
        //     }]
        // });
    }



});