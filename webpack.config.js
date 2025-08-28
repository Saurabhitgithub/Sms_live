module.exports = {
    // other configurations
    module: {
      rules: [
        {
          test: /\.jsx?$/, // Match .js and .jsx files
          exclude: /node_modules/, // Exclude all node_modules
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.jsx?$/, // Match .js and .jsx files
          include: /node_modules\/@yaireo\/tagify/, // Include only this package
          use: {
            loader: 'babel-loader',
          },
        },
        // other rules...
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'], // Resolve both .js and .jsx files
    },
  };
  