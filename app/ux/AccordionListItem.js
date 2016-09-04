/**
 * A AccordionListItem is a container for Ext.ux.AccordionList with
 * useComponent: true.
 *
 * The following example shows how to configure and update sub-component items
 * in a list:
 *
 *  Ext.define('AccordionListExample.view.ListItem', {
 *      extend: 'Ext.ux.AccordionListItem',
 *      xtype : 'examplelistitem',
 *
 *      config: {
 *          layout: {
 *              type: 'vbox'
 *          },
 *
 *          text: {
 *          },
 *          button: {
 *              iconMask: true,
 *              docked: 'right',
 *          },
 *          message: {
 *              docked: 'bottom',
 *              label: 'message'
 *          },
 *          limit: {
 *              docked: 'top',
 *              label: 'limit'
 *          },
 *
 *          headerDataMap: {
 *              getText: {
 *                  setHtml: 'text'
 *              },
 *              getButton: {
 *                  setIconCls: 'icon'
 *              }
 *          },
 *
 *          contentDataMap: {
 *              getLimit: {
 *                  setValue: 'limit'
 *              },
 *              getMessage: {
 *                  setValue: 'message'
 *              }
 *          }
 *      },
 *
 *      applyText: function(config) {
 *          return Ext.factory(config, Ext.Component);
 *      },
 *
 *      updateText: function(newText) {
 *          if (newText) {
 *              this.add(newText);
 *          }
 *      },
 *
 *      applyButton: function(config) {
 *          return Ext.factory(config, Ext.Button);
 *      },
 *
 *      updateButton: function(newButton) {
 *          if (newButton) {
 *              this.add(newButton);
 *          }
 *      },
 *
 *      applyLimit: function(config) {
 *          return Ext.factory(config, Ext.field.DatePicker);
 *      },
 *
 *      updateLimit: function(newDay) {
 *          if (newDay) {
 *              this.add(newDay);
 *          }
 *      },
 *
 *      applyMessage: function(config) {
 *          return Ext.factory(config, Ext.field.TextArea);
 *      },
 *
 *      updateMessage: function(newMessage) {
 *          if (newMessage) {
 *              this.add(newMessage);
 *          }
 *      }
 *  });
 *
 */
Ext.define('FW.ux.AccordionListItem', {
    extend: 'Ext.dataview.component.ListItem',
    xtype: 'accordionlistitem',

    config: {
        baseCls: 'accordion-list-item',  // Do not override this property!

        /**
         * @cfg {String/Object} layout
         * Default layout config.
         */
        layout: {
            type: 'hbox'
        },

        /**
         * @cfg {Boolean} indent
         * Whether to indent child items.
         */
        indent: false,

        /**
         * @cfg {Object} headerDataMap
         * Defines header item's dataMap
         */
        headerDataMap: {},

        /**
         * @cfg {String/Object} layout
         * Defines content item's dataMap
         */
        contentDataMap: {},

        // @private
        itemMark: {
            docked: 'left'
        }

    },

    /**
     * @param  {Object} config
     */
    applyItemMark: function (config) {
        return Ext.factory(config, Ext.Component);
    },

    /**
     * @param  {Ext.Component} newItemMark
     */
    updateItemMark: function (newItemMark) {
        if (newItemMark) {
            this.add(newItemMark);
        }
    },

    /**
     * @override
     * @param newRecord
     */
    updateRecord: function (record) {
        var me = this,
            dataview = me.dataview || this.getDataview(),
            data = record && dataview.prepareData(record.getData(true), dataview.getStore().indexOf(record), record),
            body = this.getBody(),
            dataMap;

        me._record = record;

        var leaf = record && record.isLeaf(),
            expanded = record && record.isExpanded(),
            depth = record ? record.getDepth() : 0;

        if (leaf) {
            dataMap = me.getContentDataMap();
        }
        else {
            dataMap = me.getHeaderDataMap();
        }

        me.doMapData(dataMap, data, body);
        me.doUpdateItemMark(expanded, leaf, depth);
        me.toggle(leaf);

        /**
         * @event updatedata
         * Fires whenever the data of the DataItem is updated.
         * @param {Ext.dataview.component.DataItem} this The DataItem instance.
         * @param {Object} newData The new data.
         */
        me.fireEvent('updatedata', me, data);
    },

    /**
     * @private
     * @param  {Boolean} expanded
     * @param  {Boolean} leaf
     * @param  {Number} depth
     */
    doUpdateItemMark: function (expanded, leaf, depth) {
        var me = this,
            itemMark = me.getItemMark();

        if (Ext.isEmpty(expanded)) {
            return;
        }

        var downMark = '<div class="down"></down>',
            rightMark = '<div class="right"></div>';

        itemMark.setHtml(leaf ? '' : expanded ? downMark : rightMark);

        if (me.getIndent()) {
            itemMark.setStyle('padding-left:' + depth + 'em;');
        }
    },

    /**
     * @private
     * @param  {Boolean} leaf
     */
    toggle: function (leaf) {
        var me = this;
        me.doHiddenComponents(me.getHeaderDataMap(), leaf);
        me.doHiddenComponents(me.getContentDataMap(), !leaf);
    },

    /**
     * @private
     * @param  {Object} map
     * @param  {Boolean} hidden
     */
    doHiddenComponents: function (map, hidden) {
        var me = this;
        Ext.Object.each(map, function (key, value) {
            var component = me[key]();
            if (component) {
                component.setHidden(hidden);
            }
        });
    }

});