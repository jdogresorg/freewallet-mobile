/*
 * Phone.js - Profile
 * 
 * Handle defining phone profile and any phone-specific views
 */
 Ext.define('FW.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Phone',
        // views to load then this profile is activated
        views: [
            'Balances'
        ]
    },

    // Activate this profile if we have less than 1000 pixels to use
    isActive: function(){
        var vp = Ext.Viewport,
            s  = vp.getSize(),
            w  = (s.width>s.height) ? s.width : s.height;
        return (w<1000);
    }
});