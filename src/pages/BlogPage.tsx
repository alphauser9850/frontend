import React from 'react';
import { AuroraText } from '../components/magicui';
import Breadcrumbs from '../components/Breadcrumbs';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding MTU: Layer 2 vs Layer 3',
    category: 'Networking',
    image: '/blog/mtu-layer2-layer3.png',
    author: 'Saif Deshmukh, CCIE EI Instructor, ccielab.net',
    date: 'Jul 15, 2025',
    readTime: '7 min read',
    content: `The Maximum Transmission Unit (MTU) is a fundamental concept in networking that defines the largest size a packet can be for transmission over a network medium.\n\n**Layer 2 (Data Link Layer):**\n- MTU at Layer 2 refers to the maximum frame size that can be sent over a physical network segment (e.g., Ethernet default is 1500 bytes).\n- Layer 2 MTU includes the payload and Layer 2 headers, but not the preamble or FCS.\n\n**Layer 3 (Network Layer):**\n- MTU at Layer 3 refers to the maximum size of the IP packet (including headers) that can be transmitted without fragmentation.\n- If a Layer 3 packet exceeds the Layer 2 MTU, it must be fragmented or dropped, depending on the DF (Don't Fragment) bit.\n\n**Best Practices:**\n- Always ensure consistent MTU settings across network devices to avoid fragmentation and connectivity issues.\n- Use tools like 'ping' with the '-l' and '-f' flags to test MTU across a path.\n\nUnderstanding MTU at both Layer 2 and Layer 3 is crucial for optimizing network performance and troubleshooting issues.`
  },
  {
    id: 2,
    title: 'Cisco Modeling Labs (CML) Free Tier: What You Need to Know',
    category: 'Cisco',
    image: '/blog/cml-free-tier.png',
    author: 'Saif Deshmukh, CCIE EI Instructor, ccielab.net',
    date: 'Jul 15, 2025',
    readTime: '5 min read',
    content: `Cisco Modeling Labs (CML) now offers a free tier, making it easier than ever for network engineers and students to practice and learn.\n\n**Key Features of CML Free Tier:**\n- Access to a limited number of nodes for lab creation.\n- No cost for basic topologies and simulations.\n- Great for CCNA, CCNP, and CCIE practice labs.\n\n**How to Get Started:**\n1. Sign up for a Cisco account if you don't have one.\n2. Visit the CML Free Tier page and register.\n3. Download the CML client and start building your virtual labs.\n\n**Limitations:**\n- Node and feature limits compared to paid tiers.\n- Intended for learning and small-scale labs.\n\nThe CML Free Tier is a fantastic opportunity for anyone preparing for Cisco certifications or wanting hands-on experience with network simulation.`
  },
  {
    id: 3,
    title: 'Coming Soon: More Networking Insights',
    category: 'Announcement',
    image: '/blog/coming-soon.png',
    author: 'Saif Deshmukh, CCIE EI Instructor, ccielab.net',
    date: 'Jul 15, 2025',
    readTime: '2 min read',
    content: 'Stay tuned for more in-depth blogs on advanced networking topics, Cisco technologies, and hands-on lab guides!'
  }
];

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 bg-background text-foreground">
      <section className="container mx-auto px-4 md:px-8 lg:px-16">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Blog' }
        ]} />
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 mt-8">
          <AuroraText>Blog</AuroraText>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="w-full max-w-sm bg-card rounded-2xl shadow-md border border-border transition-transform hover:scale-105 hover:shadow-lg flex flex-col"
            >
              <div className="rounded-t-2xl overflow-hidden bg-muted flex items-center justify-center h-44">
                <img
                  src={post.image}
                  alt={`${post.title} - CCIE Enterprise Infrastructure Training Blog`}
                  className="object-contain h-32 w-32 mx-auto"
                  style={{ filter: 'var(--blog-img-filter, none)' }}
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  {post.category}
                </span>
                <h2 className="text-lg font-bold mb-2 text-foreground">
                  {post.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>{post.author}</span>
                  <span className="mx-1">•</span>
                  <span>{post.date}</span>
                  <span className="mx-1">—</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage; 