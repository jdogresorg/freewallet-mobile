/*
 * Main.js - View
 * 
 * Displays main application view
 */
 
Ext.define('FW.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',

    requires: [
        'Ext.TitleBar'
    ],

    config: {
        id: 'mainView',
        tabBarPosition: 'bottom',
        layout:  {
            type: 'card',
            animation: 'fade'
        },
        items: [
            {iconCls: 'piggybank',  title: 'Balances', xclass: 'FW.view.Balances'},
            {iconCls: 'fa-history', title: 'History',  xclass: 'FW.view.History'},
            {iconCls: 'fa-gears',   title: 'Tools',    xclass: 'FW.view.Tools'},
            {iconCls: 'user',       title: 'About',    xclass: 'FW.view.About'},
            {iconCls: 'settings',   title: 'Settings', xclass: 'FW.view.Settings'}
        ]
    }
});
