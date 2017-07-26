var App = angular.module('myApp',[]);



App.directive("ezviewAudio", function(){
  return function(scope, element, attrs){
      element.bind("timeupdate", function(){
          scope.curr = element[0].currentTime;
          scope.$apply();
      });
  }
});


// LOADING JSON
App.controller('myCtrl', function($scope, $http) {

  $scope.curr = 0;
  $scope.shown = false;
  $scope.button_text = "SHOW JSON";

  $http.get('js/transcript.json')
     .then(function(res){
        $scope.transcript_json = JSON.stringify(res.data, undefined, 4);
        $scope.result = res.data.results;
        $scope.words = [];

        // FETCH ALL WORDS WITH START AND END AND STORE IN $SCOPE.WORDS
        for(var i=0; i < $scope.result.length; i++){
            $scope.timestamps = $scope.result[i].alternatives[0].timestamps;

            for(var j=0; j < $scope.timestamps.length; j++){
                var word = $scope.timestamps[j];
                
                var temp = new Object();
                temp.word = word[0];
                temp.start = word[1];
                temp.end = word[2];
                temp.status = "unread";

                $scope.words.push(temp);
            }
        }
        
        // FETCH SPEAKERS
        $scope.speakers = res.data.speaker_labels;

        // STORE SPEAKER FOR ALL THE WORDS IN $SCOPE.WORDS
        for(var i=0; i < $scope.speakers.length; i++){
          $scope.words[i].speaker = $scope.speakers[i].speaker;
        }

        
        // INITIALIZE FINAL OBJECT ARRAY
        $scope.final_trans = [];
        var words_arr = [];

        
        for(var i=0;i<$scope.words.length-1;i++){
          var obj = new Object();         //SINGLE OBJECT WITH {speaker,[words]}
          words_arr.push($scope.words[i]);
          obj.speaker = $scope.words[i].speaker;
          
          while(i<$scope.words.length-1 && $scope.words[i].speaker == $scope.words[i+1].speaker){
            words_arr.push($scope.words[i+1]);
            i = i + 1;
          }
          // if(i == $scope.words.length-1){
          //   words_arr.push($scope.words[i]);
          // }
          obj.words = words_arr;
          words_arr = [];
          $scope.final_trans.push(obj);
        }

        console.log($scope.final_trans);
      });



       $scope.aud = document.getElementById("myAudio");

       
       $scope.wordClick = function(word){
          $scope.aud.currentTime = word.start;
       }


        $scope.toggleShown = function(){
          $scope.shown = !$scope.shown;
          if(!$scope.shown)
            $scope.button_text = "SHOW JSON";
          else
            $scope.button_text = "HIDE JSON";
        }       

});