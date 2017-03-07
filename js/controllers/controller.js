	var Field = [
		"information retrieval",
		"artificial intelligence",
		"machine learning",
		"evolutionary",
		"genetic",
		"local search",
		"multi-objective",
		"optimization",
		"heuristic search",
		"machine learning"
	];
app.controller("DHCController", ["$scope", "filtrosService", "$location", function ($scope, filtrosService, $location) {



	$("#navbar li").removeClass("active");
	$('a[href="#/dhc"]').parent().addClass("active");
	$scope.all=function(id){
		
		if( $("#"+id).text() =="ALL"){
			window.setTimeout(function(){
				$("input[type='checkbox'][name='"+id+"']").prop('checked', true);
				$("#"+id).text("NONE");
			},300);
		}else if( $("#"+id).text() =="NONE"){
			window.setTimeout(function(){
				$("input[type='checkbox'][name='"+id+"']").prop('checked', false);
				$("#"+id).text("ALL");
			},300);
		}
		
	}
	$scope.conference = [
		"AAAI",
		"GECCO",			
		"IJCAI",
		"VLDB",
	];

	$scope.year = [
		2005,
		2006,
		2007,
	];

	$scope.field = Field;
	$scope.clickConf = function () {
		
		$("#conference").toggle();
	}

	$scope.submit = function () {
		var confs = [];
		var set = [];
		$("input[type='checkbox'][name='conf']:checked").each(function () {
			confs.push($(this).val());
			// set.push($(this).val());
		});
		confs.join("|");
		var year = [];
		$("input[type='checkbox'][name='year']:checked").each(function () {			
			year.push($(this).val());						
		});
		

		set.push(confs.join("|"));
		set.push(year.join("|"));

		

		var textualFilter = $( "#selectFilter option:selected" ).text();		
		if(textualFilter != "Open this select menu"){
			$location.path("/resultcells/"+textualFilter+"#"+set.join("_").trim());
		}else{
			$location.path("/resultcells/"+set.join("_").trim());
		}
		
		
	}
		


	for(i in $scope.field){
		var filter = $scope.field[i];		
		$("#selectFilter").append($('<option>', {value: 1, text: filter}));
		// $("selectFilter").trigger("change");	
	}

	$("select#selectFilter").change(function(){
		if($(this).children(":selected").html() == "Open this select menu"){
			$('#checkYearID input').each(function() {											
				$('.'+this.value).prop('disabled', false);				
        	});
        	$('#checkConferenceID input').each(function() {	
        		$('.'+this.value).prop('disabled', false);	
        		$('.'+this.value).attr('checked', false); 			
            });
		}
		if($(this).children(":selected").html() != "Open this select menu"){			
			$('#checkYearID input').each(function() {	
				var classe = "."+this.value;				
				$('.'+this.value).prop('disabled', true);													
        	});
		}
		if($(this).children(":selected").html() == "OLAP"){	
			$('#checkConferenceID input').each(function() {	
				if(this.value == "VLDB"){
					$('.'+this.value).attr('checked', true);  
					$('.'+this.value).prop('disabled', true);
				}else{
					$('.'+this.value).prop('disabled', true);
					

				}		
            });
            $('#checkYearID input').each(function() {											
				$('.'+this.value).attr('checked', true);				
        	});
		} 
		if($(this).children(":selected").html() == "information retrieval" 
			|| $(this).children(":selected").html() == "machine learning" 
			|| $(this).children(":selected").html() == "artificial intelligence" ){	
				$('#checkConferenceID input').each(function() {	
					if(this.value == "AAAI"){
						$('.'+this.value).attr('checked', true);  
						$('.'+this.value).prop('disabled', true);
					}else{
						$('.'+this.value).prop('disabled', true);
						

					}		
	            });
	            $('#checkYearID input').each(function() {											
					$('.'+this.value).attr('checked', true);				
        	});
		}
		if($(this).children(":selected").html() == "evolutionary" 
			|| $(this).children(":selected").html() == "genetic" 
			|| $(this).children(":selected").html() == "local search"
			|| $(this).children(":selected").html() == "multi-objective"
			|| $(this).children(":selected").html() == "optimization" ){	
				$('#checkConferenceID input').each(function() {	
					if(this.value == "GECCO"){
						$('.'+this.value).attr('checked', true);  
						$('.'+this.value).prop('disabled', true);
					}else{
						$('.'+this.value).prop('disabled', true);
						

					}		
	            });
	            $('#checkYearID input').each(function() {											
					$('.'+this.value).attr('checked', true);				
        	});
		}
		if($(this).children(":selected").html() == "heuristic search" 
			|| $(this).children(":selected").html() == "machine learning" ){	
				$('#checkConferenceID input').each(function() {	
					if(this.value == "IJCAI"){
						$('.'+this.value).attr('checked', true);  
						$('.'+this.value).prop('disabled', true);
					}else{
						$('.'+this.value).prop('disabled', true);
						

					}		
	            });
	            $('#checkYearID input').each(function() {											
					$('.'+this.value).attr('checked', true);				
        	});
		}
	});


}]);

