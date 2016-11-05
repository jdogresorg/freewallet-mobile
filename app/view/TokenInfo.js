/*
 * TokenInfo.js - View
 * 
 * Handle displaying information about the token (name, supply, currency, etc).
 */

 Ext.define('FW.view.TokenInfo', {
    extend: 'Ext.Container',
    xtype: 'fw-tokeninfo',

    requires:[
        'Ext.Img',
        'FW.view.phone.TokenInfo',
        'FW.view.tablet.TokenInfo'
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
        me.add({ xclass:'FW.view.' + me.main.deviceType + '.TokenInfo' });
        // Now that we have added the correct view, setup some aliases to various components
        me.tb          = me.down('fw-toptoolbar');
        me.image       = me.down('[itemId=image]');
        me.currency    = me.down('[itemId=currency]');
        me.balance     = me.down('[itemId=balance]');
        me.description = me.down('[itemId=description]');
        me.supply      = me.down('[itemId=supply]');
        me.price       = me.down('[itemId=price]');
        me.btc         = me.down('[itemId=btc]');
        me.divisible   = me.down('[itemId=divisible]');
        me.locked      = me.down('[itemId=locked]');
        me.website     = me.down('[itemId=website]');
        me.issuer      = me.down('[itemId=issuer]');
        me.owner       = me.down('[itemId=owner]');
        me.actionBtns  = me.down('[itemId=actionButtons]');
        me.sendBtn     = me.down('[itemId=send]');
        me.receiveBtn  = me.down('[itemId=receive]');
        // Tablet specific fields
        me.placeholder = me.down('[itemId=placeholder]');
        me.information = me.down('[itemId=information]');
        // Setup listeners on the buttons to handle user tapping button
        me.sendBtn.on('tap',function(btn){
            me.main.showTool('send', {
                reset: true,
                currency: me.getData().currency
            });
        });
        // Handle displaying current address and currency in QRCode
        me.receiveBtn.on('tap',function(btn){ 
            me.main.showTool('receive', {
                reset: true,
                asset: me.getData().currency
            });
        });
        me.callParent();
    },


    // Handle updating the view
    updateView: function(cfg){
        var me   = this,
            data = cfg.data;
        // Store current data so we can easily reference
        me.setData(data);
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
        // Update currency name and image
        me.image.setSrc('https://counterpartychain.io/content/images/icons/' + data.currency.toLowerCase() + '.png');
        me.updateData(data);
        // Get the basic currency information
        me.getCurrencyInfo(data);
    },


    // Handle updating view data
    updateData: function(data){
        var me  = this,
            fmt = '0,0';
        if(data.divisible)
            fmt += '.00000000';
        // Define balance
        var bal = numeral(data.amount).format(fmt),
            btc = 'NA';
        // Handle determining the USD price
        if(typeof FW.TRACKED_PRICES[data.currency] != 'undefined'){
            var o = FW.TRACKED_PRICES[data.currency];
            bal += ' ($' + numeral(o.USD * data.amount).format('0,0.00') + ')';
            data.price = numeral(o.USD).format('0,0.00');
            data.btc = numeral(o.BTC).format('0,0.00000000');
        }
        me.description.setValue(data.description);
        me.currency.setValue((data.currency=='BTC') ? 'BTC (Bitcoin)' : data.currency);
        me.supply.setValue(numeral(data.supply).format(fmt));
        me.divisible.setValue((data.divisible) ? 'True' : 'False');
        me.locked.setValue((data.locked) ? 'True' : 'False');
        me.website.setValue((data.website) ? data.website : '');
        me.issuer.setValue((data.issuer) ? data.issuer : 'NA');
        me.owner.setValue((data.owner) ? data.owner : 'NA');
        me.balance.setValue(bal);
        me.price.setValue((data.price) ? '$' + data.price : 'NA');
        me.btc.setValue((data.btc) ? data.btc : 'NA');
    },


    // Handle requesting basic asset information
    getCurrencyInfo: function(data){
        var me   = this;
        // Stash raw currency value, so we can easily 
        me.currencyValue = data.currency;
        if(data.currency=='BTC'){
            me.updateData({
                currency: 'BTC',
                amount: data.amount,
                supply: '21000000.00000000',
                website: 'http://bitcoin.org',
                divisible: true,
                locked: true,
                description: 'Bitcoin is digital money'
            });
        } else {
            var host = (FW.WALLET_NETWORK==2) ? 'testnet.counterpartychain.io' : 'counterpartychain.io';
            // Set loading mask on panel to indicate we are loading 
            me.setMasked({
                xtype: 'loadmask',
                cls: 'fw-panel',
                message: 'Loading Data',
                showAnimation: 'fadeIn',
                indicator: true
            });
            // Make request for data on currency
            me.main.ajaxRequest({
                url: 'https://' + host + '/api/asset/' + data.currency,
                // Success function called when we receive a success response
                success: function(o){
                    if(o.success){
                        var desc = o.description;
                        if(me.main.isUrl(desc))
                            o.website = desc;
                        if(data.currency=='XCP'){
                            o.website = 'https://counterparty.io';
                            o.description = 'Counterparty extends Bitcoin in new and powerful ways.';                       
                        }
                        me.updateData(Ext.apply(o,{ 
                            amount: data.amount,
                            currency: data.currency
                        }));
                        // Detect any .json urls and request the extra data
                        if(/.json$/.test(desc))
                            me.getEnhancedCurrencyInfo(desc);
                    }
                },
                // Callback function called on any response
                callback: function(){
                    me.setMasked(false);
                }    
            });            
        }
    },


    // Handle requesting enhanced currency information
    getEnhancedCurrencyInfo: function(url){
        var me = this;
        if(!me.main.isUrl(url))
            url = 'http://' + url;
        // Switch http to https if app loaded via https (https->http XHR requests will fail)
        if(document.location.protocol=='https:')
            url = url.replace('http://','https://');
        me.main.ajaxRequest({
            url: url,
            // Success function called when we receive a success response
            success: function(o){
                // console.log('enhanced info o=',o);
                if(o.website)
                    me.website.setValue(o.website);
                // if(o.image)
                //     me.image.setSrc(o.image);
            }
        });            
    }
});
