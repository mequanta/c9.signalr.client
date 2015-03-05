define(function (require, exports, module) {
    "use strict";

    main.consumes = [
        "Plugin"
    ];
    main.provides = ["signalr"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var plugin = new Plugin("mequanta.com", main.consumes);
        var emit = plugin.getEmitter();
        var connection;
        var loaded = false;
        
        function start() {
            connection.hub.start().done(function () {
                console.log('SignalR connected [ID=' + connection.hub.id + '; Transport = ' + connection.hub.transport.name + ']');
            });
        }

        function load() {
            if (loaded) return false;
            loaded = true;

            require(["./static/jquery.min.js"], function() {
                require(["./static/jquery.signalR.min.js"], function() {
                    require(["/signalr/hubs"], function(hubs) {
                        //$.connection.hub.logging = true;
                        connection = $.connection;
                        emit("beforeStart");
                        start();
                    });
                });
            });
        }

        plugin.on("load", function () {
            load();
        });

        plugin.on("unload", function () {
            loaded = false;
        });

        plugin.freezePublicAPI({
            _events: ["beforeStart"],
            get connection() { return connection; }
        });

        register(null, {
            "signalr": plugin
        });
    }
});
