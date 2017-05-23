/**
 * Created by a123 on 16/12/19.
 */
const path = require("path");

module.exports = {
    entry: {
        'index': ['./index.css', './index.js'],
        'List':['./List/List.css','./List/List.js'],
        'Detail':['./List/Detail/Detail.css','./List/Detail/Detail.js'],
        'Order':['./Order/Order.css','./Order/Order.js'],
        'payAgain':['./Order/payAgain.css','./Order/payAgain.js'],
        'personalProfile':['./personalProfile/personalProfile.css','./personalProfile/personalProfile.js'],
        'DeliveryAddress':['./personalProfile/DeliveryAddress/DeliveryAddress.css','./personalProfile/DeliveryAddress/DeliveryAddress.js'],
        'NewAddress':['./personalProfile/DeliveryAddress/NewAddress/NewAddress.css','./personalProfile/DeliveryAddress/NewAddress/NewAddress.js'],
        'specialty':['./specialty/specialty.css','./specialty/specialty.js'],
        'specialtyDetail':['./specialty/specialtyDetail/specialtyDetail.css','./specialty/specialtyDetail/specialtyDetail.js'],
        'article':['./article/article.css','./article/article.js'],
        'orderDetail':['./orderDetail/orderDetail.css','./orderDetail/orderDetail.js'],
        'ChangeAddress':['./personalProfile//DeliveryAddress/ChangeAddress/ChangeAddress.css','./personalProfile//DeliveryAddress/ChangeAddress/ChangeAddress.js']
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].min.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel"
            },
            {
                test: /\.css$/,
                loader: "style!css?sourceMap"
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: "url?limit=10000"
            }
        ]
    },
    externals: {
        jquery: "window.$"
    },
    devtool: '#source-map'
};
