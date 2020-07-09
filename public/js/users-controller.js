angular.module("FacultiesApp").controller("UserController", function($scope, $http) {

    $scope.userLogin = {
        email: "alvarogv43@gmail.com",
        password: "alvarogv43"
    };

    $scope.userRegistration = {
        email: "",
        password: ""
    };

    $scope.registration = () => {
        $http.post("/signup", $scope.userRegistration)
        .then(function(response) {
            console.log('User signup OK', response);
            $scope.userRegistration = response.config.data;

            login($scope.userRegistration);

        }, function(error) {
            console.log('Error login', error);
            alert("Error login");
        });
    }

    $scope.login = () => {
        login($scope.userLogin);
    }
    
    function login(userObject) {
        $http.post("/login", userObject)
        .then(function(response) {
            console.log('User login OK', response);

            if(response.data.message != undefined && response.data.message.includes('User or password incorrect')) {
                $scope.resultado = "User or password incorrect";
            } else {
                $scope.resultado = "OK";
                let token = response.data.token;
                localStorage.setItem("token_session", token);
                window.location.href = "/profile.html";
            }
        }, function(error) {
            console.log('Error login', error);
            alert("Error login");
        });
    }
});