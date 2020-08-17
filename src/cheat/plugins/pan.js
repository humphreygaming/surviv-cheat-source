var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "pan"
        this.UI = {
            name: "Pan Hero ²", // ¹²³
            description: "Reflect bullets with a pan",
        }
        this._options = [
            {
                value: 13,
                int: 0.5,
                name: "detectRadius",
                UI: {
                    name: "Bullet detection radius",
                },
                min: 10,
                max: 16,
            },
            {
                value: false,
                name: "displayRadius",
                UI: {
                    name: "Display detection radius",
                },
            },
            {
                // FOR DEBUGGING
                value: false,
                name: "turnWithoutPan",
                UI: {
                    name: "'Reflect' bullets without a pan",
                },
            },
            {
                value: true,
                name: "lootPan",
                UI: {
                    name: "Loot pan automatically",
                },
            },
        ]

        this.panOffset = 142
        this.stayTurnedFor = 300

        // For staying turned for some time
        this.lastTurnTime = Date.now()
        this.lastTurnPos = null

        // Reference to PIXI Graphics
        this.pixi = null
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

    end() {
        this.pixi = null
    }

    //
    // Math
    //
    magnitude(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    }

    dotProduct(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y
    }

    normalize(vector) {
        let _magnitude = this.magnitude(vector)
        return {
            x: vector.x / _magnitude,
            y: vector.y / _magnitude,
        }
    }

    subtract(vector1, vector2) {
        return {
            x: vector1.x - vector2.x,
            y: vector1.y - vector2.y,
        }
    }

    getDistance(p1, p2) {
        var dx = p2.x - p1.x,
            dy = p2.y - p1.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    rad(degrees) {
        return degrees * (Math.PI / 180)
    }

    playerHasPan(dataAccessor, player) {
        let weapons = dataAccessor.GetPlayerWeapons(player);
        let meleeType = weapons[2].type;
        return meleeType.includes("pan") || meleeType.includes("lasr_s")
    }

    // Draws a bullet detection radius
    drawRadius(player) {
        let pixi = this.pixi;
        if(this.pixi == null) {
            this.pixi = pixi = new window.PIXI.Graphics();
            player.container.addChild(this.pixi);
            player.container.setChildIndex(this.pixi, 0);
        }
        pixi.clear();
        pixi.beginFill(0xff0000, 0.0);
        pixi.lineStyle(1, 0x000000, 0.1, 0);
        pixi.drawCircle(0, 0, this.option("detectRadius") * 16);
    }

    // Loot a pan
    lootPan(dataAccessor, player, input) {
        let loot = dataAccessor.GetActiveLoot();
        // No loot available
        if(loot == null)  {
            return;
        }
        // Skip if player is downed
        if(dataAccesor.IsPlayerDowned(player)) {
            return;
        }
        // Looting pan
        if(!this.playerHasPan(dataAccessor, player)) {
            if(loot.type.includes("pan")) {
                input.addInput("loot");
            }
        }
        else {
            console.warn("player has pan");
        }
    }

    // Turns to enemy with a pan
    turnTo(playerPos, enemyPos, input) {
        let arctanAngle = Math.atan2(
            enemyPos.y - playerPos.y,
            enemyPos.x - playerPos.x
        )
        let normalAngle = -1 * arctanAngle * (180 / Math.PI)
        let angleConsideringPan = normalAngle - this.panOffset

        input.aim({
            x:
                Math.cos(this.rad(angleConsideringPan)) * 100 +
                window.innerWidth / 2,
            y:
                Math.sin(this.rad(angleConsideringPan)) * 100 +
                window.innerHeight / 2,
        })
    }

    // Reflects the bullets
    reflectBullets(dataAccessor, player, input) {
        // Dont reflect if player is shooting
        if(input.leftMouse) {
            return;
        }
        // Return if player has no pan
        if(!this.option("turnWithoutPan") && !this.playerHasPan(dataAccessor, player)) {
            return;
        }
        // Remain to be turned for a moment
        if(this.lastTurnPos != null && Date.now() - this.lastTurnTime < this.stayTurnedFor) {
            this.turnTo(dataAccessor.GetPlayerPosition(player), this.lastTurnPos, input);
        }
        var playerPos = dataAccessor.GetPlayerPosition(player);
        let bullets = dataAccessor.Bullets()["bullets"]
            .filter(bullet => {
                let playerRadius = 1;
                let alpha = Math.acos(
                    this.dotProduct(
                        bullet.dir,
                        this.normalize(this.subtract(playerPos, bullet.pos))
                    )
                );
                let beta = Math.asin(
                    playerRadius /
                        this.magnitude(this.subtract(playerPos, bullet.pos))
                );
                return (
                    bullet.alive &&
                    bullet.layer === dataAccessor.GetPlayerLayer(player) &&
                    bullet.playerId != player.__id &&
                    // if the bullet within the "reaction" radius
                    this.getDistance(playerPos, bullet.pos) <=
                        this.option("detectRadius") &&
                    // If bullet is aiming at player
                    alpha <= beta
                );
            })
            .sort((a, b) => {
                // Sort by distance to the player
                let distA = this.getDistance(playerPos, a.pos),
                    distB = this.getDistance(playerPos, b.pos)
                return distA - distB
            });
        if(bullets.length == 0) {
            return;
        }
        this.turnTo(playerPos, bullets[0].pos, input);
        this.lastTurnTime = Date.now();
        this.lastTurnPos = bullets[0].pos;
    }

    loop(dataAccessor, player, input, data, plugins) {
        if(this.option("displayRadius")) { 
            this.drawRadius(player);
        }
        else if(this.pixi != null) {
            this.pixi.clear();
        }
        if(this.option("lootPan")) {
            this.lootPan(dataAccessor, player, input);
        }
        this.reflectBullets(dataAccessor, player, input);
    }
}

module.exports = new Plugin()
