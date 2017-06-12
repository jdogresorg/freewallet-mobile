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
            title: 'Receive',
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
                    value: 'BTC',
                    readOnly: true
                },{
                    xtype: 'fw-spinnerfield',
                    label: 'USD ($)',
                    name: 'price',
                    value: 0.00,
                    decimalPrecision: 2,
                    minValue: 0,
                    maxValue: 100000000.00000000,
                    stepValue: 1,
                    listeners: {
                        // Handle detecting price changes and updating the amount
                        change: function(cmp, newVal, oldVal){
                            if(newVal!=oldVal){
                                var me  = Ext.getCmp('receiveView'),
                                    cur = me.asset.getValue();
                                if(newVal=='')
                                    newVal = 0;
                                // Handle updating amount
                                if(!me.price.isDisabled() && me.tokenInfo.estimated_value.btc!='0.00000000'){
                                    var price_usd = me.main.getCurrencyPrice('bitcoin','usd');
                                    // Calculate amount via ((quantity_usd / btc_price_usd) / asset_btc)
                                    // We do this because it is more accurate than using the asset USD value
                                    var amount = ((numeral(newVal).value() / price_usd) / me.tokenInfo.estimated_value.btc);
                                    me.amount.suspendEvents();
                                    me.amount.setValue(numeral(amount).format(me.amount.getNumberFormat()));
                                    me.amount.resumeEvents(true);
                                }
                                me.updateQRCode();
                            }
                        }
                    }
                },{
                    xtype: 'fw-spinnerfield',
                    label: 'Amount',
                    name: 'amount',
                    value: 0,
                    decimalPrecision: 8,
                    minValue: 0,
                    maxValue: 100000000.00000000,
                    stepValue: 0.01000000,
                    listeners: {
                        // Handle detecting amount changes and updating the price
                        change: function(cmp, newVal, oldVal){
                            if(newVal!=oldVal){
                                var me  = Ext.getCmp('receiveView'),
                                    cur = me.asset.getValue();
                                // Handle updating price
                                if(!me.price.isDisabled() && me.tokenInfo.estimated_value.btc!='0.00000000'){
                                    var price_usd = me.main.getCurrencyPrice('bitcoin','usd');
                                    // Calculate price via ((asset_btc_price * quantity) * current_btc_price)
                                    // We do this because it is more accurate than using the asset USD value
                                    var price = (me.tokenInfo.estimated_value.btc *  numeral(newVal).value()) * price_usd;
                                    me.price.suspendEvents();
                                    me.price.setValue(numeral(price).value());
                                    me.price.resumeEvents(true);
                                }
                                me.updateQRCode();
                            }
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
        me.address    = me.down('[name=address]');
        me.price      = me.down('[name=price]');
        me.amount     = me.down('[name=amount]');
        me.asset      = me.down('[name=asset]');
        // Call parent
        me.callParent();
    },

    // Handle updating the view with passed config info
    updateView: function(cfg){
        // console.log('updateView cfg=',cfg);
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
        }
        var asset = (cfg.asset) ? cfg.asset : 'BTC';
        me.asset.setValue(asset);
        me.getTokenInfo(asset);
        // Handle updating the QR Code
        // me.updateQRCode();
    },

    // Handle getting information on a specific token
    getTokenInfo: function(asset){
        var me = this;
        if(asset=='BTC'){
            var price_usd = me.main.getCurrencyPrice('bitcoin','usd'),
                price_btc = me.main.getCurrencyPrice('counterparty','btc');
            me.tokenInfo = {
                estimated_value : {
                    btc: 1.00000000,
                    usd: price_usd,
                    xcp: (price_btc) ? numeral(1 / price_btc).format('0.00000000') : '0.00000000'
                }
            };
            me.updateAmountField(asset);
        } else {
            me.main.getTokenInfo(asset, function(o){ 
                me.tokenInfo = o; 
                if(String(o.asset_longname).trim().length)
                    me.asset.setValue(o.asset_longname);
                me.updateAmountField(asset);
            });
        }
    },

    // Handle updating amount field to correct settings for a given currency
    updateAmountField: function(asset){
        var me      = this,
            store   = Ext.getStore('Balances'),
            prefix  = FW.WALLET_ADDRESS.address.substr(0,5);
            balance = 0;
        // Find balance in store
        store.each(function(item){
            var rec = item.data;
            if(rec.asset==asset && rec.prefix==prefix)
                balance = rec.quantity;
        });
        // Adjust amount field step/decimal precision values
        var div  = /\./.test(balance),
            dec  = (div) ? 8 : 0,
            step = (div) ? 0.01 : 1;
        me.amount.setDecimalPrecision(dec);
        me.amount.setStepValue(step);
        // enable/disable the field based on if the asset has any known value
        if(me.tokenInfo.estimated_value.btc!='0.00000000'){
            me.price.enable();
        } else {
            me.price.disable();
        }
    },


    // Handle updating/displaying a QR code 
    updateQRCode: function(){
        var me   = this,
            vals = me.getValues(),
            txt  = (vals.asset=='BTC') ? 'bitcoin' : 'counterparty',
            amt  = String(vals.amount).replace(/\,/g,''),
            q    = '',
            o    = {};
        txt +=  ':' + vals.address;
        if(vals.asset!='BTC')
            o.asset = vals.asset;
        if(amt>0)
            o.amount = amt;
        for (var key in o){
            if (q != '')
                q += "&";
            q += key + "=" + encodeURIComponent(o[key]);
        }
        if(q!='')
            txt += '?' + q;
        // console.log('txt=',txt);
        $('#receive-qrcode > canvas').remove();
        $('#receive-qrcode').qrcode({
            text: txt,
            height: 250,
            width: 250
        });
    }


});