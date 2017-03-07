app.directive("filtros", ["filtrosService", function(filtrosService){
	return {
		restrict: 'E',
		replace: true,
		template: '<ul id="filtros">\
					<li><label for="database">Database:</label>\
					<select name="" id="database" ng-model="filtrosService.database">\
						<option value="-1">Choose a segment</option>\
					</select></li>\
					<li><label for="dataconferencia">Conference:</label>\
					<select name="" id="dataconferencia" ng-model="filtrosService.conference">\
					</select></li>\
					<li><label for="conferenceYear">Year:</label>\
					<select name="" id="conferenceYear" ng-model="filtrosService.year" ng-change="renderTopics(filtrosService.database,filtrosService.conference,filtrosService.year)">\
					</select></li>\
				</ul>'

		,
		link: function(scope, element, attr) {
			var database = "";
			var conference = "";
	    	var conf = [
					{
						"database":"ABSTRACT",
						"conference":{
						"ALL": ["ALL", 1995, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010],
						"HICSS": ["ALL", 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2010],
						"ICC": ["ALL", 2009],
						"ICIP": ["ALL", 1995, 2009],
						"IEICE TRANSACTIONS": ["ALL", 2005, 2006, 2007, 2008]

						}
					},
										{
						"database":"TITLE",
						"conference":{
						"ALL": ["ALL", 1995, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010],
						"HICSS": ["ALL", 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2010],
						"ICC": ["ALL", 2009],
						"ICIP": ["ALL", 1995, 2009],
						"IEICE TRANSACTIONS": ["ALL", 2005, 2006, 2007, 2008]

						}
					}
				];
	        for (var i in conf) {
	            $("#database").append('<option value="' + conf[i].database.toLowerCase() + '">' + conf[i].database + '</option>')
	        }
            $("#database").change(function() {
            	var index = $("#database").val();
            	var database = $("#database").val();
            	if (index == -1 || index == "") return false;
            	$("#dataconferencia").html('<option value="-1">Choose a Conference</option>');
                for (var i in conf) {
                	if (index == conf[i].database.toLowerCase()) {
                        for (var j in conf[i].conference) {
                            $("#dataconferencia").append('<option value="' + j.toLowerCase() + '">' + j + '</option>');
                        }
                        $("#dataconferencia").change(function() {
                            var confName = $("#dataconferencia").val().toUpperCase();
                            var conference = $("#dataconferencia").val().toUpperCase();
                            scope.conference = confName;
                            $("#conferenceYear").html('<option value="-1">Choose an year</option>');

                            for (var k in conf[i].conference[confName]) {
                                $("#conferenceYear").append('<option value="' + conf[i].conference[confName][k] + '">' + conf[i].conference[confName][k] + '</option>');
                                $("#conferenceYear").change(function() {
	                                var year = $("#conferenceYear").val();                                                
	                                var id = $("div.tab-pane.fade.active.in").attr("id");
	                                scope.renderTopics(database,conference,year);
	                            });
                            }
                        });
                    }
                }
            });
			$("#database").select2(); 
			$("#dataconferencia").select2(); 
			$("#conferenceYear").select2(); 


        }
	};

}]);

