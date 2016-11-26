/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'FW',

    requires: [
        'Ext.device.Device',
        'Ext.MessageBox',
        'Ext.device.Device',
        'FW.ux.AccordionList',
        'FW.ux.AccordionListItem',
        'Ext.field.Spinner',
        'FW.view.field.Action',
        'FW.view.field.Spinner',
        'FW.view.field.Select'
    ],

    controllers: [
        'Main',
        'Counterparty'
    ],

    profiles: [
        'Phone', 
        'Tablet'
    ],

    models: [
        'Addresses',
        'Balances',
        'Transactions',
        'MenuTree'
    ],

    stores: [
        'Addresses',
        'Balances',
        'Transactions'
    ],

    views: [
        'Main',
        'Settings',
        'MessageBox',
        'AddressList',
        'Balances',
        'BalancesList',
        'TransactionsList',
        'Passcode',
        'About',
        'History',
        'TopToolbar',
        'MenuTree',
        'MainMenu',
        'TokenInfo',
        'TransactionInfo',
        'Tools',
        'ToolsList',
        'Broadcast',
        'Exchange',
        'Issuance',
        'Send',
        'Receive',
        'Sign',
        'Welcome',
        'Passphrase',
        'Scan',
        'QRCode',
        'TransactionPriority',
        'Bet',
        'Dividend',
        'Callback'
    ],

    icon: {
        '57': 'resources/icons/wallet-icon-57.png',
        '72': 'resources/icons/wallet-icon-72.png',
        '114': 'resources/icons/wallet-icon-114.png',
        '144': 'resources/icons/wallet-icon-144.png'
    },

    isIconPrecomposed: true,

    // Startup images used when launching app in a browser
    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    onUpdated: function() {
        FW.app.getController('Main').clearAppCache();
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
