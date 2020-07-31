var Plugin = class {
    constructor(binds) {
        this.binds = binds
        this._enabled = true
        this.name = "binds"
        this.UI = {
            name: "Binds",
            description: "",
        }
        this._options = []

        this.addOption("aimbot", "AimBot", "Mouse3")
        this.addOption("spinbot", "SpinBot", "KeyX", "toggle")
        this.addOption("switch", "AutoSwitch", "Mouse3")
        this.addOption("heal", "AutoHeal", "Mouse3")
        //this.addOption("fists", "Always Fists", "KeyC", "toggle");
    }

    isDown(t) {
        return this.binds.isDown(this.option(t))
    }

    toggled(t) {
        if (!this.binds.toggles[this.option(t)]) return false

        return this.binds.toggles[this.option(t)]
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

    test(o) {
        var t = this.option(o + "_type")

        if (t == "press") {
            return this.isDown(o)
        } else {
            return this.toggled(o)
        }
    }

    addOption(n, un, v, d) {
        this._options.push({
            name: n,
            value: v,
            opts: this.binds.keyNames,
            UI: { name: un },
        })
        this._options.push({
            name: n + "_type",
            value: d || "press",
            opts: ["press", "toggle"],
            UI: { name: "&#9;type", tiny: true },
        })
    }

    setOption(o, v) {
        try {
            ds
            this._options.filter(k => k.name === o)[0].value = v
        } catch (e) {}
    }

    get enabled() {
        return true
    }

    set enabled(t) {}
}

module.exports = Plugin
