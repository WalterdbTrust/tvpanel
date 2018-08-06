sap.ui.jsview("tvpanel.view.Patentes", {
	getControllerName: function() {
		return "tvpanel.controller.Patentes";
	},
	createContent: function(oController) {
		var sort = new sap.ui.model.Sorter("GROUP", false, true);
        var wheight = $(window).height();  
        var otemplate = new sap.m.ColumnListItem({
                    type:"Active",
					cells: [
						new sap.m.Text({
							text: "{LIC_PLATE}"
						}),

						new sap.m.Text({
							text: "{MAKE} {MODEL}"

						}),
                            new sap.ui.core.Icon({
                                src: "{STATUS}"
                            })
						
					]
				});



		var oTable = new sap.m.Table("mainViewTbl", {
			id: "mainViewTbl",
			mode : sap.m.ListMode.MultiSelect,
			height : wheight + 'px',
			itemPress:function(e){ oController.onSelectionChange(e); },
			columns: [
				new sap.m.Column({
					header: [
						new sap.m.Label({
							text: "Patente"
						})
					]
                }),
				new sap.m.Column({
					header: [
						new sap.m.Label({
							text: "Modelo"
						})
					]
                }),
				new sap.m.Column({
					header: [
						new sap.m.Label({
							text: "En Viaje"
						})
					]
				})
			],
			items: {
				template: otemplate
			}
		});



		this.destroyContent();

		var toolbar = new sap.tnt.ToolHeader("", {
		    press: function(e){oController.pressHeader(e); },
		    heigth:"50px",
			content: [
				new sap.m.IconTabHeader("iconTabHeader", {
					items: [
						new sap.m.IconTabFilter({
							text: "Ver Todos"
							
						}),
						new sap.m.IconTabFilter({
							text: "Ver Grupos"
						}),
						new sap.m.IconTabFilter({
							text: "Reglas"
						})
					]
				})
			]
		});


var radiob = new sap.m.RadioButtonGroup("selectedFilter",{
    columns:2, 
    width:"100%",
    valueState:"Warning",
    select:function(){
        oController.ajustaColoryBindeo();
    },
    // valueState:"Error",
    buttons: [
				new sap.m.RadioButton({
				     id:"viaje", 
				     text:"En viaje",
				     width:"100%",
				     valueState:"Success",    
				    //  select:function(){
        //                 oController.ajustaColoryBindeo();
        //             }

				}),
				new sap.m.RadioButton({
				     id:"todos", 
				     text:"Todos",
				     width:"100%",
				     valueState:"Warning",
				    //  select:function(){
        //                 oController.ajustaColoryBindeo();
        //             }
				     
				})
    ]

});


        var scrollTable = new sap.m.ScrollContainer("scrollTable",{
            vertical: true,
            height: wheight  + "px",
            content: [radiob,oTable]
        });
		
		var oTableAux = new sap.ui.table.Table({
			editable: false,
			id: "tableAux",
			visible: false,
			treshold: 1000
		});

		var oTableAux2 = new sap.ui.table.Table({
			editable: false,
			id: "tableAux2",
			visible: false,
			treshold: 1000
		});
        // return [toolbar, scrollTable];
		return [oTableAux,oTableAux2,scrollTable];
	}
});