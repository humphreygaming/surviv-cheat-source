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

    loop(dataAccessor, player, input, data, plugins) {
        if(plugins.binds.test("heal")) {
            return;
        }
        if(data.selectedEnemy[0]) {
            return;
        }
        if(player.action.type !== 0) {
            return;
        }
        var health = dataAccessor.GetPlayerHealth(player);
        var boost = dataAccessor.GetPlayerBoost(player);
        var now = Date.now();
        if(health < 30 &&
            dataAccessor.PlayerHasItem(player, "healthkit") &&
            now - this.time > 6100) 
        {
            input.press("56");
            this.time = now;
        }
        if(health < 100 - 15 &&
            dataAccessor.PlayerHasItem(player, "bandage") &&
            now - this.time > 3100) 
        {
            input.press("55");
            this.time = now;
        }
        if(boost < 50 &&
            dataAccessor.PlayerHasItem(player, "painkiller") &&
            now - this.time > 6100) 
        {
            input.press("48");
            this.time = now;
        }
        if(boost < 100 - 25 &&
            dataAccessor.PlayerHasItem(player, "soda") &&
            now - this.time > 6100) 
        {
            input.press("57");
            this.time = now;
        }
    }
}

module.exports = new Plugin()
