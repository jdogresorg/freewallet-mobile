/*
 * Receive.js - View 
 *
 * Handle displaying a scannable QRCode
 */

Ext.define('FW.view.Receive', {
    extend: 'Ext.form.Panel',
    
    config: {
        id: 'receiveView',
        layout: 'vbox',
        scrollable: 'vertical',
        cls: 'fw-panel',
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'Recieve',
            menu: true
        },{
            xtype: 'container',
            layout: 'vbox',
            margin: '5 5 5 5',
            items:[{
                html:'<center><div id="receive-qrcode" class="qrcode" style="width:270px;height:270px"></div></center>'
            },{
                xtype: 'fieldset',
                margin: '5 0 0 0',
                defaults: {
                    xtype:'textfield',
                    labelWidth: 70,
                    // Setup listner on all fields to update QRCode when field value changes
                    listeners: {
                        change: function(cmp, newVal, oldVal){
                            if(newVal!=oldVal){
                                Ext.getCmp('receiveView').updateQRCode();
                            }
                        }
                    }
                },
                items:[{
                    label: 'Address',
                    name: 'address',
                    readOnly: true
                },{
                    label: 'Name',
                    name: 'asset',
                    value: '',
                    readOnly: true
                },{
                    xtype: 'fw-spinnerfield',
                    label: 'Amount',
                    name: 'amount',
                    value: 0,
                    minValue: 0,
                    maxValue: 100000000.00000000,
                    stepValue: 0.01000000,
                    divisible: true
                },{
                    label: 'Label',
                    name: 'label',
                    value: ''
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
        me.address    = me.down('[name=address]');
        me.amount     = me.down('[name=amount]');
        me.asset      = me.down('[name=asset]');
        me.label      = me.down('[name=label]');
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
        if(cfg.reset){
            me.address.setValue(FW.WALLET_ADDRESS.address);
            me.amount.reset();
            me.asset.reset();
            me.label.reset();
        }
        if(cfg.asset)
            me.asset.setValue(cfg.asset);
        // Handle updating the QR Code
        // me.updateQRCode();
    },


    // Handle updating/displaying a QR code 
    updateQRCode: function(){
        var me   = this,
            vals = me.getValues(),
            txt  = vals.address;
        // Display additional info in QRCode only if we have an asset
        if(vals.asset!=''){
            txt = 'counterparty:' + vals.address + '?asset=' + vals.asset;
            if(vals.amount>0)
                txt += '&amount=' + String(vals.amount).replace(/\,/g,'');
            if(vals.label!='')
                txt += '&label=' + encodeURI(vals.label)
        }
        $('#receive-qrcode > canvas').remove();
        $('#receive-qrcode').qrcode({
            text: txt,
            height: 250,
            width: 250
        });
    }


});