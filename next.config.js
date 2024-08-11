// next.config.js の更新
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://lh3.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com;; connect-src 'self' https://tokyoquest.onrender.com https://0.0.0.0:8000 https://maps.googleapis.com; frame-src 'self';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
        ],
      },
    ];
  },
  images: {
    domains: ['dummyimage.com', 'lh3.googleusercontent.com', 'maps.gstatic.com', 'maps.googleapis.com'],
  },
};

// next.config.js の更新
// module.exports = {
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: "default-src 'self'; script-src 'self' 'unsafe-eval' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://lh3.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com; connect-src 'self' https://tokyoquest.onrender.com https://0.0.0.0:8000 https://maps.googleapis.com; frame-src 'self';",
//           },
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff',
//           },
//           {
//             key: 'X-Frame-Options',
//             value: 'DENY',
//           },
//           {
//             key: 'X-XSS-Protection',
//             value: '1; mode=block',
//           },
//           {
//             key: 'Strict-Transport-Security',
//             value: 'max-age=63072000; includeSubDomains; preload',
//           },
//           {
//             key: 'Referrer-Policy',
//             value: 'no-referrer',
//           },
//         ],
//       },
//     ];
//   },
//   images: {
//     domains: ['dummyimage.com', 'lh3.googleusercontent.com', 'maps.gstatic.com', 'maps.googleapis.com'],
//   },
// };