var fnInterval1 = function() {};

var banderaGlobos = false;
var banderaFecha = false;
var dateglobal = [];
var modeSelectd = false;
var markTemp;
var datos;
var PosicionEtiquetaVin = 3;
var zoomG;
var latG;
var lngG;
var puntoFinal;
var desdeGlobal;
var vinSelect;
var polymaps;
var arrTempAgua;
var arrVelocidad;
var arrRpm;
var backCircle;
var nextCircle;
var mtempJson = {
	"data": []
};
var OriginalResolution;
var mensajeFinEmiido = false;

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"tvpanel/model/formatter"
], function(Controller, JSONModel, formatter) {
	"use strict";

	return Controller.extend("tvpanel.controller.Posiciones", {

		// window.addEventListener('load', function() {
		// 	var script = document.createElement('script');
		// 	script.type = 'text/javascript';
		// 	script.src =
		// 		'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&avoid=TOLLS&libraries=places&callback=initMap';
		// 	document.body.appendChild(script);
		// });
		graficar: function() {

			var oModel = new sap.ui.model.json.JSONModel(mtempJson);

			sap.ui.getCore().byId("graphicID_VELOCIDAD").vizSelection([], {
				clearSelection: true
			});
			sap.ui.getCore().byId("graphicID_RPM").vizSelection([], {
				clearSelection: true
			});
			sap.ui.getCore().byId("graphicID_TEMPAGUA").vizSelection([], {
				clearSelection: true
			});
			if (mtempJson.data.length > 0) {
				var mapsView = sap.ui.getCore().byId("mapaId2");
				mapsView.setHeight(OriginalResolution);
				mapsView.setHeight((parseInt(mapsView.getHeight().substring(0, mapsView.getHeight().length - 2)) - 170) + "px");

				sap.ui.getCore().byId("graphicID_VELOCIDAD").setModel(oModel).setProperty("visible", true);
				sap.ui.getCore().byId("graphicID_RPM").setModel(oModel).setProperty("visible", true);
				sap.ui.getCore().byId("graphicID_TEMPAGUA").setModel(oModel).setProperty("visible", true);
			}

		},

		// fnINTERVAL: function(){},
		actualizaUbicacion: function() {
		    var that = this;
			var mapsView = sap.ui.getCore().byId("mapaId2");
			if (!polymaps) {
				var velColor = "#3399ff";
				polymaps = mapsView.addPolyline(new openui5.googlemaps.Polyline({
					geodesic: true,
					path: [],
					strokeColor: velColor,
					strokeOpacity: 0.6,
					strokeWeight: 6,
					visible: true
				}));

			}

			// 			var tempPath = "/VEHICLE_VIEW('" + vinSelect + "')/OBD_GPS_VIEW";
			var tempPath = "/OBD_GPS_VIEW";
			var aFilters = [];
			if (!desdeGlobal) {
				desdeGlobal = new Date();
				desdeGlobal = desdeGlobal.setMinutes(desdeGlobal.getMinutes() - 5);

			}
// 			if(!banderaFecha){
// 			    desdeGlobal = new Date();
// 			    desdeGlobal = desdeGlobal.setMinutes(desdeGlobal.getMinutes() - 15);
// 			} else {
// 			    banderaFecha = false;
// 			}


			var filtro_ = new sap.ui.model.Filter("VIN", sap.ui.model.FilterOperator.EQ, vinSelect);
			aFilters.push(filtro_);
			filtro_ = new sap.ui.model.Filter("DATE", sap.ui.model.FilterOperator.GE, desdeGlobal);
			aFilters.push(filtro_);

			var tablaView = sap.ui.getCore().byId("idtablaTemp_");
			tablaView.bindRows({
				path: tempPath,
				filters: aFilters,
				sorter: {
					path: "DATE"
				}
			});

			var puntoS;
			tablaView.getModel().setSizeLimit(2000);
			tablaView.getBinding("rows").attachDataReceived(function() {

				var marrayCount = tablaView.getBinding().getLength();
				console.log("cantidad",marrayCount);
				var marrayOri = tablaView.getBinding("rows").getContexts();
				if (marrayCount !== marrayOri.length || marrayCount === 0) {
				    // that.obtenerHojaRuta();
					return;
				}

				for (var l = 0; l < marrayOri.length; l++) {
					puntoS = marrayOri[l];
					var mpuntoS = {
						speed: puntoS.getObject().SPEED_OBD,
						lat: puntoS.getObject().LATITUDE,
						lng: puntoS.getObject().LONGITUDE,
						zIndex: -1,
						map: mapsView
					};
                    console.log("fecha",puntoS.getObject().DATE);
                    
                    // var temppoly = polymaps.mAggregations.polylines[0].getProperty("path").push(mpuntoS);;
                    polymaps.mAggregations.polylines[0].getProperty("path").unshift(mpuntoS);
                    // var finaltemp = [];
                    // temppoly.push(mpuntoS);
                    
                    // finaltemp.push(mpuntoS);
                    // for(var y = temppoly.length - 1; y >= 0; y--){
                    //     finaltemp.push(temppoly[y]);
                    // }
                    
                    
                    // temppoly.map(function(item){
                    //   finaltemp.push(item); 
                    // });
                    
				// 	polymaps.mAggregations.polylines[0].setProperty("path",temppoly);
					
					if (mtempJson.data.length > 35) {
						mtempJson.data.splice(0, 1);
					}
					mtempJson.data.push({
						DATE: puntoS.getObject().DATE,
						VELOCIDAD: puntoS.getObject().SPEED_OBD,
						RPM: puntoS.getObject().RPM,
						TEMPAGUA: puntoS.getObject().WATER_TEMP,
						DATEINFO: formatter.formatDate(puntoS.getObject().DATE)
					});

					puntoFinal = puntoS;
					if (puntoS.getObject().DATE > desdeGlobal){
					    desdeGlobal = puntoS.getObject().DATE;
					}
				}
				// polymaps.setProperty("visible",true);
                // that.obtenerHojaRuta();
			});
			

		},

		ruteoMaps: function(vin) {
			var mapsView = sap.ui.getCore().byId("mapaId2");
			mapsView.setHeight(OriginalResolution);
			// 			mapsView.setHeight((parseInt(mapsView.getHeight().substring(0, mapsView.getHeight().length - 2)) - 150) + "px");
			//  vinSelect = vin;
			var that = this;
			if (polymaps && polymaps.mAggregations.polylines[0].getProperty("path").length > 0) {
				for (var p = 0; p <= polymaps.mAggregations.polylines[0].getProperty("path").length; p++) {
					polymaps.mAggregations.polylines[0].setProperty("path", []);
				}
			}
			mtempJson = {
				"data": []
			};
			that.graficar();
			// 			var mapsView = sap.ui.getCore().byId("mapaId2");
            // return;
			var tempPath = "/VEHICLE_VIEW('" + vin + "')/OBD_GPS_VIEW";
			var aFilters = [];

			
			var desde = new Date();
			// desde = desde.setHours(desde.getHours() - 1);
// 			if(!banderaFecha){
			    desde = desde.setMinutes(desde.getMinutes() - 5);
// 			} else {
// 			    banderaFecha = false;
// 			    desde = desdeGlobal;
			    
// 			}
			
			var filtro_ = new sap.ui.model.Filter("DATE", sap.ui.model.FilterOperator.GE, desde);
			aFilters.push(filtro_);

			var tablaView = sap.ui.getCore().byId("idtablaTemp_");
			tablaView.bindRows({
				path: tempPath,
				filters: aFilters,
				sorter: {
					path: "DATE"
				}
			});

// 			tablaView.getModel().setSizeLimit(5000);
			tablaView.getBinding("rows").attachDataReceived(function() {
				var marrayCount = tablaView.getBinding().getLength();
				var marrayOri = tablaView.getBinding("rows").getContexts();

				// if (marrayCount > 5000) {
				// 	// 	clearInterval(that.fnINTERVAL);
				// 	return;
				// }

				if (marrayCount === 0) {
					return;
				}

				if (marrayCount !== marrayOri.length) {
					return;
				}

				var icons = that.cargarIcons();
				var puntoS;
				var velColor = "#3399ff";
    			if (!polymaps) {
    				// var velColor = "#3399ff";
    				polymaps = mapsView.addPolyline(new openui5.googlemaps.Polyline({
    					geodesic: true,
    					path: [],
    					strokeColor: velColor,
    					strokeOpacity: 0.6,
    					strokeWeight: 6,
    					visible: true
    				}));
    
    			}

				for (var l = 0; l < marrayOri.length; l++) {
					puntoS = marrayOri[l];
					var mpuntoS = {
						speed: puntoS.getObject().SPEED_OBD,
						lat: puntoS.getObject().LATITUDE,
						lng: puntoS.getObject().LONGITUDE,
						icon: icons.invi.icon,
						zIndex: -1,
						map: mapsView
					};

					polymaps.mAggregations.polylines[0].getProperty("path").unshift(mpuntoS);
					puntoFinal = puntoS;
					if (puntoS.getObject().DATE > desdeGlobal){
					    desdeGlobal = puntoS.getObject().DATE;
					}


					mtempJson.data.push({
						DATE: puntoS.getObject().DATE,
						VELOCIDAD: puntoS.getObject().SPEED_OBD,
						RPM: puntoS.getObject().RPM,
						TEMPAGUA: puntoS.getObject().WATER_TEMP,
						// 		POSICIONACELERADOR: item.getObject().ACCELERATOR_POS,
						// 		PRESADMISIONAB: item.getObject().PRESS_ADMISSION,
						DATEINFO: formatter.formatDate(puntoS.getObject().DATE)

					});
					

				}

			});

		},

		onExit: function() {
			clearInterval(fnInterval1);
		},

		ponerVisible: function() {
			var mapsView = sap.ui.getCore().byId("mapaId2");
			OriginalResolution = mapsView.getHeight();
			if (mapsView) {
				var mvisible = mapsView.getProperty("visible");
				if (!mvisible) {
					this.vertodo();
				}
				mapsView.setVisible(true);
			}
		},
		vertodo: function() {

			sap.ui.getCore().byId("layorigen").setVisible(false);
			sap.ui.getCore().byId("laydestino").setVisible(false);
			sap.ui.getCore().byId("layTile").setVisible(false);
			sap.ui.getCore().byId("laySeleccion").setVisible(false);

			sap.ui.getCore().byId("graphicID_VELOCIDAD").setProperty("visible", false);
			sap.ui.getCore().byId("graphicID_RPM").setProperty("visible", false);
			sap.ui.getCore().byId("graphicID_TEMPAGUA").setProperty("visible", false);

			var mapsView = sap.ui.getCore().byId("mapaId2");
			mapsView.setVisible(true);
			mapsView.setHeight(OriginalResolution);
			modeSelectd = false;
			// clearInterval(fnINTERVAL);
			this.init();
		},
		ubicar: function(vin, patente) {
			banderaGlobos = false;
			
			sap.ui.getCore().byId("layorigen").setVisible(false);
			sap.ui.getCore().byId("laydestino").setVisible(false);
			sap.ui.getCore().byId("layTile").setVisible(false);
			sap.ui.getCore().byId("laySeleccion").setVisible(false);

			vinSelect = vin;
			var that = this;
			var icons = that.cargarIcons();
			var mapsView = sap.ui.getCore().byId("mapaId2");
			if (!mapsView.getProperty("visible")) {
				return;
			}
			var markers = mapsView.getMarkers();
			var bandera = false;
			for (var i = 0; i < markers.length; i++) {
				markers[i].onInfoWindowClose();
				markers[i].setIcon(icons.gotagris.icon);
				markers[i].setZIndex(-1);
				if (!bandera) {
					var pat = $(markers[i].getInfo());
					var idpat = "vin";
					pat = pat[PosicionEtiquetaVin].getElementsByTagName("span")[idpat].innerText;

					if (pat.trim() === vin.trim()) {
						var objCenter = sap.ui.getCore().byId("autocenter");
						var objZoom = sap.ui.getCore().byId("autozoom");

						var autocenter = objCenter ? objCenter.getState() : true;
						var autozoom = objZoom ? objZoom.getState() : true;

						// 		markers[i].onClick();
						markers[i].setIcon();
						markers[i].setZIndex(1);

						// var mapsView = sap.ui.getCore().byId("mapaId2");
						if (autocenter) {
							mapsView.setLat(markers[i].getLat());
							mapsView.setLng(markers[i].getLng());
						}
						markTemp = markers[i];
						if (autozoom) {
							mapsView.setZoom(14);
						}
						bandera = true;
						modeSelectd = true;

						sap.ui.getCore().byId("infSeleccion").setText("Vehiculo <strong>" + patente + "</strong>");
						sap.ui.getCore().byId("laySeleccion").setVisible(true);

        		    	var desde = new Date();
		        	    desde = desde.setMinutes(desde.getMinutes() - 5);

						desdeGlobal = desde;
						that.ruteoMaps(vin.trim());
						that.obtenerHojaRuta();
						
					}
				}
			}

			// }
		},
		devolverMinutos: function(horaMinutos) {
			return (parseInt(horaMinutos.split(":")[0]) * 60) + parseInt(horaMinutos.split(":")[1]);
		},
		obtenerHojaRuta: function() {
			var that = this;
			var aFilters = [];

			var filtro_ = new sap.ui.model.Filter("VIN", sap.ui.model.FilterOperator.EQ, vinSelect);
			aFilters.push(filtro_);

			var tablaView = sap.ui.getCore().byId("idtablaHoja");
			tablaView.bindRows({
				path: "/ROADMAP_TRACING",
				filters: aFilters
			});
			tablaView.getBinding("rows").attachDataReceived(function() {
				var arrHoja = tablaView.getBinding("rows").getContexts();
				if (arrHoja.length === 0 || (arrHoja.length > 0 && arrHoja[0].getObject().BACK_LATITUDE === null)) {
				    
					sap.ui.getCore().byId("layorigen").setVisible(false);
					sap.ui.getCore().byId("laydestino").setVisible(false);
					sap.ui.getCore().byId("layTile").setVisible(false);

					if (backCircle) {
						backCircle.setVisible(false);

					}
					if (nextCircle) {
						nextCircle.setVisible(false);

					}

				} else {
					var mlatB = parseFloat(arrHoja[0].getObject().BACK_LATITUDE.toString().replace(",", "."));
					var mlngB = parseFloat(arrHoja[0].getObject().BACK_LONGITUDE.toString().replace(",", "."));
					var mlatN = parseFloat(arrHoja[0].getObject().NEXT_LATITUDE.toString().replace(",", "."));
					var mlngN = parseFloat(arrHoja[0].getObject().NEXT_LONGITUDE.toString().replace(",", "."));

					var mapsView = sap.ui.getCore().byId("mapaId2");
					if (backCircle) {
						backCircle.setCenter({
							lat: mlatB,
							lng: mlngB
						});
						if (!banderaGlobos) {
							banderaGlobos = true;
							banderaFecha = true;
							if (arrHoja[0].getObject().ON_TRIP !== 0 && typeof polymaps === "object"
							    && polymaps.mAggregations.polylines[0].getProperty("path").length > 0) {
								polymaps.mAggregations.polylines[0].setProperty("path", []);
							     //   polymaps.mAggregations.polylines[0].setProperty("path", []);	
								// }
							    desdeGlobal = arrHoja[0].getObject().START_TIME;
							        
							    }
							
							

						}
						backCircle.setVisible(true);

					} else {
						if (!banderaGlobos) {
							banderaGlobos = true;
							banderaFecha = true;
							if (arrHoja[0].getObject().ON_TRIP !== 0 && typeof polymaps === "object"  
							    && polymaps.mAggregations.polylines[0].getProperty("path").length > 0) {
								polymaps.mAggregations.polylines[0].setProperty("path", []);
								
								// }
							desdeGlobal = arrHoja[0].getObject().START_TIME;
							        
							    }
							
							

						}

						backCircle = new google.maps.Circle({
							strokeColor: "#5CE807",
							strokeOpacity: 0.8,
							strokeWeight: 2,
							fillColor: "#5CE807",
							fillOpacity: 0.35,
							map: mapsView.map,
							center: {
								lat: mlatB,
								lng: mlngB
							},
							radius: Math.sqrt(15) * 100
						});
					}

					var critialColor;
					var borderColor;

					var infOrigen = sap.ui.getCore().byId("infoOrigen");
					infOrigen.setText("Origen: <strong>" + arrHoja[0].getObject().BACK_DESTINATION + "</strong>");
					infOrigen.setType("Success");

					var infDestino = sap.ui.getCore().byId("infoDestino");
					infDestino.setText("Destino: <strong>" + arrHoja[0].getObject().NEXT_DESTINATION + "</strong>");

					var infTile = sap.ui.getCore().byId("infTile");
					var minut = 0;

					var starttime = new Date(arrHoja[0].getObject().START_TIME);

					var horaactual = new Date();

					var horallegada = new Date(arrHoja[0].getObject().START_TIME);
					horallegada.setMinutes(horallegada.getMinutes() + parseFloat(arrHoja[0].getObject().EXPECTED_DURATION));

					var infoTitleContent = sap.ui.getCore().byId("infoTitleContent");
					infoTitleContent.setFooter(formatter.formatDate(horallegada));

					var horaEstimadalLegada = new Date();

					if (arrHoja[0].getObject().COMPLETION_PERCENTAGE > 0) {
						var minutosTranscurridos = that.devolverMinutos(horaactual.getHours().toString() + ":" + horaactual.getMinutes().toString()) -
							that.devolverMinutos(starttime.getHours().toString() + ":" + starttime.getMinutes().toString());
						var velocidad = (minutosTranscurridos / arrHoja[0].getObject().COMPLETION_PERCENTAGE);
						minut = Math.floor((100 - arrHoja[0].getObject().COMPLETION_PERCENTAGE) * velocidad);
						horaEstimadalLegada.setMinutes(horaEstimadalLegada.getMinutes() + minut);


					} else {
						if (arrHoja[0].getObject().COMPLETION_PERCENTAGE === 0) {
							minut = arrHoja[0].getObject().EXPECTED_DURATION;
						}
						horaEstimadalLegada = new Date(arrHoja[0].getObject().START_TIME);
						horaEstimadalLegada.setMinutes(horaEstimadalLegada.getMinutes() + arrHoja[0].getObject().EXPECTED_DURATION);
					}

					infTile.setSubheader(formatter.formatDate(horaEstimadalLegada));
					
						var minutos2 = that.devolverMinutos(horaEstimadalLegada.getHours().toString() + ":" + horaEstimadalLegada.getMinutes().toString()) -
							that.devolverMinutos(horallegada.getHours().toString() + ":" + horallegada.getMinutes().toString());
					
					var InfoNumeric = sap.ui.getCore().byId("InfoNumeric");
					var InfoNumeric2 = sap.ui.getCore().byId("InfoNumeric2");
					// console.log(sap.ui.getCore().byId("InfoNumeric-scale"));
					InfoNumeric2.setValue(Math.abs(minutos2));
					InfoNumeric.setValue(Math.abs(minut));
					if (horaEstimadalLegada <= horallegada) {

						InfoNumeric.setValueColor("Good");
						InfoNumeric.setIndicator("Up");

						infDestino.setType("Success");

						infDestino.removeStyleClass("backNaranja");
						infDestino.removeStyleClass("backRojo");
						infDestino.removeStyleClass("backVerde");
						infDestino.addStyleClass("backAzul");

						critialColor = "#77B4F5";
						borderColor = critialColor;
					} else if (horaactual < horallegada) {
						InfoNumeric.setValueColor("Critical");
						infDestino.setType("Warning");
						InfoNumeric.setIndicator("Down");

						infDestino.removeStyleClass("backRojo");
						infDestino.removeStyleClass("backAzul");
						infDestino.removeStyleClass("backVerde");
						infDestino.addStyleClass("backNaranja");
						critialColor = "#F5E277";
						borderColor = "#F57E77";

					} else {

						InfoNumeric.setValueColor("Error");
						InfoNumeric.setIndicator("Down");
						infDestino.setType("Error");

						infDestino.removeStyleClass("backNaranja");
						infDestino.removeStyleClass("backVerde");
						infDestino.removeStyleClass("backAzul");

						infDestino.addStyleClass("backRojo");
						critialColor = "#F57E77";
						borderColor = critialColor;
					}

					if (arrHoja[0].getObject().ON_TRIP === 2 || arrHoja[0].getObject().ON_TRIP === 0) {

						InfoNumeric.setValueColor("Good");
						InfoNumeric.setIndicator("Up");

						infDestino.setType("Success");

						infDestino.removeStyleClass("backRojo");
						infDestino.removeStyleClass("backAzul");
						infDestino.addStyleClass("backVerde");

						critialColor = "#5CE807";
						borderColor = critialColor;
					}

					if (nextCircle) {
						nextCircle.setCenter({
							lat: mlatN,
							lng: mlngN
						});
						nextCircle.setOptions({
							strokeColor: borderColor,
							fillColor: critialColor
						});
						nextCircle.setVisible(true);
					} else {

						nextCircle = new google.maps.Circle({
							strokeColor: borderColor,
							strokeOpacity: 0.8,
							strokeWeight: 2,
							fillColor: critialColor,
							fillOpacity: 0.35,
							map: mapsView.map,
							center: {
								lat: mlatN,
								lng: mlngN
							},
							radius: Math.sqrt(15) * 100
						});
					}

				    if(arrHoja[0].getObject().ON_TRIP === 0){
				        var hnow = new Date();
				        var dif = ((hnow.getTime() - arrHoja[0].getObject().DATE.getTime()) / 1000);
				        if(dif > 25){
				            banderaGlobos = false;
        					sap.ui.getCore().byId("layorigen").setVisible(false);
        					sap.ui.getCore().byId("laydestino").setVisible(false);
        					sap.ui.getCore().byId("layTile").setVisible(false);
        					if (backCircle) {
        						backCircle.setVisible(false);
        					}
        					if (nextCircle) {
        						nextCircle.setVisible(false);
        					}
				            
				            // return;
				        } else {
				            if(!mensajeFinEmiido){
				                mensajeFinEmiido = true;

                                sap.m.MessageToast.show("Hoja de Ruta " + arrHoja[0].getObject().ROADMAP_DESCRIPTION + " ha finalizado.", {
                                    duration: 20000,                  // default
                                    width: "35em",                   // default
                                    of: mapsView,                      // default
                                    autoClose: true,                 // default
                                    animationTimingFunction: "ease", // default
                                    animationDuration: 1000,         // default
                                    closeOnBrowserNavigation: true   // default
                                });
                    
                                
                                
				            }
				        }
				    } else {
        					sap.ui.getCore().byId("layorigen").setVisible(true);
        					sap.ui.getCore().byId("laydestino").setVisible(true);
        					sap.ui.getCore().byId("layTile").setVisible(true);

				    }


				}
				
            that.actualizaUbicacion();
			});
			// 			}

		},
		init: function(ruta, id) {

			sap.ui.getCore().byId("panel2").addStyleClass("divPanel2");
			sap.ui.getCore().byId("gridSwitch").addStyleClass("botonesSwitch");
			sap.ui.getCore().byId("layAutocenter").addStyleClass("layAutocenter");
			sap.ui.getCore().byId("layAutozoom").addStyleClass("layAutozoom");
			sap.ui.getCore().byId("layverflota").addStyleClass("layverflota");
			sap.ui.getCore().byId("textZoom").addStyleClass("textSwitch");
			sap.ui.getCore().byId("textCentrar").addStyleClass("textSwitch");
			sap.ui.getCore().byId("layorigen").addStyleClass("layOrigen").setVisible(false);
			sap.ui.getCore().byId("laydestino").addStyleClass("layDestino").setVisible(false);

			// sap.ui.getCore().byId("layTile").addStyleClass("layTile").setVisible(false);
			// sap.ui.getCore().byId("layTile").addStyleClass("layTile2").setVisible(false);
			sap.ui.getCore().byId("layTile").addStyleClass("layTile").setVisible(true);
			sap.ui.getCore().byId("layTile2").addStyleClass("layTile2").setVisible(true);
			sap.ui.getCore().byId("infTile2").addStyleClass("infTile2");

			sap.ui.getCore().byId("infTile").addStyleClass("infTile");
			sap.ui.getCore().byId("infoOrigen").addStyleClass("backVerde");

			sap.ui.getCore().byId("laySeleccion").addStyleClass("laySeleccion").setVisible(false);
			sap.ui.getCore().byId("infSeleccion").addStyleClass("infSeleccion");

			if (typeof polymaps === "object" && polymaps.mAggregations.polylines[0].getProperty("path").length > 0) {
					polymaps.mAggregations.polylines[0].setProperty("path", []);
			}

			modeSelectd = false;
			var that = this;
			var icons = that.cargarIcons();
			var mapsView = sap.ui.getCore().byId("mapaId2");

			var markers = mapsView.getMarkers();
			for (var i = 0; i < markers.length; i++) {
				markers[i].onInfoWindowClose();
				markers[i].setIcon(icons.gotagris.icon);
				markers[i].setZIndex(-1);
			}

			// 			mapsView.destroyMarkers();
			// 			mapsView.resetMap();

			var objCenter = sap.ui.getCore().byId("autocenter");
			var objZoom = sap.ui.getCore().byId("autozoom");

			var autocenter = objCenter ? objCenter.getState() : true;
			var autozoom = objZoom ? objZoom.getState() : true;

			if (autozoom) {
				mapsView.setZoom(zoomG || 10);
			}

			if (autocenter && (latG && lngG)) {
				mapsView.setLat(latG);
				mapsView.setLng(lngG);
			}
			that.tabla(ruta, id);
			that.intervalo(ruta, id);

		},
		armaInfo: function(item, pstringInfo) {
			//  var icons = this.cargarIcons();
			var telem = item.getObject();
			var mstring = pstringInfo + "<h1 style='font-size:10px;'>Velocidad: " + telem.SPEED + "km/h";
			mstring += "</h1>";

			mstring += "<p style='font-size:10px;'>Fecha y hora:" + formatter.formatDate(item.getObject().DATE) + "</br>";
			mstring += "Temp. Agua  : " + telem.WATER_TEMP + " ºC</br>";
			mstring += telem.TEMPACEITE ? ("Temp. Aceite: " + telem.TEMPACEITE + " ºC</br>") : "";
			mstring += "Revoluciones: " + telem.RPM + " x min.</br>";
			mstring += telem.PRESS_ADMISSION ? ("Presion Admision: " + telem.PRESS_ADMISSION + " </br>") : "";
			mstring += telem.ACCELERATOR_POS ? ("Acelerador  : %" + telem.ACCELERATOR_POS + " </p>") : "</p>";

			return mstring;
		},

		tabla: function(id) {
			var that = this;
			datos = [];
			var intravels = [];

			// console.log("Se ejecuta intervalo");
			var tablaViewData = sap.ui.getCore().byId("idDatos");
			// clearInterval(fnInterval1);
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			oModel.attachRequestCompleted(function onCompleted(oEvent) {
				var a = this.getJSON();
				var userEmail = JSON.parse(a).email;

				// userEmail = "pablo.benavidez@dbtrust.com.ar";

				var filtro1 = new sap.ui.model.Filter("EMAIL", sap.ui.model.FilterOperator.EQ, userEmail);
				tablaViewData.bindRows({
					path: "/VEHICLE_VIEW_GROUP",
					filters: [filtro1]
				});
				tablaViewData.getBinding("rows").attachDataReceived(function() {

					datos = tablaViewData.getBinding("rows").getContexts();
					var totaldatosLength = tablaViewData.getBinding("rows").getLength();
					if (datos.length !== totaldatosLength) {
						return;
					}
					var vinLimpios = [];
					datos.map(function(item) {
						if (vinLimpios.indexOf(item.getObject().VIN) < 0) {
							vinLimpios.push(item.getObject().VIN);
						}
					});

					var filtroVin = [];
					vinLimpios.map(function(item) {
						filtroVin.push(new sap.ui.model.Filter("VIN", sap.ui.model.FilterOperator.EQ, item.toString()));
					});

					var tablaView2 = sap.ui.getCore().byId("lineItemsList1");
					var labelView = sap.ui.getCore().byId("labelId1_");

					tablaView2.bindRows({
						path: "/DRIVER_VIEW",
						filters: filtroVin
					});
					tablaView2.getBinding("rows").attachDataReceived(function() {
						var arrDrivers = tablaView2.getBinding("rows").getContexts();
						var totalLength = tablaView2.getBinding("rows").getLength();
						if (arrDrivers.length !== totalLength) {
							return;
						}

						tablaView2.bindRows({
							path: "/TELEMETRY_VIEW",
							filters: filtroVin
						});
						labelView.setProperty("visible", false);

						tablaView2.getBinding("rows").attachDataReceived(function() {
							var mapView = sap.ui.getCore().byId("mapaId2");
							// 			clearInterval(fnInterval1);
							var marray = tablaView2.getBinding("rows").getContexts();
							totalLength = tablaView2.getBinding("rows").getLength();
							if (marray.length !== totalLength) {
								return;
							}
							mapView.setVisible(true);
							var icons = that.cargarIcons();
							var maxLat = 0;
							var minLat = 0;
							var maxLng = 0;
							var minLng = 0;

							var marcas = [];

							marray = marray.filter(function(item) {
								return item.getObject().LAST_LATITUDE !== null && item.getObject().LAST_LONGITUDE !== null;
							});

							var primero = true;
							marray.map(function(item, i) {
								if (parseFloat(item.getObject().LAST_LATITUDE.replace(",", ".")) !== 0 && parseFloat(item.getObject().LAST_LONGITUDE
										.replace(",", ".")) !== 0) {
									if (primero) {
										primero = false;
										minLat = parseFloat(item.getObject().LAST_LATITUDE.replace(",", "."));
										maxLat = minLat;

										minLng = parseFloat(item.getObject().LAST_LONGITUDE.replace(",", "."));
										maxLng = minLng;
									}
									minLat = parseFloat(item.getObject().LAST_LATITUDE.replace(",", ".")) < minLat ? parseFloat(item.getObject().LAST_LATITUDE
										.replace(",", ".")) : minLat;
									maxLat = parseFloat(item.getObject().LAST_LATITUDE.replace(",", ".")) > maxLat ? parseFloat(item.getObject().LAST_LATITUDE
										.replace(",", ".")) : maxLat;

									minLng = parseFloat(item.getObject().LAST_LONGITUDE.replace(",", ".")) < minLng ? parseFloat(item.getObject().LAST_LONGITUDE
										.replace(",", ".")) : minLng;
									maxLng = parseFloat(item.getObject().LAST_LONGITUDE.replace(",", ".")) > maxLng ? parseFloat(item.getObject().LAST_LONGITUDE
										.replace(",", ".")) : maxLng;
								}
								var oneVehicle = datos.filter(function(vehicle) {
									return vehicle.getObject().VIN === item.getObject().VIN;
								});

								var stringDriversHeader = "<h1 style='font-size:10px;'><dl><dt>Conductor/es:</dt>";
								var stringDrivers = "";
								if(oneVehicle && oneVehicle.length > 0 && arrDrivers && arrDrivers.length > 0){
    								arrDrivers.map(function(driver) {
    									if (oneVehicle[0].getObject().VIN === driver.getObject().VIN) {
    										stringDrivers += "<dd>" + driver.getObject().FIRSTNAME + " " + driver.getObject().LASTNAME + "</dd>";
    									}
    								});
								}
								if (stringDrivers.length > 0) {
									stringDrivers = stringDriversHeader + stringDrivers;
									stringDrivers += "</dl></h1>";
								} else {
									stringDrivers = "";
								}

								var stringInfo = "<h2 style='font-size:11px;margin-bottom: 0px;margin-top: 0px;'>" + oneVehicle[0].getObject().MODEL +
									" " + oneVehicle[0].getObject().SUBMODEL +
									"</h2>";
								stringInfo +=
									"<h1 style='margin-bottom: 0px;margin-top: 0px;'><span style='font-style:oblique;font-size:10px;'> Patente: </span><span id='pat' style='font-style:oblique;font-size:10px;'>" +
									oneVehicle[0].getObject().LIC_PLATE;
								// console.log("Drivers:", stringDrivers);
								stringInfo += stringDrivers;
								stringInfo += "</span></h1> ";
								stringInfo +=
									"<p style='visibility:hidden; height:0px;margin-bottom: 0px;margin-top: 0px;'><span id='vin' style='visibility:hidden'>" +
									item.getObject().VIN + "</span><span id='date' style='visibility:hidden'>" + formatter.formatDate(item.getObject().DATE) +
									"</span></p>";

								var pos = {
									animation: 0,

									info: that.armaInfo(item, stringInfo),

									lat: parseFloat(item.getObject().LAST_LATITUDE.replace(",", ".")),
									lng: parseFloat(item.getObject().LAST_LONGITUDE.replace(",", ".")),

									icon: icons.gotagris.icon,
									zIndex: -1,
									map: mapView,

								};

								if (pos.lat !== 0 && pos.lng !== 0) {
									var mark_ = new openui5.googlemaps.Marker(pos);
									marcas.push(mark_);
									intravels.push({
										VIN: item.getObject().VIN,
										IN_TRAVEL: item.getObject().IN_TRAVEL
									});
								}
							});
							var VinAzules = "";
							var markers = mapView.getMarkers();
							for (var i = 0; i < marcas.length; i++) {
								var patMarcas = $(marcas[i].getInfo());
								var idpat = "vin";
								patMarcas = patMarcas[PosicionEtiquetaVin].getElementsByTagName("span")[idpat].innerText;
								// 			console.log("este:", patMarcas);
								var encontro = false;
								for (var j = 0; j < markers.length; j++) {
									var patMarkers = $(markers[j].getInfo());
									// 	console.log(patMarkers);

									if (patMarkers[PosicionEtiquetaVin] && patMarkers[PosicionEtiquetaVin].getElementsByTagName("span")[idpat]) {
										// console.log(idpat,patMarkers[PosicionEtiquetaVin].getElementsByTagName("span")[idpat]
										// );
										patMarkers = patMarkers[PosicionEtiquetaVin].getElementsByTagName("span")[idpat].innerText;

									} else {
										patMarkers = "";
									}

									// console.log("Contra este:", patMarkers);
									if (patMarcas.trim() === patMarkers.trim()) {
										encontro = true;
										// console.log("Encontro");

										var inTr = 0;
										intravels.map(function(tr) {
											if (tr.VIN === patMarcas.trim()) {
												inTr = tr.IN_TRAVEL;
											}
										});

										if (inTr && (markers[j].getLat() !== marcas[i].getLat() || markers[j].getLng() !== marcas[i].getLng())) {
											markers[j].setLat(marcas[i].getLat());
											markers[j].setLng(marcas[i].getLng());

											if (that.obtenerDate(markers[j]) !== that.obtenerDate(marcas[i])) {
												markers[j].setInfo(marcas[i].getInfo());
											}

											if (markers[j] !== markTemp) {
												if (markers[j].getIcon() !== icons.gotablue.icon) {
													markers[j].setIcon(icons.gotablue.icon);
													markers[j].setZIndex(1);
												}
												VinAzules += "|" + patMarkers;
											} else {
												VinAzules += "|" + patMarkers;
											}
										} else {
											if (markers[j] !== markTemp && markers[j].getIcon() === icons.gotablue.icon) {
												markers[j].setIcon(icons.gotagris.icon);
												markers[j].setZIndex(-1);
											}
										}
										break;
									}
								}
								sap.ui.controller("tvpanel.controller.Patentes").rowColor(VinAzules);
								if (!encontro) {
									//  console.log("No encontro asi que lo agrega: ",marcas[i]);
									mapView.addMarker(marcas[i]);
								}
							}

							// 	console.log("markers del mapa:", markers);
							var objCenter = sap.ui.getCore().byId("autocenter");
							var objZoom = sap.ui.getCore().byId("autozoom");

							var autocenter = objCenter ? objCenter.getState() : true;
							var autozoom = objZoom ? objZoom.getState() : true;

							if (!modeSelectd) {

								if (autocenter) {
									latG = (minLat + maxLat) / 2;
									lngG = (minLng + maxLng) / 2;
									if (mapView.getLat() !== latG) {
										mapView.setLat(latG);
									}
									if (mapView.getLng() !== lngG) {
										mapView.setLng(lngG);
									}

								} else {
									if (mapView.getLat() !== mapView.map.getCenter().lat()) {
										mapView.setLat(mapView.map.getCenter().lat());
									}
									if (mapView.getLng() !== mapView.map.getCenter().lng()) {
										mapView.setLng(mapView.map.getCenter().lng());
									}
								}

								var difLat = maxLat - minLat;
								var difLng = maxLng - minLng;

								if (autozoom) {
									zoomG = that.obtenerZoom(difLat, difLng) + 2;
									mapView.setZoom(zoomG);
								}
							} else {
								if (autocenter) {
									if (mapView.getLat() !== markTemp.getLat()) {
										mapView.setLat(markTemp.getLat());
									}
									if (mapView.getLng() !== markTemp.getLng()) {
										mapView.setLng(markTemp.getLng());
									}
								} else {
									if (mapView.getLat() !== mapView.map.getCenter().lat()) {
										mapView.setLat(mapView.map.getCenter().lat());
									}
									if (mapView.getLng() !== mapView.map.getCenter().lng()) {
										mapView.setLng(mapView.map.getCenter().lng());
									}

								}
								if (autozoom) {
									zoomG = 14;
									mapView.setZoom(zoomG);
								}
								
								// that.actualizaUbicacion();
								that.obtenerHojaRuta();
								that.graficar();
							}
						});
					});
				});
			});

			// }
		},
		obtenerDate: function(mark) {
			var dateMarcas = $(mark.getInfo());
			var id = "date";
			dateMarcas = dateMarcas[PosicionEtiquetaVin].getElementsByTagName("span")[id].innerText;
			return dateMarcas;
		},

		intervalo: function(ruta, id) {
			clearInterval(fnInterval1);
			fnInterval1 = setInterval(this.tabla.bind(this, ruta, id), 5000);
		},

		obtenerZoom: function(difLat, difLng) {
			var reglasZoom = this.obtenerReglas();
			var mret = 0;
			for (var i = 0; i < reglasZoom.length; i++) {
				if (difLat <= reglasZoom[i].lat && difLng < reglasZoom[i].lng) {
					mret = reglasZoom[i].zoom;
					break;
				}
			}
			// console.log("Zoom:",mret);
			return mret;
		},
		obtenerReglas: function() {
			return [{
				lat: 0.0080,
				lng: 0.0170,
				zoom: 15
			}, {
				lat: 0.0140,
				lng: 0.0400,
				zoom: 14
			}, {
				lat: 0.0300,
				lng: 0.0700,
				zoom: 13
			}, {
				lat: 0.0700,
				lng: 0.1500,
				zoom: 12
			}, {
				lat: 0.1300,
				lng: 0.3200,
				zoom: 11
			}, {
				lat: 0.3200,
				lng: 0.6400,
				zoom: 10
			}, {
				lat: 0.6400,
				lng: 1.2800,
				zoom: 9
			}, {
				lat: 1.2800,
				lng: 2.5600,
				zoom: 8
			}, {
				lat: 2.5600,
				lng: 4.1200,
				zoom: 7
			}, {
				lat: 5.1200,
				lng: 10.2400,
				zoom: 6
			}, {
				lat: 10.2400,
				lng: 20.4800,
				zoom: 5
			}, {
				lat: 20.4800,
				lng: 40.9600,
				zoom: 4
			}, {
				lat: 40.9600,
				lng: 81.9200,
				zoom: 3
			}, {
				lat: 999.0000,
				lng: 999.0000,
				zoom: 2
			}];
		},
		cargarIcons: function() {

			var myRootPath = jQuery.sap.getModulePath("tvpanel");
			var iconBase = myRootPath + "/icon/";

			return {
				go: {
					icon: iconBase + "end.png"
				},
				punto: {
					icon: iconBase + "point.png"
				},
				flag: {
					icon: iconBase + ""
				},
				track: {
					icon: iconBase + "source.gif"
				},
				gotagris: {
					icon: iconBase + "gotagris2.png"
				},
				gotablue: {
					icon: iconBase + "gotablue.png"
				},
				alertIcon: {
					icon: iconBase + "Alert-icon.png"
				},
				llegada: {
					icon: iconBase + "llegada.png"
				},
				invi: {
					icon: iconBase + "invisible.png"
				}
			};
		}

	});
});