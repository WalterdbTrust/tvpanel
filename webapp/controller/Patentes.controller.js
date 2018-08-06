/*global location */
// var vinSelection="";
var tempGlobalJson = {
	"data": []
};
var fnInterval = function() {};
var vinGlobalSelection;
sap.ui.define([
	"tvpanel/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"tvpanel/model/formatter",
	"sap/ui/Device"
], function(BaseController, JSONModel, formatter, Device) {
	"use strict";

	return BaseController.extend("tvpanel.controller.Patentes", {
		formatter: formatter,

		onExit: function() {
			clearInterval(fnInterval);
		},

		onInit: function() {

		},
		rowColor: function(vinSelection) {
			vinGlobalSelection = vinSelection;
			this.mostrarMovimiento();
		},
		mostrarMovimiento: function() {
            var vinSelection;
            if(!vinGlobalSelection){ 
                vinSelection = "||||";
            } else {
                vinSelection = vinGlobalSelection;
            }
            
			
			var oTable = sap.ui.getCore().byId("mainViewTbl");

			var rows = oTable.getVisibleItems(); //number of rows on tab
			var actualRow;
			for (var i = 0; i < rows.length; i++) {
				actualRow = rows[i].getBindingContext();
				if (actualRow) {
					rows[i].setSelected(vinSelection.indexOf(actualRow.getObject().VIN.trim()) >= 0);
				}
			}

		},
		onSelectionChange: function(oEvent) {
			var context = oEvent.getParameters().listItem.getBindingContext().getObject();
			var _objectId2 = context.VIN;
			var patente = context.LIC_PLATE;
			sap.ui.controller("tvpanel.controller.Posiciones").ubicar(_objectId2,patente);
		},
		onAfterRendering: function() {
		    sap.ui.getCore().byId("viaje").addStyleClass("optionfilter");
		    sap.ui.getCore().byId("todos").addStyleClass("optionfilter");		    
			var that = this;
		    clearInterval(fnInterval);
			fnInterval = setInterval(that.ajustaColoryBindeo,60000);
			that.bindeoPatentes();
		},

		bindeoPatentes: function() {
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			oModel.attachRequestCompleted(function onCompleted(oEvent) {

				var a = this.getJSON();
				var userEmail = JSON.parse(a).email;
				var filtro1 = new sap.ui.model.Filter("EMAIL", sap.ui.model.FilterOperator.EQ, userEmail);
                
				var oTableAux = sap.ui.getCore().byId("tableAux");
				var tempPath = "/VEHICLE_VIEW_GROUP_STATUS";
				oTableAux.bindRows({
					path: tempPath,
					filters: [filtro1]
				});

				oTableAux.getBinding("rows").attachDataReceived(function() {
					var codigos = oTableAux.getBinding("rows").getContexts();
				// 	var mtempJson = {
				// 		"data": []
				// 	};

					for (var i = 0; i < codigos.length; i++) {

						tempGlobalJson.data.push({
							LIC_PLATE: codigos[i].getObject().LIC_PLATE,
							MAKE: codigos[i].getObject().MAKE,
							MODEL: codigos[i].getObject().MODEL,
							GROUP: codigos[i].getObject().GROUP,
							VIN: codigos[i].getObject().VIN,
							STATUS: 0,
							STYLE: "red"
						});

					}
				// 	tempGlobalJson.data = mtempJson.data;
					that.ajustaColoryBindeo();
				});

			});

		},
		ajustaColoryBindeo: function() {
			var filtros = [];
			for (var g = 0; g < tempGlobalJson.data.length; g++) {
				filtros.push(new sap.ui.model.Filter("VIN", sap.ui.model.FilterOperator.EQ, tempGlobalJson.data[g].VIN));
			}

			var that = this;
			var oTableAux2 = sap.ui.getCore().byId("tableAux2");
			var tempPath2 = "/TELEMETRY_VIEW";
			oTableAux2.bindRows({
				path: tempPath2,
				filters: filtros
			});
			oTableAux2.getBinding("rows").attachDataReceived(function() {
				var telemetria = oTableAux2.getBinding("rows").getContexts();
				for (var t = 0; t < telemetria.length; t++) {
					for (var j = 0; j < tempGlobalJson.data.length; j++) {
						if (telemetria[t].getObject().VIN === tempGlobalJson.data[j].VIN) {
							tempGlobalJson.data[j].STYLE = telemetria[t].getObject().IN_TRAVEL === 1 ? "green" : "red";
                            tempGlobalJson.data[j].STATUS = telemetria[t].getObject().IN_TRAVEL === 1 ? 1 : 0;
						}
					}
				}

				var oModel1 = new sap.ui.model.json.JSONModel(tempGlobalJson);
				var oTable = sap.ui.getCore().byId("mainViewTbl");
				oTable.setModel(oModel1);
				var tempPathLocal = "/data";
                
				var otemplate = new sap.m.ColumnListItem({
					type: "Active",
					// 		icon: "./icon/desconectado.png",
					cells: [
						new sap.m.Text({
							text: "{LIC_PLATE}"
						}),
						new sap.m.Text({
							text: "{MAKE} {MODEL}",
							wrapping: true,
							renderWhitespace: true,
							width: "55px"
						}),
						new sap.ui.core.Icon({
							color: "{STYLE}",
							src: "sap-icon://primary-key"
						})

					]
				});
				var sort = new sap.ui.model.Sorter("GROUP", false, true);
				
				
				
				if(sap.ui.getCore().byId("selectedFilter").getSelectedButton().getId() === "viaje"){
				    var filtro1 = new sap.ui.model.Filter("STATUS",  sap.ui.model.FilterOperator.EQ, 1);
    				oTable.bindItems({
    					path: tempPathLocal,
    					sorter: sort,
    					template: otemplate,
    					filters: [filtro1]
    				});

				} else {
    				oTable.bindItems({
    					path: tempPathLocal,
    					sorter: sort,
    					template: otemplate
    					
    				});
				    
				}

				// that.mostrarMovimiento();
			});

		},
		cargarImg: function() {

			var myRootPath = jQuery.sap.getModulePath("tvpanel");
			var iconBase = myRootPath + "/icon/";

			return {
				desconect: {
					icon: iconBase + "desconectado.png"
				},
				conect: {
					icon: iconBase + "conectado.png"
				}
			};
		}

	});
});