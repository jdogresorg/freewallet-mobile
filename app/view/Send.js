/*
 * Send.js - View 
 *
 * Handle displaying 'Send' form 
 */

Ext.define('FW.view.Send', {
    extend: 'Ext.form.Panel',

    config: {
        id: 'sendView',
        layout: 'vbox',
        scrollable: 'vertical',
        cls: 'fw-panel',
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'Send',
            menu: true
        },{
            xtype: 'container',
            layout: 'vbox',
            margin: '5 5 5 5',
            cls: 'no-label-ellipsis',
            items:[{
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 0 0',
                defaults: {
                    margin: '0 0 0 0'
                },
                items:[{
                    xtype: 'fieldset',
                    width: 65,
                    layout: {
                        type:'vbox',
                        pack:'center',
                        align: 'center'
                    },
                    items:[{
                        xtype: 'image',
                        itemId: 'image',
                        src: 'resources/images/icons/btc.png',
                        width: 48,
                        height: 48,
                        listeners: {
                            // When user taps the currency icon, treat as if they had tapped the currency field
                            tap: function(cmp, value){
                                var me = Ext.getCmp('sendView');
                                me.asset.showPicker(cmp);
                            }
                        }

                    }]
                },{
                    xtype: 'fieldset',
                    margin: '0 0 0 5',
                    flex: 1,
                    items:[{
                        xtype: 'fw-selectfield',
                        label: 'Name',
                        labelAlign: 'top',
                        name: 'asset',
                        store: 'Balances',
                        displayField: 'display_name',
                        valueField: 'asset',
                        value: 'BTC',
                        defaultTabletPickerConfig: {
                            cls: 'fw-currency-picker',
                            itemTpl: new Ext.XTemplate(
                                '<div class="fw-pickerlist-item">' +
                                    '<div class="fw-pickerlist-icon">' +
                                        '<img src="https://xchain.io/icon/{[this.toUpper(values.asset)]}.png">' + 
                                    '</div>' +
                                    '<div class="fw-pickerlist-info">' +
                                        '<div class="fw-pickerlist-currency">{display_name}</div>' +
                                    '</div>' +
                                '</div>',
                                {
                                    toUpper: function(val){
                                        return String(val).toUpperCase();
                                    }
                                }
                            )
                        },
                        defaultPhonePickerConfig: {
                            cls: 'fw-currency-picker',
                            itemTpl: new Ext.XTemplate(
                                '<div class="fw-pickerlist-item">' +
                                    '<div class="fw-pickerlist-icon">' +
                                        '<img src="https://xchain.io/icon/{[this.toUpper(values.asset)]}.png" width="35">' + 
                                    '</div>' +
                                    '<div class="fw-pickerlist-info">' +
                                        '<div class="fw-pickerlist-currency">{display_name}</div>' +
                                    '</div>' +
                                '</div>',
                                {
                                    toUpper: function(val){
                                        return String(val).toUpperCase();
                                    }
                                }
                            )
                        },
                        listeners: {
                            // When currency changes, update currency image and balance
                            change: function(cmp, value){
                                var me   = Ext.getCmp('sendView'),
                                    step = (value=='BTC') ? 0.01 : 1;
                                me.amount.setValue(0);
                                me.amount.setStepValue(step);
                                me.updateImage(value);
                                me.updateBalance(value);
                                me.amount.setStepValue(step);
                                me.price.reset();
                                me.getTokenInfo(value);
                            }
                        }
                    }]
                }]
            },{
                xtype: 'fieldset',
                margin: '5 0 0 0',
                defaults: {
                    xtype:'textfield',
                    labelWidth: 70
                },
                items:[{
                    xtype: 'fw-actionfield',
                    label: 'Send To',
                    name: 'destination',
                    iconCls: 'fa fa-qrcode',
                    handler: function(){
                        var view = Ext.getCmp('sendView');
                        FW.app.getController('Main').scanQRCode(view);
                    }
                },{
                    label: 'Balance',
                    name: 'available',
                    value: '0.00000000',
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
                            // console.log('change old,new=',oldVal,newVal);
                            if(newVal!=oldVal){
                                var me  = Ext.getCmp('sendView'),
                                    cur = me.asset.getValue();
                                if(newVal=='')
                                    newVal = 0;
                                // Handle updating amount
                                if(!me.price.isDisabled() && me.tokenInfo && me.tokenInfo.estimated_value.btc!='0.00000000'){
                                    var price_usd = me.main.getCurrencyPrice('bitcoin','usd');
                                    // Calculate amount via ((quantity_usd / btc_price_usd) / asset_btc)
                                    // We do this because it is more accurate than using the asset USD value
                                    var amount = ((numeral(newVal).value() / price_usd) / me.tokenInfo.estimated_value.btc);
                                    me.amount.suspendEvents();
                                    me.amount.setValue(numeral(amount).format(me.amount.getNumberFormat()));
                                    me.amount.resumeEvents(true);
                                }
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
                                var me  = Ext.getCmp('sendView'),
                                    cur = me.asset.getValue();
                                // Handle updating price
                                if(!me.price.isDisabled() && me.tokenInfo && me.tokenInfo.estimated_value.btc!='0.00000000'){
                                    var price_usd = me.main.getCurrencyPrice('bitcoin','usd');
                                    // Calculate price via ((asset_btc_price * quantity) * current_btc_price)
                                    // We do this because it is more accurate than using the asset USD value
                                    var price = (me.tokenInfo.estimated_value.btc *  numeral(newVal).value()) * price_usd;
                                    me.price.suspendEvents();
                                    me.price.setValue(numeral(price).value());
                                    me.price.resumeEvents(true);
                                }
                            }
                        }
                    }
                }]
            },{
                xtype: 'fw-transactionpriority',
                margin: '0 0 0 0'
            },{
                margin: '5 0 0 0',
                xtype: 'button',
                text: 'Send',
                iconCls: 'fa fa-send',
                ui: 'confirm',
                handler: function(btn){
                    Ext.getCmp('sendView').validate();
                }
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
        me.image       = me.down('[itemId=image]');
        me.asset       = me.down('[name=asset]');
        me.source      = me.down('[name=source]');
        me.destination = me.down('[name=destination]');
        me.price       = me.down('[name=price]');
        me.amount      = me.down('[name=amount]');
        me.available   = me.down('[name=available]');
        me.priority    = me.down('fw-transactionpriority');
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
            me.destination.reset();
            me.asset.reset();
            me.amount.reset();
            me.available.reset();
            me.priority.reset();
        }
        // Set asset and update asset field value
        var asset = (cfg.asset) ? cfg.asset : 'BTC';
        me.asset.setValue(asset);
        // Get aset value and update image and balance (do this so asset and icon always match)
        var val = me.asset.getValue();
        me.updateImage(val);
        me.updateBalance(val);
        me.updateForm(cfg);
        me.getTokenInfo(asset);
    },


    // Handle getting information on a specific token
    getTokenInfo: function(asset){
        var me = this;
        if(asset=='BTC'){
            var price_usd = me.main.getCurrencyPrice('bitcoin','usd'),
                price_btc = me.main.getCurrencyPrice('counterparty','btc');
            me.tokenInfo = {
                asset: 'BTC',
                estimated_value : {
                    btc: 1.00000000,
                    usd: price_usd,
                    xcp: (price_btc) ? numeral(1 / price_btc).format('0.00000000') : '0.00000000'
                }
            };
            me.price.enable();
        } else {
            me.main.getTokenInfo(asset, function(o){ 
                me.tokenInfo = o; 
                if(String(o.asset_longname).trim().length)
                    me.asset.setValue(o.asset_longname);
                // enable/disable price field based on if the asset has any known value
                if(o.estimated_value.btc!='0.00000000'){
                    me.price.enable();
                } else {
                    me.price.disable();
                }
            });
        }
    },


    // Handle updating the image
    updateImage: function(asset){
        var me  = this, 
            src = 'resources/images/wallet.png';
        if(asset)
            src = 'https://xchain.io/icon/' + asset.toUpperCase() + '.png';
        if(asset=='BTC')
            src = 'resources/images/icons/btc.png';
        me.image.setSrc(src);
    },


    // Handle looking up asset balance and updating field
    updateBalance: function(asset){
        var me      = this,
            store   = Ext.getStore('Balances'),
            prefix  = FW.WALLET_ADDRESS.address.substr(0,5);
            balance = 0,
            values  = false,
            format  = '0,0';
        // Find balance in store
        store.each(function(item){
            var rec = item.data;
            if(rec.asset==asset && rec.prefix==prefix){
                balance = rec.quantity;
                values  = rec.estimated_value;
            }
        });
        // If balance is divisible, update display format and precision
        if(/\./.test(balance)){
            format += '.00000000';
            me.amount.setDecimalPrecision(8);
        } else {
            me.amount.setDecimalPrecision(0);
        }
        me.balance = balance;
        // Set max and available amount
        var bal = numeral(balance),
            amt = bal.format(format);
        // Display price in USD
        if(values.usd!='0.00')
            amt += ' ($' + numeral(values.usd).format('0,0.00') + ')';
        me.amount.setMaxValue(bal.value());
        me.available.setValue(amt);
    },


    // Handle validating the send data and sending the send
    validate: function(){
        var me      = this,
            vals    = me.getValues(),
            dest    = vals.destination,
            msg     = false,
            amount  = String(vals.amount).replace(',',''),
            amt_sat = me.main.getSatoshis(amount),
            fee_sat = me.main.getSatoshis(String(vals.feeAmount).replace(' BTC','')),
            bal_sat = me.main.getSatoshis(me.main.getBalance('BTC'));
        // Verify that we have all the info required to do a send
        if(vals.amount==0){
            msg = 'You must enter a send amount';
        } else if(dest.length<25 || vals.destination.length>34 || !CWBitcore.isValidAddress(dest)){
            msg = 'You must enter a valid address';
        } else {
            if(fee_sat > bal_sat)
                msg = 'BTC balance below required amount.<br/>Please fund this address with some Bitcoin and try again.';
            if(vals.asset=='BTC' && (amt_sat + fee_sat) > bal_sat)
                msg = 'Total exceeds available amount!<br/>Please adjust the amount or miner fee.';
            if(vals.asset!='BTC' && parseFloat(amount) > parseFloat(me.balance))
                msg = 'Amount exceeds balance amount!';
        }
        if(msg){
            Ext.Msg.alert(null,msg);
            return;
        }
        // Define call function to run when we are sure user wants to send transaction
        var fn = function(){
            // Show loading screen while we are processing the send
            me.setMasked({
                xtype: 'loadmask',
                message: 'Please wait',
                showAnimation: 'fadeIn',
                indicator: true
            });
            // Define callback called when transaction is done (success or failure)
            var cb = function(txid){
                me.setMasked(false);
                if(txid){
                    Ext.Msg.alert(null,'Your transaction has been broadcast');
                    me.destination.reset();
                    me.amount.reset();
                    me.priority.reset();

                }
            };
            // Convert amount to satoshis
            amt_sat = (/\./.test(vals.available)) ? amt_sat : String(vals.amount).replace(/\,/g,'');
            me.main.cpSend(FW.WALLET_NETWORK, FW.WALLET_ADDRESS.address, vals.destination, vals.asset, amt_sat, fee_sat, cb);
        }
        // Confirm action with user
        var asset = (me.tokenInfo.asset_longname && me.tokenInfo.asset_longname!='') ? me.tokenInfo.asset_longname : me.tokenInfo.asset;
        Ext.Msg.confirm('Confirm Send', 'Send ' + vals.amount + ' ' +  asset +'?', function(btn){
            if(btn=='yes')
                fn();
        });
    },


    // Handle updating the form values (used when scanning QRcodes)
    updateForm: function(o){
        var me = this;
        if(o){
            if(o.asset) 
                me.asset.setValue(o.asset);
            if(o.address) 
                me.destination.setValue(o.address);
            if(o.amount)
                me.amount.setValue(numeral(o.amount).value());
        }
    }

});