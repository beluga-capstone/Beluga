module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    backend: 'https://api.beluga.tacex.dev',
    //backend: 'http://localhost:5000', // for local dev
    wsbackend: 'ws://beluga.tacex.dev',
    //wsbackend: 'ws://localhost' // for local dev
  },
}
