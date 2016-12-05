/*
 * Broadcast.js - View 
 *
 * Display broadcast message form
 */

Ext.define('FW.view.Broadcast', {
    extend: 'Ext.form.Panel',
    
    config: {
        id: 'broadcastView',
        layout: 'vbox',
        scrollable: 'vertical',
        cls: 'fw-panel',
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'Broadcast Message',
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
                    xtype: 'fw-spinnerfield',
                    labelWidth: 70
                },
                items:[{
                    xtype: 'textareafield',
                    label: 'Message',
                    name: 'message',
                    maxRows: 6
                },{
                    label: 'Value',
                    name: 'value',
                    minValue: -1000000000,
                    maxValue: 1000000000,
                    stepValue: 1,
                    value: 0
                },{
                    label: 'Fee',
                    name: 'fee',
                    decimalPrecision: 8,
                    minValue: 0,
                    maxValue:  0.99999999,
                    stepValue: 0.01000000,
                    value: 0,
                    listeners: {
                        change: function(cmp, newVal, oldVal){
                            var max = cmp.getMaxValue();
                            if(newVal>max)
                                cmp.setValue(max);
                        }
                    }
                }]                
            },{
                xtype: 'fw-transactionpriority',
                margin: '0 0 0 0'
            },{
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    margin: '5 0 0 0',
                    xtype: 'button',
                    flex: 1
                },
                items: [{
                    text: 'Broadcast',
                    itemId: 'sign',
                    iconCls: 'fa fa-edit',
                    ui: 'confirm',
                    handler: function(btn){
                        Ext.getCmp('broadcastView').validate();
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
        me.fee       = me.down('[name=fee]');
        me.value     = me.down('[name=value]');
        me.priority  = me.down('fw-transactionpriority');
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
            me.message.setValue('');
            me.fee.reset();
            me.value.reset();
            me.priority.reset();
        }        
        // Pre-populate message field if we have message
        if(cfg.message)
            me.message.setValue(cfg.message);
    },


    // Handle validating the broadcast data and sending the broadcast
    validate: function(){
        var me   = this,
            vals = me.getValues(),
            msg  = false;
        console.log('broadcast vals=',vals);
        // Verify that we have all the info required
        if(vals.message==''){
            msg = 'You must enter a message';
        } else {
            // Validate that we have enough BTC to cover this transaction
            var balance = me.main.getBalance('BTC'),
                fee_sat = me.main.getSatoshis(String(vals.feeAmount).replace(' BTC','')),
                bal_sat = me.main.getSatoshis(balance);
            if(fee_sat > bal_sat)
                msg = 'Bitcoin balance below required amount.<br/>Please fund this address with some Bitcoin and try again.';
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
                    me.message.reset();
                    me.fee.reset();
                    me.value.reset();
                    me.priority.reset();
                }
            };
            me.main.cpBroadcast(FW.WALLET_NETWORK, FW.WALLET_ADDRESS.address, vals.message, numeral(vals.value).value(), vals.fee, fee_sat, cb);
        }
        // Confirm action with user
        Ext.Msg.confirm('Confirm Broadcast', 'Send Broadcast?', function(btn){
            if(btn=='yes')
                fn();
        });

    }

});