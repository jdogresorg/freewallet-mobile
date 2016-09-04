/*
 * FW.view.Scan.js - View 
 *
 * Handle displaying a view requesting the user to scan a QR code
 */

Ext.define('FW.view.Scan', {
    extend: 'Ext.Panel',
    xtype: 'fw-scanqrcode', 

    config: {
        cls: 'no-rounded-edges',
        modal: true,
        hideOnMaskTap: true,
        centered: true,
        width: 320,
        layout: 'vbox',
        // height: (device=='phone') ? '70%' : 400,
        items: [{
            docked: 'top',
            cls: 'fw-panel',
            xtype: 'toolbar',
            title: 'Please Scan a QRCode'
        },{
            html: '<div id="reader" style="width:320px;height:240px"></div>'
        },{
            docked: 'bottom',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Cancel',
                ui: 'decline',
                flex: 1,
                handler: function(btn){
                    btn.up('fw-scanqrcode').hideView();
                }
            }]
        }]
    },


    initialize: function(){
        var me  = this,
            cfg = me.config;
        me.main = FW.app.getController('Main');
        if(cfg.view)
            me.view = cfg.view;
        me.callParent();
        me.on('painted', me.setupReader);
    },


    // Handle updating the view 
    updateView: function(cfg){
        var me = this;
    },


    // Handle non-native scanning via HTML5 (https://github.com/dwa012/html5-qrcode)
    setupReader: function(){
        var me = this;
        $('#reader').html5_qrcode(me.onScan, me.onError, me.onVideoError);
    },


    // Handle hiding the view and stopping qrcode scanning
    hideView: function(){
        var me = this,
            vp = Ext.Viewport;
        // Trap any errors from HTML5 qrcode scanner
        try {
            $('#reader').html5_qrcode_stop();
        } catch(e){
            console.log('reader error');        
        }
        vp.remove(me,true);
    },


    // Handle validating any scanned data
    onScan: function(data){
        var me   = Ext.ComponentQuery.query('fw-scanqrcode')[0],
            data = me.main.getScannedData(String(data));
        if(data.valid){
            if(me.view)
                me.view.updateForm(data);
            me.hideView();
        }
        // // console.log('onScan=',data);
        // if(data.length>25){
        //     var arr  = data.split('?'),
        //         addr = arr[0];
        //     if(checkBitcoinAddress(addr)){
        //         if(me.view){
        //             // Handle passing the data forward to the form
        //             me.view.updateForm({
        //                 address: addr,
        //                 amount: null,
        //                 asset: null,
        //                 message: null
        //             });
        //         }
        //         me.hideView();
        //     }   
        // }
    },

   // Handle scanning errors
    onError: function(error){
        // console.log('onError=',error);
    },

    
    // Handle scanning video errors
    onVideoError: function(error){
        // console.log('onVideoError=',error);
    }


});