"use strict"

const { replace } = require("lodash")

window.request = require("sync-request")
import("crypto-js").then(CryptoJS => {
    import("lodash").then(_ => {
        const key = require("./cheat/data.json").secret
        const icehackswm =
            atob("ZGF0YTppbWFnZS9wbmc7YmFzZTY0LA==") +
            "iVBORw0KGgoAAAANSUhEUgAAAQAAAABgCAMAAADFL1y6AAADAFBMVEVMaXH////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////KYZgzAAAA/3RSTlMA+gH3/Pn4/v379fD26/Tu8wQF7wLp6gMG8u3xCePi7OB61AznxeSm19LE5djN6NW+ENncnAfR3cpG3sl4CKDfeS3b5grOJW7DMg2hjrk9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"
        
        //Sends a new synchronous get request to the given url.
        const get = theUrl => {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false);
            xmlHttp.send(null);
            return xmlHttp.responseText;
        }

        //Returns an Enci file for the given url
        const getEnciFile = url => {
            var result
            try {
                result = CryptoJS.AES.decrypt(
                    get(chrome.runtime.getURL(url)),
                    key
                ).toString(CryptoJS.enc.Utf8);
            } catch (e) {
                console.error(e);
                result = icehackswm;
            }
            return result;
        }

        //Returns a patched version of the given JS with injected code/fixes.
        const PatchAppJs = (js, isDev, isVerbose) => {
            var key = require("./cheat/random")();
            var tex = JSON.parse(get("file/textures/db.json"));
            var data = [
                {
                    name: "Console Fix",
                    from: /&&\(console\[[^\]]+\]=function\(\){}\)/g,
                    to: "",
                    dev: true,
                },
                {
                    name: "OnError Patch",
                    from: /window\[[^\]]+\](=function\([a-z0-9_]+,[a-z0-9_]+,[a-z0-9_]+,[a-z0-9_]+,[a-z0-9_]+\))/g,
                    to: "window['onrandomvariable']$1",
                },
                {
                    name: "Scope Export",
                    from: /function ([a-z0-9_]+)\(([a-z0-9_]+),([a-z0-9_]+)\)\{this\[([^\]]+)\]=([a-z0-9_]+),this\[([^\]]+)\]=([a-z0-9_]+),this\[([^\]]+)\]=([^_^,]+)/g,
                    to: "function $1($2,$3){this[$4]=$5;window." + key + ".scope=this.game; this[$6]=$7,this[$8]=$9",
                },
                {
                    name: "Green Screen of Death Fix",
                    from: /if\([a-z0-9_]+&&[a-z0-9_]+\[[^\]]+\]&&[a-z0-9_]+\[[^\]]+\]\)\{var [a-z0-9_]+=[a-z0-9_]+;[a-z0-9_]+=null,[a-z0-9_]+\[[^\]]+\]\[[^\]]+\]\(\);\}/g,
                    to: "",
                },
                {
                    name: "CloudFunctions Patch",
                    from: /https:\/\/us-central1-surviv-fa40f\.cloudfunctions\.net\//g,
                    to: 'https://cdnjs.com/',
                },
                {
                    name: "Freeze Patch 1",
                    from: /if\([a-z0-9_]+\[[^\]]+\]\([a-z0-9_]+\[[a-z0-9_]+\]\)>=[^\)]+\)return!!\[\];/g,
                    to: "continue;",
                },
                {
                    name: "Freeze Patch 2",
                    from: /(return [a-z0-9_]+\[[^\]]+\]\([a-z0-9_]+\)!=-)/g,
                    to: "return false;$1",
                },
                {
                    name: "Fix Amazon Redirect",
                    from: /'https:\/\/www\.amazon\..*?'/g,
                    to: "'https://icehacks.github.io'",
                },
                {
                    name: "Fix Cheat",
                    from: /return String\[[^\]]+\]\([a-z_0-9]+\);/g,
                    to: 'return "⍁⌖⍁⌖⍁";'
                },
                {
                    name: "End Game",
                    from: /([a-z0-9_]+\[[^\]]+\]\[[^\]]+\]\(\));\};/g,
                    to: `$1;window.${key}.end();};`,
                },
                {
                    name: "Transparency",
                    from: /&&[a-z0-9_]+\[[^\]]+\]\[[^\]]+\]<[a-z0-9_]+;/g,
                    to: "&& false;",
                },
                {
                    name: "Prevent Hidden",
                    from: /this\[[^\]]+\]\[[a-z0-9_]+\]\[[^\]]+\]=!\[\];\}\}/g,
                    to: "continue;}}"
                },
                {
                    name: "Non-Dev Patch",
                    from: /var ([a-z0-9_]+)=new ([a-z0-9_]+)\[([a-z0-9_]+)\]\(([a-z0-9_]+),([a-z0-9_]+)\(([a-z0-9_]+)\)\),/g,
                    to:
                        'var $1=new $1[$2]($3, $4($5).replace(/icehacks|cheat|aimbot|auto|™|bot|esp|bump|grenade/gi, "fgiopdsiohrgFDSGRFg")),',
                },
                {
                    name: "Shape Color",
                    from: /var ([a-z0-9_]+)=([a-z0-9_]+)\[([^\]]+)\]\[([^\]]+)\],([a-z0-9_]+=[a-z0-9_]+\[[^\]]+\]\([a-z0-9_]+\[[^\]]+\],[a-z0-9_]+\[[^\]]+\],_[a-z0-9]+)/g,
                    to:
                        require("./cheat/parses/color.parse").default.replace(
                            /sjs/g,
                            "window." + key
                        ) + ";var $1=$2[$3][$4],$5",
                },
                {
                    name: "Packet Editor",
                    from: /'m_sendMessage':function ([a-z0-9_]+)\(([a-z0-9_]+),([a-z0-9_]+),([a-z0-9_]+)\)\{var ([a-z0-9_]+)=([a-z0-9_]+)\|\|/g,
                    to:
                        "'m_sendMessage':function $1($2, $3, $4){" +
                        require("./cheat/parses/packet_edit.parse").default
                        .replace(
                            /sjs/g,
                            "window." + key
                        )
                        .replace(
                            /replaceVar1/g,
                            "$2"
                        )
                        .replace(
                            /replaceVar2/g,
                            "$3"
                        ) + "var $5=$6||",
                },
                {
                    name: "Loop",
                    from: /;var ([a-z0-9_]+)=this\[([^\]]+)\]\[([^\]]+)\]\(\),([a-z0-9_]+)=([a-z0-9_]+)\[/g,
                    to:
                        ";var $1 = this[$2][$3]();" +
                        `try{if(!window.${key}.ready){window.${key}.init();};window.${key}.loop()}catch(e){console.log(e)};` +
                        "var $4=$5[",
                },
                // {
                //     name: "Icon Fix",
                //     //from: /return"img\/loot\/"\+([a-z])\.lootImg\.sprite\.slice\(0,-4\)\+"\.svg";/g,
                //     from: /return'img\/loot\/'\+.*\+'\.svg';/g,
                //     to:
                //         "return $1.lootImg.sprite.includes('://') ? $1.lootImg.sprite.replace('.png', '.svg') : 'img/loot/' + $1.lootImg.sprite.slice(0,-4) + '.svg';",
                // },
            ];
                // Textures
                ; (() => {
                    if (tex.length)
                        tex.forEach(d => {
                            js = js.replace(
                                new RegExp('sprite:"' + d.type + '\\.img"', "g"),
                                "sprite:'" + chrome.runtime.getURL(d.url) + "'"
                            )
                        })
                })()

            //Console.logs the status of the given replacement.
            var AlertIfNeeded = (name, work, id) => {
                if(!isDev) {
                    return;
                }
                var l = 35 - name.length - (work ? 0 : 4);
                var j = new Array(l).join(".");
                console.log(
                    name + j + (work ? "" : "NOT ") + "injected",
                    id,
                    "found",
                    (work || {}).length || 0
                );
            }
            data.forEach((d, id) => {
                if (!(d.dev ? isDev : true))
                    return AlertIfNeeded((d.name || d.from) + " (DEV)", false, id)
                AlertIfNeeded(
                    (d.name || d.from) + (d.dev ? " (DEV)" : ""),
                    js.match(d.from),
                    id
                )
                js = js.replace(d.from, d.to)
            });
            return js;
        }

        //Inject the new HTML into the body
        const InjectInBody = (id, body) => {
            var o = "(function(){"
                ; (o += "var code = ("),
                    (o += JSON.stringify({
                        code: body,
                    })),
                    (o += ").code;"),
                    (o += "var script = document.createElement('script');"),
                    (o += "script.innerHTML = code;"),
                    (o += "document.body.appendChild(script);"),
                    (o += "})();")
            o += "(function(){"
                ; (o += "var code = ("),
                    (o += JSON.stringify({
                        code: request("GET", "./main.js").body,
                    })),
                    (o += ").code;"),
                    (o += "var script = document.createElement('script');"),
                    (o += "script.innerHTML = code;"),
                    (o += "document.body.appendChild(script);"),
                    (o += "})()")
            try {
                chrome.tabs.executeScript(id, {
                    code: o,
                })
            } 
            catch(e) { 
                console.error("Failed to inject in body.", e);
            }
        }

        //Returns a dictionary of string values to their replacement in the obfuscated appJs. i.e. "Bitstream" -> "a0_0234234('0x342')"
        const GetObfReplacements = (appJs, isVerbose, shouldDeobfuscate) => {
            try {
                var match = /var ([A-Za-z0-9_]+)=(\[.*\]);\(function\(/g.exec(appJs);
                if(isVerbose) {
                    console.log("Match for Obf replacements", match);
                }
                var arrayName = match[1];
                var array = new Function("var a = "+match[2]+"; return a;")();
                if(isVerbose) {
                    console.log("Variable name", arrayName);
                    console.log("Array for Obf replacements", array);
                }
                var regExp = new RegExp("var [a-z0-9_]+="+arrayName+"\\[([a-z0-9_]+)\\];", "g");
                match = regExp.exec(appJs);
                if(isVerbose) {
                    console.log("Second match", match);
                }
                regExp = new RegExp("var ([a-z0-9_]+)=function\\("+match[1]+",", "g");
                match = regExp.exec(appJs);
                var masterFunctionName = match[1];
                if(isVerbose) {
                    console.log("Master function name", masterFunctionName);
                }
                if(shouldDeobfuscate) {
                    for(var i = 0; i < array.length; i++) {
                        if(array[i].length > 200) {
                            continue;
                        }
                        var hexStr = "0x"+i.toString(16);
                        var findRegex = new RegExp(masterFunctionName+"\\(\'"+hexStr+"\'\\)", "g");
                        appJs = appJs.replace(findRegex, "\'"+array[i]+"\'");
                    }
                    console.log("Deobfuscated JS", appJs);
                }
                var retVal = { };
                for(var i = 0; i < array.length; i++) {
                    retVal[array[i]] = masterFunctionName+`\\('0x${i.toString(16)}'\\)`;
                }
                if(isVerbose) {
                    console.log("Obf replacements", retVal);
                }
                return retVal;
            }
            catch(e) {
                console.error("Failed to get Obf replacements", e);
            }
        }

        chrome.webRequest.onBeforeRequest.addListener(
            req => {
                if (
                    req.url.match(/js\/app\.\w+\.js$/g) &&
                    !req.url.match(/stats/g) &&
                    req.type == "script"
                ) {
                    chrome.tabs.get(req.tabId, r => {
                        var isDev = r.url.match(/dev/g);
                        var shouldDeobfuscate = r.url.match(/deobf/g);
                        var isVerbose = r.url.match(/verbose/g);
                        var appJs = request("GET", req.url).getBody("utf-8");
                        //Not used currently, but helpful to have.
                        var dictReplacements = GetObfReplacements(appJs, isVerbose, shouldDeobfuscate);
                        appJs = PatchAppJs(appJs, isDev, isVerbose);
                        InjectInBody(req.tabId, appJs);
                    })
                    return {
                        cancel: true,
                    }
                }
                if(req.url.includes("surviv_shirts_en.png")) {
                    return {
                        redirectUrl: getEnciFile("file/wm01.enci"),
                    }
                }
                if(req.url.includes("img/surviv_logo")) {
                    return {
                        redirectUrl: getEnciFile("file/wm04.enci"),
                    }
                }
                if(req.url.includes("img/particles/part-smoke")) {
                    return {
                        redirectUrl: getEnciFile("file/wm02.enci"),
                    }
                }
            },
            {
                urls: chrome.runtime.getManifest()["externally_connectable"]
                    .matches,
            },
            ["blocking"]
        )
    })
})
