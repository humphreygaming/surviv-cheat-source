var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "trees"
        this.UI = {
            name: "Transparency",
            description: "",
        }
        this._options = [
            {
                value: 0.5,
                int: 0.1,
                name: "tree",
                UI: {
                    name: "Obstacles",
                },
                min: 0,
                max: 1,
            },
            {
                value: 0,
                int: 0.1,
                name: "roof",
                UI: {
                    name: "Roofs",
                },
                min: 0,
                max: 1,
            },
        ]
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

    loop(obfuscate, scope, player, input, data) {
        data.getObjects().forEach(obj => {
            if (obj.__type === data.data.Type.Building) {
                if (obj.imgs.length > 1) {
                    if (obj.type == "container_05") return
                    obj.imgs.forEach(img => {
                        if (img.isCeiling) {
                            img.sprite.imgAlpha = this.option("roof")
                        }
                    })
                }
            }
            if (
                obj.__type === data.data.Type.Obstacle &&
                obj.img &&
                obj.img.match(/tree|bush|table|stairs|brush/g)
            ) {
                obj.sprite.alpha = this.option("tree")
            }
        })
    }
}

module.exports = new Plugin()
