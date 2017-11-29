sap.ui.controller("zui5_debt_coll.DebtMaster", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf zui5_debt_coll.mainView
	 */
	onInit : function() {
		oDebtMasterCtrl = this;
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf zui5_debt_coll.mainView
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf zui5_debt_coll.mainView
	 */
	// onAfterRendering: function() {
	//
	// },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf zui5_debt_coll.mainView
	 */
	// onExit: function() {
	//
	// }
	onFindPaymentsPressed : function() {
		
		 var oModel = new sap.ui.model.json.JSONModel();
		 oModel.loadData("data/debtors.json");
		 oModel.attachRequestCompleted(function() { 

			 var oItem = new sap.m.ObjectListItem({
				    title: "{DebtorName}",
				    type: sap.m.ListType.Active,
				    press: oDebtMasterCtrl.onDebtorPress
			 	}); 			 
			 
			 oItem.addAttribute(new sap.m.ObjectAttribute().setText('{AdrLineOne}'));
			 oItem.addAttribute(new sap.m.ObjectAttribute().setText('{AdrPostCode}'));
			 oItem.addAttribute(new sap.m.ObjectAttribute().setText('{PhoneNumber}'));
			 oItem.addAttribute(new sap.m.ObjectAttribute().setText('{Debt}'));
			 
			 var hiDebtList=sap.ui.getCore().byId("mainPage--masterPage--HighestDebtorsList"); 			 
			 
			 hiDebtList.setModel(oModel);
			 hiDebtList.bindItems("/DebtorsList",oItem);
			 
			 console.log(oModel.getData());
			 
			 oDebtMapCtrl.outputUserLocation();
			 
			 //TODO: remove old markers and refresh Google Map with new Addresses (if there are any)
			 
			 var Debtors=oModel.getData().DebtorsList;

			 if (Debtors.length>0)
			 {
				 for (var i = 0; i < Debtors.length; i++) 
				 {
					 console.log("Call Google API and pass following Address: " + Debtors[i].AdrLineOne + ", " + Debtors[i].AdrPostCode);
					 oDebtMapCtrl.setMarker(Debtors[i],false,true,i);
				 }
			 }
			 
		});		
		 
	},
	
	onDebtorPress: function(evt) {
		var bindingContext=evt.getSource().getBindingContext();
		var oAddress = bindingContext.oModel.getProperty(bindingContext.sPath);
		console.log("Call Google API and pass following Address: " + oAddress.AdrLineOne + ", " + oAddress.AdrPostCode);
		oDebtMapCtrl.setMarker(oAddress,true,true);
	}
	
});