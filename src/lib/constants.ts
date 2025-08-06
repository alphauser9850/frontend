// Course naming constants to ensure consistency across the application
export const COURSE_NAMES = {
  CCNA: "CCNA R&S",
  CCNP: "CCNP Enterprise", 
  CCIE: "CCIE Enterprise Infrastructure",
  CCIE_WIRELESS: "CCIE Wireless",
  SD_WAN: "SD-WAN",
  SD_ACCESS: "SD-Access"
} as const;

export const COURSE_DESCRIPTIONS = {
  CCNA: "Cisco Certified Network Associate",
  CCNP: "Cisco Certified Network Professional",
  CCIE: "Cisco Certified Internetwork Expert - Enterprise Infrastructure",
  CCIE_WIRELESS: "Cisco Certified Internetwork Expert - Wireless",
  SD_WAN: "Software-Defined Wide Area Network",
  SD_ACCESS: "Software-Defined Access Network"
} as const;

export const COURSE_PATHS = {
  CCNA: "/courses/ccna",
  CCNP: "/courses/ccnp",
  CCIE: "/training/ccie-enterprise-infrastructure",
  CCIE_WIRELESS: "/courses/ccie-wireless",
  SD_WAN: "/courses/sd-wan",
  SD_ACCESS: "/courses/sd-access"
} as const;

// Course items for navigation menus - icons will be handled in components
export const COURSE_ITEMS = [
  {
    title: COURSE_NAMES.CCNA,
    description: COURSE_DESCRIPTIONS.CCNA,
    path: COURSE_PATHS.CCNA,
    iconType: "Server"
  },
  {
    title: COURSE_NAMES.CCNP,
    description: COURSE_DESCRIPTIONS.CCNP,
    path: COURSE_PATHS.CCNP,
    iconType: "Server"
  },
  {
    title: COURSE_NAMES.CCIE,
    description: COURSE_DESCRIPTIONS.CCIE,
    path: COURSE_PATHS.CCIE,
    iconType: "Sparkles"
  },
  {
    title: COURSE_NAMES.CCIE_WIRELESS,
    description: COURSE_DESCRIPTIONS.CCIE_WIRELESS,
    path: COURSE_PATHS.CCIE_WIRELESS,
    iconType: "Sparkles"
  },
  {
    title: COURSE_NAMES.SD_WAN,
    description: COURSE_DESCRIPTIONS.SD_WAN,
    path: COURSE_PATHS.SD_WAN,
    iconType: "Layers"
  },
  {
    title: COURSE_NAMES.SD_ACCESS,
    description: COURSE_DESCRIPTIONS.SD_ACCESS,
    path: COURSE_PATHS.SD_ACCESS,
    iconType: "Layers"
  }
] as const; 