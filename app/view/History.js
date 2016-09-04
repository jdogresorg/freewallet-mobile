/*
 * History.js - View
 * 
 * Handles displaying transaction history
 */

Ext.define('FW.view.History', {
    extend: 'Ext.Container',

    requires:[
        'FW.view.phone.History',
        'FW.view.tablet.History'
    ],

    config: {
        id: 'historyView',
        layout: 'card',
        items:[]
    },


    initialize: function(){
        var me = this;
        // Setup alias to main controller
        me.main  = FW.app.getController('Main');
        // Add view based on device type
        me.add({ xclass:'FW.view.' + me.main.deviceType + '.History' });
        // Setup some aliases to the various components
        me.list  = me.down('fw-transactionslist');
        me.info  = me.down('fw-transactioninfo');
        me.cards = me.down('[itemId=history]');
        // Call parent function
        me.callParent();
    },


    // Handle displaying the currency information
    showTransactionInfo: function(data){
        var me = this;
        var cfg = {
            html:'stuff here',
            data: data
        };
        // Set some options for phones
        if(me.main.deviceType=='phone'){
            cfg.back = function(){
                me.cards.setActiveItem(0);
            }
        }
        // Set the currency info view as active
        me.cards.setActiveItem(1);
        // Handle updating the currency info view
        me.info.updateView(cfg);
    }

});


// Ext.define('FW.view.History', {
//     extend: 'Ext.dataview.List',
//     xtype: 'fw-history',

//     config: {
//         cls: 'fw-panel fw-historylist',
//         bgCls: 'fw-background',
//         infinite: true,
//         variableHeights: true,
//         striped: true,
//         disableSelection: true,
//         store: 'Transactions',
//         emptyText: 'No transactions found',
//         itemTpl: new Ext.XTemplate(
//             '<div class="fw-historylist-item {[this.getClasses(values)]}">' +
//                 '<div class="fw-historylist-icon">' +
//                     '<img src="http://counterpartychain.io/content/images/icons/{[this.toLower(values.currency)]}.png">' + 
//                 '</div>' +
//                 '<div class="fw-historylist-info">' +
//                     '<div class="fw-historylist-amount">{[this.sentReceived(values)]} {[this.numberFormat(values.amount)]}</div>' +
//                     '<div class="fw-historylist-currency">{currency}</div>' +
//                     '<div class="fw-historylist-timestamp">{[this.getTimestamp(values.time)]}</div>' +
//                 '</div>' +
//             '</div>',
//             {
//                 toLower: function(val){
//                     return String(val).toLowerCase();
//                 },
//                 numberFormat: function(val){
//                     var fmt = '0,0',
//                         val = String(val).replace('-','');
//                     if(/\./.test(val))
//                         fmt += '.00000000';
//                     return numeral(val).format(fmt);
//                 },
//                 sentReceived: function(values){
//                     var str = 'Received';
//                     if(values.type==1 && /\-/.test(values.amount))
//                         str = 'Sent';
//                     return str;
//                 },
//                 getClasses: function(values){
//                     var cls = 'fw-historylist-item ';
//                     if(values.type==1)
//                         cls += (/\-/.test(values.amount)) ? ' fw-historylist-sent' : ' fw-historylist-received';
//                     return cls;
//                 },
//                 getTimestamp: function(tstamp){
//                     return Ext.Date.format(new Date(tstamp),'m-d-Y H:i:s');
//                 }
//             }
//         ),
//         listeners: {
//             itemtap: function(){
//                 Ext.Msg.alert(null,'Coming Soon');
//             }
//         },
//         items:[{
//             xtype: 'fw-toptoolbar',
//             title: 'My History',
//             menu: true
//         }]
//     },

//     initialize: function(){
//         var me  = this;
//         me.callParent();
//         // Handle sorting currencies by type and name
//         // We do this so we show currencies (BTC,XCP) before assets
//         me.getStore().sort([{
//             property : 'time',
//             direction: 'DESC'
//         }]);
//     },

// });
