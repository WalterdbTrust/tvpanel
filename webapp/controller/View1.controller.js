sap.ui.define([
    "tvpanel/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(BaseController,Controller,JSONModel) {
	"use strict";

	return BaseController.extend("tvpanel.controller.View1", {
            // sap.Controller("tvpanel.controlles.Posiciones").verTodo();
            onInit: function(){
                sap.ui.controller("tvpanel.controller.Posiciones").ponerVisible();
            } 
            

	});
});