app.controller("ResultcellsController", ["$scope", "filtrosService", "$location", '$routeParams', "$http",
	function ($scope, filtrosService, $location, $routeParams, $http) {
		var k = $routeParams.k;	
		var set = k.split("_");
		
		if(k.split("#").length > 1){
			var filterName = k.split("#")[0];
			var conferenceName = k.split("#")[1].split("_")[0];
			var yearName = k.split("#")[1].split("_")[1].split("|").join(",");
			

			var matrix = [];
			var linha = [[],[],[],[],[]];			
			linha[0].push(conferenceName);
			linha[1].push(yearName);
			linha[2].push(filterName);
			linha[3].push(conferenceName+"_"+filterName);
			linha[4].push(filterName);
			matrix.push(linha);
			
			$scope.matrix2 = matrix;
			$scope.verifyHierarchy = {};

		}else{
					$scope.k_combinations = function (set, k) {
			var i, j, combs, head, tailcombs;

			// There is no way to take e.g. sets of 5 elements from
			// a set of 4.
			if (k > set.length || k <= 0) {
				return [];
			}

			// K-sized set has only one K-sized subset.
			if (k == set.length) {
				return [set];
			}

			// There is N 1-sized subsets in a N-sized set.
			if (k == 1) {
				combs = [];
				for (i = 0; i < set.length; i++) {
					combs.push([set[i]]);
				}
				return combs;
			}

			combs = [];
			for (i = 0; i < set.length - k + 1; i++) {
				// head is a list that includes only our current element.
				head = set.slice(i, i + 1);
				// We take smaller combinations from the subsequent elements
				tailcombs = $scope.k_combinations(set.slice(i + 1), k - 1);
				// For each (k-1)-combination we join it with the current
				// and store it to the set of k-combinations.
				for (j = 0; j < tailcombs.length; j++) {
					combs.push(head.concat(tailcombs[j]));
				}
			}
			return combs;
		}

		$scope.combinations = function (set) {
			var k, i, combs, k_combs;
			combs = [];

			// Calculate all non-empty k-combinations
			for (k = 1; k <= set.length; k++) {
				k_combs = $scope.k_combinations(set, k);
				for (i = 0; i < k_combs.length; i++) {
					combs.push(k_combs[i]);
				}
			}
			return combs;
		}

		
		$scope.confs =[];
		$scope.confs = set.map( i=>i.split("|").join(","));

		var aux = $scope.confs.join(",");
		var combinationVec = [];
		for(i in aux.split(",")){			
			if(aux.split(",")[i] == "none"){
				
			}else{
				if(aux.split(",")[i].length > 0){
				combinationVec.push(aux.split(",")[i]);					
				}	
			}		
		}				

		

		
		$scope.confs  = $scope.combinations(combinationVec).map(i => {			
			return i.join("_");
		});


		var matrix = [];
		for(i in $scope.confs){
			// console.log($scope.confs[i]);
			var linha = [[],[],[],[],[]];
			var elements = $scope.confs[i].split("_");
			console.log(elements);
			for(j in elements){
				if(!isNaN(elements[j])){ 
					//é numero
					linha[1].push(elements[j]); 
				}else{
					//é conf ou field
					if(Field.some(i => i.toLowerCase()==elements[j].toLowerCase())){
						linha[2].push(elements[j]); 
					}else{
						linha[0].push(elements[j]); 
					}
				}
				// matrix.push(linha);
				linha[3] =[$scope.confs[i]];
				if( !matrix.some(i=>i==linha)){
					matrix.push(linha);
				}
			}
			
		}
		
		$scope.matrix2 = matrix;
		$scope.verifyHierarchy = {};
		}
		


		$scope.buscar=function(str){				
			console.log("BUSCAR: "+str);
			$http({
	            method: "get",
	            url:  "./data/"+str+".json",
	            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	        }).then( function(response){
		        	if($scope.matrix2[0][4].length > 0){

		        		$location.path("/hierchiesSentence/"+str);
		        	}else{
						if(response.data.title.topics.length > 0 && response.data.abstract.topics.length > 0){						
							$location.path("/hierchies/"+str);
						}else{							
							alert("Celula com poucos documentos.. impossivel construir hierarquia!");
						}	        		
		        	}														
				}, function(response){
					alert("Insufficient amount of documents for hierarchizing step!!!");				
			});			

// console.log($scope.verifyHierarchy);
			// $location.path("/hierchies/"+str);
		}

	}]);

	
