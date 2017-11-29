sap.ui.controller("zui5_debt_coll.DebtMap", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_debt_coll.mainView
*/
	onInit : function() {
		
		//Attributes
		oDebtMapCtrl = this;
		oDebtMapCtrl.geocoder = null;
		oDebtMapCtrl.map = null;
		oDebtMapCtrl.infoWindow = null;
		oDebtMapCtrl.location = null;
		
		//Constants (perhaps use some global constants include?!?)
		oDebtMapCtrl.userIcon="http://maps.google.com/mapfiles/marker_green.png";
		oDebtMapCtrl.dfltMarkerIcon="http://maps.google.com/mapfiles/marker.png";
		
		//Test variables
		oDebtMapCtrl.userGeolocation=false;
		oDebtMapCtrl.testUserLocation={ "AdrLineOne": "Barrington road", "AdrPostCode": "BN12 4XL" };
		
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_debt_coll.mainView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_debt_coll.mainView
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_debt_coll.mainView
*/
//	onExit: function() {
//
//	}
	
	initiMap: function()
	{
		
		if (oDebtMapCtrl.map==null)
		{
			
			oDebtMapCtrl.geocoder = new google.maps.Geocoder();
			oDebtMapCtrl.infoWindow = new google.maps.InfoWindow();
			
			var mapOptions = {
					center: new google.maps.LatLng(51.5074, 0.1278),
					zoom: 13,
	                mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
			
			oDebtMapCtrl.map = new google.maps.Map(sap.ui.getCore().byId("mainPage--detailPageMap--debtMapPage").getDomRef(), mapOptions);
			
		}	
		
	},
	
	outputUserLocation: function()
	{
		
		if (oDebtMapCtrl.userGeolocation==true)
		{
		
			 //Output user's location
			 if (navigator.geolocation) 
			 {
				 
				 navigator.geolocation.getCurrentPosition(function(position) {
					
					 var pos = {
		              lat: position.coords.latitude,
		              lng: position.coords.longitude
		            };
		
					 oDebtMapCtrl.initiMap();
					 
					 oDebtMapCtrl.map.setCenter(pos);
					 
					 var marker = new google.maps.Marker({
						 map: oDebtMapCtrl.map,
						 position: pos,
						 icon: oDebtMapCtrl.userIcon
					 });				 
					 
		         }, function() 
		         {
		        	  console.log('Users location could not be determined');
		         });
			 } 
			 else 
			 {
	        	console.log('Browser doesnt support Geolocation');
			 }		

		}
		else oDebtMapCtrl.setMarker(oDebtMapCtrl.testUserLocation,true,false);
			 
	},
	
	setMarker: function(iAddress,iCenter,iDebtor,iMarkerNum) 
	{
		
		var oIcon=(iDebtor)?oDebtMapCtrl.dfltMarkerIcon:oDebtMapCtrl.userIcon;
		
		oDebtMapCtrl.initiMap();
			
		if (oDebtMapCtrl.map==null) return;
		
		oDebtMapCtrl.geocoder.geocode({ 'address': (iAddress.AdrLineOne + ", " + iAddress.AdrPostCode) }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
            	
            	if (iCenter==true) oDebtMapCtrl.map.setCenter(results[0].geometry.location);
            	
                var marker = new google.maps.Marker({
                    map: oDebtMapCtrl.map,
                    position: results[0].geometry.location,
                    icon: oIcon
                });
                
                if (iDebtor) 
        		{
                	
                	var debtorAddInfo='<div class="info_content"><h3>' + 
                						iAddress.DebtorName	+
                						'</h3><p><b>Address:</b> ' +
                						iAddress.AdrLineOne + ', ' + iAddress.AdrPostCode +
                						'<br/><b>Phone number:</b> ' + iAddress.PhoneNumber + 
                						'<br/><b>Total Debt:</b> ' + iAddress.Debt + ' GBP</p></div>';
                	
                    google.maps.event.addListener(marker, 'click', (function(marker, iMarkerNum) {
                        return function() {
                        	oDebtMapCtrl.infoWindow.setContent(debtorAddInfo);
                        	oDebtMapCtrl.infoWindow.open(oDebtMapCtrl.map, marker);
                        }
                    })(marker, iMarkerNum));                	
                	
        		}
                                
            } else {
            	console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
		
	}
	
});