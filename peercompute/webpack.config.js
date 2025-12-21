import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const useHttps = process.env.HTTPS === '1' || process.env.HTTPS === 'true';
const devHost = process.env.DEV_HOST || '0.0.0.0';
const httpsOptions = useHttps && process.env.SSL_CERT && process.env.SSL_KEY ? {
  cert: fs.readFileSync(process.env.SSL_CERT),
  key: fs.readFileSync(process.env.SSL_KEY)
} : undefined;

export default {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'public'),
      },
      {
        directory: path.join(__dirname, 'games'),
        publicPath: '/games',
      }
    ],
    host: devHost,
    allowedHosts: 'all',
    compress: true,
    port: 5173, // Keep same port as Vite for convenience
    server: useHttps ? { type: 'https', options: httpsOptions } : 'http',
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    fallback: {
      "buffer": "buffer",
      "crypto": "crypto-browserify",
      "stream": "stream-browserify",
      "assert": "assert",
      "process": "process/browser",
      "url": false,
      "fs": false,
      "path": false,
      "os": false
    },
    alias: {
      process: "process/browser"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' }, // Copy public assets to root of dist
        // Also copy test files if they exist and are needed
        { from: 'test-p2p.html', to: 'test-p2p.html', noErrorOnMissing: true },
        { from: 'test-automated.html', to: 'test-automated.html', noErrorOnMissing: true },
        { from: 'games', to: 'games', noErrorOnMissing: true }
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
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true
  }
};
