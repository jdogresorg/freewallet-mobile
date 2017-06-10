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
        me.asset       = me.down('[itemId=asset]');
        me.type        = me.down('[itemId=type]');
        me.quantity    = me.down('[itemId=quantity]');
        me.source      = me.down('[itemId=source]');
        me.buying      = me.down('[itemId=buying]');
        me.selling     = me.down('[itemId=selling]');
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
        // Setup tap listener on transaction hash field to send taps to xchain.io
        me.hash.btn.on('tap', function(cmp){
            var val   = me.hash.getValue(),
                net   = (FW.WALLET_NETWORK==2) ? 'tBTC' : 'BTC',
                host  = (FW.WALLET_NETWORK==2) ? 'testnet.xchain.io' : 'xchain.io',
                asset = me.asset.getValue();
            if(asset=='BTC')
                url  = 'https://blocktrail.com/' + net + '/tx/' + val;
            else 
                url  = 'https://' + host + '/tx/' + val;
            me.main.openUrl(url);
        });
        // Setup listeners on certain fields to handle copying value to clipboard
        var copyFields = ['source','issuer','destination'];
        Ext.each(copyFields, function(name){
            var field = me[name];
            // Handle native copy-to-clipboard functionality
            if(me.main.isNative){
                field.btn.on('tap', function(){ 
                    me.main.copyToClipboard(field.getValue()); 
                });
            } else {
                // Handle non-native copy-to-clipboard functionality
                var clipboard = new Clipboard('#' + field.id + ' .fa-files-o', {
                    text: function(e){
                        return field.getValue();
                    }
                });
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
        // Handle hiding placeholder and showing asset information
        if(me.placeholder){
            me.placeholder.hide();
            me.information.show();
        }
        // Hide most everything by default
        me.iconholder.hide();
        me.quantity.hide();
        me.destination.hide();
        me.message.hide();
        me.value.hide();
        me.description.hide();
        me.divisible.hide();
        me.locked.hide();
        me.transfer.hide();
        me.feePaid.hide();
        me.issuer.hide();
        me.buying.hide();
        me.selling.hide();
        // Handle Sends
        if(data.type=='send'){
            me.image.setSrc('https://xchain.io/icon/' + data.asset.toUpperCase() + '.png');
            me.iconholder.show();
            me.quantity.show();
            me.destination.show();
        } else if(data.type=='order'){
            me.buying.show();
            me.selling.show();
        } else if(data.type=='broadcast'){
            // Handle Broadcasts
            me.message.show();
            me.value.show();
        } else if(data.type=='issuance'){
            // Handle Issuances
            me.image.setSrc('https://xchain.io/icon/' + data.asset.toUpperCase() + '.png');
            me.iconholder.show();
            me.quantity.show();
            me.description.show();
            me.divisible.show();
            me.locked.show();
            me.transfer.show();
            me.feePaid.show();
            me.issuer.show();
        }
        // Hide miners fees for everything except BTC for now
        // Come back at some point and add code to determine miners fees WITHOUT having to make an extra API call
        if(data.asset=='BTC'){
            me.fee.show();
        } else {
            me.fee.hide();
        }
        me.updateData(data);
        me.getTransactionInfo(data);
    },


    // Handle updating view fields
    updateData: function(data){
        // console.log('updateData data=',data);
        var me    = this,
            fmt   = (/\./.test(data.quantity)||data.asset=='BTC') ? '0,0.00000000' : '0,0',
            time  = (data.timestamp) ? Ext.Date.format(new Date(parseInt(data.timestamp + '000')),'m-d-Y H:i:s') : '',
            block = (data.block_index) ? numeral(data.block_index).format('0,0') : '-',
            qty   = (data.quantity) ? data.quantity.replace('-','') : 0,
            status = (data.timestamp) ? ((data.status) ? data.status : 'Valid') : 'Pending',
            type   = (typeof data.type === 'string') ? data.type : 'Send';
            fee    = (data.fee) ? data.fee : 'NA',
            asset  = (data.asset_longname && data.asset_longname!='') ? data.asset_longname : data.asset,
            type   = data.type.charAt(0).toUpperCase() + data.type.slice(1);
        if(type=='Order'){
            var buying  = (data.get_asset_longname!='') ? data.get_asset_longname : data.get_asset,
                selling = (data.give_asset_longname!='') ? data.give_asset_longname : data.give_asset,
                fmtA    = (/\./.test(data.get_quantity)) ? '0,0.00000000' : '0,0',
                fmtB    = (/\./.test(data.give_quantity)) ? '0,0.00000000' : '0,0';
            me.buying.setValue(numeral(data.get_quantity).format(fmtA) + ' ' + buying);
            me.selling.setValue(numeral(data.give_quantity).format(fmtB) + ' ' + selling);
        }
        me.asset.setValue(asset);    
        me.type.setValue(type);
        me.quantity.setValue(numeral(qty).format(fmt));
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
            net   = (FW.WALLET_NETWORK==2) ? 'tbtc' : 'btc',
            hostA = (FW.WALLET_NETWORK==2) ? 'tbtc.blockr.io' : 'btc.blockr.io',
            hostB = (FW.WALLET_NETWORK==2) ? 'testnet.xchain.io' : 'xchain.io';
        // Set loading mask on panel to indicate we are loading 
        me.setMasked({
            xtype: 'loadmask',
            cls: 'fw-panel',
            message: 'Loading Data',
            showAnimation: 'fadeIn',
            indicator: true
        });
        // Get BTC transaction info
        if(data.asset=='BTC'){
            // Get BTC transaction info from blocktrail
            me.main.ajaxRequest({
                url: 'https://api.blocktrail.com/v1/' + net + '/transaction/' + data.hash + '?api_key=' + FW.API_KEYS.BLOCKTRAIL,
                success: function(o){
                    if(o.hash){
                        // console.log('data=',data);
                        me.updateData({ 
                            type: 'Send',
                            asset: 'BTC',
                            quantity: numeral(o.estimated_value).multiply(0.00000001).format('0,0.00000000'),
                            hash: o.hash,
                            status: (o.block_height) ? 'Valid' : 'Pending',
                            source: o.inputs[0].address,
                            destination: o.outputs[0].address,
                            block_index: o.block_height,
                            timestamp: moment(o.first_seen_at,["YYYY-MM-DDTH:m:s"]).unix(),
                            fee: numeral(o.total_fee).multiply(0.00000001).format('0,0.00000000')
                        });
                    }
                    me.setMasked(false);
                },
                failure: function(o){
                    // If the request to blocktrail API failed, fallback to slower blockr.io API
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
                                // console.log('data=',data);
                                me.updateData({ 
                                    type: 'Send',
                                    asset: 'BTC',
                                    quantity: data.quantity,
                                    hash: data.hash,
                                    source: src,
                                    destination: dst,
                                    block_index: o.data.block,
                                    timestamp: data.time,
                                    fee: o.data.fee
                                });
                            }
                        },
                        // Callback function called on any response
                        callback: function(){
                            me.setMasked(false);
                        }    
                    });                    
                }
            });
  
        } else {
            // console.log('data=',data);
            // Handle requesting transaction info from counterpartychain.io API
            me.main.ajaxRequest({
                url: 'https://' + hostB + '/api/tx/' + data.hash,
                // Success function called when we receive a success response
                success: function(o){
                    if(!o.error){
                        var fee = (data.fee=='NA') ? data.fee : numeral(String(data.fee).replace('+','').replace('-','')).format('0.00000000');
                        me.updateData(Ext.apply(o,{ 
                            asset: o.asset,
                            quantity: o.quantity,
                            hash: data.hash,
                            message: o.text,
                            value: o.value,
                            type: o.tx_type,
                            feePaid: o.fee + ' XCP',
                            transfer: (o.transfer) ? 'True' : 'False',
                            locked: (o.locked) ? 'True' : 'False',
                            divisible: (o.divisible) ? 'True' : 'False',
                            status : (o.status) ? o.status : 'Pending'
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
