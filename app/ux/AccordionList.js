/**
 *  {@link Ext.ux.AccordionList} is a subclass of {@link Ext.Container}
 *  Collapsible List with using Ext.data.TreeStore.
 *  You can expand and collapse contents by header item tap.
 *  Also it can nested infinity.
 *
 *  @author Shinobu Kawano <http://kawanoshinobu.com>
 *
 *  Simple example:
 *
 *     @example miniphone preview
 *      var data = {
 *         "items" : [{
 *               "text" : "Today",
 *               "items" : [{
 *                           "text" : "Eat",
 *                           "leaf" : true
 *                       }, {
 *                           "text" : "Sleep",
 *                           "leaf" : true
 *                       }, {
 *                           "text" : "Drinking",
 *                           "leaf" : true
 *                       }]
 *           }, {
 *               "text" : "Tomorrow",
 *               "items" : [{
 *                           "text" : "Watch TV",
 *                           "leaf" : true
 *                       }, {
 *                           "text" : "Watch Video",
 *                           "leaf" : true
 *                       }]
 *           }, {
 *               "text" : "This week",
 *               "items" : [{
 *                           "text" : "Shopping",
 *                           "leaf" : true
 *                       }]
 *           }, {
 *               "text" : "Later",
 *               "items" : [{
 *                           "text" : "Eat",
 *                           "leaf" : true
 *                       }, {
 *                           "text" : "Sleep",
 *                           "leaf" : true
 *                       }, {
 *                           "text" : "Drinking",
 *                           "leaf" : true
 *                       }]
 *           }]
 *      };
 *
 *      Ext.define('Task', {
 *          extend: 'Ext.data.Model',
 *          config: {
 *              fields: [{
 *                  name: 'text',
 *                  type: 'string'
 *              }]
 *          }
 *      });
 *
 *      var store = Ext.create('Ext.data.TreeStore', {
 *          model: 'Task',
 *          defaultRootProperty: 'items',
 *          root: data
 *      });
 *
 *      var accordionList = Ext.create('Ext.ux.AccordionList', {
 *          fullscreen: true,
 *          store: store
 *      });
 *
 */
