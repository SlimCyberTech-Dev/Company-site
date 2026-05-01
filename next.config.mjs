/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
