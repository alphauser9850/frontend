import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Breadcrumbs from '../components/Breadcrumbs';
// Mock blog data
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
        content: `
  <p>The Maximum Transmission Unit (MTU) is a fundamental concept in computer networking. It defines the largest size a packet can be for transmission over a specific network medium. Proper MTU configuration ensures efficient data transfer, avoids fragmentation, and helps maintain optimal network performance.</p>

  <h2>What Is MTU?</h2>
  <p>MTU determines the maximum amount of data that can be transmitted in a single network-layer or data-link-layer frame. It plays a key role in both Layer 2 (Data Link Layer) and Layer 3 (Network Layer) of the OSI model.</p>

  <h2>MTU at Layer 2 (Data Link Layer)</h2>
  <p>At the Data Link Layer, MTU refers to the maximum frame size that can be transmitted over a physical network segment such as Ethernet.</p>

  <h3>Key Characteristics:</h3>
  <ul>
    <li><strong>Default Ethernet MTU:</strong> 1500 bytes</li>
    <li><strong>Includes:</strong> Payload and Layer 2 headers</li>
    <li><strong>Excludes:</strong> Preamble and Frame Check Sequence (FCS)</li>
  </ul>

  <p>If the Layer 2 MTU is exceeded, frames may be dropped or require fragmentation (depending on the protocol stack).</p>

  <h2>MTU at Layer 3 (Network Layer)</h2>
  <p>At the Network Layer, MTU refers to the maximum size of an IP packet (including headers) that can be transmitted over the network without requiring fragmentation.</p>

  <h3>Important Considerations:</h3>
  <ul>
    <li><strong>Includes:</strong> Entire IP packet (headers + data)</li>
    <li><strong>Fragmentation:</strong> If a packet exceeds the MTU, it must be fragmented or dropped, depending on whether the <code>DF</code> (Don't Fragment) flag is set.</li>
    <li><strong>Path MTU:</strong> The smallest MTU value along a network path. Path MTU Discovery (PMTUD) can be used to find it dynamically.</li>
  </ul>

  <h2>Why MTU Matters</h2>
  <p>Misconfigured MTU settings can lead to various network issues, including packet loss, latency, and failed connections. It is particularly critical in VPNs, tunnels, and networks with diverse device types.</p>

  <h2>Best Practices for Managing MTU</h2>
  <ul>
    <li>Ensure consistent MTU settings across all network devices (routers, switches, firewalls, etc.).</li>
    <li>Avoid overly small MTUs unless required by specific applications.</li>
    <li>Use tools like <code>ping</code> with <code>-f</code> (Don't Fragment) and <code>-l</code> (packet size) flags to test effective MTU.</li>
    <li>Implement Path MTU Discovery where applicable.</li>
    <li>Monitor for fragmentation and performance bottlenecks using network analysis tools.</li>
  </ul>

  <h2>Testing MTU Using Ping (Example)</h2>
  <p>You can test the MTU across a path using the <code>ping</code> command with specific flags:</p>

  <pre><code>ping -f -l 1472 example.com</code></pre>

  <p>In this example, 1472 bytes + 28 bytes of ICMP/IP headers = 1500 bytes. If the ping is successful without fragmentation, the MTU is sufficient.</p>

  <h2>Conclusion</h2>
  <p>Understanding and configuring MTU correctly is essential for a smooth and efficient network. Whether at Layer 2 or Layer 3, mismatched or misconfigured MTUs can cause avoidable problems. Regular testing, monitoring, and adherence to best practices will help ensure your network remains robust and high-performing.</p>`
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


function BlogDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState(blogPosts.find(p => p.slug === slug) || blogPosts[0]);

    const sanitizedContent = DOMPurify.sanitize(post.content);


    return (
        <div className="min-h-screen  bg-background">
            <div className='container mx-auto px-4'>
                <Breadcrumbs items={[
                    { label: 'Home', href: '/' },
                    { label: 'Blogs', href: '/blog' },
                    { label: post.title, }
                ]} />
            </div>

            <div className="blogWrapper">
                <div className="blogInner">


                    {/* Main Content */}
                    <div className="blogContent">
                        <h1>{post.title}</h1>
                        <div className="dFlex postMeta pb-6">
                            <span>{post.author}</span>
                            <span>{post.date}</span>
                        </div>
                        <div className="featuredImg">
                            <img
                                src={post.image}
                                alt={post.title}
                                className=""
                            />
                        </div>

                        <div className="flex items-center justify-between  postMeta text-xs text-muted-foreground  ">
                            <span className="categotyBadge inline-block bg-primary/10 text-primary px-3  rounded-full text-xs font-semibold mb-2">
                                {post.category}
                            </span>
                            <span className='readBadge'>{post.readTime}</span>
                        </div>


                        {/* Article Content */}
                        <div className="">
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                            />
                        </div>


                    </div>


                </div>
            </div>
        </div>
    );
}

export default BlogDetailPage;