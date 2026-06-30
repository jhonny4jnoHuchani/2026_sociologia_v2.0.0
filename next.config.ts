/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  // Ignorar errores de ESLint durante el build de producción
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'archivosminio.upea.bo',
        pathname: '/archivospaginasnode/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24, 
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",

              // Scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com",

              // Estilos
              "style-src 'self' 'unsafe-inline'",

              // Imágenes
              "img-src 'self' data: blob: https://archivosminio.upea.bo https://img.youtube.com https://i.ytimg.com https://*.tile.openstreetmap.org",

              // Fuentes
              "font-src 'self'",

              // Peticiones fetch/axios — API backend + Nominatim + Iconify + OSM tiles + PDFs
              "connect-src 'self' https://apiadministrador.upea.bo https://nominatim.openstreetmap.org https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com https://*.tile.openstreetmap.org https://archivosminio.upea.bo",

              // Iframes - OpenStreetMap, Google Maps, YouTube + PDFs de gacetas
              "frame-src 'self' https://www.openstreetmap.org https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com https://archivosminio.upea.bo",

              // Workers
              "worker-src blob: 'self'",

              // Anti-Clickjacking
              "frame-ancestors 'none'",
            ].join('; '),
          },

          // Anti-Clickjacking cabecera dedicada
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          // MIME-sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig