// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from 'path';
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WorkboxWebpackPlugin from "workbox-webpack-plugin";
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
const { HotModuleReplacementPlugin } = webpack;
import  {fileURLToPath}  from 'url';
import  _  from 'lodash';


const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';



const config = {
    entry: './assets/src/script.js',
    output: {
        path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
        filename: 'bundle.js',
        assetModuleFilename: '[hash].[ext][query]'
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/music/[name][ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new MiniCssExtractPlugin({ filename: 'assets/src/style.css'}),
        new HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets/', to: 'assets/' }
            ]
        }),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    stats: { errorDetails: true }
};

export default () => {
    if (isProduction) {
        config.mode = 'production';
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
        
    } else {
        config.mode = 'development';
    }

    return config;
};
