const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    https: true,
  },

  pages: {
    index: {
      entry: 'src/main.js',
      title: 'SearchW'
    }
  },

  chainWebpack: config => {
    config.plugin('define').tap(args => {
      Object.assign(args[0], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      });
      return args;
    });
  }
});