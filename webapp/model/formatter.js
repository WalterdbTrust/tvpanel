sap.ui.define([
	] , function () {
		"use strict";

		return {

			/**
			 * Rounds the number unit value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 */
			stateConect: function(value){
			    console.log("desde el formatter:",value);
                var myRootPath = jQuery.sap.getModulePath("tvpanel");
		    	var iconBase = myRootPath + "/icon/";			    
			    if(value){
			        return iconBase + "desconectado.png";			
			    } else {
			        return iconBase + "conectado.png";			
			    }
			},
			numberUnit : function (sValue) {
				if (!sValue) {
					return "";
				}
				return parseFloat(sValue).toFixed(2);
			},
			formatDate : function(data){
				return ("0" + data.getDate()).slice(-2) + "/" 
					 + ("0" + (data.getMonth() + 1)).slice(-2) + "/" 
						    + data.getFullYear() + " " 
					 + ("0" + data.getHours()).slice(-2) + ":" 
					 + ("0" + data.getMinutes()).slice(-2) + ":" 
					 + ("0" + data.getSeconds()).slice(-2);
			},
			formatDateSinHora : function(data){
				return ("0" + data.getDate()).slice(-2) + "/" 
					 + ("0" + (data.getMonth() + 1)).slice(-2) + "/" 
						    + data.getFullYear() + " ";
			}

		};

	}
);