const {merge} = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(commonConfig, {
	mode: 'production',
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css' 
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				loader: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.scss$/,
				loader: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
		]
	},
	optimization: {
		minimizer: [
			new TerserPlugin(),
			new CssMinimizerPlugin()
		]
	}
});