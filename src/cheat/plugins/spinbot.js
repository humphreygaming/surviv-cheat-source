var Plugin = class {
    constructor() {
        this._enabled = false
        this.name = "spinbot"
        this.UI = {
            name: "SpinBot™",
            description: "",
        }
        this._options = [
            {
                value: 119,
                int: 1,
                name: "angle",
                UI: {
                    name: "Spin Angle",
                },
                min: 0,
                max: 360,
            },
        ]
        this.angle = 0
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

    rad(degrees) {
        var pi = Math.PI
        return degrees * (pi / 180)
    }

    loop(obfuscate, scope, player, input, data, plugins) {
        if (plugins.binds.test("spinbot")) return

        this.angle += parseInt(this.option("angle"))

        var lastPos = {}
        lastPos.x = Math.cos(this.rad(this.angle)) * 100 + window.innerWidth / 2
        lastPos.y =
            Math.sin(this.rad(this.angle)) * 100 + window.innerHeight / 2

        if (!plugins.aimbot.aim) {
            input.aim(lastPos)
        }
    }
}

module.exports = new Plugin()
