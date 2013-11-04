'use strict';


angular.module('security', [])
    .run(['$rootScope', '$location', 'AuthService', 'SessionService', '$http',
        function ($rootScope, $location, AuthService, SessionService, $http) {


            /**
             * Handle Auth for when the route changes
             */
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                $rootScope.error = null;

                console.log("location path", $location.path());

                // only allow registered path if not logged in
                if(AuthService.isLoggedIn()) {
                    if($location.path() == "/register" || $location.path() == "/login") {
                        $location.path('/logout');
                    }
                } else {
                    // not logged in
                    if($location.path() != "/login" && $location.path() != "/register") {
                        // Save the current path
                        if($location.path() != "/login" && $location.path() != "/register") {
                            SessionService.pathAfterLogin = $location.path();
                        }

                        console.log("Security: Not logged in.", AuthService.isLoggedIn());

                        // Redirect to login
                        $location.path('/login');
                    }
                }
            });

    }])

    .factory('SessionService', function(currentUser, $rootScope) {
        var session = {
            currentUser: null,
            pathAfterLogin: null
        };

        $rootScope.$watch(function() {
            return session.currentUser
        }, function(value) {
            $rootScope.currentUser = value;
        });

        return session;
    })

    .factory('AuthService', function($http, $cookies, $cookieStore, $location, SessionService, UserModel, tokenUrl, connectUrl, apiUrl2){

        /**
         * Stores the CSRF token in the headers
         * @param token
         */
        function storeToken(token) {
            $http.defaults.headers.common['X-CSRF-Token'] = token;
        }

        /**
         * Stores the logged in session info in the cookies
         * @param sessionResponse
         */
        function storeSession(sessionResponse) {
            var sessionName = sessionResponse.session_name;
            var sessionId = sessionResponse.sessid;
            $cookies[sessionName] = sessionId;
        }

        /**
         * Gets the CSRF token from the drupal server and stores it
         * @param success
         * @param error
         */
        function getCSRFToken(success, error) {
            $http.post(tokenUrl).success(function (data) {
                storeToken(data);
                success();
            }, error);
        }

        function storeSessionLogin(data, success, error) {
            // Store the session in the cookie for future authentication
            storeSession(data);

            var currentUser = new UserModel(data.user);
            SessionService.currentUser = currentUser;
            $cookieStore.put('currentUser', currentUser);

            getCSRFToken(function() {
                success(currentUser);
            });
        }

        return {

                /**
                 * Is the user logged in currently
                 * @returns {boolean}   True if logged in
                 */

            isLoggedIn: function() {
                if(!SessionService.currentUser) {
                    var currentUser = $cookieStore.get('currentUser');
                    SessionService.currentUser = currentUser;

                    // Get the token if we dont have it
                    // its okay if this takes a while to return, should all work out
                    // before we have to make any authenticated calls
                    if(!$http.defaults.headers.common['X-CSRF-Token']) {
                        getCSRFToken(function() {}, function() {});
                    }

                    return currentUser;
                } else {
                    return SessionService.currentUser;
                }
            },

            /**
             * Registers a user
             * @param user          The UserModel
             * @param success
             * @param error
             */
            register: function(user, success, error) {
                getCSRFToken(function() {
                    user.$register(success, error);
                });
            },

            current: function(success, error) {
                $http.post(connectUrl, {}).success(function (data) {
                    if(data.user.uid == 0) {
                        // anonymous user, no one logged in
                        success(null);
                    } else {
                        storeSessionLogin(data, function() {
                            success()
                        }, function() {});
                        SessionService.currentUser = new UserModel(data.user);
                        success(SessionService.currentUser);
                    }
                }, error);
            },

            /**
             * Login to drupal backend
             * @param credentials   {username: USERNAME, password: PASSWORD}
             * @param success
             * @param error
             */
            login: function(credentials, error) {
                getCSRFToken(function() {
                    // login with credentials (username, password)
                    $http.post(apiUrl2 + "user/loginmail", credentials).success(function(data) {

                        storeSessionLogin(data, function() {}, function() {});

                        if(SessionService.pathAfterLogin) {
                            $location.path(SessionService.pathAfterLogin);
                            SessionService.pathAfterLogin = null;
                        } else {
                            $location.path('/feed');
                        }
                    }).error(function(error2) {
                       console.log("error is", error2);
                        error(error2);
                    });
                })
            },

            /**
             * Logs the user out
             * @param success
             * @param error
             */
            logout: function(success, error) {
                SessionService.currentUser = null;
                $cookieStore.remove('currentUser');

                $http.post(apiUrl2 + "user/logout", {}).success(function (data) {
                    $location.path('/login');
                    success();
                }).error(error);
            }


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
        };
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