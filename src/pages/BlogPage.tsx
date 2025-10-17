import React from 'react';
import { AuroraText } from '../components/magicui';
import Breadcrumbs from '../components/Breadcrumbs';
// import SEOHeadings from '../components/SEOHeadings';
import { Link } from 'react-router-dom';
const blogPosts = [
  {
    id: 1,
    slug: 'understanding-mtu-layer2-vs-layer3',
    title: 'Understanding MTU: Layer 2 vs Layer 3',
    category: 'Networking',
    image: '/mtu-layer2-layer3.png',
    author: 'Saif Deshmukh, CCIE EI Instructor, ccielab.net',
    date: 'Jul 15, 2025',
    readTime: '7 min read',
    content: `The Maximum Transmission Unit (MTU) is a fundamental concept in networking that defines the largest size a packet can be for transmission over a network medium.\n\n**Layer 2 (Data Link Layer):**\n- MTU at Layer 2 refers to the maximum frame size that can be sent over a physical network segment (e.g., Ethernet default is 1500 bytes).\n- Layer 2 MTU includes the payload and Layer 2 headers, but not the preamble or FCS.\n\n**Layer 3 (Network Layer):**\n- MTU at Layer 3 refers to the maximum size of the IP packet (including headers) that can be transmitted without fragmentation.\n- If a Layer 3 packet exceeds the Layer 2 MTU, it must be fragmented or dropped, depending on the DF (Don't Fragment) bit.\n\n**Best Practices:**\n- Always ensure consistent MTU settings across network devices to avoid fragmentation and connectivity issues.\n- Use tools like 'ping' with the '-l' and '-f' flags to test MTU across a path.\n\nUnderstanding MTU at both Layer 2 and Layer 3 is crucial for optimizing network performance and troubleshooting issues.`
  },
  {
    id: 2,
    slug: 'cisco-modeling-labs-cml-free-tier',
    title: 'Cisco Modeling Labs (CML) Free Tier: What You Need to Know',
    category: 'Cisco',
    image: '/cml-free-tier.png',
    author: 'Saif Deshmukh, CCIE EI Instructor, ccielab.net',
    date: 'Jul 15, 2025',
    readTime: '5 min read',
    content: `Cisco Modeling Labs (CML) now offers a free tier, making it easier than ever for network engineers and students to practice and learn.\n\n**Key Features of CML Free Tier:**\n- Access to a limited number of nodes for lab creation.\n- No cost for basic topologies and simulations.\n- Great for CCNA, CCNP, and CCIE practice labs.\n\n**How to Get Started:**\n1. Sign up for a Cisco account if you don't have one.\n2. Visit the CML Free Tier page and register.\n3. Download the CML client and start building your virtual labs.\n\n**Limitations:**\n- Node and feature limits compared to paid tiers.\n- Intended for learning and small-scale labs.\n\nThe CML Free Tier is a fantastic opportunity for anyone preparing for Cisco certifications or wanting hands-on experience with network simulation.`
  },
  {
    id: 3,
    slug: 'coming-soon-more-networking-insights',
    title: 'Coming Soon: More Networking Insights',
    category: 'Announcement',
    image: '/coming-soon.png',
    author: 'Saif Deshmukh, CCIE EI Instructor, ccielab.net',
    date: 'Jul 15, 2025',
    readTime: '2 min read',
    content: 'Stay tuned for more in-depth blogs on advanced networking topics, Cisco technologies, and hands-on lab guides!'
  }
];

const BlogPage: React.FC = () => {
  return (
    <>
      <div className='container mx-auto px-4'>
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Blogs' }
        ]} />
      </div>
      <div className="min-h-screen pt-20 bg-background text-foreground pb-20">
        {/* SEO Optimized Headings */}
        {/* <SEOHeadings
          title="CCIE Training Blog | Networking Insights & Cisco Technologies"
          description="Expert insights on CCIE training, networking technologies, Cisco certifications, and hands-on lab guides from certified CCIE instructors."
          canonicalUrl="https://www.ccielab.net/blog"
          h1Text="CCIE Training Blog"
          h1ClassName="text-4xl md:text-5xl font-bold text-center mb-10"
        /> */}

        <section className="container mx-auto px-4 md:px-8 lg:px-16">

          
            <AuroraText as="h1" fontClass='blogTitle text-4xl md:text-5xl font-bold text-center mb-10'>Blogs</AuroraText> 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {blogPosts.map((post) => (
              <Link
                to={`/blog/${post.slug}`}
                key={post.id}
                className="w-full max-w-sm bg-card rounded-2xl shadow-md border border-border transition-transform hover:scale-105 hover:shadow-lg flex flex-col cursor-pointer"
              >
                <div className="rounded-t-2xl overflow-hidden bg-muted flex items-center justify-center h-44">
                  <img
                    src={post.image}
                    alt={`${post.title} - CCIE Enterprise Infrastructure Training Blog`}
                    className="object-cover object-top"
                    style={{ filter: 'var(--blog-img-filter, none)' }}
                  />
                </div>
                <div className="flex flex-col flex-1 blogDesc p-6">
                  <span className="categotyBadge inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2">
                    {post.category}
                  </span>
                  <div className="dFlex postMeta pb-6">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span className='readBadge'>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage; 