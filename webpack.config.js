var path = require("path")
var JavaScriptObfuscator = require("webpack-obfuscator")
var CopyWebpackPlugin = require("copy-webpack-plugin")
var { CleanWebpackPlugin } = require("clean-webpack-plugin")
var WebpackBuildNotifierPlugin = require("webpack-build-notifier")
var ClosureCompilerPlugin =
    process.platform == "win32"
        ? require("webpack-closure-compiler")
        : require("closure-webpack-plugin")
var zipFolder = require("zip-folder")
var CryptoJS = require("crypto-js")
var fs = require("fs")
var manifest
try {
    manifest = require("./src/cheat/data.json")
} catch (e) {
    fs.writeFileSync("./src/cheat/data.json", "{}")
    manifest = {}
}
var version = (manifest.version = "2.1.7")

var time = new Date()

var string = (manifest.secret =
    Buffer.from(
        (
            (new Date().getDate() + new Date().getMonth()) *
            Math.pow(new Date().getFullYear(), 2)
        ).toString(32)
    )
        .toString("base64")
        .replace(/[^a-zA-Z]/g, "") +
    (new Date().getSeconds() + new Date().getMinutes()))

fs.writeFileSync("src/cheat/data.json", JSON.stringify(manifest))

var dataURL = file => {
    var file =
        "data:image/png;base64," + fs.readFileSync(file).toString("base64")

    return CryptoJS.AES.encrypt(file, string)
}
var config = {
    entry: {
        main: "./src/cheat/index.js",
        background: "./src/background.js",
        content: "./src/content.js",
    },
    output: {
        filename: "[name].js",
        chunkFilename: "chunks/[chunkhash:8].icehacks.js",
        path: path.resolve("./out/"),
    },
    plugins: [
        new ClosureCompilerPlugin(
            process.platform == "win32"
                ? undefined
                : {
                    platform: "native",
                }
        ),
        new CopyWebpackPlugin([
            {
                from: "src",
                ignore: ["*.js", "*.txt", "data.json", "*.dev.*"],
                transform: (content, path) => {
                    if (
                        path.match(/\.png|\.jpg|\.gif/g) &&
                        !path.match(/\.enc\./g)
                    )
                        return content

                    var parse = [
                        {
                            from: /[0-9]+\.[0-9]+\.[0-9]+/g,
                            to: version,
                        },
                    ]

                    content = content.toString()

                    if (!path.match(/\.png|\.jpg|\.gif/g))
                        parse.forEach(p => {
                            content = content.replace(p.from, p.to)
                        })
                    if (path.match(/\.enc\.png/g))
                        content = dataURL(path).toString()

                    return Buffer.from(content)
                },
                transformPath: path => {
                    return path.replace(/\.enc\.png/g, ".enci")
                },
            },
        ]),
        new CleanWebpackPlugin(),
        {
            apply: compiler => {
                compiler.hooks.afterEmit.tap("AfterEmitPlugin", compilation => {
                    zipFolder("./out", "./zip/latest.zip", new Function())
                    zipFolder(
                        "./out",
                        "./zip/" +
                        `${time.getMonth()+1}-${time.getDate()}-${time.getFullYear()}.${Buffer.from(
                            time.getMilliseconds().toString(32)
                        )
                            .toString("base64")
                            .replace(/[^0-9a-zA-Z]/g, "")
                            .substr(0, 6)}.zip`,
                        new Function()
                    )
                })
            },
        },
        new WebpackBuildNotifierPlugin({
            title: "Surviv v" + version + " Build (" + string + ")",
            suppressWarning: true,
        }),
    ],
    /*optimization: {
		splitChunks: {
			chunks: "all"
		}
	},*/
    module: {
        rules: [
            {
                test: /parse\.js|\.txt/i,
                use: ["raw-loader"],
            },
        ],
        noParse: [/[\/\\]node_modules[\/\\]jquery[\/\\].+?$/],
    },
    stats: "errors-only",
}


module.exports = (env, argv) => {

    if (argv.mode !== 'development') {
        config.plugins.splice(1,0,new JavaScriptObfuscator(
            {
                //identifierNamesGenerator: "mangled",
                //rotateUnicodeArray: true,
                //deadCodeInjection: true,
                //unicodeEscapeSequence: true,
                //selfDefending: true,
                //transformObjectKeys: true,
                //disableConsoleOutput: true
            },
            ["content.js"]
        ))
    }

    return config;
};
