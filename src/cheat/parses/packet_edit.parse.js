if (e == 3) {
    var weap = sjs.data.items[sjs.scope.player[sjs.obfuscate.netData].weapType]
    t.inputs = t.inputs.concat(sjs.inputs)

    // Looking for new weaponIndex value
    ;(function () {
        if (sjs.obfuscate) {
            if (sjs.obfuscate.wepIdx) return
            let playerData = sjs.scope.player[sjs.obfuscate.localData]

            let found = false
            Object.keys(playerData).forEach(key => {
                if (found) return

                // initial weapon index
                if (playerData[key] === 2) {
                    sjs.obfuscate.wepIdx = key
                    found = true
                    return
                }
            })
        }
    })()

    if (
        (sjs.input.leftMouse &&
            (sjs.scope.player[sjs.obfuscate.localData][sjs.obfuscate.wepIdx] ==
                2 ||
                (weap && weap.fireMode && weap.fireMode == "single")) &&
            sjs.plugins.bump &&
            sjs.plugins.bump.enabled) ||
        t.inputs.includes(4)
    ) {
        t.shootHold = false
        //t.shootStart = !sjs.shootStart;
        t.shootStart = true
    }
    sjs.shootStart = t.shootStart

    if (sjs.input.moveAngleOv || sjs.input.moveAngle) {
        t.touchMoveActive = true
        t.touchMoveDir = {
            x: Math.cos(sjs.input.moveAngleOv || sjs.input.moveAngle),
            y: Math.sin(sjs.input.moveAngleOv || sjs.input.moveAngle),
        }
    }

    if (sjs.UI.showing) {
        t.shootStart = false
        t.inputs = t.inputs.filter(function (jhg) {
            return jhg == 17 || jhg == 18 ? false : true
        })
    }
} else if (e == 12) {
    /*if (sjs && sjs.plugins.autoloot) {
		sjs.plugins.autoloot.lastLoot = Date.now();
	}*/
} else if (e == 1) {
    if (sjs.plugins.autoloot && sjs.plugins.autoloot.enabled) {
        t.isMobile = true
        t.useTouch = true
    }
}
