const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

const dotenv = require('dotenv').config({
    path: path.join(__dirname, 'build.env')
});

const env = dotenv.parsed;
if (env===undefined) 
    throw Error("Environment file not found (build.env)")

console.log(env)

module.exports = {
    entry: {
        popup: "./src/popup/index.tsx",
        pages: "./src/pages/index.tsx",
        content: "./src/injection/index.tsx"
    },
    mode: env.DEVELOPMENT??true ? "development" : "production",
    // Required because chrome extensions can't use "eval"
    // Most fast build source maps unfortunately use "eval"
    devtool: env.DEVELOPMENT??true ? 'cheap-source-map' : undefined, 
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
                    env.DEVELOPMENT??true ? "style-loader" : MiniCssExtractPlugin.loader,
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
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            },
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
        filename: "[name].bundle.js",
    },
    optimization: env.DEVELOPMENT??true ? {} : {
        splitChunks: {
            chunks: 'all',
        }
    }
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
