import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadingsProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  h1Text: string;
  h1ClassName?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'course' | 'organization';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  structuredData?: any;
}

/**
 * Enhanced SEOHeadings component with comprehensive meta tags, Open Graph, Twitter Cards,
 * and structured data for optimal search engine optimization
 */
const SEOHeadings: React.FC<SEOHeadingsProps> = ({
  title,
  description,
  canonicalUrl,
  h1Text,
  h1ClassName = "sr-only",
  keywords,
  image = "/ccielab.net logo.jpeg",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  structuredData
}) => {
  // Default structured data if none provided
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'course' ? 'Course' : 'WebPage',
    "name": h1Text,
    "headline": h1Text,
    "description": description,
    "url": canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": "CCIE LAB",
      "url": "https://www.ccielab.net",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.ccielab.net/ccielab.net logo.jpeg"
      }
    }
  };

  // Merge custom structured data with defaults
  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="CCIE LAB" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@ccielab" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={author || "CCIE LAB"} />
        {publishedTime && <meta property="article:published_time" content={publishedTime} />}
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        {section && <meta property="article:section" content={section} />}
        {tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
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