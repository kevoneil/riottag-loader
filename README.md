
# This package has been deprecated.
Please check out the official Webpack Riot plugin [here](https://github.com/riot/tag-loader)

Thank you!

# riottag-loader
A webpack loader for Riot.js that gathers and compiles tags.

## Notice
This package is under development, I would be wary of using it in production!

If you run into issues, feel free to open an issue or pull request.

Thanks in advance!

## Installation
You can install this loader via NPM or Yarn

```
npm install riottag-loader
```
or
```
yarn add riottag-loader
```

## Usage

Head into your `webpack.config.js` file and add the following to the `loaders` array:

```
module: {
  loaders: [
    {
      test: /\.tag$/,
      exclude: /node_modules/,
      loader: 'riottag-loader',
    },
  ],
}
```
## Query

You can optionally send in queries/options:

```
module: {
  loaders: [
    {
      test: /\.tag$/,
      exclude: /node_modules/,
      loader: 'riottag-loader',
      query: {
        exclude: ['css']
      }
    },
  ],
}
```

**NOTE:** Webpack recommends that you load the `riottag-loader` before loading Babel. Non-Javascript transformations should be loaded first. To learn more, click [here](https://webpack.github.io/docs/loaders.html#cacheable).

## Credit
First of all thanks to [@esnunes](https://github.com/esnunes/) for writing the first riot loader (at least, the one that I used).

Credit also goes to the great people that bring you the [Riot](https://github.com/riot/riot) framework.

Tests were stolen and adapted for use with webpack, from this plugin: [rollup-plugin-riot](https://github.com/riot/rollup-plugin-riot)
