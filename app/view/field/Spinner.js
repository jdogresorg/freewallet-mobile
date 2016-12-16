/*
 * Spinner.js - Field
 * 
 * Spinner field to support floating numbers
 */
Ext.define('FW.view.field.Spinner', {
    extend: 'Ext.field.Spinner',
    xtype: 'fw-spinnerfield',
    
    config : {
        component: {
            type: 'tel',    // Use 'tel' so we bring up simple number keyboard
            disabled: false, 
            readOnly: false  // Fixes issue on android that prevents editing of numbers
        },
        decimalPrecision: 0, // default to 0 (integers only)
        listeners: {
            // when user blurs field, re-set value to enforce formatting
            blur: function(cmp){
                cmp.setValue(cmp.getValue());
            }            
        }
    },


    // Initialize the component and some values
    initialize: function(){
        var me  = this,
            cfg = me.config;
        me.decimalPrecision = cfg.decimalPrecision;
        me.callParent();
    },


    // Force numbers to display in friendly format with commas
    applyValue : function(value, oldValue){
        var me = this;
        return numeral(value).format(me.getNumberFormat())
    },


    // Handle getting display format
    getNumberFormat: function(){
        var me  = this,
            fmt = '0,0';
        if(me.decimalPrecision){
            fmt += '.';
            for(var i=0;i<me.decimalPrecision;i++)
                fmt += '0';
        }
        return fmt;
    },


    // Override default spin function to force numeric values
    spin: function(down){
        var me        = this,
            origValue = me.getComponent().getValue(),
            stepValue = me.getStepValue(),
            direction = down ? 'down' : 'up',
            minValue  = numeral(me.getMinValue()),
            maxValue  = numeral(me.getMaxValue()),
            value;
        // Add or subtract from value
        if(down){
            value = numeral(origValue).subtract(stepValue);
        } else {
            value =  numeral(origValue).add(stepValue);
        }
        // Enforce min/max values
        if(value<minValue)
            value = minValue;
        if(value>maxValue)
            value = maxValue;
        // Set value and fire off spin events
        me.setValue(value);
        me.fireEvent('spin', me, value, direction);
        me.fireEvent('spin' + direction, me, value);
    },


    // Handle changing decimal precision
    setDecimalPrecision: function(val){
        var me  = this;
        me.decimalPrecision = val;
        me.setValue(me.getValue());
    },


    getValue: function(){
        var me = this;
        return me.getComponent().getValue();
    }

});