Ext.define('FW.ux.AccordionList', {
    extend: 'Ext.Container',
    xtype: 'accordionlist',
    alternateClassName: 'Ext.AccordionList',

    requires: [
        'Ext.dataview.List',
        'FW.ux.AccordionListItem'
    ],

    config: {
        /**
         * @cfg {String/String[]} cls
         * The CSS class to add to this component's element.
         */
        cls: Ext.baseCSSPrefix + 'accordion-list',

        /**
         * @cfg {String} headerItemCls
         * The CSS class to add to this header item's element.
         */
        headerItemCls: Ext.baseCSSPrefix + 'accordion-list-header',

        /**
         * @cfg {String} contentItemCls
         * The CSS class to add to this header item's element.
         */
        contentItemCls: Ext.baseCSSPrefix + 'accordion-list-content',

        /**
         * @cfg {String/Object} layout
         * Default layout config.
         */
        layout: {
            type: 'fit'
        },

        /**
         * @cfg {Ext.data.TreeStore/Object/String} store
         * Store instance
         */
        store: null,

        /**
         * @cfg {String} displayField
         * Defaults template's display field.
         */
        displayField: 'text',

        /**
         * @cfg {Boolean} scrollable
         * List's default listScrollable config.
         */
        listScrollable: true,

        /**
         * @cfg {String} headerItemTpl
         * Header item's html template.
         */
        headerItemTpl: [
            '<tpl if="this.isExpanded(values)">',
            '{0}',
            '<tpl else>',
            '{1}',
            '</tpl>'
        ].join(''),

        /**
         * @cfg {String} headerCloseTpl
         * Header item's html template which it closing.
         */
        headerCloseTpl: '<div class="right"></div><div>{0}</div>',

        /**
         * @cfg {String} headerOpenTpl
         * Header item's html template which it opening.
         */
        headerOpenTpl: '<div class="down"></div><div>{0}</div>',

        /**
         * @cfg {String} contentItemTpl
         * Content item's html template.
         */
        contentItemTpl: '{0}',

        /**
         * @cfg {String} countTpl
         * Content item count html template.
         */
        countTpl: [
            '<div class="', Ext.baseCSSPrefix, 'accordion-list-count" ',
            'style="position:absolute; right:0; margin-right: 1em;">',
            '{0}',
            '</div>'
        ].join(''),

        /**
         * @cfg {Boolean} defaultExpanded
         * Whether items all expanded or not.
         */
        defaultExpanded: false,

        /**
         * @cfg {Boolean} useSelectedHighlights
         * Whether selected items highlights or not.
         */
        useSelectedHighlights: true,

        /**
         * @cfg {Boolean} singleMode
         * Whether to only show one expanded list at a time.
         */
        singleMode: false,

        /**
         * @cfg {Boolean} animation
         * Whether to use animation when item is expanded.
         */
        animation: false,

        /**
         * @cfg {Number} animationDuration
         * Animation duration time (ms). This is used when item expand.
         */
        animationDuration: 800,

        /**
         * @cfg {Boolean} showCount
         * Whether to show item's count in the header.
         */
        showCount: false,

        /**
         * @private
         */
        list: null,

        /**
         * @cfg {Object} listConfig
         * Sets list's config.
         */
        listConfig: {},

        /**
         * @cfg {Boolean} indent
         * Whether to indent child items.
         */
        indent: false,

        /**
         * @cfg {Boolean} indent
         * Flag the use a component based DataView implementation.
         */
        useComponents: false,

        /**
         * @cfg {String} indent
         * The xtype used for the component based DataView.
         * You must specify accordionlistitem's sub class.
         */
        defaultType: 'accordionlistitem',

        /**
         * @cfg {Boolean/Object} indexBar
         * `true` to render an alphabet IndexBar docked on the right.
         * This can also be a config object that will be passed to {@link Ext.IndexBar}.
         */
        indexBar: null
    },

    /**
     * @protected
     */
    initialize: function () {
        var me = this;
        me.doInitialize();
        me.callParent(arguments);
    },

    /**
     * @private
     */
    doInitialize: function () {
        var me = this;
        if (me.getDefaultExpanded()) {
            me.doAllExpand();
        }
    },

    /**
     * @protected
     */
    applyStore: function (newStore) {
        return this.patchStore(newStore);
    },

    /**
     * @protected
     */
    applyDisplayField: function (newField) {
        return '{' + newField + '}';
    },

    /**
     * @protected
     */
    updateStore: function (newStore, oldStore) {
        var me = this,
            list = me.getList();

        if (!list) {
            list = me.readyList();
        }

        newStore.on('load', me.onLoadStore, me);
        list.setStore(newStore);
    },

    /**
     * @private
     * @return {Ext.dataview.List}
     */
    readyList: function () {
        var me = this,
            config = me.makeListConfig(),
            list;

        list = Ext.create('Ext.dataview.List', config);

        me.applyMoreListSetting(list);
        me.setList(list);
        me.add(list);
        return list;
    },

    /**
     * @private
     * @return {Object}
     */
    makeListConfig: function () {
        var me = this,
            defaultConfig = {
                scrollToTopOnRefresh: false
            },
            config;

        if (me.getUseComponents() === false) {
            config = me.makeElementListConfig(defaultConfig);
        }
        else {
            config = me.makeComponentListConfig(defaultConfig);
        }

        if (me.getAnimation()) {
            Ext.Object.merge(config, {
                itemHeight: 'auto'
            });
        }

        var indexBar = me.getIndexBar();
        if (!Ext.isEmpty(indexBar)) {
            Ext.Object.merge(config, {
                indexBar: indexBar,
                grouped: true
            });
        }

        Ext.Object.merge(config, me.getListConfig());

        return config;
    },

    /**
     * @private
     * @param  {Object} config
     * @return {Object}
     */
    makeElementListConfig: function (config) {
        var me = this;

        Ext.Object.merge(config, {
                itemTpl: new Ext.XTemplate(
                    '<tpl if="leaf">',
                    me.makeContentTemplate(),
                    '<tpl else>',
                    me.makeHeaderTemplate(),
                    me.getShowCount() ? me.makeCountTpl() : '',
                    '</tpl>',
                    {
                        isExpanded: function (values) {
                            return values.expanded;
                        }
                    }
                ),
                useSimpleItems: true
            }
        );

        return config;
    },

    /**
     * @private
     * @param  {Object} config
     * @return {Object}
     */
    makeComponentListConfig: function (config) {
        var me = this;

        Ext.Object.merge(config, {
            useComponents: true,
            defaultType: me.getDefaultType(),
            itemTpl: '',
            useSimpleItems: false
        });

        return config;
    },

    /**
     * @private
     * @param  {Ext.dataview.List} list
     */
    applyMoreListSetting: function (list) {
        var me = this;

        if (me.getUseSelectedHighlights() === false) {
            list.setSelectedCls('');
        }

        if (me.getUseComponents()) {
            me.applyItemTapPatch(list);
        }

        list.on('itemtap', me.onItemTap, me);
        list.on('refresh', me.onListRefresh, me);
        list.on('itemindexchange', me.onItemIndexChange, me);
        list.setScrollable(me.getListScrollable());
    },

    /**
     * @private
     * @param  {Ext.dataview.List} list
     */
    applyItemTapPatch: function (list) {
        var parseEvent = function (e) {
            var me = this,
                target = Ext.fly(e.getTarget()).findParent('.' + 'accordion-list-item', 8),
                item = Ext.getCmp(target.id);

            return [me, item, item.$dataIndex, e];
        };
        list.parseEvent = parseEvent;

        list.on({
            element: 'element',
            delegate: '.accordion-list-item',
            tap: list.onItemTap
        });
    },

    /**
     * @private
     * @param  {Ext.data.Store} store
     * @param  {Ext.data.Model} records
     * @param  {Boolean} successful
     */
    onLoadStore: function (store, records, successful) {
        if (successful === false) {
            return;
        }
        this.setCountToRecords(records);
    },

    /**
     * @private
     * @param  {Ext.data.Model} records
     */
    setCountToRecords: function (records) {
        var me = this;

        (records || []).forEach(function setCount(record) {
            if (record.hasChildNodes()) {
                record.set('cnt', record.childNodes.length);
                record.childNodes.forEach(setCount);
            }
            else {
                record.set('cnt', 0);
            }
        });
    },

    /**
     * @private
     * @return {String}
     */
    makeHeaderTemplate: function () {
        var me = this,
            displayField = me.getDisplayField(),
            openTpl = Ext.String.format(me.getHeaderOpenTpl(), displayField),
            closeTpl = Ext.String.format(me.getHeaderCloseTpl(), displayField);
        return Ext.String.format(me.getHeaderItemTpl(), openTpl, closeTpl);
    },

    /**
     * @private
     * @return {String}
     */
    makeContentTemplate: function () {
        var me = this,
            displayField = me.getDisplayField();
        str = Ext.String.format(me.getContentItemTpl(), displayField);
        // console.log('contentItemTpl str=',str);            
        return  str
    },

    /**
     * @private
     * @return {String}
     */
    makeCountTpl: function () {
        return Ext.String.format(this.getCountTpl(), '{cnt}');
    },

    /**
     * @private
     */
    updateListScrollable: function (newListScrollable, oldListScrollable) {
        var list = this.getList();
        if (list) {
            list.setScrollable(newListScrollable);
        }
    },

    /**
     * Loads data into the store.
     */
    load: function () {
        this.getStore().load();
    },

    /**
     * Remove all items from the store.
     */
    removeAllItem: function () {
        this.getStore().removeAll();
    },

    /**
     * Gets the number of cached records.
     * @return {Number}
     */
    getCount: function () {
        var store = this.getStore();
        return Ext.isEmpty(store) ? 0 : store.getCount();
    },

    /**
     * Gets the number of all records.
     * @return {Number}
     */
    getAllCount: function () {
        var store = this.getStore();
        return Ext.isEmpty(store) ? 0 : store.getAllCount();
    },

    /**
     * Expand all of contents.
     */
    doAllExpand: function () {
        var me = this;
        me.doAll(function expand(node) {
            if (me.getAnimation()) {
                me.addListExpandListeners(node);
            }
            node.expand();
            if (!node.isLeaf()) {
                node.childNodes.forEach(expand, me);
            }
        });
    },

    /**
     * Collapse all of contents.
     */
    doAllCollapse: function () {
        var me = this;
        me.doAll(function collapse(node) {
            node.collapse();
            if (!node.isLeaf()) {
                node.childNodes.forEach(collapse, me);
            }
        });
    },

    /**
     * Collapse all of contents with single mode.
     * @param  {Number} depth
     */
    doAllCollapseWithSingleMode: function (depth) {
        var me = this;
        me.doAll(function collapse(node) {
            if (node.data.depth === depth) {
                node.collapse();
            }
        });
    },

    /**
     * @private
     * @param  {Function} updater
     */
    doAll: function (updater) {
        var me = this,
            list = me.getList(),
            store = list.getStore();
        store.each(updater, me);
    },

    /**
     * @private
     * @param  {Ext.dataview.List} list
     */
    onListRefresh: function (list) {
        var me = this,
            items = list.listItems,
            ln = items.length,
            headerCls = me.getHeaderItemCls(),
            contentCls = me.getContentItemCls(),
            i, item, record, isLeaf;

        for (i = 0; i < ln; i++) {
            item = items[i];
            record = item.getRecord();
            if (!Ext.isEmpty(record)) {
                isLeaf = record.get('leaf');
                item.removeCls(isLeaf ? headerCls : contentCls);
                item.addCls(isLeaf ? contentCls : headerCls);
            }
        }

        if (me.getIndent()) {
            me.doIndent();
        }
    },

    /**
     * Called when an list item has been tapped
     * @param  {Ext.List} list The subList the item is on
     * @param  {Number} index The id of the item tapped
     * @param  {Ext.Element} target The list item tapped
     * @param  {Ext.data.Record} record The record whichw as tapped
     * @param  {Ext.event.Event} e The event
     */
    onItemTap: function (list, index, target, record, e) {
        var me = this,
            store = list.getStore(),
            node = store.getAt(index);

        if (me.getAnimation()) {
            me.scrollToSelectedItem();
            me.readyAnimation(list, index, target, record, e);
        }

        // if any of the event handlers return 'false', we cancel processing of the tap
        var ret = me.fireEvent('itemtap', me, list, index, target, record, e);
        if (ret === false) {
            return;
        }

        if (node.isLeaf()) {
            me.fireEvent('leafitemtap',
                list, index, target, record, e);
        }
        else {
            if (node.isExpanded()) {
                node.collapse();
            }
            else {
                if (me.getSingleMode()) {
                    me.doAllCollapseWithSingleMode(record.data.depth);
                }
                node.expand();
            }
        }

        if (me.getIndent()) {
            me.doIndent();
        }
    },

    /**
     * @protected
     * @param  {Ext.dataview.List} list
     * @param  {Ext.data.Record} record
     * @param  {Number} index
     */
    onItemIndexChange: function (list, record, index) {
        var me = this;
        if (me.getIndent()) {
            me.doIndent();
        }
    },

    /**
     * @private
     * http://siva-technology.blogspot.pt/2013/03/sencha-touch-scroll-to-selected-item-on.html
     * Position list item
     */
    scrollToSelectedItem: function () {
        var me = this,
            list = me.getList(),
            store = list.getStore(),
            selected = list.getSelection()[0],
            idx = store.indexOf(selected),
            map = list.getItemMap(),
            offset = map.map[idx];

        list.getScrollable().getScroller().scrollTo(0, offset);
    },

    /**
     * @private
     * @param  {Ext.dataview.List} list
     * @param  {Number} index
     * @param  {Ext.Element} target
     * @param  {Ext.data.Record} record
     */
    readyAnimation: function (list, index, target, record) {
        var me = this,
            id = record.getId();

        var parentItem = list.getStore().getAt(index);
        me.addListExpandListeners(parentItem);
    },

    /**
     * @private
     * @param  {Ext.data.Model} parent
     */
    addListExpandListeners: function (parent) {
        var me = this;


        //me.loadedTaps = me.loadedTaps || {};
        //
        //if (me.loadedTaps[parent.id]) {
        //    return;
        //}
        //else {
        //    me.loadedTaps[parent.id] = true;
        //}

        var grand = parent.parentNode;

        if (parent.hasListener('expandanim')) {
            return;
        }
        else if (grand && grand.hasListener('expandanim')) {
            return;
        }

        parent.on('expand', function (record) {
            record.fireEvent('expandanim', record);
        });

        parent.setListeners({
            expandanim: me.onExpandWithAnimation,
            scope: me
        });
    },

    /**
     * @private
     * @param  {Ext.data.Model} parent
     */
    onExpandWithAnimation: function (parent) {
        var me = this,
            list = me.getList();

        Ext.each(parent.childNodes, function (el) {
            var item = list.getItemAt(list.getStore().indexOf(el));
            item.hide();
            if (el.get('expanded')) {
                me.addListExpandListeners(item, list);
                el.collapse();
                el.expand();
            }
        });

        Ext.each(parent.childNodes, function (el) {
            var item = list.getItemAt(list.getStore().indexOf(el));
            try {
                item.show({
                    easing: 'easeInOut',
                    duration: me.getAnimationDuration(),
                    autoClear: true,
                    from: {
                        opacity: 0,
                        height: '0px'
                    },
                    to: {
                        opacity: 1,
                        height: '51px'
                    }
                });
            } catch (e) {
            }
        });
    },

    /**
     * @private
     */
    doIndent: function () {
        var me = this,
            list = me.getList();

        var items = list.listItems,
            ln = items.length,
            i, item, record, elem, indent;

        for (i = 0; i < ln; i++) {
            item = items[i];
            record = item.getRecord();
            if (!Ext.isEmpty(record)) {
                elem = item.element.down('.x-innerhtml');
                indent = ((record.getDepth() + 0.5) - 1) + 'em';
                // 2.1
                // elem = item.element.down('.x-list-item-body .x-innerhtml');
                // indent = ((record.getDepth()) -1) + 'em';
                elem.dom.style.setProperty('padding-left', indent);
            }
        }
    },

    /**
     * HACK: See. Can not able to load json data in Sencha touch 2.1 Accordionlist
     *       http://www.sencha.com/forum/showthread.php?253032-Can-not-able-to-load-json-data-in-Sencha-touch-2.1-Accordionlist
     * @private
     * @param  {Ext.data.TreeStore/Object/String} store
     * @return {Ext.data.TreeStore}
     */
    patchStore: function (store) {
        var me = this;

        if (store) {
            if (Ext.isString(store)) {
                // store id
                store = Ext.data.StoreManager.get(store);
            } else {
                // store instance or store config
                if (!(store instanceof Ext.data.TreeStore)) {
                    store = Ext.factory(store, Ext.data.TreeStore, null);
                }
            }
        }

        if (!store.isStore) {
            console.error('You should set a store id, a store config or an instance of Ext.data.TreeStore to `store` config');
            return;
        }

        store.on('addrecords', function (store, records) {
            // fix sort order if we add children to a already loaded treestore
            if (!records[0].parentNode.isRoot()) {
                // we have to fix the sort order of the items and the data array
                store.getData().items = me.fixTreeStoreSortOrder(store.getData().items, records);
                store.getData().all = me.fixTreeStoreSortOrder(store.getData().all, records);
                store.fireEvent('refresh', store, store.data);
            }
        });

        store.onProxyLoad = function (operation) {
            var records = operation.getRecords(),
                successful = operation.wasSuccessful(),
                node = operation.getNode();

            me.loadedTaps = {}; // Reset

            node.beginEdit();
            node.set('loading', false);
            if (successful) {
                records = this.fillNode(node, records);
            }
            node.endEdit();
            // we only have to call this once to get an addrecords ev
            if (node.isRoot()) {
                this.updateNode(node);
            }
            this.loading = false;
            this.loaded = true;

            // Model event
            node.fireEvent('load', node, records, successful);
            // Store event
            this.fireEvent('load', this, records, successful, operation);
            // Ext.ux.AccordionList event
            me.fireEvent('load', this, records, successful, operation);

            // this is a callback that would have been passed to the 'read' function and is
            // optional
            Ext.callback(operation.getCallback(), operation.getScope() ||
                me, [records, operation, successful]);
        };

        if (Ext.isFunction(store.setClearOnLoad)) {
            store.setClearOnLoad(false);
        }

        if (store.getAutoLoad()) {
            Ext.defer(function () {
                var list = this.getList(),
                    tmp = list.getLoadingText();
                list.setLoadingText(null);
                store.load();
                list.setLoadingText(tmp);
            }, 500, this);
        }
        return store;
    },

    /**
     * @private
     * @param  {Ext.data.TreeStore} store
     * @param  {Array} allRecords | of store's data or items array
     * @param  {Array} newRecords | new loaded children of node
     * @return {Array}            | correct sort order
     */
    fixTreeStoreSortOrder: function (allRecords, newRecords) {
        var store = this.getStore(),
            moveRecords = [],
            parentIndex = Ext.Array.indexOf(allRecords, newRecords[0].parentNode),
            firstRecordIndex = Ext.Array.indexOf(allRecords, newRecords[0]);

        // assume all records have the same parent because we're expanding one node
        if (parentIndex + 1 !== firstRecordIndex) {
            moveRecords = Ext.Array.splice(allRecords, allRecords.length - newRecords.length, newRecords.length);
            return Ext.Array.insert(allRecords, parentIndex + 1, moveRecords);
        } else {
            return allRecords;
        }
    }

});