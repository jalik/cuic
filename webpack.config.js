/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

const path = require("path");
const Package = require("./package.json");
const isProd = process.argv.indexOf("-p") !== -1;
const isHTTPS = process.argv.indexOf("--https") !== -1;
const filename = Package.name + "-aio" + (isProd ? ".min" : "");

module.exports = {
    entry: {
        bundle: path.join(__dirname, "src", `index.js`)
    },
    output: {
        libraryTarget: "umd",
        path: path.join(__dirname, "dist"),
        filename: `${filename}.js`
    },
    devServer: {
        hot: true,
        host: "0.0.0.0",
        port: isHTTPS ? 3443 : 3000,
        contentBase: path.join(__dirname, "docs"),
        publicPath: `/`,
        watchContentBase: true
    },
    resolve: {
        extensions: [".js"],
        modules: [path.join(__dirname, "src"), "node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "remove-comments-loader"
            }
        ]
    },
    plugins: []
};
