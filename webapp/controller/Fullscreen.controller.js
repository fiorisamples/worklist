sap.ui.define([
    "./BaseController",
    'sap/m/library',
	'sap/m/TablePersoController',
    './PersoService',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
   ],
    function (BaseController, mlibrary, TablePersoController, PersoService, JSONModel, Filter, FilterOperator, exportLibrary, Spreadsheet,) {
        var that = this;

        var ResetAllMode =  mlibrary.ResetAllMode;

        var TableController,
            EdmType = exportLibrary.EdmType;;

        return BaseController.extend("worklist.controller.Fullscreen", {

            onInit: function () {
                var oViewModel = new JSONModel({
                    busy: false,
                    delay: 0,
                    productTitle: this.getResourceBundle().getText("productTitle")
                });
                this.setModel(oViewModel, "fullScreenView");

                this._oTPC = new TablePersoController({
                    table: this.byId("idProductTable"),
                    //specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
                    componentName: "worklist",
                    resetAllMode: ResetAllMode.ServiceReset,
                    persoService: PersoService
                }).activate();



                var oProductModel = new JSONModel();
                this.getRouter().getRoute("fullscreen").attachPatternMatched(this._onObjectMatched, this);
            },


            onExit: function () {
                this._oTPC.destroy();
            },
               
            
            onPersoButtonPressed:function(){
                this._oTPC.openDialog();
            }, 
            
            /***
             * 
             */
            onExport:function(){
                var aCols, oRowBinding, oSettings, oSheet, oTable;
                if (!this._oTable) {
                    this._oTable = this.byId('idProductTable');
                } 
                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this._createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Product.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };
    
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function() {
                    oSheet.destroy();
                });

            },

            _createColumnConfig:function(){
                var aCols = [];

                aCols.push({
                    label: 'Product',
                    property: ['ProductID', 'Name'],
                    type: EdmType.String,
                    template: '{0}, {1}'
                });
    
                aCols.push({
                    label: 'Product Name',
                    type: EdmType.String,
                    property: 'Name'
                });
    
                aCols.push({
                    property: 'TypeCode',
                    type: EdmType.String
                });
    
                aCols.push({
                    property: 'Description',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'Category',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'SupplierID',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'SupplierName',
                    type: EdmType.String
                });


    
                aCols.push({
                    property: 'CreatedAt',
                    type: EdmType.Date
                });
    
                aCols.push({
                    property: 'Price',
                    type: EdmType.Number,
                    scale: 2,
                    delimiter: true
                });
    
                aCols.push({
                    property: 'CurrencyCode',
                    type: EdmType.String
                });
    
                
    
                return aCols;
            },

            /**
             * Navigation to home page
             */
            onNavBackFull: function () {
                this.getModel("appView").setProperty("/layout", "OneColumn");
                this.getRouter().navTo("list", {}, true);
            },

            /**
             * @param {Object} oEvent is used to count the number of record
             */ 
            onProductUpdateFinished:function(oEvent){
                var sTitle,
                iTotalItems = oEvent.getParameter("total"),
                oViewModel = this.getModel("fullScreenView");
                if (this.byId("idProductTable").getBinding("items").isLengthFinal()) {
                    if (iTotalItems) {
                        sTitle = this.getResourceBundle().getText("productTitleCount", [iTotalItems]);
                    } else {
                        //Display 'Line Items' instead of 'Line items (0)'
                        sTitle = this.getResourceBundle().getText("productTitle");
                    }
                    oViewModel.setProperty("/productTitle", sTitle);
                }
            }, 

            /**
             * @param {object} oEvent object is to Change the record
             */ 
            onChange:function(oEvent){
                var sProduct = this.byId("idProduct").getValue(),
                    sProductType,
                    aFilter = [];
                this.TableId = this.getView().byId("idProductTable");

                if(this.byId("idProductType").getSelectedItem()){
                   sProductType = this.byId("idProductType").getSelectedItem().getKey();
                   aFilter.push(new Filter("TypeCode", FilterOperator.EQ, sProductType))
                }
                
                 if(sProduct){
                     sProduct.trim();
                     sProduct = sProduct.toUpperCase();
                     aFilter.push(new Filter("ProductID", FilterOperator.EQ, sProduct));
                 }

                 if(this.byId("idCategory").getSelectedItems()){
                     var sItem = this.byId("idCategory").getSelectedItems();
                     for( var i = 0; i < sItem.length; i++){
                        aFilter.push(new Filter("Category", FilterOperator.EQ, sItem[i].getText()));
                     }
                 }

                 var oBinding = this.TableId.getBinding("items");

                 if (oBinding) {
                    oBinding.filter(aFilter);
                 }
            },

            /**
             * @param {object} oEvent an event contain the selected key
             */  
            onSelectionChange:function(oEvent){
                var sKey = this.byId("idProductType").getSelectedKey();
                this.byId("idProductType").setSelectedKey(sKey)
                this.onChange();
            }, 
             
           /**
            * Serach the while Click on Go Button 
            */
            onSearch:function(){
              this.onChange();
            }, 

            /**
             * Clear the Filter Bar Input Values 
             */ 
            onClear:function(){
               this.byId("idProduct").setValue("");
               this.byId("idCategory").removeAllSelectedItems();
               this.byId("idProductType").clearSelection();
               this.onChange();
            },
            

            /**
             *  Comobox selection 
             */
            handleSelectionFinish:function(){
                this.onChange();
            },

            /**
             * 
             */ 
            // onCancel:function(){
            // },

            /**
             *  Object Page Mathced function
             */
            _onObjectMatched: function () {        
              this.getModel("appView").setProperty("/layout", "EndColumnFullScreen");           
                that = this;
                // var oArgument = oEvent.getParameter("arguments"),
                //     sProduct = oArgument.Product,
                //     sSaleOrder = oArgument.objectId;

                // this.getModel().read("/ProductSet", {
                //     filters: [new Filter("ProductID", FilterOperator.EQ, sProduct)],
                //     success: function (oData) {
                //         var oDataModel = new JSONModel(oData.results[0]);
                //         that.getView().setModel(oDataModel, "Product");
                //     }, error: function () {

                //     }
                // });             
            }
        });
    });