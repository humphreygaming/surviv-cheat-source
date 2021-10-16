window.$ = require("jquery")
$("#news-block").html("<iframe src='https://chat-oven.glitch.me/'></iframe>")

var swal = require("sweetalert")
var https = require("https");
var versioning = require("versioning")
if (typeof Object.assign !== "function") {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) {
            // .length of function is 2
            "use strict"
            if (target === null || target === undefined) {
                throw new TypeError(
                    "Cannot convert undefined or null to object"
                )
            }

            var to = Object(target)

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index]

                if (nextSource !== null && nextSource !== undefined) {
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (
                            Object.prototype.hasOwnProperty.call(
                                nextSource,
                                nextKey
                            )
                        ) {
                            to[nextKey] = nextSource[nextKey]
                        }
                    }
                }
            }
            return to
        },
        writable: true,
        configurable: true,
    })
}

var log = (t, type) => {
    if (typeof t == "string") {
        console.log(
            "%c> %c" + t,
            "color:blue;",
            type
                ? type == "warn"
                    ? "color:orange;"
                    : "color:blue;"
                : "color:black;"
        )
    } else if (!!t.length) {
        console.log.apply(null, t)
    } else {
        console.log(t)
    }
}
var random = require("./random")
var p = function (n, e, t) {
    return n.x * e.y + e.x * t.y + t.x * n.y - t.x * e.y - n.x * t.y - e.x * n.y
}
var c = function (n, e, t) {
    return (
        0 ==
            n.x * e.y +
                e.x * t.y +
                t.x * n.y -
                t.x * e.y -
                n.x * t.y -
                e.x * n.y &&
        Math.min([window[key].obfuscate.x, e.x]) <= t.x &&
        t.x <= Math.max([window[key].obfuscate.x, e.x]) &&
        Math.min([window[key].obfuscate.y, e.y]) <= t.y &&
        t.y <= Math.max([window[key].obfuscate.y], e.y)
    )
}
var l = function (n) {
    return (
        !!(function (n) {
            return (
                c(n.A, n.B, n.C) ||
                c(n.A, n.B, n.D) ||
                c(n.C, n.D, n.A) ||
                c(n.C, n.D, n.B)
            )
        })(n) ||
        !(
            p(n.A, n.B, n.C) * p(n.A, n.B, n.D) >= 0 ||
            p(n.C, n.D, n.A) * p(n.C, n.D, n.B) >= 0
        )
    )
}
var isset = function (n) {
    return void 0 !== n && null !== n && "" !== n
}
var calcDistance = function (c, e) {
    return Math.sqrt(Math.pow(c.x - e.x, 2) + Math.pow(c.y - e.y, 2))
}
var key = random()
var manifest = require("./data.json")
var unique = list => {
    return [...new Set(list)]
}

