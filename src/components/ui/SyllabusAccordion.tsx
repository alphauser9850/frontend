import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../store/themeStore';
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

// Define types for SubSection
interface SubSectionItem {
  title: string;
  items: (string | SubSectionItem)[];
}

interface SubSectionProps {
  title: string;
  items?: (string | SubSectionItem)[];
  level?: number;
}

const SubSection = ({ title, items, level = 0 }: SubSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useThemeStore();

  const paddingLeft = `${level * 1.5}rem`;

  const themeClasses = {
    button: isDarkMode
      ? 'hover:bg-gray-800 text-gray-200'
      : 'hover:bg-gray-50 text-gray-700',
    title: isDarkMode
      ? level === 0 ? 'font-semibold text-white' : 'font-medium text-gray-300'
      : level === 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-700',
    icon: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    text: isDarkMode ? 'text-gray-400' : 'text-gray-600'
  };

  const hasNestedItems = items && items.length > 0;

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 w-full text-left p-2 rounded transition-colors",
          themeClasses.button
        )}
        style={{ paddingLeft }}
      >
        {hasNestedItems ? (
          isOpen ? (
            <ChevronDown className={cn("h-4 w-4 flex-shrink-0", themeClasses.icon)} />
          ) : (
            <ChevronRight className={cn("h-4 w-4 flex-shrink-0", themeClasses.icon)} />
          )
        ) : (
          <div className="w-4 h-4 flex-shrink-0" /> // Spacer for alignment when no chevron
        )}
        <span className={themeClasses.title}>
          {title}
        </span>
      </button>

      {isOpen && items && items.length > 0 && (
        <div className="mt-1">
          {items.map((item, idx) => {
            if (typeof item === 'string') {
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2 py-1.5"
                  style={{ paddingLeft: `${(level + 1) * 1.5 + 0.5}rem` }}
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className={cn("text-sm", themeClasses.text)}>{item}</span>
                </div>
              );
            } else {
              return (
                <SubSection
                  key={idx}
                  title={item.title}
                  items={item.items}
                  level={level + 1}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

// Define types for AccordionItem
interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionItem = ({ title, children, defaultOpen = false }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { isDarkMode } = useThemeStore();

  const themeClasses = {
    container: isDarkMode
      ? 'border-gray-700 bg-gray-800 shadow-gray-900'
      : 'border-gray-200 bg-white shadow-sm',
    button: isDarkMode
      ? 'bg-gray-800 hover:bg-gray-700'
      : 'bg-white hover:bg-gray-50',
    title: isDarkMode ? 'text-white' : 'text-gray-900',
    icon: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    content: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
  };

  return (
    <div className={cn(
      "border rounded-lg mb-3 overflow-hidden",
      themeClasses.container
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full p-4 text-left transition-colors",
          themeClasses.button
        )}
      >
        <span className={cn("font-bold text-lg", themeClasses.title)}>{title}</span>
        {isOpen ? (
          <ChevronDown className={cn("h-6 w-6 flex-shrink-0", themeClasses.icon)} />
        ) : (
          <ChevronRight className={cn("h-6 w-6 flex-shrink-0", themeClasses.icon)} />
        )}
      </button>

      {isOpen && (
        <div className={cn("p-4 border-t", themeClasses.content)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default function CCIESyllabus() {
  const { isDarkMode } = useThemeStore();

  const networkInfrastructure = [
    {
      title: 'Switched Campus',
      items: [
        {
          title: 'Switch Administration',
          items: [
            'Managing MAC address table',
            'Errdisable recovery',
            'L2 MTU'
          ]
        },
        {
          title: 'Layer 2 Protocols',
          items: [
            'CDP, LLDP',
            'UDLD'
          ]
        },
        {
          title: 'VLAN Technologies',
          items: [
            'Access ports',
            'Trunk ports (802.1Q)',
            'Native VLAN',
            'Manual VLAN pruning',
            'Normal range and extended range VLANs',
            'Voice VLAN'
          ]
        },
        {
          title: 'EtherChannel',
          items: [
            'LACP, static',
            'Layer 2, Layer 3',
            'Load balancing',
            'EtherChannel misconfiguration guard',
            'Identify multichassis EtherChannel use cases'
          ]
        },
        {
          title: 'Spanning Tree Protocol',
          items: [
            'PVST+, Rapid PVST+, MST',
            'Switch priority, port priority, tuning port/path cost, STP timers',
            'PortFast, BPDU guard, BPDU filter',
            'Loop guard, root guard'
          ]
        }
      ]
    },
    {
      title: 'Routing Concepts',
      items: [
        'Administrative distance',
        'Static routing (unicast, multicast)',
        'Policy-based routing',
        'VRF-Lite',
        'VRF-aware routing with BGP, EIGRP, OSPF, and static',
        'Route leaking between VRFs using route maps and VASI',
        'Route filtering with BGP, EIGRP, OSPF, and static',
        'Redistribution between BGP, EIGRP, OSPF, and static',
        'Routing protocol authentication',
        'Bidirectional Forwarding Detection',
        'L3 MTU'
      ]
    },
    {
      title: 'EIGRP',
      items: [
        'Adjacencies',
        {
          title: 'Best Path Selection',
          items: [
            'Reported distance, computed distance, feasible distance, feasibility condition, successor, feasible successor',
            'Classic metrics and wide metrics'
          ]
        },
        {
          title: 'Operations',
          items: [
            'General operations',
            'Topology table',
            'Packet types',
            'Stuck-in-active',
            'Graceful shutdown'
          ]
        },
        'EIGRP named mode',
        {
          title: 'Optimization, Convergence, and Scalability',
          items: [
            'Query propagation boundaries',
            'Leak-map with summary routes',
            'EIGRP stub with leak map'
          ]
        }
      ]
    },
    {
      title: 'OSPF (v2 and v3)',
      items: [
        'Adjacencies',
        'OSPFv3 address family support',
        'Network types, area types',
        'Path preference',
        {
          title: 'Operations',
          items: [
            'General operations',
            'Graceful shutdown',
            'GTSM (Generic TTL Security Mechanism)'
          ]
        },
        {
          title: 'Optimization, Convergence, and Scalability',
          items: [
            'Metrics',
            'LSA throttling, SPF tuning',
            'Stub router',
            'Prefix suppression'
          ]
        }
      ]
    },
    {
      title: 'BGP',
      items: [
        {
          title: 'IBGP and EBGP Peer Relations',
          items: [
            'Peer groups, templates',
            'Active, passive',
            'Timers',
            'Dynamic neighbors',
            '4-byte AS numbers',
            'Private AS numbers'
          ]
        },
        {
          title: 'Path Selection',
          items: [
            'Attributes',
            'Best path selection algorithm',
            'Load balancing'
          ]
        },
        {
          title: 'Routing Policies',
          items: [
            'Attribute manipulation',
            'Conditional advertisement',
            'Outbound route filtering',
            'Standard and extended communities',
            'Multihoming'
          ]
        },
        {
          title: 'AS Path Manipulations',
          items: [
            'local-as, allowas-in, remove-private-as',
            'AS path prepending',
            'Regular expressions'
          ]
        },
        {
          title: 'Convergence and Scalability',
          items: [
            'Route reflectors',
            'Aggregation, as-set'
          ]
        },
        'Other BGP features such as soft reconfiguration and route refresh'
      ]
    },
    {
      title: 'Multicast',
      items: [
        {
          title: 'Layer 2 Multicast',
          items: [
            'IGMPv2, IGMPv3',
            'IGMP snooping, PIM snooping',
            'IGMP querier',
            'IGMP filter',
            'MLD'
          ]
        },
        'Reverse path forwarding check',
        {
          title: 'PIM',
          items: [
            'Sparse mode',
            'Static RP, BSR, Auto-RP',
            'Group-to-RP mapping',
            'Source Specific Multicast',
            'Multicast boundary, RP announcement filter',
            'PIMv6 anycast RP',
            'IPv4 anycast RP using MSDP',
            'Multicast multipath'
          ]
        }
      ]
    }
  ];

  const softwareDefinedInfrastructure = [
    {
      title: 'Cisco SD-Access',
      items: [
        {
          title: 'Underlay',
          items: [
            'Manual',
            'LAN automation / PnP',
            'Device discovery and device management',
            'Extended nodes / policy extended nodes'
          ]
        },
        {
          title: 'Overlay',
          items: [
            'LISP, BGP control planes',
            'VXLAN data plane',
            'Cisco TrustSec policy plane',
            'L2 flooding',
            'Native multicast'
          ]
        },
        {
          title: 'Fabric Design',
          items: [
            'Single-site campus',
            'Multisite',
            'Fabric in a box'
          ]
        },
        {
          title: 'Fabric Deployment',
          items: [
            'Host onboarding',
            'Authentication templates',
            'Port configuration',
            'Multisite remote border',
            'Border priority',
            'Adding devices to fabric'
          ]
        },
        {
          title: 'Fabric Border Handoff',
          items: [
            'SDA, SDWAN, IP transits',
            'Peer device (Fusion router)',
            'Layer 2 border handoff'
          ]
        },
        {
          title: 'Segmentation',
          items: [
            'Macro segmentation using virtual networks',
            'Micro-level segmentation using SGTs and SGACLs'
          ]
        }
      ]
    },
    {
      title: 'Cisco SD-WAN',
      items: [
        {
          title: 'Controller Architecture',
          items: [
            'Management plane (vManage)',
            'Orchestration plane (vBond)',
            'Control plane (vSmart)'
          ]
        },
        {
          title: 'SD-WAN Underlay',
          items: [
            'WAN Cloud Edge deployment (AWS, Azure, Google Cloud)',
            'WAN Edge deployment (hardware)',
            'Greenfield, brownfield, and hybrid deployments',
            'System configuration (system IP, site ID, org name, vBond address)',
            'Transport configuration (underlay and tunnel interfaces, allowed services, TLOC extension)'
          ]
        },
        {
          title: 'Overlay Management Protocol (OMP)',
          items: [
            'OMP attributes',
            'IPsec key management',
            'Route aggregation',
            'Redistribution',
            'Additional features (BGP AS path propagation, SDA integration)'
          ]
        },
        {
          title: 'Configuration Templates',
          items: [
            'CLI templates',
            'Feature templates',
            'Device templates'
          ]
        },
        {
          title: 'Centralized Policies',
          items: [
            'Data policies',
            'Application-aware routing policies',
            'Control policies'
          ]
        },
        {
          title: 'Localized Policies',
          items: [
            'Access lists',
            'Route policies'
          ]
        }
      ]
    }
  ];

  const transportTechnologies = [
    'Static point-to-point GRE tunnels',
    {
      title: 'MPLS',
      items: [
        {
          title: 'Operations',
          items: [
            'Label stack, LSR, LSP',
            'LDP',
            'MPLS ping, MPLS traceroute'
          ]
        },
        {
          title: 'L3VPN',
          items: [
            'PE-CE routing using BGP',
            'Basic MP-BGP VPNv4/VPNv6'
          ]
        }
      ]
    },
    {
      title: 'DMVPN',
      items: [
        {
          title: 'Troubleshoot DMVPN Phase 3 with dual hub',
          items: [
            'NHRP',
            'IPsec/IKEv2 using preshared key'
          ]
        }
      ]
    }
  ];

  const securityAndServices = [
    {
      title: 'Device Security on Cisco IOS XE',
      items: [
        'Control plane policing and protection',
        'AAA'
      ]
    },
    {
      title: 'Network Security',
      items: [
        {
          title: 'Switch Security Features',
          items: [
            'VACL, PACL',
            'Storm control',
            'DHCP snooping, DHCP option 82',
            'IP Source Guard',
            'Dynamic ARP Inspection',
            'Port security'
          ]
        },
        {
          title: 'Router Security Features',
          items: [
            'IPv6 traffic filters',
            'IPv4 access control lists',
            'Unicast Reverse Path Forwarding'
          ]
        },
        {
          title: 'IPv6 Infrastructure Security Features',
          items: [
            'RA Guard',
            'DHCP Guard',
            'Binding table',
            'Device tracking',
            'ND Inspection/Snooping',
            'Source Guard'
          ]
        }
      ]
    },
    {
      title: 'System Management',
      items: [
        {
          title: 'Device Management',
          items: [
            'Console and VTY',
            'SSH, SCP',
            'RESTCONF, NETCONF'
          ]
        },
        'SNMP (v2c, v3)',
        {
          title: 'Logging',
          items: [
            'Local logging, syslog, debugs, conditional debugs',
            'Configuration change notification and logging',
            'Timestamps'
          ]
        }
      ]
    },
    {
      title: 'Quality of Service',
      items: [
        'Differentiated Services architecture',
        'Classification, trust boundary',
        'Network Based Application Recognition (NBAR)',
        'Marking DSCP values in IPv4 and IPv6 headers',
        'Policing, shaping',
        'Congestion management and avoidance',
        'HQoS',
        'End-to-end Layer 3 QoS using MQC'
      ]
    },
    {
      title: 'Network Services',
      items: [
        {
          title: 'First-Hop Redundancy Protocols',
          items: [
            'HSRP, VRRP',
            'Redundancy using IPv6 RS/RA'
          ]
        },
        {
          title: 'Time Synchronization Protocols',
          items: [
            'NTP as a client',
            'PTP design considerations'
          ]
        },
        {
          title: 'DHCP on Cisco Devices',
          items: [
            'Client, server, relay',
            'Options',
            'SLAAC/DHCPv6 integration',
            'Stateful, stateless DHCPv6',
            'DHCPv6 Prefix Delegation'
          ]
        },
        {
          title: 'IPv4 Network Address Translation',
          items: [
            'Static NAT, PAT',
            'Dynamic NAT, PAT',
            'Policy-based NAT, PAT',
            'VRF-aware NAT, PAT',
            'VRF-aware Software Infrastructure (VASI) NAT'
          ]
        }
      ]
    },
    {
      title: 'Network Optimization',
      items: [
        'IP SLA (ICMP, UDP, TCP probes)',
        'Tracking objects and lists',
        'Flexible NetFlow'
      ]
    },
    {
      title: 'Network Operations',
      items: [
        {
          title: 'Traffic Capture',
          items: [
            'SPAN, RSPAN, ERSPAN',
            'Embedded packet capture'
          ]
        },
        {
          title: 'Troubleshooting Tools',
          items: [
            'Data path packet trace',
            'Conditional debugger (debug platform condition)'
          ]
        }
      ]
    }
  ];

  const automationProgrammability = [
    {
      title: 'Data Encoding Formats',
      items: [
        'JSON',
        'XML',
        'YAML',
        'Jinja'
      ]
    },
    {
      title: 'Automation and Scripting',
      items: [
        'EEM applets',
        {
          title: 'Guest Shell',
          items: [
            'Linux environment',
            'CLI Python module',
            'EEM Python module'
          ]
        }
      ]
    },
    {
      title: 'Programmability',
      items: [
        {
          title: 'Interaction with vManage API',
          items: [
            'Python requests library and Postman',
            'Monitoring endpoints',
            'Configuration endpoints'
          ]
        },
        'Interaction with Cisco DNA Center API using HTTP requests (GET, PUT, POST) via Python requests library and Postman',
        {
          title: 'Deploy and verify model-driven telemetry',
          items: [
            'Configure on-change subscription using gRPC'
          ]
        }
      ]
    }
  ];

  const renderMixedContent = (items: (string | SubSectionItem)[]) => {
    return items.map((item, idx) => {
      if (typeof item === 'string') {
        return (
          <div key={idx} className="flex items-start gap-2 py-1.5 pl-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              {item}
            </span>
          </div>
        );
      }
      return (
        <SubSection
          key={idx}
          title={item.title}
          items={item.items}
          level={0}
        />
      );
    });
  };

  return (
    <div className={cn("min-h-screen p-6")}>
      <div className="max-w-5xl mx-auto">
        <div className="space-y-3">
          <AccordionItem title="Network Infrastructure (30%)" defaultOpen={true}>
            <div className="space-y-2">
              {networkInfrastructure.map((section, idx) => (
                <SubSection
                  key={idx}
                  title={section.title}
                  items={section.items}
                  level={0}
                />
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="Software-Defined Infrastructure (25%)">
            <div className="space-y-2">
              {softwareDefinedInfrastructure.map((section, idx) => (
                <SubSection
                  key={idx}
                  title={section.title}
                  items={section.items}
                  level={0}
                />
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="Transport Technologies and Solutions (15%)">
            <div className="space-y-2">
              {renderMixedContent(transportTechnologies)}
            </div>
          </AccordionItem>

          <AccordionItem title="Infrastructure Security and Services (15%)">
            <div className="space-y-2">
              {securityAndServices.map((section, idx) => (
                <SubSection
                  key={idx}
                  title={section.title}
                  items={section.items}
                  level={0}
                />
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="Infrastructure Automation and Programmability (15%)">
            <div className="space-y-2">
              {automationProgrammability.map((section, idx) => (
                <SubSection
                  key={idx}
                  title={section.title}
                  items={section.items}
                  level={0}
                />
              ))}
            </div>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}