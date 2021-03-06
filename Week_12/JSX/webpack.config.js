module.exports = {
	entry: './src/main.js',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [
							[
								'@babel/plugin-transform-react-jsx',
								{ pragma: 'createElement' },
							],
						],
					},
				},
			},
		],
	},
	devServer: {
		contentBase: './dist',
	},
	// devtool: 'source-map',
}
