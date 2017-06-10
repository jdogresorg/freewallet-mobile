/*
 * TransactionInfo.js - View
 * 
 * Display transaction information on phone
 */
 Ext.define('FW.view.phone.TransactionInfo', {
    extend: 'Ext.Container',

    config: {
        layout: 'vbox',
        scrollable: 'vertical',
        cls: 'fw-panel',
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'Transaction Info',
            menu: true
        },{
            xtype: 'container',
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
                        label: 'Name',
                        itemId: 'asset',
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
                    xtype: 'fw-actionfield',
                    iconCls: 'fa fa-files-o',
                    label: 'Source',
                    itemId: 'source'
                },{
                    xtype: 'fw-actionfield',
                    iconCls: 'fa fa-files-o',
                    label: 'Issuer',
                    itemId: 'issuer'
                },{
                    xtype: 'fw-actionfield',
                    iconCls: 'fa fa-files-o',
                    label: 'Destination',
                    itemId: 'destination'
                },{
                    label: 'Quantity',
                    itemId: 'quantity'
                },{
                    label: 'Description',
                    itemId: 'description'
                },{
                    label: 'Divisible',
                    itemId: 'divisible'
                },{
                    label: 'Buying',
                    itemId: 'buying'
                },{
                    label: 'Selling',
                    itemId: 'selling'
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
                    xtype: 'fw-actionfield',
                    label: 'TX Hash',
                    itemId: 'hash',
                    iconCls: 'fa fa-globe'
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
                    itemId: 'message',
                    maxRows: 1,
                    height: 70
                }]
            }]
        }]
    }

});
