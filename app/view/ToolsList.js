/*
 * ToolsList.js - View
 * 
 * Handle displaying list of tools
 */

 Ext.define('FW.view.ToolsList', {
    extend: 'Ext.Container',
    xtype: 'fw-toolslist',

    config: {
        layout: 'vbox',
        scrollable: 'vertical',
        cls: 'fw-panel',
        items: [{
            xtype: 'fw-toptoolbar',
            title: 'Tools'
        },{
            xtype: 'container',
            margin: '5 5 5 5',
            defaults: {
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    cls: 'fw-tools-button',
                    iconAlign: 'top',
                    margin: '0 5 5 0',
                    height: 100,
                    flex: 1
                }
            },
            items: [{
                items: [{
                    text: 'Send',
                    iconCls: 'fa fa-paper-plane fa-2x',
                    handler: function(){
                        FW.app.getController('Main').showTool('send',{ reset: true });
                    }
                },{
                    text: 'Receive',
                    iconCls: 'fa fa-smile-o fa-2x',
                    handler: function(){
                        FW.app.getController('Main').showTool('receive',{ reset: true });
                    }
                },{
                    text: 'Issue<br>Token',
                    iconCls: 'fa fa-institution fa-2x',
                    margin: '0 0 5 0',
                    handler: function(){
                        FW.app.getController('Main').showTool('issue',{ reset: true });
                    }
                }]
            },{
                items: [{
                    text: 'Broadcast<br/>Message',
                    iconCls: 'fa fa-bullhorn fa-2x',
                    handler: function(){
                        FW.app.getController('Main').showTool('broadcast',{ reset: true });
                    }
                },{
                    text: 'Sign<br>Message',
                    iconCls: 'fa fa-edit fa-2x',
                    handler: function(){
                        FW.app.getController('Main').showTool('sign',{ reset: true });
                    }
                },{
                    text: 'Decentralized<br>Exchange',
                    iconCls: 'fa fa-exchange fa-2x',
                    margin: '0 0 5 0',
                    handler: function(){
                        FW.app.getController('Main').showTool('exchange',{ reset: true });
                    }
                }]
            // },{
            //     items: [{
            //         text: 'Create<br/>Bet',
            //         iconCls: 'fa fa-book fa-2x',
            //         handler: function(){
            //             FW.app.getController('Main').showTool('bet',{ reset: true });
            //         }
            //     },{
            //         text: 'Pay<br/>Dividend',
            //         iconCls: 'fa fa-book fa-2x',
            //         handler: function(){
            //             FW.app.getController('Main').showTool('dividend',{ reset: true });
            //         }
            //     },{
            //         text: 'OTC<br>Market',
            //         iconCls: 'fa fa-book fa-2x',
            //         margin: '0 0 5 0',
            //         handler: function(){
            //             FW.app.getController('Main').showTool('otcmarket',{ reset: true });
            //         }
            //     }]
            }]

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
    }

});
