(function() {
    'use strict';

    angular
        .module('projectManager')
        .directive('chat', chat);

    function chat(projectService, $route, chatSocket, $http, identity, chatService, $filter, $timeout, toastr, usersService, webNotification) {

        var directive = {
            restrict: 'E',
            templateUrl: 'app/common/chat/chat.view.html',
            replace: true,
            scope: {
                title: '=',
                description: '=',
                id: '=',
                role: '=',
                admins: '=',
                developers: '='
            },
            link: link
        };
        return directive;

        ////////////////////////////

        function link(scope, element, attrs) {
            // Creating local variables
            var projectRole = scope.role;
            var conId = "";
            var roles = {
                frontEnd: 'Front-End',
                backEnd: 'Back-End',
                fullStack: 'Full-stack',
                projectManager: 'Project Manager'
            };
            var roleToSend;
            var msg;
            var currPosition = '';
            var myName = '';
            // Scope models
            scope.authors = [];
            scope.role = attrs.role;
            scope.messages = [];
            // Functions avaible to the scope
            scope.displayAuthor = displayAuthor;
            scope.isMe = isMe;
            scope.deleteProject = deleteProject;
            scope.sendToRoleMessage = sendToRoleMessage;
            scope.checkRoleToSend = checkRoleToSend;
            scope.checkPositionMessage = checkPositionMessage;
            scope.showPrivileges = showPrivileges;
            // Initiaziling conversation
            initConversation();
            // Getting all participants in the conversation
            function getParticipants() {
                chatService.getParticipants(conId).then(function(participants) {
                    scope.authors = participants;
                    loadHistory();
                }, function(err) {
                    console.log(err);
                });
            }
            // Function to init the conversation
            function initConversation() {
                // Getting the conversation data from API call
                chatService.getConverstationById(scope.id).then(function(data) {
                    // Saving conversation ID
                    conId = data.id;
                    getParticipants();
                    usersService.getCurrentProfile().then(function(user) {
                        // Saving current user position and name
                        currPosition = user.position;
                        myName = user.name;
                    }, function(err) {
                        console.log(err);
                    });
                    // Subscribing to the conversation channel
                    chatSocket.emit('subscribe', data.id);
                    // Start listening for event 'send'
                    chatSocket.on('send', function(data, role) {
                        if (data.conversationId === conId) {
                            scope.messages.push({
                                body: data.body,
                                author: {
                                    _id: data.author
                                },
                                createdAt: data.createdAt,
                                roleToSend: role
                            });
                        }
                        // Scrolling the current chat view
                        chatScroll();
                    });
                    // Start listening for push notifications
                    chatSocket.on('notification ' + scope.id, function(data) {
                        // Checking if the notification is for the user's position
                        if (data.position === currPosition) {
                            // Showing web notification
                            webNotification.showNotification(scope.title, {
                                body: data.message.replace('@' + currPosition + ' ', ''),
                                autoClose: 7000,
                                icon: '../../../bower_components/HTML5-Desktop-Notifications/alert.ico'
                            }, function onShow(error, hide) {
                                if (error) {
                                    window.alert('Unable to show notification: ' + error.message);
                                }
                            });
                        }
                        // Scrolling after message been received
                        chatScroll();
                    });

                }, function(err) {
                    console.error(err);
                });
            }

            scope.sendMessage = function(MessageForm) {
                // Checking for valid message format
                if (MessageForm.$valid) {
                    // Checking if is going to be a push notification
                    if (roleToSend) {
                        // Emitting the notification with data
                        chatSocket.emit('notification', {
                            projectId: scope.id,
                            conversationName: scope.title,
                            author: myName,
                            keyword: roleToSend,
                            conversationId: conId,
                            authorId: identity.getId(),
                            body: scope.message
                        });
                    }
                    // Sending an ordinary message
                    chatSocket.emit('send', {
                        conversationId: conId,
                        author: identity.getId(),
                        body: scope.message,
                        toRole: roleToSend
                    });
                    // Pushing the message to scope model
                    scope.messages.push({
                        body: scope.message,
                        author: {
                            _id: identity.getId()
                        },
                        createdAt: Date.now()
                    });
                    // Scrolling the chat view
                    chatScroll();
                    // Reseting models
                    scope.message = '';
                    roleToSend = '';
                }
            };
            /**
             * Displays author by ID
             * @param {id} String Author ID
             * @return Empty string if no author is found or the authors name
             */
            function displayAuthor(id) {
                if (identity.getId() === id) {
                    return "";
                }
                for (var i = 0; i < scope.authors.length; i++) {
                    if (scope.authors[i]._id === id) {
                        return scope.authors[i].name;
                    }
                }
            }
            /**
             * Shows if the user is the sender
             * @param {id} String Author ID
             * @return Boolean true if the sender is the current user and false if nah
             */
            function isMe(id) {
                if (identity.getId() === id) {
                    return true;
                }
                return false;
            }
            // Function to load chat history
            function loadHistory() {
                // Calling the API route from service and receiving data
                chatService.history(conId).then(function(data) {
                    // Assign data to scope
                    scope.messages = data.conversation;
                    // Filtering data by date
                    scope.messages = $filter('orderBy')(scope.messages, 'createdAt');
                    // Scrolling the view to the bottom
                    chatScroll();
                }, function(err) {
                    console.log(err);
                });
            }
            /**
             * Deleting project
             * @param {id} String Project ID
             * @return Void Deletes the project if user have permission
             */
            function deleteProject(id) {
                // Asking the user if he want to delete it (no misclick)
                bootbox.confirm("Are you sure you want to delete this project?", function(answer) {
                    // Checking the answer from the modal
                    if (answer) {
                        // Deleting project through API call
                        projectService.deleteProject(id).then(function() {
                            $route.reload();
                        }, function() {

                        });
                    }
                });
            }
            /**
             * Sets role to be send to
             * @param {role} String Role to be send to
             * @return Void sets the message to be a notification also not just message
             */
            function sendToRoleMessage(role) {
                // Checking for role and applying it to the local variable
                if (roles.hasOwnProperty(role)) {
                    roleToSend = roles[role];
                }
            }
            /**
             * Checks if the notification is for the current user and changing message color to the view
             * @param {message} String Message received and send
             * @return Boolean true if the notification message is for the user and false if nah
             */
            function checkPositionMessage(role) {
                if (role === currPosition) {
                    return true;
                }
                return false;
            }
            /**
             * Function to help view display options to the user for his privileges to the project
             * @param {privilege} String Privilege
             * @return Boolean if the user have the requested privilege and false if nah
             */
            function showPrivileges(privilege) {
                if (privilege === 'edit' && (projectRole === 'owner' || projectRole === 'admin')) {
                    return true;
                } else if (privilege === 'delete' && projectRole === 'owner') {
                    return true;
                }
                return false;
            }

            function checkRoleToSend(role) {
                if (roleToSend === role) {
                    return true;
                }
                return false;
            }
            // Scrolles the current view to the bottom
            function chatScroll() {
                $timeout(function() {
                    if ($('#scroll' + scope.id)[0].scrollHeight) {
                        $('#scroll' + scope.id).scrollTop($('#scroll' + scope.id)[0].scrollHeight);
                    }
                }, 300);
            }

        }
    }

})();
