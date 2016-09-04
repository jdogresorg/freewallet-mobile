/*
 * Passcode.js - View
 * 
 * Handles displaying a numeric keypad to collect a passcode
 */

Ext.define('FW.view.Passcode', {
    extend: 'Ext.Panel',
    requires: [
        'Ext.MessageBox',
        'Ext.field.Password'
    ],
    alias: 'widget.passcode',

    config: {
        fullscreen: true,
        id: 'passcodeView',
        centered: true,
        modal: true,
        scroll: false,
        width: 300,
        height: 350,
        value: '',
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'stretch'
        },
        items:[{
            xtype:'toolbar',
            itemId: 'toolbar',
            docked: 'top',
            cls: 'fw-panel',
            title: 'Please enter your passcode'
        },{
            xtype: 'container',
            itemId: 'indicator',
            margin: '0 5 0 5',
            height: 44,
            html: '<div class="passcode-indicator"></div>'
        },{
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'buttons',
            defaults: {
                flex: 1,
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults:{
                    xtype: 'button',
                    flex: 1,
                    margin: '5 5 5 5'
                }
            }
        }]
    },


    // Handle initializing the component and adding some buttons
    initialize: function(){
        var me    = this,
            cfg   = me.config,
            vp    = Ext.Viewport,
            items = [];
        // Setup some aliases
        me.tb           = me.down('[itemId=toolbar]');
        me.btnContainer = me.down('[itemId=buttons]');
        me.indicator    = me.down('[itemId=indicator]');
        // Setup alias on passcode indicator element 
        me.indicator.on('painted', function(el){
            if(!me.indicatorEl)
                me.indicatorEl = el.down('.passcode-indicator');
        });
        // Define back button
        var backBtn = {
            ui: 'decline',
            iconCls: 'fa fa-arrow-left',
            handler: function(){
                me.removeDigit(1);
            }
        };
        // Define done button
        var doneBtn = {
            ui: 'confirm',
            text: 'Done',
            handler: function(){
                // Use callback function if we have one, then destroy it
                if(me.cb){
                    me.cb(String(me.getValue()));
                    delete me.cb;
                }
                // Hide the component and reset the value & indicator
                me.hide();
                me.setValue('');
                me.updateIndicator();
            }
        };
        // Handle adding numeric buttons
        items.push({ items: [me.getDigitKey(1), me.getDigitKey(2), me.getDigitKey(3) ] });
        items.push({ items: [me.getDigitKey(4), me.getDigitKey(5), me.getDigitKey(6) ] });
        items.push({ items: [me.getDigitKey(7), me.getDigitKey(8), me.getDigitKey(9) ] });
        items.push({ items: [backBtn, me.getDigitKey(0), doneBtn ] })
        // Update container with new buttons
        me.btnContainer.setItems(items)
        me.updateView(cfg);
        me.setWindowSize();
        me.callParent();
        // Handle resizing passcode panel when necessary
        vp.on('orientationchange', function(){ me.setWindowSize(); });
    },


    // Handle updating the view config
    updateView: function(cfg){
        var me = this;
        // Handle updating callback
        if(cfg.cb)
            me.cb = cfg.cb;
        // Handle updating title in toolbar
        if(cfg.title)
            me.tb.setTitle(cfg.title);
    },


    // Handle setting passcode window size
    setWindowSize: function(){
        // Handle resizing passcode panel        
        var me = this,
            vp = Ext.Viewport,
            o  = vp.getOrientation(),
            s  = vp.getSize();
        // Handle shrinking passcode panel if needed
        if(o=='landscape' && s.height < 350){
            me.setSize(300, s.height);
        } else {
            me.setSize(300,350);
        }
    },

    // Handle returning a digit button config 
    getDigitKey: function(digit){
        var me  = this;
        // Define the basic button config
        var cfg = {
            xtype: 'button',
            text: String(digit),
            handler: function(){
                me.addDigit(digit);
            }
        };
        return cfg;
    },


    // Handle removing digit from value and updating indicator
    addDigit: function(digit){
        var me  = this,
            val = me.getValue() + String(digit).toString();
        me.setValue(val);
        me.updateIndicator();
    },


    // Handle removing digit from value and updating indicator
    removeDigit: function(digit){
        var me  = this,
            str = me.getValue(),
            val = str.substr(0,str.length - 1);
        me.setValue(val);
        me.updateIndicator();
    },


    // Handle updating the passcode indicator element
    updateIndicator: function(){
        var me  = this,
            txt = '',
            val = String(me.getValue());
        for(var i=0;i<val.length;i++)
            txt  += '&#9679;';
        me.indicatorEl.setHtml(txt);
    }


});