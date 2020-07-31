var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "reload"
        this.UI = {
            name: "AutoReload",
            description: "",
        }
        this._options = []
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

    loop(obfuscate, scope, player, input, data, plugins) {
        if (data.selectedEnemy[0]) return
        if (player.action.type !== 0) return

        var curWeapIdx = player[obfuscate.localData][obfuscate.weapIdx],
            weaps = player[obfuscate.localData][obfuscate.weapons],
            inventory = player[obfuscate.localData].inventory,
            curWeap = weaps[curWeapIdx]

        var gun1 = weaps[0].type != "" ? data.guns[weaps[0].type] : false
        var gun2 = weaps[1].type != "" ? data.guns[weaps[1].type] : false

        if (
            gun1 &&
            weaps[0].type.length > 0 &&
            weaps[0].ammo < gun1.maxClip &&
            inventory[gun1.ammo] > 0
        ) {
            input.addInput("EquipPrimary")
            input.addInput("Reload")

            return
        }

        if (
            gun2 &&
            weaps[1].type.length > 0 &&
            weaps[1].ammo < gun2.maxClip &&
            inventory[gun2.ammo] > 0
        ) {
            input.addInput("EquipSecondary")
            input.addInput("Reload")

            return
        }
    }
}

module.exports = new Plugin()
