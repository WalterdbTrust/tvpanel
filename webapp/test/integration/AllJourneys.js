jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"tvpanel/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"tvpanel/test/integration/pages/Worklist",
		"tvpanel/test/integration/pages/Object",
		"tvpanel/test/integration/pages/NotFound",
		"tvpanel/test/integration/pages/Browser",
		"tvpanel/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "tvpanel.view."
	});

	sap.ui.require([
		"tvpanel/test/integration/WorklistJourney",
		"tvpanel/test/integration/ObjectJourney",
		"tvpanel/test/integration/NavigationJourney",
		"tvpanel/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});