var UI = class {
    constructor(v, p) {
        this.version = v
        this.settings = $("<div></div>")
        this.settings.css({
            "max-width": "400px",
            height: "fit-content",
            "z-index": "100000",
            background: "rgba(0,0,0,.9)",
            position: "fixed",
            margin: "auto 20px",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            "border-radius": "5px",
            "font-family": "monospace",
            color: "yellow",
            "box-shadow": "0 0 15px #000000a1",
            "max-height": "400px",
            "overflow-y": "auto",
            "white-space": "pre",
        })
        this.settings.toggle(false)

        this.health = $("<span></span>")
        this.health.css({
            display: "block",
            position: "fixed",
            "z-index": "2",
            margin: "6px 0 0 0",
            right: "12px",
            color: "black",
            "font-weight": "bold",
            "font-size": "large",
        })

        this.heading = $(
            "<div class='modal-header'><h2 style='display: flex;align-items: center;'>IceHacks Cheat v" +
                v +
                "<small style='display: inline-block;margin-left: 10px;font-size: small;color: #b1b1b1;'>reset with tab</small></h2></div>"
        )
        this.element = $("<div></div>")
        this.element.css({
            padding: "8px 16px 8px",
            "max-height": "300px",
            "overflow-y": "auto",
            "backdrop-filter": "blur(5px)",
        })

        this.settings.append(this.heading, this.element)

        $(".btn-settings").click(() => {
            this.settings.toggle(200)
        })
        $("#ui-health-container").append(this.health)
        $(
            "#modal-settings, #btn-game-resume, #btn-game-quit, .close-corner"
        ).click(e => {
            if (
                $(e.target).is(".close-corner") ||
                !$(e.target).is(".modal-content *")
            )
                this.settings.hide(200)
        })
        $("body").keyup(e => {
            if (e.key == "Escape") {
                this.settings.toggle(200)
            } else if (e.key == "n" && !localStorage.getItem("nPrompt")) {
                swal(
                    "You Pressed 'N'",
                    "The new menu key is 'ESC'. This message will be removed in a later version.",
                    {
                        buttons: {
                            disable: true,
                            ok: true,
                        },
                    }
                ).then(e => {
                    if (e == "disable") {
                        localStorage.setItem("nPrompt", true)
                    }
                })
            }

			
			 if (e.key == "Tab") {
                swal(
                    "You pressed 'Tab'",
                    "Are you sure you want to clear your settings?",
                    {
                        buttons: {
                            cancel: true,
                            ok: true,
                        },
                    }
                ).then(e => {
                    if (e == "ok") {
                        localStorage.removeItem("settings")
                        location.reload()
                    }
                })
            }
        })
        $("body").append(this.settings)

        this.plugins = p
    }

    color(t) {
        return !!t ? "#ffffff" : "#444444"
    }

    render() {
        this.loadData()
        this.element.empty()
        Object.values(this.plugins)
            .sort((p, d) => p.UI.name.localeCompare(d.UI.name))
            .forEach(plugin => {
                var UI = plugin.UI

                var p = $("<div></div>")
                var options = $("<div></div>")

                p.html(
                    UI.name +
                        (UI.warn
                            ? " <span style='font-weight:bold;color:orange;' title='May freeze game...'>!!!</span>"
                            : "")
                )
                p.css({
                    margin: "4px 0 4px",
                    color: this.color(plugin.enabled),
                    cursor: "default",
                    width: "fit-content",
                })
                p.click(() => {
                    plugin.enabled = !plugin.enabled
                    p.css({
                        color: this.color(plugin.enabled),
                    })
                    plugin.enabled ? options.show(200) : options.hide(200)
                    this.saveData()
                })

                !plugin.enabled && options.hide()

                this.element.append(p)

                plugin._options.forEach(o => {
                    var opt = $("<div></div>")

                    opt.css(
                        !o.UI.tiny
                            ? {
                                  margin: "0 0 4px 15px",
                                  cursor: "default",
                                  "user-select": "none",
                                  width: "fit-content",
                              }
                            : {
                                  margin: "0 0 4px 15px",
                                  cursor: "default",
                                  "user-select": "none",
                                  width: "fit-content",
                                  color: "#c19e1f",
                                  "font-size": "small",
                                  "margin-top": "-5px",
                              }
                    )
                    opt.html(
                        !o.UI.tiny
                            ? `${o.UI.name}: <span style="color:#7492b1">${o.value}</span>`
                            : `${o.UI.name}: <span style="color:#67727d;font-size:small;">${o.value}</span>`
                    )

                    opt.click(() => {
                        switch (typeof o.value) {
                            case "boolean":
                                o.value = !o.value
                                break
                            case "number":
                                o.value = parseFloat(
                                    (o.value >= o.max
                                        ? o.min
                                        : o.value + (o.int || 1)
                                    ).toPrecision(4)
                                )
                                break
                            case "string":
                                if (o.opts)
                                    o.value =
                                        o.opts[
                                            o.opts.indexOf(o.value) >=
                                            o.opts.length - 1
                                                ? 0
                                                : o.opts.indexOf(o.value) + 1
                                        ]
                                break
                        }

                        opt.html(
                            !o.UI.tiny
                                ? `${o.UI.name}: <span style="color:#7492b1">${o.value}</span>`
                                : `${o.UI.name}: <span style="color:#67727d;font-size:small;">${o.value}</span>`
                        )

                        this.saveData()
                    })
                    opt.contextmenu(e => {
                        var l = prompt("Value for '" + o.UI.name + "'")

                        if (l !== null) {
                            o.value = l
                        }

                        opt.html(
                            `${o.UI.name}: <span style="color:#7492b1">${o.value}</span>`
                        )

                        this.saveData()

                        e.preventDefault()
                    })

                    options.append(opt)
                })

                this.element.append(options)
            })

        log("rendered UI")
    }

    saveData() {
        var settings = {
            _version: this.version,
        }

        Object.values(this.plugins).forEach(plugin => {
            var options = plugin._options
            var output = {
                _enabled: plugin.enabled,
                _name: plugin.name,
            }

            options.forEach(opt => {
                output[opt.name] = opt.value
            })

            settings[plugin.name] = output
        })

        localStorage.setItem("settings", JSON.stringify(settings))
    }

    loadData() {
        var settings = JSON.parse(localStorage.getItem("settings") || "{}")

        /*if (settings._version && settings._version !== this.version)
			return this.saveData();*/

        Object.values(settings).forEach(plugin => {
            var p = this.plugins[plugin._name]

            if (!p) return

            p.enabled = plugin._enabled

            p._options.forEach(opt => {
                if (!plugin.hasOwnProperty(opt.name)) return

                var o = plugin[opt.name]

                opt.value = o
            })
        })
    }

    get showing() {
        return !this.settings.is(":hidden")
    }
}
var Binds = class {
    constructor(sjs) {
        this.sjs = sjs
        this.keys = {}
        this.keyNames = Object.values({
            "Left Shift": "ShiftLeft",
            "Right Shift": "ShiftRight",
            "Right Ctrl": "ControlRight",
            "Left Ctrl": "ControlLeft",
            Enter: "Enter",
            "Right Alt": "AltRight",
            "Left Alt": "AltLeft",
            "Left Mouse": "Mouse1",
            "Middle Mouse": "Mouse2",
            "Right Mouse": "Mouse3",
            Space: "Space",
            X: "KeyX",
            Z: "KeyZ",
        })
        this.toggles = {}

        $(document).on("keydown", e => {
            this.keys[e.code] = true
        })
        $(document).on("keyup", e => {
            this.toggles[e.code] = !(this.toggles[e.code]
                ? this.toggles[e.code]
                : false)

            delete this.keys[e.code]
        })

        $(document).on("mousedown", e => (this.keys["Mouse" + e.which] = true))
        $(document).on("mouseup", e => {
            this.toggles["Mouse" + e.which] = !(this.toggles["Mouse" + e.which]
                ? this.toggles["Mouse" + e.which]
                : false)

            delete this.keys["Mouse" + e.which]
        })

        var plugin = require("./plugins/binds")

        sjs.addPlugin(new plugin(this))
    }

    isDown(k) {
        return !!this.keys[k]
    }
}

