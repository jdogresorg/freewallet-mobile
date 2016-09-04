/*
 * Action.js - Field
 * 
 * Field with an action button to the right button
 */

 Ext.define('FW.view.field.Action', {
    extend: 'Ext.Container',
    xtype: 'fw-actionfield',

    config: {
        layout: 'hbox',
        cls: 'x-action-field',
        items:[{
            xtype: 'container',
            cls: 'x-field-buttons',
            layout: 'hbox',
            items:[{
                xtype: 'button',
                iconCls: 'fa fa-edit',
                iconMask: true,
                ui: 'plain',
                margin: '5 0 5 0'
            }]
        }]
    },

    // Handle initializing the component and setting up the field
    initialize: function(){
        var me  = this,
            cfg = me.initialConfig;
        // Add the field
        var fld = Ext.apply(Ext.clone(cfg),{
            flex: 1,
            itemId: 'field',
            xtype: cfg.type || 'textfield'
        });
        // Setup alias to field and button
        me.btn   = me.down('button');
        me.field = me.insert(0,fld);
        // Handle updating the button config
        if(cfg.iconCls)
            me.btn.setIconCls(cfg.iconCls);
        // Setup tap listener which calls passes handler function button and field value
        me.btn.on('tap', function(cmp){
            if(cfg.handler)
                cfg.handler(cmp,me.field.getValue());
        });
        me.callParent();
    },

    getValue: function(){
        return this.field.getValue();
    },

    setValue: function(value){
        return this.field.setValue(value);
    },

    reset: function(){
        return this.field.reset();
    }

});