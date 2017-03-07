app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
app.filter('html', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsHtml(url);
    };
}]);

app.service("filtrosService", function(){
	return {
		conference:"",
		database:"",
		year:"",
		setYear:function(value){
			this.year = value;
		},
		setDatabase:function(value){
			this.database = value;
		},
		setConference:function(value){
			this.conference = value;
		},

	};
});

app.factory( "Tree",  function(){
	var MyTree = function (){
		this.tree = "";
		this.click=[];
		this.topic=[];
		this.treeid=[];

		this.init=function(){

		};
		this.renderTopics=function( db, conf, _year, id, scope){
			console.log( db );
			var database = db.toLowerCase().split(" ").join("_");
			var conference = conf.toLowerCase().split(" ").join("_");
			var year = _year;
			var _url = "data/"+database+"/"+conference+"/topics/topics.json"
			var self = this;
            $.ajax({
                url: _url,
                success: function(data) {
                    self.parseConferenceTree(data, database, conference, year, id, scope);
                },
                error: function(data) {
                    //var han = JSON.parse(data.responseText);
                   // self.parseConferenceTree(han, id, "HAN");
                }
            });

		};
		this.renderDualTopics=function( db, conf, _year, K, scope){

			var database = db.toLowerCase().split(" ").join("_");
			var conference = conf.toLowerCase().split(" ").join("_");
			var year = _year;
			var _url = "data/"+database+"/"+conference+"/topics/topics.json"
			var han = "data/"+database+"/dblp/topics/dblp.json"
			var self = this;
            $.ajax({
                url: _url,
                success: function(data) {
                    self.parseDualConferenceTree(data, database, conference, year, 'dhcubing', K, scope,scope.dhcubing);
                },
                error: function(data) {
                    //var han = JSON.parse(data.responseText);
                   // self.parseDualConferenceTree(han, id, "HAN");
                }
            });
           // if( window.hanTree !== undefined || window.hanTree != ""){
	            $.ajax({
	                url: han,
	                success: function(data) {
	                	window.hanTree = data;
						console.log(year);
	                    self.parseDualConferenceTree(data, database, conference, "ALL", "han", K, scope, scope.han);						
	                },
	                error: function(data) {
	                    //var han = JSON.parse(data.responseText);
	                   // self.parseDualConferenceTree(han, id, "HAN");
	                }
	            });
           // }

		};
		this.parseConferenceTree=function(json, database, conference, year, selector, scope) {
			var self=this;
	        var elements = []; //array de elementos
	        var edges = []; // array de arestas

	        var narr = [];

	        //selecionando o Objeto ano no JSON
	        var objetoAno = json[year];

	        for (var i in objetoAno) {
	            var obj = {
	                data: {
	                    id: objetoAno[i].id,
	                    topic: objetoAno[i].topics

	                }
	            };
	            elements.push(obj);
	            if (objetoAno[i]["target"].length > 0) {
	                for (var j in objetoAno[i]["target"]) {
	                    var edge = {
	                        data: {
	                            id: "o" + objetoAno[i]["id"] + "t" + objetoAno[i]["target"][j],
	                            source: objetoAno[i]["id"],
	                            target: objetoAno[i]["target"][j]
	                        }
	                    };
	                    edges.push(edge);
	                }
	            }
	        }

	        for (var i in elements) {
	            narr.push(elements[i]);
	        }
	        for (var i in edges) {
	            narr.push(edges[i]);
	        }

	        this.tree = cytoscape({
	            container: $("#" + selector),
	            elements: narr,
	            boxSelectionEnabled: false,
	            autounselectify: true,
	            style: [{
	                    selector: 'node',
	                    style: {
	                        'content': 'data(id)',
	                        'color': '#000',
	                        'text-opacity': 0.5,
	                        'text-valign': 'center',
	                        'text-halign': 'right',
	                        'background-color': '#11479e'
	                    }
	                },

	                {
	                    selector: 'edge',
	                    style: {
	                        'width': 4,
	                        'target-arrow-shape': 'triangle',
	                        'line-color': '#9dbaea',
	                        'target-arrow-color': '#9dbaea'
	                    }
	                }
	            ],

	            layout: {
	                name: 'dagre',
	            },
	            ready: function() {
	                window.tree = this;
	            },

	        });
	        this.tree.minZoom(0.35);
	        this.tree.nodes().on("tap", function(evt) { 
	            	var nodeID = this.data('id');
	            	console.log("Node ID do lado de fora: "+nodeID);
	            	var tree_id = $(evt.cy.container()).attr("id");
	            	self.tree.nodes().forEach(function(ele) {
				            ele.style('background-color', '#11479e');
				        });
	            	self.tree.$("#" + this.data('id')).style('background-color', "#DFF80B");
	            	$("#nodestopics").html( objetoAno[nodeID].topics );  
	            	self.documentRankTitle(database,conference,year,nodeID,scope);    
	            	self.documentRankAbstract(database,conference,year,nodeID,scope);     		
 

    		 });      

	    };
	    this.parseDualConferenceTree=function(json, database, conference, year, selector, K, scope, tree) {
			var self=this;
	        var elements = []; //array de elementos
	        var edges = []; // array de arestas

	        var narr = [];
	        console.log( "K: "+K);
	        //selecionando o Objeto ano no JSON
	        var objetoAno = json[year];

	        for (var i in objetoAno) {
	            var obj = {
	                data: {
	                    id: objetoAno[i].id,
	                    topic: objetoAno[i].topics

	                }
	            };
	            elements.push(obj);
	            if (objetoAno[i]["target"].length > 0) {
	                for (var j in objetoAno[i]["target"]) {
	                    var edge = {
	                        data: {
	                            id: "o" + objetoAno[i]["id"] + "t" + objetoAno[i]["target"][j],
	                            source: objetoAno[i]["id"],
	                            target: objetoAno[i]["target"][j]
	                        }
	                    };
	                    edges.push(edge);
	                }
	            }
	        }

	        for (var i in elements) {
	            narr.push(elements[i]);
	        }
	        for (var i in edges) {
	            narr.push(edges[i]);
	        }

	        tree = cytoscape({
	            container: $("#" + selector),
	            elements: narr,
	            boxSelectionEnabled: false,
	            autounselectify: true,
	            style: [{
	                    selector: 'node',
	                    style: {
	                        'content': 'data(id)',
	                        'color': '#000',
	                        'text-opacity': 0.5,
	                        'text-valign': 'center',
	                        'text-halign': 'right',
	                        'background-color': '#11479e'
	                    }
	                },

	                {
	                    selector: 'edge',
	                    style: {
	                        'width': 4,
	                        'target-arrow-shape': 'triangle',
	                        'line-color': '#9dbaea',
	                        'target-arrow-color': '#9dbaea'
	                    }
	                }
	            ],

	            layout: {
	                name: 'dagre',
	            },
	            ready: function() {
	                window.tree = this;
	            },

	        });
	        tree.minZoom(0.35);
	        scope.$apply();
	        tree.nodes().on("tap", function(evt) { 
	            	var nodeID = this.data('id');
	            	var tree_id = $(evt.cy.container()).attr("id");
	            	
	            	var status = false;

	            	if( self.click.length == 2){ 
	            	//eu estou zerando o vetor que armazena o click 
	            	//e limpando o grafo. Isso é para o caso onde vc ja fez uma consulta, mas quer fazer outra
	            		self.click=[];
            		}

	            	for( var i in self.click ){
	            		if( self.click[i] == tree_id ){
	            			status=true;
	            		}
	            	}

	            	if( !status ){
	            		tree.nodes().forEach(function(ele) {
				            ele.style('background-color', '#11479e');
				        });
	            		tree.$("#" + this.data('id')).style('background-color', "#DFF80B");
	            		self.click.push( tree_id );
	            		console.log( scope );
	            		if( selector == "han"){	            			
	            			scope.node_ids[0] = nodeID;
	            			scope.hantopics.text = objetoAno[nodeID].topics;
	            			scope.hantopics.id = nodeID;
	            			self.getEntropy(database, "dblp", year,nodeID,"",scope);
	            			
	            			
	            		}else{	            			
	            			scope.node_ids[1] = nodeID;
	            			scope.dhcubingtopics.text = objetoAno[nodeID].topics;
	            			scope.dhcubingtopics.id = nodeID;
	            			self.getEntropy(database, conference, year,nodeID,K,scope);

	            		}	            	
	            		if( self.click.length == 2){
	            			self.showQuantityAndDifference(scope); // mostra a quantidade de tags e as tags diferentes
	            			self.getCosine(database, conference, year,nodeID,K,scope);
            			}	
	            	}
	            	
    		});      

	    };
	    this.getEntropy=function(database,conference,year,nodeID,K,scope){
	    	$.ajax({
	    		url: 'data/'+database+"/"+conference+"/entropy/"+K+"/"+conference+".json",
	    	})
	    	.done(function(data) {
	    		var response = data;
	    		if( conference == "dblp"){
	    			scope.hanEntropy = response[year][nodeID].entropy;
	    		}else{
    		 		scope.DHEntropy = response[year][nodeID].entropy;
	    		}

	    	})
	    	.fail(function() {
	    		console.log("error");
	    	})
	    	.always(function() {
	    		scope.$apply();
	    	});
	    	
	    };
	    this.getCosine=function(database, conference,year,nodeID, K, scope){
	    	var self=this;
	    	$.ajax({
	    		url: 'data/'+database+"/"+conference+"/cosine/"+K+"/"+conference+".json",
	    	})
	    	.done(function(data) {
	    		var response = data;
	    		console.log( self.click );
	    		scope.cosine = response[year][scope.node_ids[1] ].cos[scope.node_ids[0] ];

	    	})
	    	.fail(function() {
	    		console.log("error");
	    	})
	    	.always(function() {
	    		scope.$apply();
	    	});
	    };
	    this.showQuantityAndDifference = function(scope){
	    	var hantopics = scope.hantopics.text;
			var dhcubingtopics = scope.dhcubingtopics.text;

			var arrTopic1 = hantopics.split(",");
	        var arrTopic2 = dhcubingtopics.split(",");

	        var termsHan = [];
	        var termsDHCubing = [];
	        var contHan = 0;
	        var contDHC = 0;

	        for (i in arrTopic1) {
	            arrTopic1[i] = arrTopic1[i].trim();
	            var auxHan = arrTopic1[i].split(" ");
	            for(j in auxHan){
	                termsHan[contHan] = auxHan[j];
	                contHan = contHan+1;
	            }            
	        }
	        

	        for (i in arrTopic2) {
	            arrTopic2[i] = arrTopic2[i].trim();
	            var auxDHC = arrTopic2[i].split(" ");
	            for(j in auxDHC){
	                termsDHCubing[contDHC] = auxDHC[j]
	                contDHC = contDHC+1;
	            }
	        }


	        var topicosDHCDifrentes = [];
	        var mySet = new Set();
	        var contadorTopicosDiferentesDHC = 0;
	        var topicDiffer1 = hantopics.split(/(?:,| )+/);
	        var topicDiffer2 = dhcubingtopics.split(/(?:,| )+/);


	        for(i in termsDHCubing){
	            if(termsHan.indexOf(termsDHCubing[i]) == -1){
	                topicosDHCDifrentes[contadorTopicosDiferentesDHC] = termsDHCubing[i];
	                mySet.add(termsDHCubing[i]);
	                contadorTopicosDiferentesDHC = contadorTopicosDiferentesDHC+1;                
	            }
	        }
	        var qtdTopicarrTopic1 = arrTopic1.length;
	        var qtdTopicarrTopic2 = arrTopic2.length;

	        var qtdTopicosDiferentes = 0;
	        for (i in arrTopic2) {
	            if (arrTopic1.indexOf(arrTopic2[i]) == -1) {
	                arrTopic2[i] = '<span class="differ">' + arrTopic2[i] + '</span>';
	                qtdTopicosDiferentes = qtdTopicosDiferentes + 1;
	            } else {
	                arrTopic1[arrTopic1.indexOf(arrTopic2[i])] = '<span class="equals">' + '<strong>' + arrTopic1[arrTopic1.indexOf(arrTopic2[i])] + '</strong>' + '</span>';
	            }
	        }
	        var vetorTermosDiferentes = [];
	        var contador = 0;
	        for (let item of mySet) {
	            vetorTermosDiferentes[contador] = item; 
	            contador++;               
	        }
	        scope.hanDetails = "Quantidade de topicos: " + qtdTopicarrTopic1
	        scope.DHDetails = "Quantidade de topicos: " + qtdTopicarrTopic2 + "<br/>Quantidade de topicos diferentes: " + qtdTopicosDiferentes+"<br/><br />Termos Diferentes: "+vetorTermosDiferentes.join(", ")
        	scope.$apply();
	    };
	    this.documentRankTitle=function(database,conference,year,nodeID, scope){
	    	$.ajax({				
				url: 'data/'+"title"+"/"+conference+"/rank/"+"classifica.json",
				type: 'get',
				data: {},
				success: function (data) {
					var obj = data;
					var myobj = obj[year][nodeID];
					console.log(myobj);				
					scope.documentRankTitle.data = [];
					if(myobj.length >=10){
						console.log(myobj[0]);
						for(i = 0; i < 10; i++) {										
	    					scope.documentRankTitle.data.push( {
	    						rank:i+1,
	    						docID: myobj[i]["docID"],   
	    						// authors: myobj[i]["title"],
	    						// abstract: myobj[i]["abstract"] 						
	    					});
	    				}
					}else{
						console.log("ELSE")
						for(i = 0; i < myobj.length; i++) {										
	    					scope.documentRankTitle.data.push( {
	    						rank:i+1,
	    						docID: myobj[i]["docID"],  
	    						authors: myobj[i]["title"],
	    						abstract: myobj[i]["abstract"] 	    					  						
	    					});
	    				}
					}

    				
    				scope.$apply();
				}
			});
	    };

	    this.documentRankAbstract=function(database,conference,year,nodeID, scope){
	    	$.ajax({				
				url: 'data/'+"abstract"+"/"+conference+"/rank/"+"classifica.json",
				type: 'get',
				data: {},
				success: function (data) {
					var obj = data;
					var myobj = obj[year][nodeID];
					console.log(myobj);				
					scope.documentRankAbstract.data = [];
					if(myobj.length >=10){
						console.log("IF")
						for(i = 0; i < 10; i++) {										
	    					scope.documentRankAbstract.data.push( {
	    						rank:i+1,
	    						docID: myobj[i]["docID"]    						
	    					});
	    				}
					}else{
						console.log("ELSE")
						for(i = 0; i < myobj.length; i++) {										
	    					scope.documentRankAbstract.data.push( {
	    						rank:i+1,
	    						docID: myobj[i]["docID"]    						
	    					});
	    				}
					}

    				
    				scope.$apply();
				}
			});
	    };

	};
	
	return MyTree;
});