app.controller("HierchiesController", ["$scope", "filtrosService", "$http", '$routeParams',
	function ($scope, filtrosService, $http, $routeParams) {
		var k = $routeParams.k;
		
		$scope.limite = 4;
		$scope.hierchies = {};
		$scope.tableA = [];
		$scope.tableT = [];
		$scope.tableS = [];
		$scope.modal = "";

		$scope.nodeSelectedAbstract = "";
		$scope.nodeSelectedTitle = "";
		$scope.nodeSelectedSentence = "";


		$http({
            method: "get",
            url:  "./data/"+k+".json",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then( function(response){
				console.log(response.data);
				$scope.hierchies = response.data;								
				$scope.updateTopics();

			window.setTimeout(function(){
				$('#jstreeAbstract').jstree();
				$('#jstreeTitle').jstree();
				$('#jstreeSentence').jstree();
			}, 100);
			
			}, function(response){
				console.log(response);
			});

        

        $scope.updateTopics = function(){
			window.setTimeout(function(){$scope.$apply();},100);
        }

		$scope.show=function(str){
			
			if( $("#"+str).hasClass("hide")){
				$("#"+str).removeClass("hide");
			}else{
				$("#"+str).addClass("hide");
			}
		}
		$scope.showTitle=function(str, obj){
			
			
			if( $("#"+str).hasClass("hide")){
				$("#"+str).removeClass("hide");
				$("#icon-"+str).attr("class", "glyphicon glyphicon-minus");
			}else{
				$("#"+str).addClass("hide");
				$("#icon-"+str).attr("class", "glyphicon glyphicon-plus");
			}
		}



		$('#jstreeAbstract').on("changed.jstree", function (e, data) {							
			$scope.tableA = [];
			var selected = data.selected;
		
			$scope.nodeSelectedAbstract = selected;			
			var type = selected[0].split("_")[0];
			var nodeId = selected[0].split("_")[1]-1;	
			// 

			$('#cardTopicsAbstract').text($scope.hierchies.abstract.topics[nodeId]);
			var ranking = $scope.hierchies.abstract.ranking[nodeId];	
			console.log("TAMANHO DO RANKING: "+ranking.length)			
			for(i = 0; i < ranking.length; i++){
				var split = ranking[i].split("|");					
				$scope.tableA.push({ 	id:(i+1), 	col1:split[0], 	col2:split[1], 	col3:split[2] });
			}
			$scope.$apply();
    	});




    	$('#jstreeTitle').on("changed.jstree", function (e, data) {	
			$scope.tableT = [];			
			var selected = data.selected;			
			$scope.nodeSelectedTitle = selected;
			var type = selected[0].split("_")[0];
			var nodeId = selected[0].split("_")[1]-1;	
				
			$('#cardTopicsTitle').text($scope.hierchies.title.topics[nodeId]);
			var ranking = $scope.hierchies.title.ranking[nodeId];				
			for(i = 0; i < ranking.length; i++){
				var split = ranking[i].split("|");	
				$scope.tableT.push({ 	id:(i+1), 	col1:split[0], 	col2:split[1], 	col3:split[2] })
			}
			$scope.$apply();
    	});

    	$('#jstreeSentence').on("changed.jstree", function (e, data) {	
			$scope.tableS = [];			
			var selected = data.selected;			
			$scope.nodeSelectedSentence = selected;
			var type = selected[0].split("_")[0];
			var nodeId = selected[0].split("_")[1]-1;	
				
			$('#cardTopicsSentence').text($scope.hierchies.sentence.topics[nodeId]);
			var ranking = $scope.hierchies.sentence.ranking[nodeId];				
			for(i = 0; i < ranking.length; i++){
				var split = ranking[i].split("|");	
				$scope.tableS.push({ 	id:(i+1), 	col1:split[0], 	col2:split[1], 	col3:split[2] })
			}
			$scope.$apply();
    	});


		$scope.clicks = function(id, obj, segment){ 

			if(segment == "abstract"){
				var node = String($scope.nodeSelectedAbstract).split("_")[1];
				var paperContent = $scope.hierchies.abstract.ranking[node][id].split("|");		

				$(".modal-body").html("<h5>"+paperContent[3]+"</h5><br /><p align='justify'>"+paperContent[4]+"</p><br /><br /><strong>Authors: </strong>"+paperContent[5]);
				$('#myModal').modal({show:true, keyboard:true});
			}else if(segment == "title"){
				var node = String($scope.nodeSelectedTitle).split("_")[1];
				var paperContent = $scope.hierchies.title.ranking[node][id].split("|");		

				$(".modal-body").html("<h5>"+paperContent[3]+"</h5><br /><p align='justify'>"+paperContent[4]+"</p><br /><br /><strong>Authors: </strong>"+paperContent[5]);
				$('#myModal').modal({show:true, keyboard:true});
			}else{
				var node = String($scope.nodeSelectedSentence).split("_")[1];
				var paperContent = $scope.hierchies.sentence.ranking[node][id].split("|");		

				$(".modal-body").html("<h5>"+paperContent[3]+"</h5><br /><p align='justify'>"+paperContent[4]+"</p><br /><br /><strong>Authors: </strong>"+paperContent[5]);
				$('#myModal').modal({show:true, keyboard:true});
			}			
		};

	}]);