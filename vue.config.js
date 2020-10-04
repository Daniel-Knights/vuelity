const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    outputDir: path.resolve(__dirname, './dist'),
    css: {
        extract: false,
        loaderOptions: {
            sass: {
                additionalData: `
                    @import "@/sass/_variables.scss";
                    @import "@/sass/_mixins.scss";
                `,
            },
        },
    },
    configureWebpack: {
        plugins: [new BundleAnalyzerPlugin()],
    },
};
