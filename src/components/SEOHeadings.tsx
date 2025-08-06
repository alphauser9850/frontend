import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadingsProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  h1Text: string;
  h1ClassName?: string;
}

/**
 * SEOHeadings component ensures proper H1 tag implementation for SEO
 * This component renders both a visible H1 tag and injects it into the document head
 * for better search engine crawling and indexing
 */
const SEOHeadings: React.FC<SEOHeadingsProps> = ({
  title,
  description,
  canonicalUrl,
  h1Text,
  h1ClassName = "sr-only"
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {/* Inject H1 into document head for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": h1Text,
            "headline": h1Text,
            "description": description
          })}
        </script>
      </Helmet>
      
      {/* Visible H1 tag for screen readers and SEO */}
      <h1 className={h1ClassName}>
        {h1Text}
      </h1>
    </>
  );
};

export default SEOHeadings; 