module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    backend: 'http://localhost:5000',
    //backend: 'http://localhost:5000', // for local dev
    wsbackend: 'ws://192.168.100.4',
    //wsbackend: 'ws://localhost' // for local dev
  },
}
