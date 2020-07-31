var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "autoheal"
        this.UI = {
            name: "AutoHeal™",
            description: "",
        }
        this._options = []
        this.time = Date.now()
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

    has(player, thing, o) {
        return player[o.inventory][thing] > 0
    }

    loop(obfuscate, scope, player, input, data, plugins) {
        if (plugins.binds.test("heal")) return
        if (data.selectedEnemy[0]) return
        if (player.action.type !== 0) return

        var localData = player[obfuscate.localData],
            now = Date.now(),
            health = localData[obfuscate.health]
        if (
            health < 30 &&
            this.has(localData, "healthkit", obfuscate) &&
            now - this.time > 6100
        ) {
            input.press("56")
            this.time = now
        }

        if (
            health < 100 - 15 &&
            this.has(localData, "bandage", obfuscate) &&
            now - this.time > 3100
        ) {
            input.press("55")
            this.time = now
        }

        if (
            localData.boost < 50 &&
            this.has(localData, "painkiller",obfuscate) &&
            now - this.time > 6100
        ) {
            input.press("48")
            this.time = now
        }

        if (
            localData.boost < 100 - 25 &&
            this.has(localData, "soda",obfuscate) &&
            now - this.time > 6100
        ) {
            input.press("57")
            this.time = now
        }
    }
}

module.exports = new Plugin()
