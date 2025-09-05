import React from "react";
import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";
import { Server, Users, BookOpen, HelpCircle, ProjectorIcon, Disc2, Book, ComputerIcon } from "lucide-react";
import { AuroraText,Particles, ShineBorder } from "../components/magicui";
import { Accordion, AccordionItem } from "../components/ui/Accordion";
import AccordionTrigger from "../components/ui/Accordion";
import AccordionContent from "../components/ui/Accordion";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import SEOHeadings from "../components/SEOHeadings";

const CCNAPage: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* SEO Optimized Headings */}
      <SEOHeadings
        title="CCNA Certification Training | CCIELab.Net - Cisco Networking Fundamentals"
        description="Master networking fundamentals and prepare for the CCNA certification with our comprehensive course. Learn from expert instructors with hands-on labs and real-world scenarios."
        canonicalUrl="https://www.ccielab.net/courses/ccna"
        h1Text="CCNA Certification Training"
        h1ClassName="sr-only"
        keywords="CCNA training, CCNA certification, Cisco networking, networking fundamentals, Cisco training, networking certification"
        image="/ccna.jpg"
        type="course"
        section="CCNA Training"
        tags={["CCNA", "Cisco", "Networking", "Certification", "Training", "Fundamentals"]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "CCNA Certification Training",
          "description": "Master networking fundamentals and prepare for the CCNA certification with our comprehensive course.",
          "url": "https://www.ccielab.net/courses/ccna",
          "provider": {
            "@type": "Organization",
            "name": "CCIE LAB",
            "url": "https://www.ccielab.net"
          },
          "courseMode": "online",
          "educationalLevel": "beginner",
          "inLanguage": "en-US"
        }}
      />

       <Particles
              className="absolute inset-0 z-10"
              quantity={100}
              staticity={30}
              color={isDarkMode ? "#6366f1" : "#4f46e5"}
              size={isDarkMode ? 0.6 : 0.5}
            />
      {/* Background */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          isDarkMode ? "bg-black" : "bg-gradient-to-b from-primary-50 to-gray-50"
        )}
      ></div>

      {/* Hero Section */}
      <div className="relative z-20 text-center px-4 py-32">

        
        <div className="mb-6 text-center">
          <h1
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            <AuroraText>CCNA </AuroraText> Certification
          </h1>
        </div>

       

        <p
          className={cn(
            "max-w-2xl mx-auto text-lg",
            isDarkMode ? "text-white/70" : "text-gray-600"
          )}
        >
          Master networking fundamentals and prepare for the CCNA certification with our comprehensive course.
        </p><br/>
        
       {/*} <p
          className={cn(
            "max-w-2xl mx-auto text-lg",
            isDarkMode ? "text-white/70" : "text-gray-600"
          )}>
         <ul className="space-y-3 text-gray-300 text-base align-center">
              {[
                "100% Beginner Friendly",
                "Includes Labs & Practice Tests",
                "Covers Latest Cisco Syllabus",
                "Get Certified Faster with Expert Mentorship",
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 mt-1 animate-pulse" size={20} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
        </p>*/}
           
      </div>

      {/* Course Highlights */}
      <section className="relative z-20 py-20  dark:bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Why Join This Course?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Live & Recorded Classes",
                description: "Learn through expert-led live sessions and access recorded content anytime.",
                icon: <Users className="h-8 w-8 text-primary" />,
              },
              {
                title: "Hands-On Labs",
                description: "Practice with real-world scenarios using our virtual lab environment.",
                icon: <Server className="h-8 w-8 text-primary" />,
              },
              {
                title: "Career Guidance",
                description: "Get mentorship and career support to excel in networking roles.",
                icon: <HelpCircle className="h-8 w-8 text-primary" />,
              },
              {
                title: "Real Time Projects",
                description: "Get mentorship and career support to excel in networking roles.",
                icon: <Disc2 className="h-8 w-8 text-primary" />,
              },
              {
                title: "Teachings From Experts",
                description: "Get mentorship and career support to excel in networking roles.",
                icon: <Book className="h-8 w-8 text-primary" />,
              },
              {
                title: "Job Assistance",
                description: "Get mentorship and career support to excel in networking roles.",
                icon: <ComputerIcon className="h-8 w-8 text-primary" />,
              },
            ].map((highlight, i) => (
              <div
                key={i}
                className=" dark:bg-gray-900 p-6 rounded-2xl shadow-xl border  dark:border-gray-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  {highlight.icon}
                  <h3 className="text-xl font-semibold">{highlight.title}</h3>
                </div>
                <p className="text-gray-300 dark:text-gray-300">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  
     

{/* Curriculum Grid  */}
<section className="relative z-20 py-20 bg-black">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-4xl font-bold text-primary text-center mb-12">Course Curriculum</h2>

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Networking Fundamentals & OSI Model", progress: 20 },
          { title: "IP Addressing and Subnetting", progress: 40 },
          { title: "Routing Protocols (RIP, OSPF, EIGRP)", progress: 60 },
          { title: "Switching & VLANs", progress: 70 },
          { title: "ACLs, NAT & DHCP", progress: 85 },
          { title: "Network Security & Troubleshooting", progress: 100 },
        ].map((mod, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 text-white p-6 rounded-2xl relative shadow-xl border-2 border-transparent animate-border-glow"
          >
            <h3 className="text-xl font-bold mb-2">Module {idx + 1}</h3>
            <p className="mb-4 text-gray-300">{mod.title}</p>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${mod.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{mod.progress}% Complete</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
</section>




      {/* Success Stories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Success Stories
            </span>
            <h2 className="text-4xl font-bold mb-4">
              <AuroraText>Our Students' Achievements</AuroraText>
            </h2>
            <p className="text-muted-foreground">
              Hear from our successful CCNA candidates who have achieved their goals with our training program.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Michael Chen",
                role: "Network Engineer",
                quote: "The labs and practice scenarios were instrumental in my exam success. I passed on my first attempt!",
              },
              {
                name: "Jessica Patel",
                role: "IT Specialist",
                quote: "The depth of content and instructor support made all the difference. Highly recommended!",
              },
            ].map((story, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold">{story.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{story.role}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-4 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Frequently Asked Questions
            </span>
            <h2 className="text-4xl font-bold mb-4">
              <AuroraText>Have Questions? We’ve Got Answers</AuroraText>
            </h2>
            <p className="text-muted-foreground">
              Find answers to the most common questions about our CCNA program.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion>
              <AccordionItem title="Is this course suitable for beginners?">
                <AccordionTrigger>Is this course suitable for beginners?</AccordionTrigger>
                <AccordionContent>
                  Yes! It starts from scratch and progresses to advanced topics.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem title={""}>
                <AccordionTrigger>Do I get a certificate?</AccordionTrigger>
                <AccordionContent>
                  Yes. Upon completion, you receive a certificate of completion + CCNA prep guidance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem title={""}>
                <AccordionTrigger>When will the course be available?</AccordionTrigger>
                <AccordionContent>
                  We are launching soon. You can join the waitlist or follow us for updates.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-20 py-16 text-center bg-primary text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Join the Waitlist</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Be the first to know when we go live. Gain access to early-bird discounts, free trials, and more.
        </p>
        <a
          href="/waitlist"
          className="inline-block px-6 py-3 rounded-lg bg-white text-primary font-semibold shadow hover:bg-gray-100 transition"
        >
          Join Now
        </a>
      </section>
    </div>
  );
};

export default CCNAPage;
