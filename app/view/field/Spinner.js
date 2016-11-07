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
            // Change type to number since it shows numbers keyboard, and allows for additional chars like ,
            type: 'number',
            disabled: false
        },
        divisible: false // Flag to indicate if the amount is divisible
    },
    

    // Override default applyValue function to force number to be in correct display format
    applyValue : function(value, oldValue){
        var me  = this,
            fmt = (me.divisible) ? '0,0.00000000' : '0,0',
            val = numeral(value).format(fmt);
        return val
    },


    // Override default spin function to force numeric values
    spin: function(down){
        var me        = this,
            format    = (me.divisible) ? '0.00000000' : '0',
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
        value = value.format(format);
        me.setValue(value);
        me.fireEvent('spin', me, value, direction);
        me.fireEvent('spin' + direction, me, value);
    },


    // Handle setting flag to determine if value is divisible
    setDivisible: function(divisible){
        var me  = this,
            div = (divisible) ? true : false;
        me.divisible = div;
        me.setValue(me.getValue());
    },

    getValue: function(){
        var me = this;
        return me.getComponent().getValue();
    }

});