//Handles accessing specific data within a scope. This allows us to have only one spot where data is accessed. If the path to specific data changes,
//we will just change it here
var DataAccessor = class {

    Bullets() {
        return this._scope[this._obfuscationKeys.bullets];
    }

    Pixi() {
        return this._scope.pixi;
    }

    Camera() {
        return this._scope[this._obfuscationKeys.camera];
    }
    
    InputManager() {
        return this._scope[this._obfuscationKeys.inputManager];
    }

    ObjectCreator() {
        return this._scope[this._obfuscationKeys.objectCreator];
    }

    UiManager() {
        return this._scope[this._obfuscationKeys.uiManager];
    }

    PlayerInfo() {
        return this._scope[this._obfuscationKeys.players.barn][this._obfuscationKeys.players.info];
    }

    GetActiveLoot() {
        return this._scope[this._obfuscationKeys.loot.barn][this._obfuscationKeys.loot.active];
    }

    GetPlayerHealth(player) {
        return player[this._obfuscationKeys.localData][this._obfuscationKeys.health];
    }

    GetPlayerBoost(player) {
        return player[this._obfuscationKeys.localData][this._obfuscationKeys.boost];
    }

    GetPlayerPosition(player) {
        if(!player || !player.__type) {
            console.error("Player has no type", player);
        }
        //Is the current player or an actual enemy.
        if(player.__type === 1) {
            return player[this._obfuscationKeys.netData][this._obfuscationKeys.pos];
        }
        else {
            return player.pos;
        }
    }

    GetPlayerLayer(player) {
        if(!player || !player.__type) {
            console.error("Player has no type", player);
        }
        //Is the current player or an actual enemy.
        if(player.__type === 1) {
            return player[this._obfuscationKeys.netData][this._obfuscationKeys.layer];
        }
        else {
            return player.layer;
        }
    }

    GetPlayerWeapIdx(player) {
        return player[this._obfuscationKeys.localData][this._obfuscationKeys.weapIdx];
    }

    GetPlayerWeapons(player) {
        return player[this._obfuscationKeys.localData][this._obfuscationKeys.weapons];
    }

    GetPlayerWeaponType(player) {
        return player[this._obfuscationKeys.netData][this._obfuscationKeys.weapType];
    }

    GetPlayerNetData(player) {
        return player[this._obfuscationKeys.netData];
    }

    GetPlayerDirection(player) {
        return player[this._obfuscationKeys.netData][this._obfuscationKeys.dir];
    }

    IsPlayerDead(player) {
        return player[this._obfuscationKeys.netData][this._obfuscationKeys.dead];
    }

    IsPlayerDowned(player) {
        return player[this._obfuscationKeys.netData][this._obfuscationKeys.downed];
    }

    PlayerHasItem(player, item) {
        return player[this._obfuscationKeys.localData][this._obfuscationKeys.inventory][item] > 0;
    }

    GetCurrentPlayer() {
        return this._scope[this._obfuscationKeys.currentPlayer];
    }

    constructor(scope, obfuscationKeys) {
        this._scope = scope;
        this._obfuscationKeys = obfuscationKeys;
    }

}

