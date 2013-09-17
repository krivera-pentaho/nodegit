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

require(['jquery'], function() {
	require(['handlebars', 'jquery-ui', 'bootstrap'], function(Handlebars){
		// Bind click interactions on add repo button
		$("#add-repo-btn").bind("click", function() {			
			$("#repo-path").val("");
			$("#add-repo-modal").modal('show');
		});

		// Init options on modal
		$("#add-repo-modal").modal({
			keyboard: true,
			show: false
		});

		// Bind click for add a repo path
		$("#add-repo-path-btn").bind("click", function() {
			var path = $("#repo-path").val();
			var url = getBaseUrl() + "/git/isGitDir?path=" + path; //"/home/krivera/fun-week/git/nodegit/";

			$.get(url, 
				function(data) {
					$("#add-repo-modal").modal('hide');
					

					if (data == "false") {
						alertShow("'" + path + "' is not a valid path to a git repository", "ERROR");
					} else {
						alertShow("Repository Added", "SUCCESS");
					}
					alert(data);
				});
		});
	});
});

var ALERT_SEVERITY = {
	"ALERT": "",
	"INFO": "alert-info",
	"SUCCESS": "alert-success",
	"ERROR": "alert-error"
}

function getBaseUrl() {
	return "http://" + location.host;
}

function alertShow(message, severity, $addToContainer) {
	$("#alert-message").text(message);

	$("#alert-container")
		.removeAttr("class")
		.addClass("alert")
		.addClass(ALERT_SEVERITY[severity])		
		.alert();
}

function alertHide() {
	$("#alert-container").alert("close");
}

