export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://slimcybertech.com/#organization",
    name: "SlimCyberTech",
    url: "https://slimcybertech.com",
    logo: {
      "@type": "ImageObject",
      url: "https://slimcybertech.com/logo.png",
      width: 400,
      height: 400,
    },
    description:
      "SlimCyberTech is a software engineering company based in West Nile, Uganda, specializing in custom software development, mobile apps, cybersecurity, and tech consulting.",
    foundingDate: "2020",
    founders: [{ "@type": "Person", name: "SlimCyberTech Team" }],
    address: {
      "@type": "PostalAddress",
      addressLocality: "West Nile",
      addressCountry: "UG",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "info@slimcybertech.com",
        availableLanguage: ["English"],
      },
    ],
    sameAs: [
      "https://whatsapp.com/channel/0029Vb8BAyd0G0XYpCcddb3o",
      "https://www.instagram.com/slimcybertech?igsh=ZzRscWRlNWlvdjZk",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://slimcybertech.com/#website",
    url: "https://slimcybertech.com",
    name: "SlimCyberTech",
    description: "Building the Future With Code",
    publisher: {
      "@id": "https://slimcybertech.com/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://slimcybertech.com/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://slimcybertech.com/#localbusiness",
    name: "SlimCyberTech",
    image: "https://slimcybertech.com/og-image.png",
    url: "https://slimcybertech.com",
    telephone: "+256700000000",
    email: "info@slimcybertech.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "West Nile",
      addressLocality: "West Nile",
      addressRegion: "Northern Region",
      addressCountry: "UG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 0.3136,
      longitude: 32.5811,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$",
    currenciesAccepted: "UGX, USD",
    paymentAccepted: "Cash, Bank Transfer, Mobile Money",
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Software Development",
    provider: {
      "@id": "https://slimcybertech.com/#organization",
    },
    areaServed: {
      "@type": "Place",
      name: "Africa",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "SlimCyberTech Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Software Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile App Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cybersecurity Consulting" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Data Analysis" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cloud & DevOps Engineering" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX Design" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Technology Consulting" } },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
