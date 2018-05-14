function isFirstInColumn(columnIndex, scope) {
    var first = true;
    switch (columnIndex) {
        case 0:
            first = scope.firstInFirstColumn;
            break;
        case 1:
            first = scope.firstInSecondColumn;
            break;
        case 2:
            first = scope.firstInThirdColumn;
            break;
    }
    return first;
}

function setFirstInColumnToFalse(columnIndex, scope) {
    switch (columnIndex) {
        case 0:
            scope.firstInFirstColumn = false;
            break;
        case 1:
            scope.firstInSecondColumn = false;
            break;
        case 2:
            scope.firstInThirdColumn = false;
            break;
    }
}


/**
 * Start of the conversation angularjs module!!
 *
 * This module contains some directives (nodes), some controller and their related services
 */
angular.module('conApp', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: 'static/content/start_page.html'})
            .when('/intents', { templateUrl: 'static/content/intents.html' })
            .when('/entities', { templateUrl: 'static/content/entities.html' })
            .when('/node-editor', { templateUrl: 'static/content/node_editor.html' })
        .otherwise({ redirectTo: '/' });
    })
    // this is the straight node version. It has a badge, a rectangular div and a add button on the right
    .directive('node', ['$document', function ($document) {
        var first = true;
        return {
            restrict: 'E',
            templateUrl: 'static/content/nodes/node_straight.html',
            link: function (scope, element, attr) {
                var columnIndex = element.parent().index();
                var first = true;

                first = isFirstInColumn(columnIndex, scope);

                // all absolute positioned elements should be relative to the node
                $(element).prop('style', 'position:relative;');

                // when it is not the first node in the row, then set another top value
                if (!first) {
                    // left of node top value
                    $(element.children()[0].children[0]).css('top', '100px');
                    // right of node top value
                    $(element.children()[2]).css('top', '93px');
                }
                setFirstInColumnToFalse(columnIndex, scope);

                // attach data to the element
                $(element).data('name', 'node');
                $(element).data('position', {columnIndex: columnIndex, index: element.index()});
                $(element).data('link', {
                    relatedNodesLeft: [],
                    relatedNodesRight: [],
                    lastNodeRight: function () {
                        var len = this.relatedNodesRight.length - 1;
                        return this.relatedNodesRight[len];
                    }
                });
                // add element to nodes list of the related column
                scope.nodes[columnIndex].push(element[0]);
            }
        };
    }])
    // this is the leaf node version. It has a badge, 2 rectangular divs and also an add button on the right
    .directive('node2', function () {
        return {
            restrict: 'E',
            templateUrl: 'static/content/nodes/node.html',
            link: function (scope, element, attr) {
                var columnIndex = element.parent().index();

                // all absolute positioned elements should be relative to the node
                $(element).prop('style', 'position:relative;');
                $(element.children()[2]).css('top', '93px');

                // attach data to the element
                $(element).data('name', 'node2');
                $(element).data('position', {columnIndex: columnIndex, index: element.index()});
                $(element).data('link', {
                    relatedNodesRight: [],
                    relatedNodesLeft: [],
                    lastNodeRight: function () {
                        var len = this.relatedNodesRight.length - 1;
                        return this.relatedNodesRight[len];
                    }
                });
                // add element to nodes list of the related column
                scope.nodes[columnIndex].push(element[0]);
            }
        };
    })
    .factory('IntentService', function($http) {
        /*var intents = [
            {name: 'meal', sentences: ['Was gibt es heute zu essen?'], entities: []},
            {name: 'timetable', sentences: ['Was habe ich heute?'], entities: []},
            {name: 'joke', sentences: ['Erzähle mir einen Witz!'], entities: []}
        ];*/
        var intents = undefined;
        var lock = false;

        return {
            getIntents: function () {

                if (!intents && !lock) {
                    lock = true; // Sperre den aufruf von getIntents

                    $http.get('api/v1/intents').then(function(response){
                        lock = false; // Gebe die Sperre wieder frei
                        return intents = response.data;
                    }, function (response) {
                        lock = false; // Gebe die Sperre wieder frei
                        console.log('Fehler: intentsService->getIntents');
                    });
                } else {
                    return intents;
                }
            },
            addIntent: function (intent) {

                if (intent.sentences && intent.sentences.indexOf(';') != -1) {
                    // Zerlegen des sentences String in ein array...
                    intent.sentences = intent.sentences.split(';');
                    // Leere Elemente entfernen
                    intent.sentences = intent.sentences.filter(function (element, index) {
                        if(element == '' || !element) {
                            return false;
                        }
                        return true;
                    });
                } else {
                    if (!intent.sentences) {
                        // Neuer Intent ohne sentences
                        intent.sentences = [];
                    } else {
                        //.. oder übernehme den String
                        intent.sentences = [intent.sentences];
                    }
                }

                if (intent.entities && intent.entities.indexOf(',') != -1) {
                    // Zerlegen des entities String in ein array...
                    intent.entities = intent.entities.split(',');
                    // Leere Elemente entfernen
                    intent.entities = intent.entities.filter(function (element, index) {
                        if(element == '' || !element) {
                            return false;
                        }
                        return true;
                    });
                } else {
                    if (!intent.entities) {
                        // Neuer Intent ohne entities
                        intent.entities = []
                    } else {
                        //.. oder übernehme den String
                        intent.entities = [intent.entities];
                    }
                }

                // Wenn es den Intent bereits gibt, wird dieser gefunden
                var foundIntent = intents.find(function(ele){
                    return ele.name == intent.name;
                });

                // Intent existiert schon
                if (foundIntent) {
                    // Entities übernehmen
                    var tmpIntent = {};
                    tmpIntent.entities = Object.assign([], foundIntent.entities);
                    tmpIntent.sentences = Object.assign([], foundIntent.sentences);
                    var tmpEntites = Object.assign([], foundIntent.entities);
                    var tmpSentences = Object.assign([], foundIntent.sentences);

                    // Hinzufügen der entities zu einem temporären Intent
                    $(intent.entities).each(function (index, el) {
                        var foundEntity = tmpEntites.find(function (el2) {
                            return el == el2;
                        });
                        if (el != '' && !foundEntity)
                            tmpIntent.entities.push(el);
                    });

                    // Hinzufügen der sentences zu einem temporären Intent
                    $(intent.sentences).each(function (index, el) {
                        var foundSentence = tmpSentences.find(function (el2) {
                            return el == el2;
                        });
                        if (el != '' && !foundSentence)
                            tmpIntent.sentences.push(el);
                    });

                    this.updateIntent(foundIntent, tmpIntent);

                // Intent existier noch nicht
                } else {
                    // Wenn es den Intent noch nicht gibt, darf der Satz nicht leer sein
                    if (intent.sentences.length == 0) {
                        alert('Füge erst einen passenden Beispielsatz hinzu!');
                        return false;
                    }

                    // Ist eines der beiden ersten Eingabefelder leer? Wenn ja, stoppe!
                    // Wenn das dritte und erste Eingabefeld leer sind, kann die Warnung normal ausgegeben werden
                    if ((intent.sentences.length == 0 && intent.entities.length == 0) || (intent.sentences.length == 0 && intent.entities.length == 0) || !intent.name || (intent.name && intent.name.length == 0) || (intent.name == "" && intent.entities.length == 0)) {
                        alert('Keines der beiden Eingabefelder darf leer sein!');
                        return false;
                    }

                    $http.put('api/v1/intent', intent, {}).then(function (response) {
                        intents.splice(0, 0, intent);
                        return true;
                    }, function (response) {
                        return false;
                    });
                }
            },
            updateIntent: function (oldIntent, newIntent) {
                // Berechne die Unterschiede in den Sätzen und Entitäten
                var oldSentences = Object.assign([], oldIntent.sentences);
                var newSentences = Object.assign([], newIntent.sentences);
                var oldEntities = Object.assign([], oldIntent.entities);
                var newEntities = Object.assign([], newIntent.entities);
                var sentencesToAdd = [], sentencesToRemove = [], entitiesToAdd = [], entitiesToRemove = [];

                if (oldSentences.length > newSentences.length) {
                    // Finde die zu entfernenden Sätze
                    sentencesToRemove = oldSentences.filter(function (el) {
                        el.trim();
                        return !newSentences.contains(el);
                    });
                } else {
                    // Finde die zu hinzuzufügenden Sätze
                    sentencesToAdd = newSentences.filter(function (el) {
                        el.trim();
                        return !oldSentences.contains(el);
                    });
                }

                if (oldEntities.length > newEntities.length) {
                    // Finde die zu entfernenden Entitäten
                    entitiesToRemove = oldEntities.filter(function (el) {
                        el.trim();
                        return !newEntities.contains(el);
                    });
                } else {
                    // Finde die zu hinzuzufügenden Entitäten
                    entitiesToAdd = newEntities.filter(function (el) {
                        el.trim();
                        return !oldEntities.contains(el);
                    });
                }

                $http.patch('api/v1/intent', {
                        sentencesToRemove: sentencesToRemove,
                        sentencesToAdd: sentencesToAdd,
                        entitiesToRemove: entitiesToRemove,
                        entitiesToAdd: entitiesToAdd,
                        name: oldIntent.name
                    }, {})
                    .then(function (response) {
                        var intent = intents.find(function (el) {
                            return el.name == oldIntent.name;
                        });

                        intent.sentences = intent.sentences.filter(function (el, index) {
                            return !sentencesToRemove.contains(el);
                        });
                        intent.entities = intent.entities.filter(function (el, index) {
                            return !entitiesToRemove.contains(el);
                        });

                        $.each(sentencesToAdd, function (index, el) {
                            intent.sentences.push(el);
                        });
                        $.each(entitiesToAdd, function (index, el) {
                            intent.entities.push(el);
                        });

                        return true;
                    }, function (response) {
                        return false;
                    });
            },
            deleteIntent: function (intent) {
                var tmpIntent = {name: intent.name, sentences: intent.sentences, entities: intent.entities};
                $http.delete('api/v1/intent', {data: tmpIntent.name, contentType: 'application/json'}).then(function (response) {
                    // Aktualisiere die Oberfläche erst nach erfolgreichem serverseitigem löschen!
                    intents = intents.filter(function (ele) {
                        return JSON.stringify(ele) != JSON.stringify(intent);
                    });
                    return true;
                }, function (response) {
                    return false;
                });
            }
        };
    })
    .factory('EntityService', function($http, $q, $rootScope) {
        /*var entities = [
            {name: 'monday', words: ['Montag', 'Monday']},
            {name: 'tuesday', words: ['Dienstag', 'Tuesday']},
            {name: 'wednesday', words: ['Mittwoch', 'Wednesday']}
        ];*/
        var entities = undefined;
        var lock = false;

        return {
            getEntities: function () {
                if (!entities && !lock) {
                    lock = true;
                    $http.get('api/v1/entities').then(
                        function successCallback(response) {
                            lock = false;
                            return entities = response.data;
                        },
                        function errorCallback(response) {
                            lock = false;
                            console.log('Fehler: entityService->getEntities');
                        }
                    );
                } else {
                    return entities;
                }
            },
            addEntity: function (entity) {
                var foundWord = undefined;

                // Gibt es die Entity bereits?
                var foundEntity = entities.find(function(ele){
                   return ele.name == entity.name;
                });

                if (entity.words.indexOf(',') != -1) {
                    // Zerlegen des words String in ein array...
                    entity.words = entity.words.split(',');
                    // Leere Elemente entfernen
                    entity.words = entity.words.filter(function (element, index) {
                        if(element == '' || !element) {
                            return false;
                        }
                        return true;
                    });
                } else {
                    //.. oder übernehme den String
                    entity.words = [entity.words];
                }

                // Entity existiert schon
                if (foundEntity) {
                    var tmpEntity = {};
                    tmpEntity.words = Object.assign([], foundEntity);
                    var tmpWords = Object.assign([], foundEntity.words);

                    // Hinzufügen der Wörter zu einer temporären Entity
                    $(entity.words).each(function (index, el) {
                        var foundEntity = tmpWords.find(function (el2) {
                            return el == el2;
                        });
                        if (el != '' && !foundEntity)
                            tmpEntity.words.push(el);
                    });

                    this.updateEntity(foundEntity, tmpEntity);

                // Entity existiert noch nicht
                } else {
                    // Da die Entitiy noch nicht existiert dürfen die Eingabefelder nicht leer sein
                    if (!entity.words || (entity.words && entity.words.length == 0) || !entity.name || (entity.name && entity.name.length == 0)) {
                        alert('Keines der beiden Eingabefelder darf leer sein!');
                        return false;
                    }

                    $http.put('api/v1/entity', entity, {}).then(function (response) {
                        entities.splice(0, 0, entity);
                        return true;
                    }, function (response) {
                        return false;
                    });
                }
            },
            updateEntity: function (oldEntity, newEntity) {
                // Berechne die Unterschiede in den Wörtern
                var oldWords = Object.assign([], oldEntity.words);
                var newWords = Object.assign([], newEntity.words);
                var wordsToAdd = [], wordsToRemove = [];

                if (oldWords.length > newWords.length) {
                    // Finde die zu entfernenden Wörter
                    wordsToRemove = oldWords.filter(function (el) {
                        el.trim();
                        return !newWords.contains(el);
                    });
                } else {
                    // Finde die zu hinzuzufügenden Wörter
                    wordsToAdd = newWords.filter(function (el) {
                        el.trim();
                        return !oldWords.contains(el);
                    });
                }
                $http.patch('api/v1/entity', {wordsToRemove: wordsToRemove, wordsToAdd: wordsToAdd, name: oldEntity.name}, {})
                    .then(function (response) {

                        var entity = entities.find(function (el) {
                            return el.name == oldEntity.name;
                        });

                        entity.words = entity.words.filter(function (el, index) {
                            el.trim();
                            return !wordsToRemove.contains(el);
                        });

                        $.each(wordsToAdd, function (index, el) {
                            entity.words.push(el);
                        });
                        return true;
                    }, function (response) {
                        return false;
                    });
            },
            deleteEntity: function (entity) {
                $http.delete('api/v1/entity', {data: entity.name, headers: {contentType: 'application/json'}}).then(function (response) {
                    // Aktualisiere die Oberfläche erst nach erfolgreichem serverseitigem löschen!
                    entities = entities.filter(function(ele) {
                        return JSON.stringify(ele) != JSON.stringify(entity);
                    });

                    return true;
                }, function (response) {
                    // Fehler
                    alert("Entität konnte nicht gelöscht werden. Schau am Besten mal in der Entwicklerkonsole nach!");
                });
            }
        };
    })
    .factory('StartPageService', function () {
        return {

        };
    })
    .factory('NodeEditorService', ['$compile', function($compile) {
        return {
            addFirstColumnNode: function ($event, scope) {
                // Get the last node
                var target = $($event.currentTarget);
                var tmp = target.parent().get(0).children;
                var lastNode = tmp.item(tmp.length - 2);

                /** Compile the new element
                 *  With this you are able to add own directives dynamically
                 */
                var el = $compile( "<node2></node2>" )( scope );
                // Append after the last
                lastNode.parentElement.append(el[0]);
            },
            addNode: function ($event, scope) {
                var target = $($event.currentTarget);

                // Traverse up to the columns and get the next column
                var lastNode = target.parent().parent().next();
                var el = undefined;

                switch ("node2") {
                    case "node":
                        /** Compile the new element
                         *  With this you are able to add own directives dynamically
                         */
                        el = $compile("<node></node>")(scope);
                        break;

                    case "node2":
                        /** Compile the new element
                         *  With this you are able to add own directives dynamically
                         */
                        el = $compile("<node2></node2>")(scope);
                        break;

                    default:
                        el = $compile("<node></node>")(scope);
                }
                // Append after the last
                lastNode.append(el[0]);
            }
        };
    }])
    .factory('NavbarService', function ($http) {
        return {
            train: function () {
                $http.post('api/v1/train').then(function (response) {
                    alert("Alle Netze fertig trainiert!");
                }, function (response) {
                    alert("Es ist ein Fehler aufgetreten oder die TTL des HTTP-Packets wurde überschritten etc..");
                });
            },
            trainIntents: function () {
                $http.post('api/v1/intents').then(function (response) {
                    alert("Intent Netz fertig trainiert!");
                }, function (response) {
                    alert("Es ist ein Fehler aufgetreten oder die TTL des HTTP-Packets wurde überschritten etc..");
                });
            },
            trainEntities: function () {
                $http.post('api/v1/entities').then(function (response) {
                    alert("Entitäten Netze fertig trainiert!");
                }, function (response) {
                    alert("Es ist ein Fehler aufgetreten oder die TTL des HTTP-Packets wurde überschritten etc..");
                });
            }
        };
    })
    .factory('SidebarRightService', function ($http) {
        return {

        };
    })
    .controller('IntentCtrl', function ($scope, IntentService) {
        $scope.clOneName = 'Intent';
        $scope.clTwoName = 'Beispielsätze';
        $scope.clThreeName = 'Entities';

        // Hier die Intents dynamisch holen anstatt statisch hinzuschreiben und der Variablen IntentService.intents zuweisen
        $scope.intentService = IntentService;

        $scope.forSure = function (intent) {
            var reply = confirm("Willst du den Intent wirklich löschen?");
            if (reply) {
                IntentService.deleteIntent(intent);
            }
        };

        $scope.toggle = function (event, scope, _switch) {
            var intent = scope.intent;
            var target = event.currentTarget;
            var div = event.currentTarget.children[0];
            var input = event.currentTarget.children[1];
            var add = event.currentTarget.children[2];

            if ($(div).css('display') == 'block') {

                var div2, input2, add2 = undefined;
                if (target.nextElementSibling.classList.contains('w3-border')) {
                    div2 = target.previousElementSibling.children[0];
                    input2 = target.previousElementSibling.children[1];
                    add2 = target.previousElementSibling.children[2];
                } else {
                    div2 = target.nextElementSibling.children[0];
                    input2 = target.nextElementSibling.children[1];
                    add2 = target.nextElementSibling.children[2];
                }

                if (_switch) {
                    var tmp = {div: div, input:input, add: add};

                    div = div2;
                    input = input2;
                    add = add2;

                    div2 = tmp.div;
                    input2 = tmp.input;
                    add2 = tmp.add;

                    delete tmp;
                }


                $(input).val(intent.sentences.join('; '));

                $(div).toggle();
                $(input).toggle();
                $(add).toggle();

                $(input2).val(intent.entities.join(', '));

                $(div2).toggle();
                $(input2).toggle();
                $(add2).toggle();
            }
        };
        $scope.updateIntent = function ($event, scope) {
            var target = $event.currentTarget;
            var add = $(target).parent().children()[2];

            var rightDiv = $(target).parent().children()[0];
            var rightInput = $(target).parent().children()[1];
            var entities = $(rightInput).val();
            var oldIntent = scope.intent;

            var tmpEntities = [];

            if (typeof entities == 'string')
                entities = entities.split(',');
            if (entities.length == 1 && entities[0] == '') {
                entities = [];
            } else if(entities.length > 1) {
                // Führendes leeres Element entfernen
                entities = entities.filter(function (element, index) {
                   if (element == '' || !element) {
                       return false;
                   }
                   return true;
                });
                var tmpEntities = [];
                // Führende und abschließende Leerzeichen entfernen
                $.each(entities, function (index, element) {
                    tmpEntities.push(element.trim());
                });
                entities = tmpEntities;
            }

            var uniqueEntities = [];
            $.each(entities, function(i, el){
                if($.inArray(el, uniqueEntities) === -1) uniqueEntities.push(el);
            });
            entities = uniqueEntities;

            var leftDiv = $(target).parent().prev().children()[0];
            var leftInput = $(target).parent().prev().children()[1];
            var sentences = $(leftInput).val();
            sentences = sentences.trim().split(';');
            if (sentences.left == 1 && sentences[0] == '') {
                sentences = [];
            } else if(sentences.length > 1) {
                // Leere Elemente entfernen
                sentences = sentences.filter(function (element, index) {
                    if (element == '' || !element) {
                        return false;
                    }
                    return true;
                });
                var tmpSentences = [];
                // Führende und abschließende Leerzeichen entfernen
                $.each(sentences, function (index, element) {
                    tmpSentences.push(element.trim());
                });

                sentences = tmpSentences;
            }

            // Wenn sich etwas an den Sätzen oder Entitäten geändert hat, aktualisiere den intent
            if (!sentences.equals(oldIntent.sentences) || !entities.equals(oldIntent.entities)) {
                IntentService.updateIntent(oldIntent, {name: oldIntent.name, sentences: sentences, entities: entities});
            }
            $(rightDiv).toggle();
            $(leftDiv).toggle();
            $(rightInput).toggle();
            $(leftInput).toggle();
            $(add).toggle();
        };
    })
    .controller('EntityCtrl', function ($scope, EntityService) {
        $scope.clOneName = 'Entity';
        $scope.clTwoName = 'Beispielwörter';

        // Hier die Entities dynamisch holen anstatt statisch hinzuschreiben und der Variablen EntitieService.entities zuweisen
        $scope.entityService = EntityService;

        $scope.forSure = function (entity) {
            var reply = confirm("Willst du den Intent wirklich löschen?");
            if (reply) {
                EntityService.deleteEntity(entity);
            }
        };

        $scope.toggle = function (event, scope) {
            var entity = scope.entity;
            var div = event.currentTarget.children[0];
            var input = event.currentTarget.children[1];
            var add = event.currentTarget.children[2];

            if ($(div).css('display') == 'block') {
                $(input).val(entity.words);

                $(div).toggle();
                $(input).toggle();
                $(add).toggle();
            }
        };
        $scope.updateEntity = function ($event, scope) {
            var target = $event.currentTarget;
            var div = $(target).parent().children()[0];
            var input = $(target).parent().children()[1];
            var add = $(target).parent().children()[2];
            var words = $(input).val();
            var wordsArr = words.split(',');
            var oldEntity = scope.entity;

            if (wordsArr.length == 1 && wordsArr[0] == '') {
                wordsArr = [];
            } else if(wordsArr.length > 1) {
                // Leere Elemente entfernen
                wordsArr = wordsArr.filter(function (element, index) {
                    if (element == '' || !element) {
                        return false;
                    }
                    return true;
                });
            }

            // Wenn sich etwas an den Wörtern geändert hat, wird die entity aktualisiert
            if (!wordsArr.equals(oldEntity.words)) {
                EntityService.updateEntity(oldEntity, {name: oldEntity.name, words: wordsArr});
            }
            $(div).toggle();
            $(input).toggle();
            $(add).toggle();
        };
    })
    .controller('StartPageCtrl', function ($scope, StartPageService) {
        $scope.startPageService = StartPageService;
    })
    .controller('NodeEditorCtrl', function ($scope, NodeEditorService) {
        $scope.nodeEditorService = NodeEditorService;
        $scope.nodes = {
            0: [], //firstColumn
            1: [], //secondColumn
            2: []  //thirdColumn
        };
        $scope.alert = function (str) {
            alert(str);
        };
        $scope.initNode = function (node) {

        };

        $scope.firstInFirstColumn = true;
        $scope.firstInSecondColumn = true;
        $scope.firstInThirdColumn = true;
        $scope.firstColumnNodes = [];
        $scope.secondColumnNodes = [];
        $scope.thirdColumnNodes = [];
        $scope.firstColumnNodeCount = $scope.firstColumnNodes.length;
        $scope.secondColumnNodeCount = $scope.secondColumnNodes.length;
        $scope.thirdColumnNodeCount = $scope.thirdColumnNodes.length;
    })
    .controller('NavbarCtrl', function ($scope, NavbarService) {
        $scope.navbarService = NavbarService;
        $scope.train = function () {
            NavbarService.train();
        };
        $scope.trainIntents = function () {
            NavbarService.trainIntents();
        };
        $scope.trainEntities = function () {
            NavbarService.trainEntities();
        }
    })
    .controller('SidebarRightCtrl', function ($scope, SidebarRightService) {
        $scope.sidebarRightService = SidebarRightService;
        $scope.map = {};
        $scope.createMessageContainer = function(clazz, sentence, time) {
            var div = document.createElement("div");
            div.classList.add("message");
            div.classList.add(clazz);
            div.classList.add("w3-bar-block");

            var pre = document.createElement("pre");
            pre.classList.add("w3-bar-item");
            $(pre).html(sentence);
            div.appendChild(pre);

            var span = document.createElement("span");
            span.classList.add("w3-bar-item");
            $(span).html(time);
            div.appendChild(span);

            return div;
        };
        $scope.now = function () {
            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            };

            var date = new Date();
            return addZero(date.getHours()) + ":"+ addZero(date.getMinutes());
        };
        // Vergesse den aktuellen Schlüssel
        $scope.handleKeyUp = function ($event) {
            if ($event.key == "Enter" || $event.key == "Control") {
                $scope.map[$event.key] = false;
            }
        };
        // Merke die Schlüssel und klassifiziere den Text
        $scope.handleKeyDown = function ($event) {
            if ($event.key == "Enter" || $event.key == "Control") {
                $scope.map[$event.key] = true;
            }

            // Den Chat-Text verarbeiten wenn er gesendet (Strg + Enter) wurde
            if ($scope.map["Enter"] && $scope.map["Control"]) {

                var sentence = $event.target.value.trim();
                $event.target.value = '';

                // Nachricht dem Chatverlauf hinzufügen (rechts)
                $('#chat_history').append($scope.createMessageContainer('message-right', sentence, $scope.now()))

                $.ajax({
                    method: "POST",
                    url: "api/v1/intent",
                    contentType: "application/json",
                    data: JSON.stringify(
                        {
                            sentence: sentence,
                            context : {
                                conversation_id: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
                                priorIntent: {
                                    intent: "meal"
                                },
                                system:{
                                    dialog_stack:[],
                                    dialog_turn_counter:1,
                                    dialog_request_counter:1,
                                    _node_output_map:[]
                                }
                            },
                            init: "",
                            param: ""
                        }
                    )
                }).then(function(data) {
                    // Nachricht dem Chatverlauf hinzufügen (links)
                    $('#chat_history').append($scope.createMessageContainer('message-left', JSON.stringify(data.classifications, null, 2), $scope.now()));
                    $('#chat_history').animate({ scrollTop: $("#chat_history")[0].scrollHeight }, "slow");
                });
            }
        }
    });