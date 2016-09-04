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
                    '<div class="fw-transactionslist-amount">' +
                        '<tpl if="type == 1">' +
                            '{[this.getAmount(values)]}' +
                        '<tpl elseif="type == 2">' +
                            'Counterparty Broadcast' +
                        '<tpl elseif="type == 3">' +
                            'Counterparty Issuance' +
                        '</tpl>' +
                    '</div>' +
                    '<div class="fw-transactionslist-currency">{currency}</div>' +
                    '<div class="fw-transactionslist-timestamp">{[this.getTimestamp(values.time)]}</div>' +
                '</div>' +
            '</div>',
            {
                getIcon: function(values){
                    var src = 'resources/images/icons/btc.png';
                    if(values.type==2){
                        src = 'resources/images/icons/broadcast.png';
                    } else if(values.type==3){
                        src = 'resources/images/icons/issuance.png';
                    } else if(values.type==1 && values.currency!='BTC'){
                        src = 'https://counterpartychain.io/content/images/icons/'  + String(values.currency).toLowerCase() + '.png';
                    }
                    icon = '<img src="' + src + '"/>';
                    return icon;

                },
                toLower: function(val){
                    return String(val).toLowerCase();
                },
                getAmount: function(values){
                    var str = 'Received ',
                        fmt = '0,0',
                        amt = String(values.amount).replace('-','');
                    if(values.type==1 && /\-/.test(values.amount))
                        str = 'Sent ';
                    if(/\./.test(amt) || values.currency=='BTC')
                        fmt += '.00000000';
                    str += numeral(amt).format(fmt);
                    return str;
                },
                getClasses: function(values){
                    var cls = 'fw-transactionslist-item ';
                    if(values.type==1)
                        cls += (/\-/.test(values.amount)) ? ' fw-transactionslist-sent' : ' fw-transactionslist-received';
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
