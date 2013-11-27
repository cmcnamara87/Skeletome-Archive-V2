'use strict';


angular.module('security', [])
    .config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {

        var interceptor = ['$location', '$q', function($location, $q) {
            function success(response) {
                return response;
            }

            function error(response) {

                if(response.status === 401) {
                    console.log("Security Provider: 401 Status");
                    if($location.path() != "/login") {
                        $location.url('/login');
                    }
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }

            return function(promise) {
                return promise.then(success, error);
            }
        }];

        $httpProvider.responseInterceptors.push(interceptor);
    }])
    .run(['$rootScope', '$location', 'AuthService', 'SessionService', '$http',
        function ($rootScope, $location, AuthService, SessionService, $http) {

            /**
             * Handle Auth for when the route changes
             */
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                $rootScope.error = null;

                AuthService.isAuthenticated().then(function(path) {
                    console.log("is logged in");

                    // Success
                    if($location.path() == "/register" || $location.path() == "/login") {
                        // Redirect them to the main page
                        $location.path('/feed');
                    }

                }, function(reason){
                    // Not logged in
                    console.log("not logged in");
                    if($location.path() == "/register" || $location.path() == "/login")  {
                        // Going to login or register page, go to feed after logging in
                        SessionService.pathAfterLogin = "/feed";
                    } else {
                        // Save the current path and shove them to login page
                        SessionService.pathAfterLogin = $location.path();
                        $location.path('/login');
                    }

                });
            });

    }])

/**
 * Stores information about the current user session
 */
    .factory('SessionService', function($rootScope) {
        var session = {
            isAuthenticated: false,
            currentUser: {},
            pathAfterLogin: null
        };
        $rootScope.SessionService = session;
        return session;
    })

/**
 * Deals with logging in a user
 */
    .factory('AuthService', function($http, $q, $cookies, $location, SessionService, UserModel, tokenUrl, connectUrl, apiUrl2){

        /**
         * Gets the CSRF token from the drupal server and stores it
         * @param success
         * @param error
         */
        function setupCSRFToken() {
            return $http.post(tokenUrl).then(function(response) {
//                $http.defaults.headers.common['X-CSRF-Token'] = response.data;
                $http.withCredentials = true;
                return true;
            });
        }

        /**
         * Stores the session login data
         * @param data
         */
        function storeLoginData(data) {
            $cookies[data.session_name] = data.sessid;
            SessionService.sessionName = data.session_name;
            var user = new UserModel(data.user);
            angular.copy(user, SessionService.currentUser);
            SessionService.isAuthenticated = true;
        }

        /**
         * Clears the session login data
         */
        function clearLoginData() {
            delete $cookies[SessionService.sessionName];
            angular.copy(SessionService.currentUser, {});
            SessionService.isAuthenticated = false;
            SessionService.sessionName = null;
        }

        var auth = {

            /**
             * Checks if there is a current logged in / authenticated
             * @returns A promise, that returns bool if the user is logged in or not
             */
            isAuthenticated: function() {
                if(SessionService.isAuthenticated) {
                    // Already logged in
                    return $q.when(true);
                }

                // Not logged in front end, check with back end
                return setupCSRFToken().then(function() {
                    return $http.post(connectUrl).then(function(response) {
                        if(response.data.user.uid == 0) {
                            console.log("isAuthenticated: Got back no one logged in", response.data.user.uid);
                            // no one logged in on server (well, actually 'anon' user is, but whatever
                            return $q.reject("No one logged in");
                        } else {
                            console.log("isAuthenticated: Got back already logged in", response.data.user.uid);
                            // Someone is logged in on the server
                            storeLoginData(response.data);
                            return true;
                        }
                    });
                });

            },
            /**
             * Logins in a user with credentials
             * @param credentials   - {mail: Email Address, password: PASSWORD}
             * @returns {*} A promise that the user will be logged in
             */
            login: function(credentials) {
                return $http.post(apiUrl2 + "user/loginmail", credentials).then(function(response) {
                    storeLoginData(response.data);
                    return setupCSRFToken();
                });
            },
            /**
             * Logs out the current user
             * @returns {*} A promise that the user will be logged out
             */
            logout: function() {
                clearLoginData();
                return $http.post(apiUrl2 + "user/logout").then(function(response) {
                    return true;
                });
            },

            /**
             * Registers a user
             */
            register: function(user) {
                return $http.post(apiUrl2 + "user/register", user);
            }
        };

        return auth;


//
//
//        /**
//         * Logs a user out
//         * @returns {*}
//         */
//        function logout() {
//            SessionService.isAuthenticated = false;
//            SessionService.currentUser = {};
//
//            delete $cookies['sessionName'];
//
//            return getCSRFToken().then(function() {
//                return $http.post(apiUrl2 + "user/logout").then(function(response) {
//                    delete $http.defaults.headers.common['X-CSRF-Token'];
//                    $location.path('/login');
//                    return true;
//                }, function(reason) {
//                    console.log("failed to log out", reason);
//                });
//            });
//        }
//
//        return {
//
//            /**
//             * Registers a user
//             * @param user          The UserModel
//             * @param success
//             * @param error
//             */
//            register: function(user) {
//                return $http.post(apiUrl2 + "user/register", user).then();
//            },
//
//            current: function(success, error) {
//                getCurrent(success, error);
//            },
//
//            /**
//             * Is the user logged in currently
//             * @returns {boolean}   True if logged in
//             */
//            isAuthenticated: function() {
//
//                // Promise is either resolved instantly, if we have it in the cookies
//                // Or delayed cause we go to the server
//                if($location.search().type == "401") {
//                    // we've headed to the login page, with a 401
//                    // dump everything
//                    console.log("401: Dumping all stuff stored");
//
//                    delete $http.defaults.headers.common['X-CSRF-Token'];
//
//                    return logout().finally(function() {
//                        $location.search('type', "");
//                        return $q.reject("You do not have permission to access this content");
//                    })
//                }
//
//                if(!SessionService.currentUser) {
//                    // No current user
//                    // Go to server
//                    return getCSRFToken().then(function() {
//                        return $http.post(connectUrl).then(function(response) {
//                            if(response.data.user.uid == 0) {
//                                console.log("isAuthenticated: Got back no one logged in", response.data.user.uid);
//                                // no one logged in on server (well, actually 'anon' user is, but whatever
//                                return $q.reject("No one logged in");
//                            } else {
//                                console.log("isAuthenticated: Got back already logged in", response.data.user.uid);
//                                // Someone is logged in on the server
//                                storeSessionLogin(response.data);
//
//                                return SessionService.pathAfterLogin;
//                            }
//                        });
//                    });
//                } else {
//                    console.log("already logged in");
//                    // Already logged in
//                    return $q.when(SessionService.pathAfterLogin);
//                }
//            },
//
//
//            /**
//             * Login to drupal backend
//             * @param credentials   {mail: Email Address, password: PASSWORD}
//             */
//            login: function(credentials) {
//                return $http.post(apiUrl2 + "user/loginmail", credentials).then(function(response) {
//                    console.log("Got back", response);
//                    storeSessionLogin(response.data);
//
//                    // Work out where to redirect the user to
//                    return getCSRFToken().then(function(token) {
//                        console.log("token is", token);
//                        return SessionService.pathAfterLogin;
//                    });
//                });
//            },
//
//
//            /**
//             * Logs the user out
//             * @param success
//             * @param error
//             */
//            logout: function() {
//                console.log("logging out");
//                return logout();
//            }


//                $http.post(apiUrl2 + "user/logout", {}).success(function (data) {
//
//                    console.log(data);
//                });

//                $http.post(apiUrl2 + "user/login", {username: "admin", password: "admin" }).success(function (data) {
//                    var user = data.user;
//
//                    $rootScope.currentUser = user;
//                    // Store the session in the cookie for future authentication
//                    storeSession(data);
//
//                    // Get the CSRF token (needed to make authenticated requests in the future)
//                    $http.post(tokenUrl).success(function (data) {
//                        storeToken(data);
//
//                        defer.resolve(user);
//                    });
//                });

//


//
//                $http.post('/register', user).success(function(res) {
//                    changeUser(res);
//                    success();
//                }).error(error);
//            }
//            login: function(user, success, error) {
//                $http.post('/login', user).success(function(user){
//                    changeUser(user);
//                    success(user);
//                }).error(error);
//            },
//            logout: function(success, error) {
//                $http.post('/logout').success(function(){
//                    changeUser({
//                        username: '',
//                        role: userRoles.public
//                    });
//                    success();
//                }).error(error);
//            },
//            accessLevels: accessLevels,
//            userRoles: userRoles,
//            user: currentUser
//        };
    });

