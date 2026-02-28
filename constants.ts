
import { CareerRole } from './types';

export const ALL_ROLES: CareerRole[] = [
  {
    id: 'da',
    name: 'Data Analyst',
    icon: '📊',
    domain: 'Data',
    description: 'Transform data into insights to help organizations make better decisions.',
    skills: ['SQL', 'Python', 'Tableau', 'Excel'],
    level: 'Entry Level',
    overview: 'A Data Analyst collects, cleans, and interprets data sets to answer a question or solve a problem.',
    tools: ['PostgreSQL', 'Python (Pandas)', 'PowerBI', 'Jupyter Notebooks'],
    roadmap8Week: [
      'Week 1-2: Advanced Excel and Statistics Fundamentals',
      'Week 3-4: SQL for Data Analysis (Joins, Aggregations, Window Functions)',
      'Week 5-6: Python for Data Analysis (Numpy, Pandas, Matplotlib)',
      'Week 7-8: Visualization & Storytelling with Tableau/PowerBI'
    ],
    projects: ['Sales Dashboard for Retail Store', 'E-commerce Customer Behavior Analysis'],
    resources: [
      { name: 'Google Data Analytics Professional Certificate', url: 'https://www.coursera.org', type: 'cert' },
      { name: 'Alex The Analyst YouTube Channel', url: 'https://youtube.com', type: 'video' }
    ]
  },
  {
    id: 'wd',
    name: 'Web Developer',
    icon: '🌐',
    domain: 'Web',
    description: 'Build and maintain websites using modern frontend and backend frameworks.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    level: 'Entry Level',
    overview: 'Web developers use programming languages to create websites, from UI design to server-side logic.',
    tools: ['VS Code', 'Git', 'Npm', 'Chrome DevTools'],
    roadmap8Week: [
      'Week 1-2: Advanced HTML/CSS & Responsive Design',
      'Week 3-4: Modern JavaScript (ES6+)',
      'Week 5-6: React Fundamentals & State Management',
      'Week 7-8: API Integration & Deployment'
    ],
    projects: ['Personal Portfolio Site', 'E-commerce Product Catalog'],
    resources: [
      { name: 'FreeCodeCamp Web Dev Guide', url: 'https://freecodecamp.org', type: 'doc' },
      { name: 'Web Dev Simplified YouTube', url: 'https://youtube.com', type: 'video' }
    ]
  },
  {
    id: 'cyber',
    name: 'Cybersecurity Analyst',
    icon: '🛡️',
    domain: 'Security',
    description: 'Protect networks and data from cyber threats and unauthorized access.',
    skills: ['Networking', 'Linux', 'Security Tools', 'Encryption'],
    level: 'Entry Level'
  },
  {
    id: 'cloud',
    name: 'Cloud Engineer',
    icon: '☁️',
    domain: 'Cloud',
    description: 'Design and manage scalable infrastructure on cloud platforms like AWS and Azure.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Linux'],
    level: 'Mid Level'
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    icon: '♾️',
    domain: 'Cloud',
    description: 'Bridge the gap between development and operations for faster software delivery.',
    skills: ['CI/CD', 'Jenkins', 'Terraform', 'Git'],
    level: 'Mid Level'
  },
  {
    id: 'aiml',
    name: 'AI/ML Engineer',
    icon: '🤖',
    domain: 'AI/ML',
    description: 'Build intelligent systems and predictive models using machine learning algorithms.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Math'],
    level: 'Mid Level'
  },
  {
    id: 'uiux',
    name: 'UI/UX Designer',
    icon: '🎨',
    domain: 'Design',
    description: 'Create intuitive and visually appealing user interfaces for digital products.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Adobe XD'],
    level: 'Entry Level'
  }
];

export const SKILL_CATEGORIES = [
  {
    category: 'Programming',
    skills: ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'C', 'Go']
  },
  {
    category: 'Web Technologies',
    skills: ['HTML', 'CSS', 'React', 'Node.js', 'TypeScript', 'Next.js', 'PHP']
  },
  {
    category: 'Data & Analytics',
    skills: [
      'Excel', 'Tableau', 'Power BI', 'Statistics', 'R', 'Big Data', 'Pandas', 
      'Matplotlib', 'Seaborn', 'Snowflake', 'Databricks', 'Apache Spark', 
      'ETL Pipelines', 'Data Visualization', 'NoSQL', 'Data Warehousing'
    ]
  },
  {
    category: 'Cloud & DevOps',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Terraform', 'GCP']
  },
  {
    category: 'Security',
    skills: ['Network Security', 'Linux', 'Penetration Testing', 'SIEM Tools', 'Firewalls', 'Ethical Hacking']
  },
  {
    category: 'AI/ML',
    skills: [
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 
      'Computer Vision', 'LLMs', 'Generative AI', 'Prompt Engineering', 
      'MLOps', 'Scikit-Learn', 'Keras', 'Reinforcement Learning', 
      'Vector Databases', 'LangChain', 'XGBoost'
    ]
  },
  {
    category: 'Embedded & IoT',
    skills: ['Arduino', 'Raspberry Pi', 'Microcontrollers', 'MQTT', 'Circuit Design', 'RTOS', 'Robotics']
  },
  {
    category: 'Business & Design',
    skills: ['Figma', 'Product Management', 'Agile/Scrum', 'Marketing', 'User Research']
  }
];
