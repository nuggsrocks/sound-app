const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = env => {

	let envBasePath = __dirname + '/.env';

	let environment = env.ENVIRONMENT;

	let envFilePath = `${envBasePath}.${environment}`;

	let envFile = dotenv.config({path: envFilePath}).parsed;

	let envDefinitions = {};

	for (let i = 0; i < Object.keys(envFile).length; i++) {
		envDefinitions['process.env.' + Object.keys(envFile)[i]] = JSON.stringify(Object.values(envFile)[i]);
	}

	return {
		mode: 'development',
		entry: './js/index.js',
		output: {
			path: __dirname + '/public',
			filename: 'bundle.js'
		},
		module: {
			rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.css$/,
				loader: ['style-loader', 'css-loader']
			},
			{
				test: /\.scss$/,
				loader: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.(jpe?g|png|gif|wav)/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
			}
			]
		},
		devtool: 'source-map',
		target: 'web',
		watch: true,
		plugins: [
			new HtmlWebpackPlugin({
				template: 'index.html',
				filename: 'index.html',
				title: 'Webpack Project',
				meta: {
					charset: 'utf-8',
					viewport: 'width=device-width,initial-scale=1.0'
				}
			}),
			new webpack.DefinePlugin(envDefinitions)
		]
	}
}