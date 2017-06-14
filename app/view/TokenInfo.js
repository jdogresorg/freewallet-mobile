/*
 * TokenInfo.js - View
 * 
 * Handle displaying information about the token (name, supply, description, etc).
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
        me.asset       = me.down('[itemId=asset]');
        me.balance     = me.down('[itemId=balance]');
        me.description = me.down('[itemId=description]');
        me.supply      = me.down('[itemId=supply]');
        me.xcp         = me.down('[itemId=xcp]');
        me.btc         = me.down('[itemId=btc]');
        me.usd         = me.down('[itemId=usd]');
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
                asset: me.getData().asset
            });
        });
        // Handle displaying current address and currency in QRCode
        me.receiveBtn.on('tap',function(btn){ 
            me.main.showTool('receive', {
                reset: true,
                asset: me.getData().asset
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
        me.image.setSrc('https://xchain.io/icon/' + data.asset.toUpperCase() + '.png');
        me.updateData(data);
        // Get the basic currency information
        me.getTokenInfo(data);
    },


    // Handle updating view data
    updateData: function(data){
        var me  = this,
            fmt = '0,0';
        if(data.divisible)
            fmt += '.00000000';
        // Define balance
        var bal   = numeral(data.quantity).format(fmt),
            asset = (data.asset_longname && String(data.asset_longname).trim().length) ? data.asset_longname : data.asset;
        me.description.setValue(data.description);
        me.asset.setValue(asset);
        me.supply.setValue(numeral(data.supply).format(fmt));
        me.divisible.setValue((data.divisible) ? 'True' : 'False');
        me.locked.setValue((data.locked) ? 'True' : 'False');
        var usd = (data.estimated_value) ? data.estimated_value.usd : 0,
            btc = (data.estimated_value) ? data.estimated_value.btc : 0,
            xcp = (data.estimated_value) ? data.estimated_value.xcp : 0;
        me.usd.setValue(numeral(usd).format('0,0.00'));
        me.btc.setValue(numeral(btc).format('0,0.00000000'));
        me.xcp.setValue(numeral(xcp).format('0,0.00000000'));
        me.website.setValue((data.website) ? data.website : '');
        me.issuer.setValue((data.issuer) ? data.issuer : 'NA');
        me.owner.setValue((data.owner) ? data.owner : 'NA');
        me.balance.setValue(bal);
    },


    // Handle requesting basic asset information
    getTokenInfo: function(data){
        var me   = this;
        if(data.asset=='BTC'){
            var price_usd = me.main.getCurrencyPrice('bitcoin','usd'),
                values = Ext.apply(data.estimated_value,{
                usd: price_usd
            });
            me.updateData({
                asset: 'BTC',
                quantity: data.quantity,
                supply: '21000000.00000000',
                website: 'http://bitcoin.org',
                divisible: true,
                locked: true,
                description: 'Bitcoin is digital money',
                estimated_value: values
            });
        } else {
            // Set loading mask on panel to indicate we are loading 
            me.setMasked({
                xtype: 'loadmask',
                cls: 'fw-panel',
                message: 'Loading Data',
                showAnimation: 'fadeIn',
                indicator: true
            });
            var successCb = function(o){
                var desc = o.description;
                if(me.main.isUrl(desc))
                    o.website = desc;
                if(data.asset=='XCP'){
                    o.website = 'https://counterparty.io';
                    o.locked = true;
                    o.description = 'Counterparty extends Bitcoin in new and powerful ways.';                       
                }
                me.updateData(Ext.apply(o,{ 
                    quantity: data.quantity,
                    asset: data.asset
                }));
                me.setMasked(false);
                // Detect any .json urls and request the extra data
                if(/.json$/.test(desc))
                    me.getEnhancedAssetInfo(desc);
            }
            me.main.getTokenInfo(data.asset, successCb);
        }
    },


    // Handle requesting enhanced asset information
    getEnhancedAssetInfo: function(url){
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
