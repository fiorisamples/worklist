sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"],
    function (BaseController, JSONModel, Filter, FilterOperator) {
        var that = this;
        return BaseController.extend("worklist.controller.Fullscreen", {

            onInit: function () {
                var oProductModel = new JSONModel();
                this.getRouter().getRoute("fullscreen").attachPatternMatched(this._onObjectMatched, this);
            },


            onNavBackFull : function(){
            this.getModel("appView").setProperty("/layout", "OneColumn"); 
            this.getRouter().navTo("list", {}, true);
            },

            _onObjectMatched: function () {
                this.getModel("appView").setProperty("/layout", "EndColumnFullScreen")
                // that = this;
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