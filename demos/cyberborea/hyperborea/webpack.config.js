import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultCertPath = path.resolve(__dirname, '../../../peercompute/certs/dev.crt');
const defaultKeyPath = path.resolve(__dirname, '../../../peercompute/certs/dev.key');

// Default to HTTPS if certs exist; allow env override
const envHttps = process.env.HTTPS;
const useHttps = envHttps ? (envHttps === '1' || envHttps === 'true') : true;

const certPath = process.env.SSL_CERT || (fs.existsSync(defaultCertPath) ? defaultCertPath : undefined);
const keyPath = process.env.SSL_KEY || (fs.existsSync(defaultKeyPath) ? defaultKeyPath : undefined);
const hasCert = certPath && keyPath;

const httpsOptions = useHttps && hasCert ? {
  cert: fs.readFileSync(certPath),
  key: fs.readFileSync(keyPath)
} : undefined;

const publicDir = path.resolve(__dirname, 'public');
const relayConfigPath = path.resolve(__dirname, '../../../peercompute/public/relay-config.json');

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
    server: useHttps && httpsOptions ? { type: 'https', options: httpsOptions } : 'http',
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
        { from: relayConfigPath, to: 'relay-config.json', noErrorOnMissing: true }
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