var Cheat = class {
    constructor() {
        this.plugins = {};
        this.version = manifest.version;
        this.internal = 
            [...document.getElementsByTagName("script")].filter(
                s => !!s.innerHTML.match(/^var [a-z0-9_]+=\['/g)
            )[0].innerHTML;
        this.ready = false
        this.inputs = []
        this.lastInputs = []
        this.healthLast = 0
        this.input = {
            aim: pos => {
                pos = pos || {
                    x: 0,
                    y: 0,
                }
                window.isAiming = true
                var inputManager = this.dataAccessor.InputManager();
                inputManager.input.onMouseMove.call(
                    inputManager.input,
                    {
                        clientX: pos.x,
                        clientY: pos.y,
                    }
                )
            },
            addInput: i => {
                this.inputs.push(this.data.data.Input[this.ucfirst(i)])
                this.uniq(this.inputs)
            },
            press: (key, timeout = 50) => {
                var inputManager = this.dataAccessor.InputManager();
                if (!inputManager.input.keys[key]) {
                    setTimeout(() => {
                        inputManager.input.keys[
                            key
                        ] = true
                        setTimeout(() => {
                            delete inputManager.input.keys[key]
                        }, timeout)
                    }, 0)
                }
            },
            leftMouse: false,
            rightMouse: false,
            mouse: {
                x: 0,
                y: 0,
            },
            moveAngle: false,
            moveAngleOv: false,
            bind: new Binds(this),
            useItem: false,
        }
        this.data = {
            getObjects: () => {
                return Object.values(
                    this.dataAccessor.ObjectCreator().idToObj
                );
            },
            getEnemies: objects => {
                return this.data
                    .getObjects()
                    .filter(
                        p =>
                            (p &&
                                p.__type === 1 &&
                                !this.dataAccessor.IsPlayerDead(p) &&
                                !this.dataAccessor.IsPlayerDowned(this.dataAccessor.GetCurrentPlayer()) &&
                                !this.data.isTeam(p.__id)) ||
                            (p.__type === 2
                                ? objects &&
                                  p &&
                                  Math.sqrt(
                                      Math.pow(
                                          this.dataAccessor.GetPlayerPosition(p).x 
                                          - this.dataAccessor.GetPlayerPosition(this.dataAccessor.GetCurrentPlayer()).x,
                                          2
                                      ) +
                                          Math.pow(
                                                this.dataAccessor.GetPlayerPosition(p).y 
                                                - this.dataAccessor.GetPlayerPosition(this.dataAccessor.GetCurrentPlayer()).y,
                                                2
                                          )
                                  ) <= 4 &&
                                  p.destructible &&
                                  !p.isBush &&
                                  !p.isWindow &&
                                  !p.isButton &&
                                  !p.isWall &&
                                  !p.dead &&
                                  !p.exploded &&
                                  p.img &&
                                  !p.img.match(/crate-0[46]/g) &&
                                  p.type.match(
                                      /(barrel_0[234]|rack|chest|planter|stand|fire|book|vending|shelf|stone_0[245]|tree_03|crate|case|locker|deposit|drawers|toilet|gun-mount|pot)/g
                                  )
                                : false)
                    )
            },
            isTeam: id => {
                var info = this.dataAccessor.PlayerInfo();
                return info[id].teamId === info[this.dataAccessor.GetCurrentPlayer().__id].teamId;
            },
            checkId: id => {
                var info = this.dataAccessor.PlayerInfo();
                return info[id];
            },
            cantCollide: (Target, cust) => {
                var t = Target.pos;
                var player = this.dataAccessor.GetCurrentPlayer();
                var pos = this.dataAccessor.GetPlayerPosition(player);
                var objects = this.dataAccessor.ObjectCreator().idToObj;
                var collidableObjects = Object.keys(objects).filter(function (
                        n
                    ) {
                        var curObj = objects[n]
                        if (typeof curObj.img == "string") {
                            // collidable elements filter
                            if (!cust || typeof cust !== "function")
                                return (
                                    !objects[n].isDoor &&
                                    !objects[n].isBush &&
                                    !objects[n].isWindow &&
                                    !objects[n].img.includes("stair") &&
                                    !objects[n].img.includes("table") &&
                                    !objects[n].img.includes("tree") &&
                                    !objects[n].type.includes("rail") &&
                                    !objects[n].type.includes("glass") &&
                                    !objects[n].type.includes("bar") &&
                                    void 0 !== objects[n].collidable &&
                                    objects[n].collidable
                                )
                            else return cust(objects[n])
                        } else {
                            return (
                                void 0 !== objects[n].collidable &&
                                objects[n].collidable
                            )
                        }
                    }),
                    p = []
                ;(p.A = []),
                    (p.B = []),
                    (p.C = []),
                    (p.D = []),
                    (p.A.x = pos.x),
                    (p.A.y = pos.y),
                    (p.B.x = t.x),
                    (p.B.y = t.y)
                var d = true
                collidableObjects.forEach((n, e, t) => {
                    objects[n].layer !== this.dataAccessor.GetPlayerLayer(player) ||
                        (this.dataAccessor.GetPlayerNetData(objects[n]) && this.dataAccessor.IsPlayerDead(objects[n])) ||
                        (void 0 !== objects[n].collider &&
                        void 0 !== objects[n].collider.min &&
                        void 0 !== objects[n].collider.max
                            ? ((p.C.x = objects[n].collider.min.x),
                              (p.C.y = objects[n].collider.min.y),
                              (p.D.x = objects[n].collider.max.x),
                              (p.D.y = objects[n].collider.min.y),
                              l(p) && (d = false),
                              (p.C.x = objects[n].collider.max.x),
                              (p.C.y = objects[n].collider.min.y),
                              (p.D.x = objects[n].collider.max.x),
                              (p.D.y = objects[n].collider.max.y),
                              l(p) && (d = false),
                              (p.C.x = objects[n].collider.max.x),
                              (p.C.y = objects[n].collider.max.y),
                              (p.D.x = objects[n].collider.min.x),
                              (p.D.y = objects[n].collider.max.y),
                              l(p) && (d = false),
                              (p.C.x = objects[n].collider.min.x),
                              (p.C.y = objects[n].collider.max.y),
                              (p.D.x = objects[n].collider.min.x),
                              (p.D.y = objects[n].collider.max.y),
                              l(p) && (d = false))
                            : (function (n, e, t, i, a, o) {
                                  var r,
                                      s,
                                      l = a - t,
                                      c = o - i,
                                      p = l * l + c * c,
                                      d = -1
                                  0 != p &&
                                      (d = ((n - t) * l + (e - i) * c) / p),
                                      d < 0
                                          ? ((r = t), (s = i))
                                          : d > 1
                                          ? ((r = a), (s = o))
                                          : ((r = t + d * l), (s = i + d * c))
                                  var u = n - r,
                                      m = e - s
                                  return Math.sqrt(u * u + m * m)
                              })(
                                  objects[n].collider.pos.x,
                                  objects[n].collider.pos.y,
                                  p.A.x,
                                  p.A.y,
                                  p.B.x,
                                  p.B.y
                              ) <= objects[n].collider.rad && (d = false))
                });
                return !!d &&
                    function (curPlayer, enemy) {
                        var distance = calcDistance(this.dataAccessor.GetPlayerPosition(curPlayer), this.dataAccessor.GetPlayerPosition(enemy));
                        var curWeaponType = this.dataAccessor.GetPlayerWeaponType(curPlayer);
                        var curWeapon = this.data.items[curWeaponType];
                        if(curWeaponType && curWeapon) {
                            var inRange = true;
                            if(isset(curWeapon.bulletType)) {
                                var inRange = distance < this.data.bullets[curWeapon.bulletType].distance;
                            }
                            return inRange;
                        }
                        return true
                    }.bind(this)(player, Target)
                    ? true
                    : false
            },
        }
        this.UI = new UI(this.version, this.plugins);
        this.CheckForUpdates();
    }

    /**
     * @description Adds a plugin to the plugin object (maybe add more later).
     * @param {object} plugin The plugin object to load.
     */
    addPlugin(plugin) {
        this.plugins[plugin.name] = plugin;
        if(this.UI) { 
            this.UI.render();
        }
    }

    /**
     * @description Removes a plugin from the cheat, never used.
     * @param {object|string} plugin The plugin object (or name) you want to remove.
     */
    removePlugin(plugin) {
        if(typeof plugin == "object") {
            delete this.plugins[plugin.name];
        } 
        else {
            delete this.plugins[plugin];
        }
        this.UI.render();
    }

    /**
     * @description This will be implemented at a later time to enable external plugin support.
     * @param {string} url The URL you want to load.
     * @param {boolean} local Is the URL local or in the extension?
     */
    inject(url, local) {}

    /**
     * Called every Surviv update
     */
    loop() {
        if(!this.ready || !this.scope || !this.UI) {
            return;
        }
        this.lastInputs = this.inputs;
        this.inputs = [];
        this.input.moveAngle = false;
        this.input.moveAngleOv = false;
        var currentPlayer = this.dataAccessor.GetCurrentPlayer();
        Object.values(this.plugins).forEach(p => {
            if(!p.enabled || p.dontLoop || typeof p.loop !== "function") {
                return;
            }
            try {
                p.loop(
                    this.dataAccessor,
                    currentPlayer,
                    this.input,
                    this.data,
                    this.plugins,
                    this.ready
                );
            } 
            catch (e) {
                console.log("FATAL (" + p.name + ") " + e + e.stack);
            }
        });
        var currentHealth = this.dataAccessor.GetPlayerHealth(currentPlayer);
        if (this.healthLast !== currentHealth) {
            this.healthLast = currentHealth;
            this.UI.health.html(Math.ceil(this.healthLast));
        }
        this.inputs = unique(this.inputs);
        this.data.getEnemies().forEach(enemy => {
            enemy.posOldOld = enemy.posOld
        });
        currentPlayer.posOldOld = currentPlayer.posOld;
    }

    /**
     * So the plugins can reset for the next game.
     */
    end() {
        var currentPlayer = this.dataAccessor.GetCurrentPlayer();
        Object.values(this.plugins).forEach(p => {
            if(!p.enabled || typeof p.end !== "function") {
                return;
            }
            p.end(
                this.dataAccessor,
                currentPlayer,
                this.input,
                this.data
            )
        })
    }

    /**
     * Private: Retreive obfuscation keys.
     */
    _getKeys() {
        //These used to be obfuscated, but not with the latest version of obfuscation. They are hardcoded here for now.
        var data = {
            currentPlayer: 'm_activePlayer',
            pos: 'm_pos',
            dir: 'm_dir',
            backpack: 'm_backpack',
            helmet: 'm_helmet',
            chest: 'm_chest',
            weapType: 'm_curWeapType',
            layer: 'm_layer',
            dead: 'm_dead',
            downed: 'm_downed',
            health: 'm_health',
            boost: 'm_boost',
            inventory: 'm_inventory',
            weapIdx: 'm_curWeapIdx',
            weapons: 'm_weapons',
        };
        let keys = {
            netData: 'm_netData',
            localData: 'm_localData',
            camera: 'm_camera',
            objectCreator: 'm_objectCreator',
            inputManager: 'm_inputBinds',
            players: {
                barn: 'm_playerBarn',
                info: 'm_playerInfo',
            },
            loot: {
                barn: 'm_lootBarn',
                pool: 'm_lootPool',
                array: 'm_pool',
                active: 'activeCount',
            },
            bullets: 'm_bulletBarn',
            ui: 'm_uiManager',
        };
        Object.assign(keys, data);
        return keys;
    }

    /**
     * Run required setup actions
     */
    init() {
        console.log("init passed00");
        if (!this.internal || this.ready)  {
            return;
        }
        console.log("init passed");
        try {
            var func = {
                webpack_inject: (w, e, get) => {
                    this.data.GET = get
                    this.data.guns = get("ad1c4e70")
                    this.data.ammo = get("764654e6")
                    this.data.skin = get("63d67e9d")
                    this.data.melee = get("ccb6ad93")
                    this.data.bullets = get("beeed8a4")
                    this.data.throwable = get("035f2ecb")
                    this.data.explosions = get("ea3b9366")
                    this.data.objects = get("03f4982a")
                    this.data.mergeDeep = get("1901e2d9").mergeDeep
                    this.data.pieTimer = get("feb8fc30")
                    this.data.items = this.data.mergeDeep(
                        {},
                        this.data.objects,
                        this.data.throwable,
                        this.data.guns,
                        this.data.ammo,
                        this.data.skin,
                        this.data.melee,
                        this.data.bullets
                    )
                    this.data.data = this.data.mergeDeep(
                        get("8649e148"),
                        get("989ad62a"),
                        {
                            Messages: get("300e2704"),
                        }
                    );
                    this.data.selectedEnemy = [];
                    return true
                },
            };
            if(typeof window.webpackJsonp === 'function') {
                window.webpackJsonp([0], func, ["webpack_inject"]);
            }
            else {
                window.webpackJsonp.push([
                    ["webpack_inject"],
                    func,
                    [["webpack_inject"]]
                ]);
            }
            this.obfuscate = this._getKeys();
            this.dataAccessor = new DataAccessor(this.scope, this.obfuscate);
            document.addEventListener("keydown",(e)=>{
                if(e.code === "KeyX" && e.altKey) {
                    this.dataAccessor.UiManager().quitGame();
                }
            });
            this.ready = true;
        } catch (e) {
            console.log("NON_FATAL", e);
            return setTimeout(this.init, 200);
        }
        $(window).on("mousedown", e => {
            if (e.button == 0) return (this.input.leftMouse = true)
            if (e.button == 2) return (this.input.rightMouse = true)
        });
        $(window).on("mouseup", e => {
            if (e.button == 0) return (this.input.leftMouse = false)
            if (e.button == 2) return (this.input.rightMouse = false)
        });
        $(window).on("mousemove", e => {
            this.input.mouse = {
                x: e.clientX,
                y: e.clientY,
            };
        });
    }

    /**
     * Check for updates on the GitHub release repo
     */
    CheckForUpdates() {
        https.get("https://api.github.com/repos/IceHacks/SurvivCheatInjector/releases/latest", (resp) => {
            var data = "";
            resp.on("data", chunk => {
                data += chunk;
            });
            resp.on("end", () => {
                var retVal = JSON.parse(data);
                if(!retVal || !retVal.tag_name || !retVal.html_url) {
                    console.error("Invalid response when checking for update: ", retVal);
                    return;
                }
                if(!this.version) {
                    console.error("Invalid version.");
                    return;
                }
                //Check to see if the latest release's version is the same or different from the currently installed version.
                if(retVal.tag_name == this.version) {
                    //Up to date.
                    return;
                }
                if (!localStorage.checkoff) {
				swal(
                    "Surviv Cheat Injector Update",
                    "There is a new update available.\n\nCurrent Version: " + this.version + "\nNew Version: " + retVal.tag_name,
                    {
                        buttons: {
                            close: true,
                            download: true,
                        },
                    }
                );
				localStorage.checkoff = true;
				
                  then(e => {
                    if(e == "download") {
                        window.open(retVal.html_url, "_blank");
                    }
                });
              }
        }).on("error", (err => {
            console.error("Error checking for update:", err);
        }));
		}
        );
		document.addEventListener("keydown",(e)=>{
		if (e.code === "KeyU" && e.altKey) {
                swal(
                    "Are you sure you want to check for updates?",
                    "Doing so will reload the page",
                    {
                        buttons: {
                            cancel: true,
                            ok: true,
                        },
                    }
                ).then(e => {
                    if (e == "ok") {
                        localStorage.removeItem("checkoff");
                        location.reload();
                    }
                });
            }
		}
  );
}
	
    /**
     * Limits array to unique values
     */
    uniq(a) {
        a.filter((item, pos) => {
            return a.indexOf(item) == pos
        });
    }

    /**
     * Makes first letter of a string uppercase
     *
     * @param string {string} The string
     */
    ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

window[key] = new Cheat();
window[key].addPlugin(require("./plugins/aimbot-2"));
window[key].addPlugin(require("./plugins/esp"));
window[key].addPlugin(require("./plugins/autoloot"));
window[key].addPlugin(require("./plugins/trees"));
window[key].addPlugin(require("./plugins/switch"));
window[key].addPlugin(require("./plugins/bumpfire"));
window[key].addPlugin(require("./plugins/spinbot"));
window[key].addPlugin(require("./plugins/timer"));
window[key].addPlugin(require("./plugins/theme"));
window[key].addPlugin(require("./plugins/autoreload"));
window[key].addPlugin(require("./plugins/autoheal"));
window[key].addPlugin(require("./plugins/pan"));