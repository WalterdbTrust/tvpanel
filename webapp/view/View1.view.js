sap.ui.jsview("tvpanel.view.View1", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.View1
	 */
	getControllerName: function() {
		return "tvpanel.controller.View1";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.View1
	 */
	createContent: function(oController) {
		var oPage = new sap.m.Page({
// 			title: "",
            
			content: [],
			showHeader: false,
			enableScrolling: false
// 			fullWidth: true,
// 			width:"100%"
		});

		var app = new sap.m.App("myApp", {
// 			initialPage: "oPage"
// 			fullWidth: true,
// 			width:"100%"
		});


// 		var text = sap.m.Text("text1", {
// 		    text:"Hola como estas todo bien? Hola como estas todo bien? Hola como estas todo bien? Hola como estas todo bien? Hola como estas todo bien? Hola como estas todo bien? Hola como estas todo bien? Hola como estas todo bien? Hola como estas todo bien? Hola como estas todo bien? Hola como estas todo bien?"
// 		} );

        var myView1 = sap.ui.view({type:sap.ui.core.mvc.ViewType.JS, viewName:"tvpanel.view.Patentes"});
        var myView2 = sap.ui.view({type:sap.ui.core.mvc.ViewType.JS, viewName:"tvpanel.view.Posiciones"});

        // var myView2 = sap.ui.view({type:sap.ui.core.mvc.ViewType.JS, viewName:"panel1Panel1.view.GraphicMaps"});

        var layout = new sap.ui.layout.VerticalLayout("panel1",{
			width: "100%",
			layoutData : new sap.ui.layout.GridData({
			// indent: "L3 M3",
				span: "L2 M2 S2"
			})

		});

		layout.addContent(myView1);


        var layout2 = new sap.ui.layout.VerticalLayout("panel2",{
			width: "100%",
			layoutData : new sap.ui.layout.GridData({
			// indent: "L3 M3",
				span: "L10 M10 S10"
			})

		});

		layout2.addContent(myView2);

		var oGridPanel = new sap.ui.layout.Grid("GridPanel",{
					visible: true,
					hSpacing: 1,
					vSpacing: 0,
					content: [ layout, layout2 ]
		});




        oPage.addContent(oGridPanel);
        // oPage.addContent(myView2);

		app.addPage(oPage);
		
	
		
		
		
		
		return app;
	}

});