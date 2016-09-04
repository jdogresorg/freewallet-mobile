/*
 * Addresses.js - Store 
 */
Ext.define('FW.store.Addresses', {
    extend: 'Ext.data.Store',
    requires:['Ext.data.proxy.LocalStorage'],

    config: {
        model: 'FW.model.Addresses',
        // storeId: 'Addresses',
        autoLoad: true,
        autoSync: true,
        // Set this proxy to store data in localStorage
        proxy: {
            type: 'localstorage',
            id: 'Addresses'
        }
    }
});
