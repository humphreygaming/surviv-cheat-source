var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "escape"
        this.UI = {
            name: "AutoDodge™",
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

    findWeap(me, game, obfuscate) {
        var weap = me[obfuscate.netData].weapType
        return weap && game.guns[weap] ? game.guns[weap] : false
    }

    findBullet(curWeapon, game) {
        return !!curWeapon ? game.bullets[curWeapon.bulletType] : false
    }

    loop(obfuscate, scope, player, input, data, plugins) {
        var enemies = data.getEnemies()

        enemies.forEach(e => {
            if (e.layer !== player.layer) return

            var weapon = this.findWeap(e, data, obfuscate)
            var bullet = this.findBullet(weapon, data)
            var angleBetween = Math.atan2(
                e.pos.y - player.pos.y,
                e.pos.x - player.pos.x
            )
            var enemyDirection = Math.atan2(e.dir.x, e.dir.y)

            if (
                Math.abs(angleBetween - enemyDirection) <
                weapon.shotSpread *
                    (Math.PI /
                        180) /*&&
				this.calcDistance(
					e.pos.x,
					e.pos.y,
					player.pos.x,
					player.pos.y
				) < bullet.distance*/
            ) {
                console.log("enemy is aiming at me")
                input.moveAngleOv = angleBetween + 90 * (Math.PI / 180)
            }
        })
    }

    calcDistance(cx, cy, ex, ey) {
        return Math.sqrt(Math.pow(cx - ex, 2) + Math.pow(cy - ey, 2))
    }
}

module.exports = new Plugin()
