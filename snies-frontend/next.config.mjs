const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    // Standalone solo para producción
    ...(process.env.NODE_ENV === 'production' && {
        output: 'standalone',
        productionBrowserSourceMaps: false,
    }),
};
export default nextConfig;
