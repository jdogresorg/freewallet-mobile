/*
 * TokenInfo.js - View
 * 
 * Display info about specific token or currency on phone
 */
 Ext.define('FW.view.phone.TokenInfo', {
    extend: 'Ext.Container',

    config: {
        layout: 'vbox',
        scrollable: 'vertical',
        cls: 'fw-panel',
        items:[{
            xtype: 'fw-toptoolbar',
            title: 'Information',
            menu: true
        },{
            xtype: 'container',
            layout: 'vbox',
            margin: '5 5 5 5',
            cls: 'no-label-ellipsis',
            items:[{
                xtype: 'container',
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
                        itemId: 'currency',
                        value: ''
                    }]
                }]
            },{
                xtype: 'container',
                layout: 'hbox',
                itemId: 'actionButtons',
                margin: '0 0 5 0',
                defaults: {
                    xtype: 'button',
                    flex: 1
                },
                items: [{
                    text: 'Send',
                    ui: 'confirm',
                    itemId: 'send',
                    iconCls: 'fa fa-paper-plane'
                },{
                    text: 'Receive',
                    ui: 'action',
                    itemId: 'receive',
                    iconCls: 'fa fa-qrcode',
                    margin: '0 0 0 5'
                }]
            },{
                xtype: 'fieldset',
                margin: '0 0 5 0',
                defaults:{
                    xtype: 'textfield',
                    labelWidth: 80,
                    readOnly: true,
                    cls: 'no-label-ellipsis'
                },
                items:[{
                    label: 'My Balance',
                    itemId: 'balance'
                },{
                    label: 'Total Supply',
                    itemId: 'supply'
                },{
                    label: 'USD Price',
                    itemId: 'price'
                },{
                    label: 'BTC Price',
                    itemId: 'btc'
                },{
                    label: 'Divisible',
                    itemId: 'divisible'
                },{
                    label: 'Locked',
                    itemId: 'locked'
                },{
                    label: 'Issuer',
                    itemId: 'issuer'
                },{
                    label: 'Owner',
                    itemId: 'owner'
                },{
                    label: 'Description',
                    itemId: 'description'
                },{
                    xtype: 'fw-actionfield',
                    cls: 'x-last-field',
                    label: 'Website',
                    itemId: 'website',
                    iconCls: 'fa fa-globe',
                    handler: function(btn,url){
                        FW.app.getController('Main').openUrl(url);
                    }
                }]
            }]
        }]
    }

});
