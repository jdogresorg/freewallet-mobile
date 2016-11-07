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
                                me.currency.showPicker(cmp);
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
                        name: 'currency',
                        store: 'Balances',
                        displayField: 'currency',
                        valueField: 'currency',
                        value: 'BTC',
                        defaultTabletPickerConfig: {
                            cls: 'fw-currency-picker',
                            itemTpl: new Ext.XTemplate(
                                '<div class="fw-pickerlist-item">' +
                                    '<div class="fw-pickerlist-icon">' +
                                        '<img src="https://counterpartychain.io/content/images/icons/{[this.toLower(values.currency)]}.png">' + 
                                    '</div>' +
                                    '<div class="fw-pickerlist-info">' +
                                        '<div class="fw-pickerlist-currency">{currency}</div>' +
                                    '</div>' +
                                '</div>',
                                {
                                    toLower: function(val){
                                        return String(val).toLowerCase();
                                    }
                                }
                            )
                        },
                        defaultPhonePickerConfig: {
                            cls: 'fw-currency-picker',
                            itemTpl: new Ext.XTemplate(
                                '<div class="fw-pickerlist-item">' +
                                    '<div class="fw-pickerlist-icon">' +
                                        '<img src="https://counterpartychain.io/content/images/icons/{[this.toLower(values.currency)]}.png" width="35" height:>' + 
                                    '</div>' +
                                    '<div class="fw-pickerlist-info">' +
                                        '<div class="fw-pickerlist-currency">{currency}</div>' +
                                    '</div>' +
                                '</div>',
                                {
                                    toLower: function(val){
                                        return String(val).toLowerCase();
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
                                if(typeof FW.TRACKED_PRICES[value] != 'undefined'){
                                    me.price.enable();
                                } else {
                                    me.price.disable();
                                }
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
                    xtype: 'textfield',
                    label: 'USD',
                    name: 'price',
                    value: '$0.00',
                    component: {
                        // Change type to tel since it shows numbers keyboard, and allows for additional chars like ,
                        type: 'number',
                        disabled: false
                    },
                    listeners: {
                        // Handle detecting price changes and updating the amount
                        change: function(cmp, newVal, oldVal){
                            if(newVal!=oldVal){
                                var me  = Ext.getCmp('sendView'),
                                    cur = me.currency.getValue();
                                if(newVal=='')
                                    newVal = '0';
                                // Make sure price starts with $
                                if(newVal.substr(0,1)!='$' || !/\./.test(newVal))
                                    cmp.setValue('$' + numeral(newVal).format('0,0.00'));
                                // Handle updating amount
                                if(!me.price.isDisabled() && typeof FW.TRACKED_PRICES[cur] != 'undefined'){
                                    var amount = (parseFloat(newVal.replace('$','').replace(',','')) / FW.TRACKED_PRICES[cur].USD) * 1,
                                        fmt    = (me.amount.divisible) ? '0,0.00000000' : '0,0';
                                    me.amount.suspendEvents();
                                    me.amount.setValue(numeral(amount).format(fmt));
                                    me.amount.resumeEvents(true);
                                }
                            }
                        }
                    }
                },{
                    xtype: 'fw-spinnerfield',
                    label: 'Amount',
                    name: 'amount',
                    value: 1,
                    minValue: 0,
                    maxValue: 100000000.00000000,
                    stepValue: 0.01000000,
                    listeners: {
                        // Handle detecting amount changes and updating the price
                        change: function(cmp, newVal, oldVal){
                            if(newVal!=oldVal){
                                var me  = Ext.getCmp('sendView'),
                                    cur = me.currency.getValue();
                                // Handle updating price
                                if(!me.price.isDisabled() && typeof FW.TRACKED_PRICES[cur] != 'undefined'){
                                    var price = parseFloat(FW.TRACKED_PRICES[cur].USD / 1) * parseFloat(newVal.replace('$','').replace(',',''));
                                    me.price.suspendEvents();
                                    me.price.setValue('$' + numeral(price).format('0,0.00'));
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
        me.currency    = me.down('[name=currency]');
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
            me.currency.reset();
            me.amount.reset();
            me.available.reset();
            me.priority.reset();
        }
        // Force currency, image, and balance updates
        var currency = (cfg.currency) ? cfg.currency : 'BTC';
        me.updateImage(currency);
        me.currency.setValue(currency);
        me.updateBalance(currency);
        me.updateForm(cfg);
    },


    // Handle updating the image
    updateImage: function(currency){
        var me  = this, 
            src = 'resources/images/wallet.png';
        if(currency)
            src = 'https://counterpartychain.io/content/images/icons/' + currency.toLowerCase() + '.png';
        if(currency=='BTC')
            src = 'resources/images/icons/btc.png';
        me.image.setSrc(src);
    },


    // Handle looking up currency balance and updating field
    updateBalance: function(currency){
        var me      = this,
            store   = Ext.getStore('Balances'),
            prefix  = FW.WALLET_ADDRESS.address.substr(0,5);
            balance = 0,
            format  = '0,0';
        // Find balance in store
        store.each(function(item){
            var rec = item.data;
            if(rec.currency==currency && rec.prefix==prefix)
                balance = rec.amount;
        });
        // If balance is divisible, update display format and set divisible flag on amount field
        if(/\./.test(balance)){
            format += '.00000000';
            me.amount.setDivisible(true);
        } else {
            me.amount.setDivisible(false);
        }
        me.balance = balance;
        // Set max and available amount
        var amt = numeral(balance).format(format);
        me.amount.setMaxValue(amt);
        if(typeof FW.TRACKED_PRICES[currency] != 'undefined')
            amt += ' ($' + numeral(FW.TRACKED_PRICES[currency]['USD'] * balance).format('0,0.00') + ')';
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
            if(vals.currency=='BTC' && (amt_sat + fee_sat) > bal_sat)
                msg = 'Total exceeds available amount!<br/>Please adjust the amount or miner fee.';
            if(vals.currency!='BTC' && parseFloat(amount) > parseFloat(me.balance))
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
            me.main.cpSend(FW.WALLET_NETWORK, FW.WALLET_ADDRESS.address, vals.destination, vals.currency, amt_sat, fee_sat, cb);
        }
        // Confirm action with user
        Ext.Msg.confirm('Confirm Send', 'Send ' + vals.amount + ' ' +  vals.currency +'?', function(btn){
            if(btn=='yes')
                fn();
        });
    },


    // Handle updating the form values (used when scanning QRcodes)
    updateForm: function(o){
        var me = this;
        if(o){
            if(o.asset) 
                me.currency.setValue(o.asset);
            if(o.address) 
                me.destination.setValue(o.address);
            if(o.amount) 
                me.amount.setValue(o.amount);
        }
    }

});