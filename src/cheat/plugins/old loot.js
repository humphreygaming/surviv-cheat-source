var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "autoloot"
        this.UI = {
            name: "Auto Loot",
            description: "",
        }
        this._options = [
            {
                value: 0.8,
                int: 0.1,
                name: "timeout",
                UI: {
                    name: "Drop Delay",
                },
                min: 0,
                max: 1,
            },
            {
                value: 0.02,
                int: 0.01,
                name: "delay",
                UI: {
                    name: "Pickup Delay",
                },
                min: 0,
                max: 1,
            },
        ]

        this.lastLoot = 0
        this.last = 0
    }

    option(o) {
        let op
        try {
            op = this._options.filter(k => k.name === o)[0].value
        } catch (e) {
            op = false
        }
        return op
    }

    setOption(o, v) {
        try {
            this._options.filter(k => k.name === o)[0].value = v
        } catch (e) {}
    }

    get enabled() {
        return this._enabled
    }

    set enabled(t) {
        this._enabled = t
    }

    getDistance(p1, p2) {
        var dx = p2.x - p1.x,
            dy = p2.y - p1.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    getLootRange(loot, curPlayer, game) {
        return (
            this.getDistance(loot.pos, curPlayer.pos) -
            (game.items[loot.type] || { rad: 1 }).rad -
            1
        )
    }

    shouldLoot(player, scope, obfuscate, data) {
        var me = player
        var loot = scope[obfuscate.loot.barn][obfuscate.loot.active]
        var guns = Object.keys(data.guns)
        var gun1 = me[obfuscate.localData].weapons[0].type == "" ? false : true
        var gun2 = me[obfuscate.localData].weapons[1].type == "" ? false : true
        var needGuns = !gun1 || !gun2
        var holdingGun = guns.includes(player[obfuscate.netData].weapType)
        var gunsClose =
            scope[obfuscate.loot.barn][obfuscate.loot.pool][
                obfuscate.loot.array
            ].filter(l => {
                return (
                    l.active &&
                    this.getLootRange(l, me, data) &&
                    guns.includes(l.type)
                )
            }) > 0
        var loots = scope[obfuscate.loot.barn][obfuscate.loot.pool][
            obfuscate.loot.array
        ]
            .filter(l => {
                return l.active && this.getDistance(l.pos, me.pos) < l.rad * 2
            })
            .sort((a, b) => {
                return (
                    this.getDistance(a.pos, me.pos) -
                    this.getDistance(b.pos, me.pos)
                )
            })

        if (!loot) {
            loot = loots[0]
            if (!loot) return false
        }

        if (gunsClose && holdingGun && !needGuns) return false

        if (loot.type.includes("pan")) return loot
        else if (loot.type.includes("katana")) return loot
        else if (loot.type.includes("hammer")) return loot
        else if (loot.type.includes("woodaxe")) return loot

        if (guns.includes(loot.type)) {
            if (needGuns) return loot
        } else if (
            loot.type.includes("backpack") &&
            loot.type > player[obfuscate.netData].backpack
        )
            return loot
        else if (
            loot.type.includes("chest") &&
            loot.type > player[obfuscate.netData].chest
        )
            return loot
        else if (
            loot.type.includes("helmet") &&
            loot.type > player[obfuscate.netData].helmet
        )
            return loot
        else if (
            player[obfuscate.localData].inventory.hasOwnProperty(loot.type)
        ) {
            var backpackLvls = parseInt(
                player[obfuscate.netData].backpack.match(/\d/g).join("")
            )

            var max = data.data.bagSizes[loot.type][backpackLvls]
            var cur = player[obfuscate.localData].inventory[loot.type]

            if (cur < max) return loot
        }

        loot.dontPickup = true

        return false
    }

    loop(obfuscate, scope, player, input, data) {
        let loot = this.shouldLoot(player, scope, obfuscate, data)
        if (
            loot &&
            Date.now() - this.lastLoot > this.option("timeout") * 1000 &&
            Date.now() - this.lastLoot > this.option("delay") * 1000
        ) {
            input.addInput("loot")
            this.last = Date.now()
        }
    }
}

module.exports = new Plugin()
