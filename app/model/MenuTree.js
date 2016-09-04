/*
 * MenuTree.js - Model
 */
Ext.define('FW.model.MenuTree', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'text', type: 'string'},
            {name: 'icon', type: 'string'}
        ]
    }
});

