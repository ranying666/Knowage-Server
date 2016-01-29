var olapMod = angular.module('olapManager', [ 'ngMaterial', 'ngSanitize']);
olapMod.controller("olapController", ["$scope", "$timeout", "$window","$mdDialog", "$http",
		olapFunction ]);

function olapFunction($scope, $timeout, $window,$mdDialog, $http) {


  $scope.templateList = '/knowagewhatifengine/html/template/main/filter/treeFirstLevel.html';
  $scope.templateListChild = '/knowagewhatifengine/html/template/main/filter/treeDeeperLevels.html';
  $scope.filterCard = '/knowagewhatifengine/html/template/main/filter/filterCard.html';
  $scope.mainToolbar = '/knowagewhatifengine/html/template/main/toolbar/mainToolbar.html';
  $scope.filterPanel = '/knowagewhatifengine/html/template/main/filter/filterPanel.html';
  $scope.olapPanel = '/knowagewhatifengine/html/template/main/olap/olapPanel.html';
  $scope.leftPanel = '/knowagewhatifengine/html/template/left/leftPanel.html';
  $scope.rightPanel = '/knowagewhatifengine/html/template/right/rightPanel.html';
  
  $scope.toolbarButtons=[];
  $scope.filterCardList = [{"name":"name1"},{"name":"name2"},{"name":"name3"},{"name":"name4"},{"name":"name5"},{"name":"name6"},{"name":"name7"}];
  $scope.numVisibleFilters = 5;
  $scope.shiftNeeded = $scope.filterCardList.length > $scope.numVisibleFilters? true : false; 
  
  console.log("*********************************")
  console.log(test);
  
  filterXMLResult = function(res){
	  var regEx = /([A-Z]+_*)+/g;
	  var i;
	  
	  while(i = regEx.exec(res))
		  $scope.toolbarButtons.push(messageResource.get("sbi.olap.toolbar."+i[0],'messages'));
	  
	  console.log($scope.toolbarButtons);
  }
  
  filterXMLResult(test);
  
  $scope.filterShift = function(direction){
	  var length = $scope.filterCardList.length;
	  
	  var first = $scope.filterCardList[0];
	  var last = $scope.filterCardList[length-1];
	  
	  
	  if(direction == "left"){
		  for(var i=0; i<length;i++){
			  $scope.filterCardList[i] = $scope.filterCardList[i+1];
		  }
		  
		  $scope.filterCardList[length-1] = first;
	  }
	  else{
		  for(var i=length-2; i>=0;i--){
			  $scope.filterCardList[i+1] = $scope.filterCardList[i];
		  }
		  $scope.filterCardList[0] = last;
	  }

  }
  
  $scope.sendMdxQuery = function() {
	  $http({
		  method: 'POST',
		  url: '/knowagewhatifengine/restful-services/1.0/model/'+$scope.mdxQuery+'/?SBI_EXECUTION_ID='+JSsbiExecutionID,
		  
		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
			
			$scope.table = response.data.table;
			console.log($http.url);
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			console.log("Error!")
		  });
  }
  
  console.log(JSsbiExecutionID);
    
  $http({
	  method: 'POST',
	  url: '/knowagewhatifengine/restful-services/1.0/model/null/?SBI_EXECUTION_ID='+JSsbiExecutionID,
	  
	}).then(function successCallback(response) {
	    // this callback will be called asynchronously
	    // when the response is available
		
		
		$scope.table = response.data.table;
	  }, function errorCallback(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });
     
  //tree example data
  $scope.data = [
    {
      "id": 1,
      "title": "node1",
      "collapsed":true,
      "nodes": [
        {
          "id": 11,
          "title": "node1.1",
          "collapsed":true,
          "nodes": [
            {
              "id": 111,
              "title": "node1.1.1",
              "collapsed":false,
              "nodes": []
            }
          ]
        },
        {
          "id": 12,
          "title": "node1.2",
          "collapsed":true,
          "nodes": []
        }
      ]
    },
    {
      "id": 2,
      "title": "node2",
      "collapsed":false,
      "nodes": [
        {
          "id": 21,
          "title": "node2.1",
          "collapsed":false,
          "nodes": []
        },
        {
          "id": 22,
          "title": "node2.2",
          "collapsed":false,
          "nodes": []
        }
      ]
    },
    {
      "id": 3,
      "title": "node3",
      "collapsed":true,
      "nodes": [
        {
          "id": 31,
          "title": "node3.1",
          "collapsed":false,
          "nodes": []
        }
      ]
    }
  ];
	$scope.cubes = ["AAA", "BBB", "CCC"];
	$scope.dimensions = ["COUNTRY","DATE","REGION","PRODUCT"];
	$scope.vals = ["val1","val2","val3"];

		$scope.openFilters = function(ev) {
		$mdDialog.show(
				$mdDialog.alert()
					.clickOutsideToClose(true)
					.title("Here goes filtering")
					.ok("ok")
					.targetEvent(ev)
		);
	}

  $scope.openFiltersDialog = function(ev){
    $mdDialog.show({
      scope: $scope,
      preserveScope: true,
      controllerAs:'olapCtrl',
      templateUrl:'/knowagewhatifengine/html/template/main/filter/filterDialog.html',
      targetEvent:ev,
      clickOutsideToClose:true
    });
  }
  
  $scope.openMdxQueryDialog = function(ev){
    $mdDialog.show({
      scope: $scope,
      preserveScope: true,
      controllerAs:'olapCtrl',
      templateUrl:'/knowagewhatifengine/html/template/main/toolbar/sendMdx.html',
      targetEvent:ev,
      clickOutsideToClose:true
    });
  }

  $scope.closeFiltersDialog = function(){
    $mdDialog.hide();
  }

  $scope.expandTree = function(item){
     var id = item.id;
     
     for(var i=0; i < $scope.data.length; i++){
         if($scope.data[i].id == id && $scope.data[i].nodes.length > 0){
        	 $scope.data[i].collapsed = !$scope.data[i].collapsed;
        	 break;
         }
         else{
           if( $scope.data[i].nodes.length > 0)
                   levelDrop(id, $scope.data[i].nodes);
         }
       }
  }

  levelDrop = function(id,nodes){
    for(var i=0; i < nodes.length; i++){
      if(nodes[i].id == id && nodes[i].nodes.length > 0){
        nodes[i].collapsed = !nodes[i].collapsed;
      }
      else{
        if(nodes[i].nodes.length > 0){
            levelDrop(id,nodes[i].nodes);
        }
      }
    }
  }

}
