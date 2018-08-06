sap.ui.jsview("tvpanel.view.Posiciones", {

	getControllerName: function() {
		return "tvpanel.controller.Posiciones";
	},

	createContent: function(oController) {
		var retorno = [];
		var wheight = $(window).height();  

		var idtablaTemp_ = new sap.ui.table.Table({
			editable: false,
			// selectionMode: sap.ui.table.SelectionMode.None,
			id: "idtablaTemp_",
			visibleRowCount: 4,
			minAutoRowCount: 4,
			visible: false
		});
        retorno.push(idtablaTemp_);

		var idtablaHoja = new sap.ui.table.Table({
			editable: false,
			// selectionMode: sap.ui.table.SelectionMode.None,
			id: "idtablaHoja",
			visibleRowCount: 4,
			minAutoRowCount: 4,
			visible: false
		});
        retorno.push(idtablaHoja);

		
		var oTable = new sap.ui.table.Table({
			editable: false,
			// selectionMode: sap.ui.table.SelectionMode.None,
			id: "lineItemsList1",
			visibleRowCount: 4,
			minAutoRowCount: 4,
			visible: false
		});
		retorno.push(oTable);

		var oTableDatos = new sap.ui.table.Table({
			editable: false,
			// selectionMode: sap.ui.table.SelectionMode.None,
			id: "idDatos",
			visibleRowCount: 4,
			minAutoRowCount: 4,
			visible: false
		});
		retorno.push(oTableDatos);

		var mlng = -58.379906;
		var mlat = -34.595210;

		var gmap = new openui5.googlemaps.Map({
			id: "mapaId2",
			lng: mlng,
			lat: mlat,
			zoom: 8,
			visible: false,
			fitToMarkers: true,
			panControl: true,
			zoomControl: true,
			height: wheight + "px",

			width: "100%"
	
		});
		retorno.push(gmap);
		

		var oLabel1 = new sap.ui.commons.Label("labelId1_", {
			text: "No se encontraron vehiculos conectados.",
			visible: true
		});




		retorno.push(oLabel1);



        var text3 = new sap.m.Text("textCentrar",{
            width: "100px",
			text: "Auto Centrar"
		});
		
		var switchCenter = new sap.m.Switch("autocenter",{
			state:true 
			// id="autozoom"
		});
		
		var layout3 = new sap.ui.layout.VerticalLayout("layAutocenter",{
			// width: "100%",
			layoutData : new sap.ui.layout.GridData({
				// indent: "L3 M3",
				span: "L3 M3 S6"
			})
		});
		layout3.addContent(text3);	
		layout3.addContent(switchCenter);
		
		
		var text4 = new sap.m.Text("textZoom",{
			width: "100px",
			text: "Auto Zoom"
		});
		
		var switchZoom = new sap.m.Switch("autozoom",{
			state:true 
			// id="autozoom"
		});
		
		var layout4 = new sap.ui.layout.VerticalLayout("layAutozoom",{
			// width: "100%",
			layoutData : new sap.ui.layout.GridData({
				// indent: "L3 M3",
				span: "L3 M3 S6"
			})
		});
		layout4.addContent(text4);	
		layout4.addContent(switchZoom);


		var btnVerFlota = new sap.m.Button("btnverflota",{
		    text: "Ver Flota",
		    press: function(e){
		        oController.vertodo();
		    },
		    type: sap.m.ButtonType.Emphasized
			// id="autozoom"
		});
		
		var layout5 = new sap.ui.layout.VerticalLayout("layverflota",{
			// width: "100%",
			layoutData : new sap.ui.layout.GridData({
				// indent: "L3 M3",
				span: "L3 M3 S6"
			})
		});
		layout5.addContent(btnVerFlota);	
// 		layout5.addContent(switchZoom);


        var oGrid1 = new sap.ui.layout.Grid("gridSwitch",{
			hSpacing: 1,
			vSpacing: 1,
			content: [layout3,layout4,layout5]
		});
        // retorno.push(layout3);
        retorno.push(oGrid1);
        
        var infOrigen = new sap.m.MessageStrip("infoOrigen",{
				text:"",
				type:"Information",
				showIcon: true,
				enableFormattedText:true
				// customIcon:"sap-icon://locked"
				
        }); 
		var layout6 = new sap.ui.layout.VerticalLayout("layorigen",{
			// width: "100%",
			layoutData : new sap.ui.layout.GridData({
				// indent: "L3 M3",
				span: "L3 M3 S6"
			})
		});
		layout6.addContent(infOrigen);	

        var infDestino = new sap.m.MessageStrip("infoDestino",{
				text:"",
				type:"Information",
				showIcon: true,
				enableFormattedText:true
				// customIcon:"sap-icon://locked"
        }); 
		var layout7 = new sap.ui.layout.VerticalLayout("laydestino",{
			// width: "100%",
			layoutData : new sap.ui.layout.GridData({
				// indent: "L3 M3",
				span: "L3 M3 S6"
			})
		});
		layout7.addContent(infDestino);	
		


        var infTile = new sap.m.GenericTile("infTile",{
                header:"Hora estimada de llegada",
                // subheader: "Llegada Programada: ",
                tileContent: [
                    new sap.m.TileContent("infoTitleContent",{
                        footer:"",
                      content: [
                            new sap.m.NumericContent("InfoNumeric",{
                                // value: 12,
                                scale:"Min."
                                // valueColor: sap.m.ValueColor.Good,
                                // indicator:"Up"
                            })                          
                          ]  
                    })
                
                ]
            
        } );
        
         var infTile2 = new sap.m.GenericTile("infTile2",{
                header:"Demora",
                // subheader: "Llegada Programada: ",
                tileContent: [
                    new sap.m.TileContent("infoTitleContent2",{
                        footer:"",
                      content: [
                            new sap.m.NumericContent("InfoNumeric2",{
                                // value: 12,
                                scale:"Min."
                                // valueColor: sap.m.ValueColor.Good,
                                // indicator:"Up"
                            })                          
                          ]  
                    })
                
                ]
            
        } );
        
				// text:" Origen: Escobar",
				// type:"Information",
				// showIcon: true,
				// customIcon:"sap-icon://locked"
				// // class:"sapUiMediumMarginBottom"
    //     }); 
		var layout8 = new sap.ui.layout.VerticalLayout("layTile",{
			// width: "100%",
			layoutData : new sap.ui.layout.GridData({
				// indent: "L3 M3",
				span: "L3 M3 S6"
			})
		});
		layout8.addContent(infTile);	

		var layout8_2 = new sap.ui.layout.VerticalLayout("layTile2",{
			// width: "100%",
			layoutData : new sap.ui.layout.GridData({
				// indent: "L3 M3",
				span: "L3 M3 S6"
			})
		});
		layout8_2.addContent(infTile2);
		
		
		
        
        var oGrid2 = new sap.ui.layout.Grid("gridDestindos",{
			hSpacing: 1,
			vSpacing: 1,
			content: [layout6,layout7,layout8,layout8_2]
		});
		
		
        // retorno.push(layout3);
        retorno.push(oGrid2);
        
        
        
        
        
        var infSeleccion = new sap.m.MessageStrip("infSeleccion",{
				text:"VEHICULO SELECCIONADO",
				type:"Information",
				showIcon: false,
				enableFormattedText:true
				// customIcon:"sap-icon://locked"
        }); 
		var layout9 = new sap.ui.layout.VerticalLayout("laySeleccion",{
			// width: "100%",
			layoutData : new sap.ui.layout.GridData({
				// indent: "L3 M3",
				span: "L3 M3 S6"
			})
		});
		layout9.addContent(infSeleccion);	
		
        var oGrid3 = new sap.ui.layout.Grid("gridSeleccion",{
			hSpacing: 1,
			vSpacing: 1,
			content: [layout9]
		});
		
		
        // retorno.push(layout3);
        retorno.push(oGrid3);


      /////////////////////////////////////////////////////////////////
      /////////////////////////// GRAFICOS ////////////////////////////
      /////////////////////////////////////////////////////////////////
      
      
      		var selectGeneralData = function(e, oChart) {
			var tempArr = [e.getParameter("data")[0].data];
			var points = [];
			var item = tempArr[0];
			var dataRecordIndex = item._context_row_number;
			var oSelectedData = oChart.getModel().getContext("/data/" + dataRecordIndex).getObject();
			var tempSelect;
			if (oChart.sId !== "graphicID_VELOCIDAD") {
				tempSelect = sap.ui.getCore().byId("graphicID_VELOCIDAD").vizSelection();
				if (tempSelect.length === 0 || tempSelect[0].data._context_row_number !== dataRecordIndex) {
					sap.ui.getCore().byId("graphicID_VELOCIDAD").vizSelection([{
						data: {
							"Fecha y Hora": oSelectedData.DATE,
							"Vel. km/h": oSelectedData.VELOCIDAD,
							"_context_row_number": dataRecordIndex
						}
					}], {
						clearSelection: true
					});
				}
			}

			if (oChart.sId !== "graphicID_RPM") {
				tempSelect = sap.ui.getCore().byId("graphicID_RPM").vizSelection();
				if (tempSelect.length === 0 || tempSelect[0].data._context_row_number !== dataRecordIndex) {
					sap.ui.getCore().byId("graphicID_RPM").vizSelection([{
						data: {
							"Fecha y Hora": oSelectedData.DATE,
							"Revoluciones x min.": oSelectedData.RPM,
							"_context_row_number": dataRecordIndex
						}
					}], {
						clearSelection: true
					});
				}
			}
			if (oChart.sId !== "graphicID_TEMPAGUA") {
				tempSelect = sap.ui.getCore().byId("graphicID_TEMPAGUA").vizSelection();
				if (tempSelect.length === 0 || tempSelect[0].data._context_row_number !== dataRecordIndex) {
					sap.ui.getCore().byId("graphicID_TEMPAGUA").vizSelection([{
						data: {
							"Fecha y Hora": oSelectedData.DATE,
							"Temp Agua ºC": oSelectedData.TEMPAGUA,
							"_context_row_number": dataRecordIndex
						}
					}], {
						clearSelection: true
					});
				}
			}
			points.push(oSelectedData);
			// });
			oController.IndicarEnInfo(points);
		};


      		var configGeneral = function() {
			return {
				general: {
					layout: {
						padding: 0.04
					}
				},
				valueAxis: {
					label: {
						formatString: "u"
					},
					title: {
						visible: false
					}
				},
				timeAxis: {
					title: {
						visible: false
					},
					levelConfig: {
						"year": {
							row: 2
						}
					},
					interval: {
						unit: ""
					}
				},
				plotArea: {
					dataLabel: {
						formatString: "u",
						visible: false
					},
					window: {
						start: "HH:mm:SS",
						end: "HH:MM:SS"
					}
				},
				legend: {
					title: {
						visible: false
					}
				},
				title: {
					visible: false
				},
				interaction: {
					syncValueAxis: true,
					selectability: {
						mode: "none"
					}

				}
			};
		};

		var generalDataset = function(label, campo) {
			return {
				dimensions: [{
					axis: 1,
					name: "Fecha y Hora",
					value: "{DATE}",
					dataType: "date"
				}],
				measures: [{
					group: 1,
					name: label,
					value: campo
				}],
				data: {
					path: "/data"
				}
			};
		};

		var feedCategoryAxis;
		var newCatAxis = function() {
			return new sap.viz.ui5.controls.common.feeds.FeedItem({
				"uid": "timeAxis",
				"type": "Dimension",
				"values": ["Fecha y Hora"]
			});
		};

		var oTableAux2 = new sap.ui.table.Table({
			editable: false,
			id: "idtablaTempGraficos",
			visible: false
				// treshold: 500
		});

		var generadorGrafico = function(idGrafico, labelAxis, campoAxis) {

			var oVizFrameGeneral = new sap.viz.ui5.controls.VizFrame(idGrafico, {
				"uiConfig": {
					"applicationSet": "fiori"
				},
				"vizType": "timeseries_line",
				width: "100%",
				height: "150px",
				visible: false,
				selectData: function(e) {
					var oChart = sap.ui.getCore().byId(idGrafico);
					selectGeneralData(e, oChart);
				},
				deselectData: function(e) {
				},
				layoutData: new sap.ui.layout.GridData({
					span: "L4 M12 S12"
				})

			});

			oVizFrameGeneral.setVizType("timeseries_line");

			oVizFrameGeneral.setVizProperties(configGeneral());

			var oDataset = new sap.viz.ui5.data.FlattenedDataset(generalDataset(labelAxis, campoAxis));

			oVizFrameGeneral.setDataset(oDataset);

			var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				"uid": "valueAxis",
				"type": "Measure",
				"values": [labelAxis]
			});
			feedCategoryAxis = newCatAxis();
			oVizFrameGeneral.addFeed(feedValueAxis);
			oVizFrameGeneral.addFeed(feedCategoryAxis);
			return oVizFrameGeneral;

		};



		var oVizFrameVELOCIDAD = generadorGrafico("graphicID_VELOCIDAD", "Vel. km/h", "{VELOCIDAD}");

		var oVizFrameRPM = generadorGrafico("graphicID_RPM", "RPM.", "{RPM}");

		var oVizFrameTEMPAGUA = generadorGrafico("graphicID_TEMPAGUA", "Temp Agua ºC", "{TEMPAGUA}");

		var oGridGraficos = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 1,
			content: [ oVizFrameVELOCIDAD, oVizFrameRPM,  oVizFrameTEMPAGUA]
		});

        retorno.push(oGridGraficos);
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////
        
        

        
		this.destroyContent();
		// this.addContent([oTable,oTableAux]);
		


		
		
		
		
		return [retorno];
	}
});