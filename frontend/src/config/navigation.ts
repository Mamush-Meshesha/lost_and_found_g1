export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'problems', label: 'Problems', href: '#problems' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'technology', label: 'Technology', href: '#technology' },
];

export interface ProblemInfo {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  tags: string[];
  targetSection: string;
}

export const PROBLEMS_DATA: ProblemInfo[] = [
  {
    id: 'problem-1',
    number: '01',
    title: 'Community Lost & Found',
    shortTitle: 'Lost & Found',
    description: 'A platform where users can report lost and found items, search reports, filter by categories, and connect relevant reports.',
    tags: ['React', 'MongoDB', 'Search', 'Authentication'],
    targetSection: 'problem-1',
  },
  {
    id: 'problem-2',
    number: '02',
    title: 'Real-Time Collaborative Task Board',
    shortTitle: 'Task Board',
    description: 'A collaborative task board where multiple users can create, update, move, and delete tasks together in real time.',
    tags: ['React', 'MongoDB', 'WebSockets', 'Real-Time'],
    targetSection: 'problem-2',
  },
  {
    id: 'problem-3',
    number: '03',
    title: 'Smart Library Management System',
    shortTitle: 'Library System',
    description: 'A library management platform with role-based access, borrowing rules, inventory availability, and concurrent borrowing protection.',
    tags: ['React', 'MongoDB', 'RBAC', 'Concurrency'],
    targetSection: 'problem-3',
  },
];
