import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const useHttps = process.env.HTTPS === '1' || process.env.HTTPS === 'true';
const hasCert = process.env.SSL_CERT && process.env.SSL_KEY;
const httpsOptions = useHttps && hasCert ? {
  cert: fs.readFileSync(process.env.SSL_CERT),
  key: fs.readFileSync(process.env.SSL_KEY)
} : undefined;

const publicDir = path.resolve(__dirname, 'public');
const peerConfigPath = path.resolve(__dirname, '../../../peercompute/public/peer-config.json');

export default {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    static: [
      { directory: publicDir },
      { directory: path.resolve(__dirname, '../../../peercompute/public') },
    ],
    host: '0.0.0.0',
    allowedHosts: 'all',
    compress: true,
    port: 5180,
    server: useHttps ? { type: 'https', options: httpsOptions } : 'http',
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      process: 'process/browser',
      url: false,
      fs: false,
      path: false,
      os: false
    },
    alias: {
      process: 'process/browser',
      '@peercompute': path.resolve(__dirname, '../../../peercompute/src/peercompute')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: publicDir, to: '', noErrorOnMissing: true },
        { from: peerConfigPath, to: 'peer-config.json', noErrorOnMissing: true }
      ],
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
