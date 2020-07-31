var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "autoloot"
        this.UI = {
            name: "Auto loot/doors",
            description: "Automatically picks up loot and opens doors.",
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
}

module.exports = new Plugin()
