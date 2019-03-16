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
            var url = me.hash.url;
            if(url)
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
        if(type=='Cancel')
            type = 'Cancel Order';
        me.asset.setValue(asset);    
        me.type.setValue(type);
        me.quantity.setValue(numeral(qty).format(fmt));
        me.source.setValue(data.source);
        me.destination.setValue(data.destination);
        me.hash.setValue(data.hash);
        me.hash.url = data.url;
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
        var me    = this;
        // Set loading mask on panel to indicate we are loading 
        me.setMasked({
            xtype: 'loadmask',
            cls: 'fw-panel',
            message: 'Loading Data',
            showAnimation: 'fadeIn',
            indicator: true
        });
        if(data.asset=='BTC'){
            var net  = (FW.WALLET_NETWORK==2) ? '/testnet' : '',
                url  = 'https://blockstream.info' + net + '/api/tx/' + data.hash,
                href = 'https://blockstream.info' + net + '/tx/' + data.hash;
            // Request transaction information from blockstream
            me.main.ajaxRequest({
                url: url,
                success: function(o){
                    if(o.txid){
                        var fee = (data.fee=='NA') ? data.fee : numeral(String(data.fee).replace('+','').replace('-','')).format('0.00000000');
                        me.updateData(Ext.apply(o,{ 
                            type: 'Send',
                            asset: 'BTC',
                            quantity: numeral(o.vout[0].value).multiply(0.00000001).format('0,0.00000000'),
                            hash: data.hash,
                            status: (o.status.block_height) ? 'Valid' : 'Pending',
                            source: o.vin[0].prevout.scriptpubkey_address,
                            destination: o.vout[0].scriptpubkey_address,
                            block_index: o.status.block_height,
                            timestamp: o.status.block_time,
                            fee: numeral(o.fee).multiply(0.00000001).format('0,0.00000000'),
                            url: href
                        }));
                        me.setMasked(false);
                    }
                },
                failure: function(o){
                    var net  = (FW.WALLET_NETWORK==2) ? 'test3' : 'main',
                        net2 = (FW.WALLET_NETWORK==2) ? 'btc-testnet' : 'btc',
                        url  = 'https://api.blockcypher.com/v1/btc/' + net + '/txs/' + data.hash,
                        href = 'https://live.blockcypher.com/' + net2 + '/tx/' + data.hash
                    // Request transaction information from blockstream
                    me.main.ajaxRequest({
                        url: url,
                        success: function(o){
                            if(o.hash){
                                var fee = (data.fee=='NA') ? data.fee : numeral(String(data.fee).replace('+','').replace('-','')).format('0.00000000');
                                me.updateData(Ext.apply(o,{ 
                                    type: 'Send',
                                    asset: 'BTC',
                                    quantity: numeral(o.outputs[0].value).multiply(0.00000001).format('0,0.00000000'),
                                    hash: data.hash,
                                    status: (o.block_height) ? 'Valid' : 'Pending',
                                    source: o.inputs[0].addresses[0],
                                    destination: '-',
                                    block_index: numeral(o.block_height).format('0,0'),
                                    timestamp: moment(o.confirmed,["YYYY-MM-DDTH:m:s"]).unix(),
                                    fee: numeral(o.fee).multiply(0.00000001).format('0,0.00000000'),
                                    url: href
                                }));
                                me.setMasked(false);
                            }
                        }
                    });
                }
            });
        } else {
            // Handle requesting transaction info from xchain.io API
            var host = (FW.WALLET_NETWORK==2) ? 'testnet.xchain.io' : 'xchain.io';
            me.main.ajaxRequest({
                url: 'https://' + host + '/api/tx/' + data.hash,
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
                            status : (o.status) ? o.status : 'Pending',
                            url: 'https://' + host + '/tx/' + data.hash
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