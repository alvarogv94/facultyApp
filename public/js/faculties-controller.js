angular.module("FacultiesApp").controller("FacultiesController", function($scope, $http) {

    compruebaToken();

    $scope.facultieId = "";

    $scope.newFacultie = {};

    $scope.setToken = function() {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $scope.token;
    };

    $scope.addFaculty = function() {
        if($scope.newFacultie.research_groups != undefined) {
            $scope.newFacultie.research_groups = $scope.newFacultie.research_groups.split(',');
        }

        if($scope.newFacultie.degrees != undefined) {
            $scope.newFacultie.degrees = $scope.newFacultie.degrees.split(','); 
        }

        $http.post("/faculties", $scope.newFacultie)
                .then(function(response) {
                    console.log('faculty added', response);
                    $scope.newFacultie = {};
                    refresh();
                }, function(error) {
                    console.log('Error adding faculty', error);
                    alert("Ups! Something went wrong when creating the faculty");
                });
    }

    $scope.loadFaculties = () => {
        $http.get("/faculties")
        .then(function(response) {
            console.log('Faculties retrieved', response.data);
            $scope.faculties = response.data.data;
            console.log("=> ", $scope.faculties);
        }, function(error) {
            console.log('Error retrieving Faculties', error);
            alert("Ups! Something went wrong when recovering the Faculties");
        });
    }
    $scope.logoff = () => {
        localStorage.removeItem("token_session");
        window.location.href = "/index.html";
    }
    $scope.removeOneFacult = () => {
        $scope.removeOneFacultie($scope.facultieId);
    }
    $scope.removeOneFacultie = function(id) {
        console.log('Removing a movie by id: ', id);
            $http.delete("/faculties/" + id)
                .then(function(response) {
                    console.log('Movie removed', response.data);
                    //alert('Movie has been removed!')
                    refresh();
                }, function(error) {
                    console.log('Error removing the movie', error);
                    alert("Ups! Something went wrong when removing the movie");
                });
    }

    $scope.updateFaculty = function() {
        $http.put("/faculties/" + $scope.newFacultie._id, $scope.newFacultie)
            .then(function(response) {
                console.log('Faculty updated', response);
                $scope.newFacultie = {};
                alert('Faculty has been updated!');
            }, function(error) {
                console.log('Error updating Faculty', error);
                alert("Ups! Something went wrong when updating the Faculty");
            });
    }

    $scope.loadUpdateForm = (faculty) => {
        $scope.newFacultie = faculty;
    }

    $scope.removeAll = () => {
        $http.delete("/faculties")
            .then(function(response) {
                console.log('Faculties removed', response.data);
                alert('All Faculties have been removed!')
            }, function(error) {
                console.log('Error removing the Faculties', error);
                alert("Ups! Something went wrong when removing the Faculties");
            });
    }

    function compruebaToken() {
        let token = localStorage.getItem("token_session");
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        $scope.token = token;
        $http.get("/profile")
        .then(function(response) {
            console.log('Token OK', response.data);
            $scope.tokenInfo = response.data.user;
        }, function(error) {
            console.log('Error', error);
            if(error.status == 401) {
                window.location.href = "/index.html";
            }
        });
    }
    function refresh() {
       $scope.loadFaculties(); 
    }

    let socket = io();
    socket.on('newFaculty', (data) => {
        let emailSession = $scope.tokenInfo.email;
        let emailEmit = data.data;
        if(emailSession != emailEmit) {
            alert(data.msg);
        } 
    });

});