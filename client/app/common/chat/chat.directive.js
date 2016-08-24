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

            scope.authors = [];
            scope.role = attrs.role;
            scope.messages = [];

            scope.displayAuthor = displayAuthor;
            scope.isMe = isMe;
            scope.deleteProject = deleteProject;
            scope.sendToRoleMessage = sendToRoleMessage;
            scope.checkPositionMessage = checkPositionMessage;
            scope.showPrivileges = showPrivileges;

            initConversation();

            function getParticipants() {
                chatService.getParticipants(conId).then(function(participants) {
                    scope.authors = participants;
                    loadHistory();
                }, function(err) {
                    console.log(err);
                });
            }

            function initConversation() {
                chatService.getConverstationById(scope.id).then(function(data) {
                    conId = data.id;
                    getParticipants();
                    usersService.getCurrentProfile().then(function(user) {
                        currPosition = user.position;
                        myName = user.name;
                    }, function(err) {
                        console.log(err);
                    });
                    chatSocket.emit('subscribe', data.id);
                    chatSocket.on('send', function(data) {
                        if (data.conversationId === conId) {
                            scope.messages.push({
                                body: data.body,
                                author: {
                                    _id: data.author
                                },
                                createdAt: data.createdAt
                            });
                        }
                    });

                    chatSocket.on('notification ' + scope.id, function(data) {
                        console.log(data);
                        if (data.position === currPosition) {
                            webNotification.showNotification(scope.title, {
                                body: data.message.replace('@' + currPosition + ' ', ''),
                                autoClose: 7000,
                                icon: '../bower_components/HTML5-Desktop-Notifications/alert.ico',
                                onClick: function onNotificationClicked() {
                                    window.alert('Notification clicked.');
                                }
                            }, function onShow(error, hide) {
                                if (error) {
                                    window.alert('Unable to show notification: ' + error.message);
                                }
                            });
                        }
                    });

                }, function(err) {
                    console.error(err);
                });
            }

            scope.sendMessage = function(MessageForm) {
                if (MessageForm.$valid) {
                    if (roleToSend) {
                        chatSocket.emit('notification', {
                            projectId: scope.id,
                            conversationName: scope.title,
                            author: myName,
                            keyword: roleToSend,
                            conversationId: conId,
                            body: scope.message.replace('@' + roleToSend, '')
                        });
                    }
                    chatSocket.emit('send', {
                        conversationId: conId,
                        author: identity.getId(),
                        body: scope.message
                    });
                    scope.messages.push({
                        body: scope.message,
                        author: {
                            _id: identity.getId()
                        },
                        createdAt: Date.now()
                    });
                    scope.message = '';
                    roleToSend = '';
                }
            };

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

            function isMe(id) {
                if (identity.getId() === id) {
                    return true;
                }
                return false;
            }

            function loadHistory() {
                chatService.history(conId).then(function(data) {
                    scope.messages = data.conversation;
                    scope.messages = $filter('orderBy')(scope.messages, 'createdAt');
                }, function(err) {
                    console.log(err);
                });
            }

            function deleteProject(id) {
                bootbox.confirm("Are you sure you want to delete this project?", function(answer) {
                    if (answer) {
                        projectService.deleteProject(id).then(function() {
                            $route.reload();
                        }, function() {

                        });
                    }
                });
            }

            function sendToRoleMessage(role) {
                if (roles.hasOwnProperty(role)) {
                    roleToSend = roles[role];
                    if (!scope.message) {
                        msg = '@' + roleToSend + ' ';
                    } else {
                        scope.message = scope.message.replace('@Front-End ', '');
                        scope.message = scope.message.replace('@Back-End ', '');
                        scope.message = scope.message.replace('@Full-stack ', '');
                        msg = '@' + roleToSend + ' ' + scope.message;
                    }
                    scope.message = msg;
                }
            }

            function checkPositionMessage(message) {
                if (message.indexOf('@' + currPosition) > -1) {
                    return true;
                }
                return false;
            }

            function showPrivileges(privilege) {
                if (privilege === 'edit' && (projectRole === 'owner' || projectRole === 'admin')) {
                    return true;
                } else if (privilege === 'delete' && projectRole === 'owner') {
                    return true;
                }
                return false;
            }

        }
    }

})();
