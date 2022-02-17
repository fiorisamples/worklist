sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/Device",
    "sap/ui/model/FilterOperator"],
    function (BaseController, JSONModel, Filter, Device, FilterOperator) {
        var that = this;
        return BaseController.extend("worklist.controller.Product", {

            onInit: function () {
                var oProductModel = new JSONModel();
                this.getRouter().getRoute("product").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                that = this;
                var oArgument = oEvent.getParameter("arguments"),
                    sProduct = oArgument.Product,
                    sSaleOrder = oArgument.objectId;

                this.getModel().read("/ProductSet", {
                    filters: [new Filter("ProductID", FilterOperator.EQ, sProduct)],
                    success: function (oData) {
                        var oDataModel = new JSONModel(oData.results[0]);
                        that.getView().setModel(oDataModel, "Product");
                    }, error: function () {

                    }
                });
            },

            onFullScreen: function (oEvent) {
                var bReplace = !Device.system.phone;
                // set the layout property of FCL control to show three columns
                
                this.getRouter().navTo("fullscreen", {
                }, bReplace);
            }
        });
    });