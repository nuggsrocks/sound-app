const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/js/index.js',
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
				test: /\.(jpe?g|png|gif|mp3|wav)/,
				loader: 'file-loader'
			}
			]
		},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/html/index.html',
			filename: 'index.html',
			meta: {
				charset: 'utf-8',
				viewport: 'width=device-width,initial-scale=1.0'
			}
		})
	]
}