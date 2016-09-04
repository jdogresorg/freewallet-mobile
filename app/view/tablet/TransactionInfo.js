/*
 * TransactionInfo.js - View
 * 
 * Display transaction information on tablet
 */
 Ext.define('FW.view.tablet.TransactionInfo', {
    extend: 'Ext.Container',

    config: {
        layout: 'vbox',
        scrollable: 'vertical',
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'Transaction Info',
            menu: true
        },{
            xtype: 'container',
            itemId: 'placeholder',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'top'
            },
            margin: '5 0 5 0',
            items:[{
                html:'<center><img src="resources/images/logo.png" width="90%" style="max-width:350px;"></center>'
            },{
                margin: '10 0 0 0',
                cls: 'fw-transactioninfo-instructions',
                html:'<center>Please select a transaction<br/>from the list on the left</center>'
            }]
        },{
            xtype: 'container',
            itemId: 'information',
            hidden: true,
            layout: 'vbox',
            margin: '5 5 5 5',
            items:[{
                xtype: 'container',
                itemId: 'iconContainer',
                layout: 'hbox',
                margin: '0 0 5 0',
                defaults: {
                    margin: '0 0 0 0'
                },
                items:[{
                    xtype: 'fieldset',
                    width: 65,
                    layout: {
                        type:'vbox',
                        pack:'center',
                        align: 'center'
                    },
                    items:[{
                        xtype: 'image',
                        itemId: 'image',
                        src: 'resources/images/wallet.png',
                        width: 48,
                        height: 48
                    }]
                },{
                    xtype: 'fieldset',
                    margin: '0 0 0 5',
                    flex: 1,
                    items:[{
                        labelAlign: 'top',
                        xtype: 'textfield',
                        readOnly: true,
                        label: 'Currency Name',
                        itemId: 'currency',
                        value: ''
                    }]
                }]
            },{
                xtype: 'fieldset',
                margin: '0 0 5 0',
                defaults:{
                    xtype: 'textfield',
                    labelWidth: 80,
                    readOnly: true
                },
                items:[{
                    label: 'TX Type',
                    itemId: 'type'
                },{
                    label: 'Source',
                    itemId: 'source'
                },{
                    label: 'Issuer',
                    itemId: 'issuer'
                },{
                    label: 'Destination',
                    itemId: 'destination'
                },{
                    label: 'Amount',
                    itemId: 'amount'
                },{
                    label: 'Description',
                    itemId: 'description'
                },{
                    label: 'Divisible',
                    itemId: 'divisible'
                },{
                    label: 'Locked',
                    itemId: 'locked'
                },{
                    label: 'Transfer',
                    itemId: 'transfer'
                },{
                    label: 'Fee Paid',
                    itemId: 'feePaid'
                },{
                    label: 'TX Hash',
                    itemId: 'hash'
                },{
                    label: 'Block #',
                    itemId: 'block'
                },{
                    label: 'Timestamp',
                    itemId: 'timestamp'
                },{
                    label: 'Miner Fee',
                    itemId: 'fee'
                },{
                    label: 'Status',
                    itemId: 'status'
                },{
                    label: 'Value',
                    itemId: 'value'
                },{
                    xtype: 'textareafield',
                    labelAlign: 'top',
                    label: 'Message',
                    itemId: 'message'
                }]
            }]
        }]
    }

});
