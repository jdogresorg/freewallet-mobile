/*
 * Tablet.js - Profile
 * 
 * Handle defining tablet profile and any phone-specific views
 */
 Ext.define('FW.profile.Tablet', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Tablet',
        // views to load then this profile is activated
        views: [
            'Balances'
        ]
    },

    // Activate this profile if we have 1000 or more pixels
    isActive: function(){
        var vp = Ext.Viewport,
            s  = vp.getSize(),
            w  = (s.width>s.height) ? s.width : s.height;
        return (w>=1000);
    }
});