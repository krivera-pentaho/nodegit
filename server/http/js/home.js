// Configure Require.js
require.config({
	baseUrl:"js/lib",
	paths: {
		"jquery": "jquery/jquery-2.0.3.min",
		"jquery-ui": "jquery/jquery-ui/js/jquery-ui-1.10.3.custom.min",
		"bootstrap": "bootstrap/js/bootstrap.min",
		"handlebars": "handlebars/handlebars"
	}
});

require(['jquery', 'handlebars', 'bootstrap', 'jquery-ui'], function(JQ, Handlebars) {
});

