const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        popup: "./src/popup/index.tsx",
        pages: "./src/pages/index.tsx",
        content: "./src/injection/index.ts"
    },
    mode: "production",
    module: {
        rules: [
            {
            test: /\.tsx?$/,
            use: [
                {
                loader: "ts-loader",
                options: {
                    compilerOptions: { noEmit: false },
                    }
                }],
            exclude: /node_modules/,
            },
            {
                exclude: /node_modules/,
                test: /\.s[ac]ss$/i,
                use: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                auto: (resourcePath, resourceQuery, resourceFragment) => {
                                    // If file is a module type, use modules
                                    return [".module.sass", ".module.scss"]
                                        .map((ending)=>resourcePath.endsWith(ending)).some((value)=>value)
                                },
                                localIdentName: "[local]__[hash:base64:16]",
                            },
                        },
                    },
                    'postcss-loader',
                    "sass-loader",
                ],
            },
            {
                exclude: /node_modules/,
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "../manifest.json" },
                { from: "src/extension_icons", to: "../icons" }
            ],
        }),
        ...getHtmlPlugins(["popup", "pages"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        // roots: [__dirname, path.join(__dirname, "src")],
        alias: {
            '@': path.resolve(__dirname, 'src/')
        }
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "Paradigm",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}
