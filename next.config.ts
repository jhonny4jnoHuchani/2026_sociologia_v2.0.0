const nextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'archivosminio.upea.bo',
        pathname: '/archivospaginasnode/**',  // permite cualquier ruta bajo ese path
      },
    ],
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

              // Estilos
              "style-src 'self' 'unsafe-inline'",

              // Imágenes — incluye el CDN de archivos
              "img-src 'self' data: blob: https://archivosminio.upea.bo",

              // Fuentes
              "font-src 'self'",

              // Peticiones fetch/axios — API backend + Nominatim
              "connect-src 'self' https://apiadministrador.upea.bo https://nominatim.openstreetmap.org",

              // Iframes — mapa de OpenStreetMap/Leaflet + Google Maps
              "frame-src 'self' https://www.openstreetmap.org https://www.google.com",

              // Tiles de Leaflet
              "worker-src blob:",

              // Anti-Clickjacking dentro del CSP
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