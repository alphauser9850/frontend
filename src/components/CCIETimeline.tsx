"use client";

import React from "react";
import { BookOpen, Award, Code, Clock, Lightbulb, Workflow, Laptop, Zap, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { BorderBeamWrapper } from "./ui/BorderBeamWrapper";

// Define the timeline steps with enhanced details
const timelineSteps = [
  {
    id: 1,
    title: "ENCOR Exam",
    description: "Pass the 350-401 ENCOR written exam",
    duration: "2-3 months",
    hours: "~220 hours",
    details: "Study core enterprise technologies including architecture, virtualization, infrastructure, and automation.",
    icon: <BookOpen className="h-4 w-4 text-primary" />,
    checkText: "Required for CCNP Enterprise",
    beamColor: "blue"
  },
  {
    id: 2,
    title: "Technology Labs",
    description: "Daily practice sessions over 90 days",
    duration: "3 months",
    hours: "180+ hours",
    details: "Hands-on practice with routing protocols, switching, security, and automation.",
    icon: <Laptop className="h-4 w-4 text-primary" />,
    checkText: "Builds hands-on expertise",
    beamColor: "purple"
  },
  {
    id: 3,
    title: "Advanced Topics",
    description: "Master SD-WAN, SDA, and programmability",
    duration: "1-2 months",
    hours: "120+ hours",
    details: "Deep dive into Software-Defined Networking and automation.",
    icon: <Workflow className="h-4 w-4 text-primary" />,
    checkText: "Develops modern skills",
    beamColor: "green"
  },
  {
    id: 4,
    title: "Bootcamp",
    description: "Intensive training with expert instructors",
    duration: "9 days",
    hours: "100+ hours",
    details: "Focused preparation covering complex scenarios and design challenges.",
    icon: <Zap className="h-4 w-4 text-primary" />,
    checkText: "Expert-led preparation",
    beamColor: "yellow"
  },
  {
    id: 5,
    title: "Mock Exams",
    description: "Practice with timed lab scenarios",
    duration: "2-3 weeks",
    hours: "40+ hours",
    details: "Complete full-length practice exams under realistic conditions.",
    icon: <Code className="h-4 w-4 text-primary" />,
    checkText: "Final preparation",
    beamColor: "indigo"
  },
  {
    id: 6,
    title: "CCIE Lab Exam",
    description: "Pass the 8-hour hands-on lab exam",
    duration: "8 hours",
    hours: "Final exam",
    details: "Demonstrate expert-level skills in complex enterprise networks.",
    icon: <Award className="h-4 w-4 text-primary" />,
    checkText: "Achieve CCIE certification",
    beamColor: "pink"
  },
];

export function CCIETimeline() {
  return (
    <div className="relative w-full py-4">
      <div className="max-w-3xl mx-auto px-4">
        {/* Main timeline container */}
        <div className="relative">
          {/* Enhanced continuous vertical line with animated gradient */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-primary/70 to-primary animate-pulse"></div>
          
          {/* Timeline steps */}
          <div className="space-y-10">
            {timelineSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step number circle - centered on the line with pulsing effect */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary z-20 shadow-md">
                  <span className="text-primary font-bold text-xs">{step.id}</span>
                </div>
                
                {/* Connecting lines from center to card */}
                <div className={cn(
                  "hidden md:block absolute top-0 h-0.5 bg-gradient-to-r from-primary to-transparent z-10",
                  step.id % 2 === 0 ? "left-1/2 w-[calc(50%-16px)]" : "right-1/2 w-[calc(50%-16px)]"
                )}></div>
                
                {/* Content container - alternating left and right */}
                <BorderBeamWrapper 
                  beamColor={step.beamColor as any}
                  duration={8 + index} // Stagger the animations
                  className={cn(
                    "w-full md:w-[calc(50%-30px)]",
                    step.id % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                  )}
                >
                  <div className="bg-background border border-border rounded-lg p-3 shadow-sm">
                    <div className="flex flex-col">
                      {/* Header with icon */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {step.icon}
                        </div>
                        <div>
                          <h4 className="text-base font-bold">{step.title}</h4>
                          <p className="text-muted-foreground text-xs">{step.description}</p>
                        </div>
                      </div>
                      
                      {/* Time information */}
                      <div className="flex flex-wrap gap-3 mb-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="font-medium text-muted-foreground">{step.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Lightbulb className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                          <span className="font-medium text-muted-foreground">{step.hours}</span>
                        </div>
                      </div>
                      
                      {/* Details */}
                      <p className="text-xs text-muted-foreground mb-2">{step.details}</p>
                      
                      {/* Check text */}
                      {step.checkText && (
                        <div className="flex items-center gap-1 mt-auto">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs font-medium text-green-600 dark:text-green-500">{step.checkText}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </BorderBeamWrapper>
                
                {/* Additional visual indicators - dots along the timeline */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-3 h-3 rounded-full bg-primary/30 blur-sm"></div>
              </div>
            ))}
            
            {/* Final achievement indicator */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-4 h-4 rounded-full bg-primary shadow-md shadow-primary/50 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 