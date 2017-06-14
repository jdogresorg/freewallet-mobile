/*
 * TransactionsList.js - View
 * 
 * Handles displaying transaction history list
 */

Ext.define('FW.view.TransactionsList', {
    extend: 'Ext.dataview.List',
    xtype: 'fw-transactionslist',

    config: {
        id: 'transactionsList',
        cls: 'fw-panel fw-transactionslist',
        bgCls: 'fw-background',
        infinite: true,
        itemHeight: 60,
        striped: true,
        disableSelection: false,
        store: 'Transactions',
        emptyText: 'No transactions found',
        deferEmptyText: false,
        itemTpl: new Ext.XTemplate(
            '<div class="fw-transactionslist-item {[this.getClasses(values)]}">' +
                '<div class="fw-transactionslist-icon">' +
                    '{[this.getIcon(values)]}' +
                '</div>' +
                '<div class="fw-transactionslist-info">' +
                    '<div class="fw-transactionslist-amount">{[this.getDescription(values)]}</div>' +
                    '<div class="fw-transactionslist-currency">{asset}</div>' +
                    '<div class="fw-transactionslist-timestamp">{[this.getTimestamp(values.time)]}</div>' +
                '</div>' +
            '</div>',
            {
                getIcon: function(values){
                    var type = values.type,
                        src  = 'resources/images/icons/btc.png';
                    if(type=='bet'){
                        src = 'resources/images/icons/xcp.png';
                    } else if(type=='broadcast'){
                        src = 'resources/images/icons/broadcast.png';
                    } else if(type=='dividend'){
                        src = 'resources/images/icons/dividend.png';
                    } else if((type=='send'||type=='order'||type=='issuance') && values.asset!='BTC'){
                        src = 'https://xchain.io/icon/'  + String(values.asset).toUpperCase() + '.png';
                    }
                    icon = '<img src="' + src + '"/>';
                    return icon;

                },
                toLower: function(val){
                    return String(val).toLowerCase();
                },
                getDescription: function(values){
                    var str  = '',
                        fmt  = '0,0',
                        type = values.type,
                        amt  = String(values.quantity).replace('-','');
                    if(type=='send'){
                        str = (/\-/.test(values.quantity)) ? 'Sent ' : 'Received ';
                    } else if(type=='bet'){
                        str = 'Bet ';
                    } else if(type=='broadcast'){
                        str = 'Counterparty Broadcast';
                    } else if(type=='burn'){
                        str = 'Burned ';
                    } else if(type=='dividend'){
                        str = 'Paid Dividend on ';
                    } else if(type=='issuance'){
                        str = 'Counterparty Issuance';
                    } else if(type=='order'){
                        str = 'Order - Buy ';
                    }
                    if(type=='send'||type=='bet'||type=='burn'||type=='order'){
                        if(/\./.test(amt) || values.asset=='BTC')
                            fmt += '.00000000';
                        str += numeral(amt).format(fmt);
                    }
                    return str;
                },
                getClasses: function(values){
                    var type = values.type,
                        cls  = 'fw-transactionslist-item ';
                    if(type=='send')
                        cls += (/\-/.test(values.quantity)) ? ' fw-transactionslist-sent' : ' fw-transactionslist-received';
                    if(type=='bet'||type=='burn')
                        cls += ' fw-transactionslist-sent';
                    return cls;
                },
                getTimestamp: function(tstamp){
                    if(tstamp){
                        var dt = new Date(parseInt(tstamp + '000'));
                        return Ext.Date.format(dt,'m-d-Y H:i:s');
                    }
                    return 'Pending';
                }
            }
        ),
        listeners: {
            itemtap: function(cmp, index, target, record, e, eOpts){
                Ext.getCmp('historyView').showTransactionInfo(record.data);
            }
        },
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'My History',
            refresh: true,
            onRefresh: function(){
                var me = Ext.getCmp('transactionsList');
                if(me.refreshing)
                    return;
                me.refreshing = true;
                me.getStore().removeAll();
                me.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading History',
                    showAnimation: 'fadeIn',
                    indicator: true
                });
                // Define callback to run after we are done refreshing balances
                var cb = function(){
                    me.setMasked(false);
                    me.refreshing = false;
                };
                me.main.getAddressHistory(FW.WALLET_ADDRESS.address, cb);
            }        
        }]
    },

    initialize: function(){
        var me  = this;
        // Setup alias to toolbar
        me.main = FW.app.getController('Main');
        me.tb   = me.down('fw-toptoolbar');
        // Display the menu button if we are on a phone
        if(me.main.deviceType=='phone')
            me.tb.menuBtn.show();
        // Display address label in titlebar, wrap at 220 pixels, display address on tap
        me.tb.tb.setTitle(FW.WALLET_ADDRESS.label);
        var title = me.tb.tb.element.down('.x-title');
        title.setMaxWidth(220);
        title.on('tap',function(){ me.main.showQRCodeView({ text: FW.WALLET_ADDRESS.address }); });
        // Call parent function
        me.callParent();
        // Handle sorting currencies by type and name
        // We do this so we show currencies (BTC,XCP) before assets
        me.getStore().sort([{
            property : 'time',
            direction: 'DESC'
        }]);
    }

});
