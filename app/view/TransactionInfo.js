/*
 * TransactionInfo.js - View
 * 
 * Displays transaction information
 */
 
 Ext.define('FW.view.TransactionInfo', {
    extend: 'Ext.Container',
    xtype: 'fw-transactioninfo',

    requires:[
        'Ext.Img',
        'FW.view.phone.TransactionInfo',
        'FW.view.tablet.TransactionInfo'
    ],

    config: {
        layout: 'card',
        items:[]
    },

    // Initialize the component
    initialize: function(){
        var me = this;
        // Setup some aliases
        me.main = FW.app.getController('Main');
        // Add view based on device type
        me.add({ xclass:'FW.view.' + me.main.deviceType + '.TransactionInfo' });
        // Now that we have added the correct view, setup some aliases to various components
        me.tb          = me.down('fw-toptoolbar');
        me.image       = me.down('[itemId=image]');
        me.currency    = me.down('[itemId=currency]');
        me.type        = me.down('[itemId=type]');
        me.amount      = me.down('[itemId=amount]');
        me.source      = me.down('[itemId=source]');
        me.destination = me.down('[itemId=destination]');
        me.hash        = me.down('[itemId=hash]');
        me.block       = me.down('[itemId=block]');
        me.timestamp   = me.down('[itemId=timestamp]');
        me.status      = me.down('[itemId=status]');
        me.fee         = me.down('[itemId=fee]');
        me.iconholder  = me.down('[itemId=iconContainer]');
        me.message     = me.down('[itemId=message]');
        me.value       = me.down('[itemId=value]');
        me.description = me.down('[itemId=description]'); 
        me.divisible   = me.down('[itemId=divisible]'); 
        me.locked      = me.down('[itemId=locked]');    
        me.transfer    = me.down('[itemId=transfer]');
        me.feePaid     = me.down('[itemId=feePaid]');
        me.issuer      = me.down('[itemId=issuer]');
        // Tablet specific fields
        me.placeholder = me.down('[itemId=placeholder]');
        me.information = me.down('[itemId=information]');
        me.callParent();
        // Handle adjusting messagebox height to text height
        me.message.on('change', function(cmp, newVal, oldVal){
            cmp.setHeight(66);
            var el = cmp.getComponent().input;
            if(el){
                el.dom.height = 'auto';
                var w = el.dom.scrollHeight + 33;
                cmp.setHeight(w);
            }
        });
    },


    // Handle updating the view
    updateView: function(cfg){
        var me   = this,
            data = cfg.data;
        // Back button
        if(cfg.back){
            me.tb.backBtn.show();
            if(typeof cfg.back === 'function')
                me.tb.onBack = cfg.back;
        } else {
            me.tb.backBtn.hide();
        }
        // Handle hiding placeholder and showing currency information
        if(me.placeholder){
            me.placeholder.hide();
            me.information.show();
        }
        // Hide most everything by default
        me.iconholder.hide();
        me.amount.hide();
        me.destination.hide();
        me.message.hide();
        me.value.hide();
        me.description.hide();
        me.divisible.hide();
        me.locked.hide();
        me.transfer.hide();
        me.feePaid.hide();
        me.issuer.hide();
        // Handle Sends
        if(data.type==1){
            me.image.setSrc('https://counterpartychain.io/content/images/icons/' + data.currency.toLowerCase() + '.png');
            me.iconholder.show();
            me.amount.show();
            me.destination.show();
        } else if(data.type==2){
            // Handle Broadcasts
            me.message.show();
            me.value.show();
        } else if(data.type==3){
            // Handle Issuances
            me.image.setSrc('https://counterpartychain.io/content/images/icons/' + data.currency.toLowerCase() + '.png');
            me.iconholder.show();
            me.amount.show();
            me.description.show();
            me.divisible.show();
            me.locked.show();
            me.transfer.show();
            me.feePaid.show();
            me.issuer.show();
        }
        // Hide miners fees for everything except BTC for now
        // Come back at some point and add code to determine miners fees WITHOUT having to make an extra API call
        if(data.currency=='BTC'){
            me.fee.show();
        } else {
            me.fee.hide();
        }
        me.updateData(data);
        me.getTransactionInfo(data);
    },


    // Handle updating view fields
    updateData: function(data){
        var me    = this,
            fmt   = (/\./.test(data.amount)||data.currency=='BTC') ? '0,0.00000000' : '0,0',
            time  = (data.time) ? Ext.Date.format(new Date(parseInt(data.time + '000')),'m-d-Y H:i:s') : '',
            block = (data.block) ? numeral(data.block).format('0,0') : '',
            amount = (data.amount) ? data.amount.replace('-','') : 0,
            status = (data.time) ? ((data.status) ? data.status : 'Valid') : 'Pending',
            type   = (typeof data.type === 'string') ? data.type : 'Send';
            fee    = (data.fee) ? data.fee : 'NA';
        me.currency.setValue(data.currency);    
        me.type.setValue(type);
        me.amount.setValue(numeral(amount).format(fmt));
        me.source.setValue(data.source);
        me.destination.setValue(data.destination);
        me.hash.setValue(data.hash);
        me.block.setValue(block);
        me.timestamp.setValue(time);
        me.fee.setValue(fee);
        me.status.setValue(status);
        me.message.setValue(data.message);
        me.value.setValue(data.value);
        me.description.setValue(data.description);
        me.divisible.setValue(data.divisible);
        me.locked.setValue(data.locked);
        me.transfer.setValue(data.transfer);
        me.feePaid.setValue(data.feePaid);
        me.issuer.setValue(data.issuer);  
    },


    // Handle requesting transaction information
    getTransactionInfo: function(data){
        var me    = this,
            hostA = (FW.WALLET_NETWORK==2) ? 'tbtc.blockr.io' : 'btc.blockr.io',
            hostB = (FW.WALLET_NETWORK==2) ? 'testnet.counterpartychain.io' : 'counterpartychain.io';
        // Set loading mask on panel to indicate we are loading 
        me.setMasked({
            xtype: 'loadmask',
            cls: 'fw-panel',
            message: 'Loading Data',
            showAnimation: 'fadeIn',
            indicator: true
        });
        // Get BTC transaction info
        if(data.currency=='BTC'){
            me.main.ajaxRequest({
                url: 'https://' + hostA + '/api/v1/tx/info/' + data.hash,
                success: function(o){
                    if(o.data){
                        // Get Source and Destination
                        // Come back and clean this up at some point...
                        var src  = o.data.vins[0].address,
                            dest = false;
                        Ext.each(o.data.vouts,function(vout){
                            if(!vout.is_nonstandard){
                                dst = vout.address;
                                return false;                                
                            }
                        });
                        // Handle subtracting miners fee from sent amount
                        var amt = data.amount;
                        if(/\-/.test(data.amount)){
                            amt = me.main.getSatoshis(Math.abs(data.amount)) - me.main.getSatoshis(o.data.fee),
                            amt = numeral(amt).multiply(0.00000001);
                        }
                        str = numeral(amt).format('0,0.00000000');
                        me.updateData({ 
                            type: 'Send',
                            currency: 'BTC',
                            amount: str,
                            hash: data.hash,
                            source: src,
                            destination: dst,
                            block: o.data.block,
                            time: data.time,
                            fee: o.data.fee
                        });
                    }
                },
                // Callback function called on any response
                callback: function(){
                    me.setMasked(false);
                }    
            });  
        } else {
            // console.log('data=',data);
            // Handle requesting transaction info from counterpartychain.io API
            me.main.ajaxRequest({
                url: 'https://' + hostB + '/api/transaction/' + data.hash,
                // Success function called when we receive a success response
                success: function(o){
                    if(o.success){
                        var fee = (data.fee=='NA') ? data.fee : numeral(String(data.fee).replace('+','').replace('-','')).format('0.00000000');
                        me.updateData(Ext.apply(o,{ 
                            currency: o.asset,
                            amount: o.quantity,
                            hash: data.hash,
                            message: o.text,
                            value: o.value,
                            feePaid: o.fee + ' XCP',
                            transfer: (o.transfer) ? 'True' : 'False',
                            locked: (o.locked) ? 'True' : 'False',
                            divisible: (o.divisible) ? 'True' : 'False'
                        }));
                    }
                },
                // Callback function called on any response
                callback: function(){
                    me.setMasked(false);
                }    
            });            
        }
    }

});
