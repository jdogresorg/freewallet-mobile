/*
 * BalancesList.js - View
 * 
 * Display list of balances
 */

Ext.define('FW.view.BalancesList', {
    extend: 'Ext.dataview.List',
    xtype: 'fw-balanceslist',

    config: {
        id: 'balancesList',
        cls: 'fw-panel fw-balanceslist x-list-nopadding',
        bgCls: 'fw-background',
        infinite: true,
        striped: true,
        disableSelection: false,
        store: 'Balances',
        emptyText: '',
        itemHeight: 60,
        itemTpl: new Ext.XTemplate(
            '<div class="fw-balanceslist-item">' +
                '<div class="fw-balanceslist-icon">' +
                    '<img src="https://counterpartychain.io/content/images/icons/{[this.toLower(values.currency)]}.png">' + 
                '</div>' +
                '<div class="fw-balanceslist-info">' +
                    '<div class="fw-balanceslist-currency">{currency}</div>' +
                    '<div>' +
                        '<div class="fw-balanceslist-amount">{[this.numberFormat(values)]}</div>' +
                        '<div class="fw-balanceslist-price">{[this.priceFormat(values)]}</div>' +
                    '</div>' +
                '</div>' +
            '</div>',
            {
                toLower: function(val){
                    return String(val).toLowerCase();
                },
                numberFormat: function(values){
                    var fmt = '0,0',
                        amt = values.amount;
                    if(/\./.test(amt) || values.currency=='BTC')
                        fmt += '.00000000';
                    return numeral(amt).format(fmt);
                },
                priceFormat: function(values){
                    var str = '';
                    if(typeof FW.TRACKED_PRICES[values.currency] != 'undefined')
                        str = '$' + numeral(FW.TRACKED_PRICES[values.currency]['USD'] * values.amount).format('0,0.00');
                    return str;
                }
            }
        ),
        listeners: {
            itemtap: function(cmp, index, target, record, e, eOpts){
                Ext.getCmp('balancesView').showTokenInfo(record.data);
            }
        },
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'My Balances',
            refresh: true,
            onRefresh: function(){
                var me = Ext.getCmp('balancesList');
                if(me.refreshing)
                    return;
                me.refreshing = true;
                me.getStore().removeAll();
                me.setMasked({
                    xtype: 'loadmask',
                    message: 'Refreshing Balances',
                    showAnimation: 'fadeIn',
                    indicator: true
                });
                // Define callback to run after we are done refreshing balances
                var cb = function(){
                    me.setMasked(false);
                    me.refreshing = false;
                };
                me.main.getAddressBalances(FW.WALLET_ADDRESS.address, cb);
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
            property : 'type',
            direction: 'ASC'
        },{
            property : 'currency',
            direction: 'ASC'
        }]);
    }

});
