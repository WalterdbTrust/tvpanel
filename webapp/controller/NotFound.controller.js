sap.ui.define([
		"tvpanel/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("tvpanel.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);