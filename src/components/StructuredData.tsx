import { getCanonicalOrigin } from '@/lib/metadata';

export function StructuredData() {
  const baseUrl = getCanonicalOrigin();
  
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "DORVIA EUROP",
        "parentOrganization": {
          "@type": "Organization",
          "name": "NAVAN"
        },
        "url": baseUrl,
        "logo": `${baseUrl}/images/logo/dorvia-logo-primary-transparent-3000.png`,
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+40 727 348 009",
            "contactType": "customer service"
          }
        ],
        "email": "ontrip.ai@gmail.com"
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "DORVIA EUROP",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