/*
myApp.services.factory('AuthService', function($http, $q, $cookies, $rootScope, tokenUrl, connectUrl, apiUrl2, $route) {

    var user = null;

    var storeSession = function(sessionResponse) {
        var sessionName = sessionResponse.session_name;
        var sessionId = sessionResponse.sessid;
        $cookies[sessionName] = sessionId;
    }
    var storeToken = function(token) {
        $http.defaults.headers.common['X-CSRF-Token'] = token;
    }

    return {
        login: function(credentials) {
            console.log("logging in");
            var defer = $q.defer();

            // login with credentials (username, password)
            $http.post(apiUrl2 + "user/login", credentials).success(function (data) {
                user = data.user;

                $rootScope.currentUser = user;
                // Store the session in the cookie for future authentication
                storeSession(data);

                // Get the CSRF token (needed to make authenticated requests in the future)
                $http.post(tokenUrl).success(function (data) {
                    storeToken(data);

                    defer.resolve(user);
                });
            });

            return defer.promise;
        },
        logout: function() {
            var defer = $q.defer();
            $http.post(apiUrl2 + "user/logout", {}).success(function (data) {
                user = null;
                $rootScope.currentUser = user;
                defer.resolve(data);
            });
            return defer.promise;
        },

        getUser: function() {
            return user;
        },

        requireAuthenticated: function() {
            var defer = $q.defer();

            if(user) {
                console.log("resolving user", user);
                defer.resolve(user);
            } else {
                // No user currently stored
                // Check if we have an existing session
                $http.post(tokenUrl).success(function (data) {
                    storeToken(data);

                    $http.post(connectUrl, {
                    }).success(function (data) {
                            if(data.user.uid == 0) {
                                // anonymous user, no one logged in
                                user = null;
                                $rootScope.currentUser = user;
                                console.log("AuthService: Not logged in");
                                defer.reject();
                            } else {
                                storeSession(data);
                                user = data.user;
                                $rootScope.currentUser = user;
                                // Reload the page lol
                                console.log("AuthService: Reloading the page", $rootScope.currentUser);
                                $route.reload();
//                            defer.resolve(user);
                            }
                        });
                });
            }

            return defer.promise;
        },

        checkCurrentUser: function() {
            console.log("calling current user");
            var defer = $q.defer();

            if(user) {
                defer.resolve(user);
            }

            // Get the CSRF token
            console.log("getting the token");


            return defer.promise;
        }
    }

});*/