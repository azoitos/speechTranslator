
module.exports = {
  entry: './frontend/index.js',
  output: {
    path: __dirname + '/public', 
    filename: './bundle.js'
  },
  context: __dirname,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
	},
	node: {
		fs: 'empty'
	},
  module: {
    loaders: [
      {
        test: /js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};