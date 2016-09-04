/*
 * Select.js - Field
 * 
 * Select field that supports custom picker templates
 */

Ext.define('FW.view.field.Select', {
    extend : 'Ext.field.Select',
    xtype  : 'fw-selectfield',

    // getTabletPicker function which handles using specified itemTpl
    getTabletPicker: function() {
        var config  = this.getDefaultTabletPickerConfig(),
            itemTpl = '<span class="x-list-label">{' + this.getDisplayField() + ':htmlEncode}</span>';
        if(config.itemTpl)
            itemTpl = config.itemTpl;
        if (!this.listPanel) {
            this.listPanel = Ext.create('Ext.Panel', Ext.apply({
                left          : 0,
                top           : 0,
                modal         : true,
                cls           : Ext.baseCSSPrefix + 'select-overlay',
                layout        : 'fit',
                hideOnMaskTap : true,
                width         : Ext.os.is.Phone ? '14em' : '18em',
                height        : (Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10) ? '12em' : (Ext.os.is.Phone ? '12.5em' : '22em'),
                items         : {
                    xtype     : 'list',
                    store     : this.getStore(),
                    itemTpl   : itemTpl,
                    listeners : {
                        select  : this.onListSelect,
                        itemtap : this.onListTap,
                        scope   : this
                    }
                }
            }, config));
        }

        return this.listPanel;
    },


    // getPhonePicker function which handles using specified itemTpl
    getPhonePicker: function(){
        var config   = this.getDefaultPhonePickerConfig(),
            pickerId = Ext.id();

        if (!this.picker) {
            this.picker = Ext.create('Ext.picker.Picker', Ext.apply({
                id: pickerId,
                slots: [
                    {
                        align: this.getPickerSlotAlign(),
                        name: this.getName(),
                        valueField: this.getValueField(),
                        displayField: this.getDisplayField(),
                        value: this.getValue(),
                        store: this.getStore()
                    }
                ],
                listeners: {
                    initialize: function(){
                        if(config.itemTpl){
                            var picker = Ext.getCmp(pickerId),
                                slots  = picker.down('pickerslot');
                            Ext.each(slots, function(slot){
                                slot.setItemTpl(config.itemTpl);
                            });
                        }
                    },                    
                    change: this.onPickerChange,
                    scope: this
                }
            }, config));
        }
        return this.picker;
    },


    // showPicker function which handles showing picker by given component
    showPicker: function(cmp) {
        var me    = this,
            store = me.getStore(),
            value = me.getValue();

        //check if the store is empty, if it is, return
        if (!store || store.getCount() === 0) {
            return;
        }

        if (me.getReadOnly()) {
            return;
        }

        me.isFocused = true;

        if (me.getUsePicker()) {
            var picker = me.getPhonePicker(),
                name = me.getName(),
                pickerValue = {};

            pickerValue[name] = value;
            picker.setValue(pickerValue);

            if (!picker.getParent()) {
                Ext.Viewport.add(picker);
            }

            picker.show();
        } else {
            var listPanel = me.getTabletPicker(),
                list = listPanel.down('list'),
                index, record;

            if (!listPanel.getParent()) {
                Ext.Viewport.add(listPanel);
            }
            // Set component to either current field, or 
            cmp = (cmp) ? cmp : me.getComponent();
            listPanel.showBy(cmp, null);

            if (value || me.getAutoSelect()) {
                store = list.getStore();
                index = store.find(me.getValueField(), value, null, null, null, true);
                record = store.getAt(index);

                if (record) {
                    list.select(record, null, true);
                }
            }
        }
    }    
});