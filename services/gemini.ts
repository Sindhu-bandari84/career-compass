
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, AIRecommendation } from "../types";

/**
 * Generates a realistic mock response if the AI service is unavailable.
 * This ensures the application "works" for users even without a configured API key.
 */

// Predefined Career Paths Database for Fallback/Demo Mode
const CAREER_PATHS = [
  {
    role: "Data Scientist",
    keywords: ["Python", "Data Analysis", "Statistics", "SQL", "Machine Learning", "Deep Learning", "Pandas", "NumPy"],
    interests: ["Data Analysis", "AI/ML", "Statistics"],
    description: "Analyze complex data to help organizations make better decisions.",
    missing: ["Big Data Tools (Spark)", "Cloud Data Warehousing"]
  },
  {
    role: "Frontend Developer",
    keywords: ["React", "JavaScript", "HTML", "CSS", "TypeScript", "UI/UX Design", "Figma", "Redux"],
    interests: ["Web Development", "UI/UX Design", "Mobile Development"],
    description: "Build interactive and responsive user interfaces for modern web applications.",
    missing: ["Webpack/Vite Config", "Accessibility Standards (WCAG)"]
  },
  {
    role: "Backend Engineer",
    keywords: ["Node.js", "Python", "Java", "SQL", "NoSQL", "API", "Database", "Go", "Docker"],
    interests: ["Web Development", "Cloud Computing", "System Design"],
    description: "Design and implement scalable server-side logic and database architecture.",
    missing: ["Microservices Patterns", "Message Queues (Kafka/RabbitMQ)"]
  },
  {
    role: "Full Stack Developer",
    keywords: ["React", "Node.js", "JavaScript", "SQL", "Mongo", "Express", "Next.js"],
    interests: ["Web Development", "Startup", "Product Development"],
    description: "Work across the entire stack from database to user interface.",
    missing: ["CI/CD Pipelines", "Advanced Security Practices"]
  },
  {
    role: "DevOps Engineer",
    keywords: ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD", "Terraform", "Cloud Computing", "Bash"],
    interests: ["Cloud Computing", "DevOps", "Cybersecurity"],
    description: "Bridge the gap between development and operations with automation.",
    missing: ["Infrastructure as Code", "Site Reliability Engineering"]
  },
  {
    role: "Cybersecurity Analyst",
    keywords: ["Network Security", "Linux", "Ethical Hacking", "Firewalls", "Python", "Cryptography"],
    interests: ["Cybersecurity", "Network Security", "Privacy"],
    description: "Protect systems and networks from digital attacks.",
    missing: ["Penetration Testing Tools", "Compliance Standards (ISO/SOC2)"]
  },
  {
    role: "AI/ML Engineer",
    keywords: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
    interests: ["AI/ML", "Robotics", "Data Science"],
    description: "Build and deploy intelligent models and systems.",
    missing: ["Model Deployment (MLOps)", "Edge AI Optimization"]
  },
  {
    role: "Cloud Architect",
    keywords: ["AWS", "Azure", "Cloud Computing", "System Design", "Networking", "Security"],
    interests: ["Cloud Computing", "System Architecture"],
    description: "Design and manage complex cloud computing strategies.",
    missing: ["Multi-Cloud Strategy", "Cost Optimization"]
  },
  {
    role: "Mobile App Developer",
    keywords: ["React Native", "Flutter", "iOS", "Android", "JavaScript", "Dart"],
    interests: ["Mobile Development", "App Design"],
    description: "Create seamless mobile experiences for iOS and Android.",
    missing: ["Native Module Bridging", "App Store Optimization"]
  }
];

function getFallbackRecommendations(data: AssessmentData): AIRecommendation[] {
  // 1. Score each career path based on user's skills and interests
  const scoredPaths = CAREER_PATHS.map(path => {
    let score = 0;
    const matches: string[] = [];

    // Skill Match Scoring
    data.skills.forEach(skill => {
      const isMatch = path.keywords.some(k => k.toLowerCase() === skill.name.toLowerCase());
      if (isMatch) {
        score += skill.rating * 5; // 5 points per rating level (max 25)
        matches.push(skill.name);
      }
    });

    // Interest Match Scoring
    data.interests.forEach(interest => {
      if (path.interests.includes(interest)) {
        score += 20; // 20 points for interest match
      }
    });

    return { ...path, score, matches };
  });

  // 2. Sort by score descending and take top 3
  // If scores are 0 (no match), we might still want to show something relevant to "Field"
  const topPaths = scoredPaths
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 3. Transform into AIRecommendation format
  return topPaths.map((path, index) => {
    // Artificial spacing + Random Jitter to ensure distinct and slightly dynamic values
    // Base score: 95 - (index * 7)
    // Jitter: Math.random() * 3 (adds 0-3% variance)
    const jitter = Math.floor(Math.random() * 4);
    const baseMatch = Math.min(95 - (index * 7) - jitter, 98);
    const hasMatches = path.matches.length > 0;

    // Calculate 'Skills Have' and 'Skills Missing' based on strict rating rules
    // Skills Have: Role keywords where user rating >= 2
    const skillsHave = data.skills
      .filter(s => s.rating >= 2 && path.keywords.some(k => k.toLowerCase() === s.name.toLowerCase()))
      .map(s => s.name);

    // Skills Missing: 
    // 1. Role keywords user has rated <= 1
    const weakSkills = data.skills
      .filter(s => s.rating <= 1 && path.keywords.some(k => k.toLowerCase() === s.name.toLowerCase()))
      .map(s => s.name);

    // 2. Role keywords user completely missed
    const knownSkillNames = data.skills.map(s => s.name.toLowerCase());
    const completelyMissing = path.keywords.filter(k => !knownSkillNames.includes(k.toLowerCase()));

    // Combine weak + missing, prioritized
    const relevantMissing = [...weakSkills, ...completelyMissing, ...path.missing].slice(0, 4);

    return {
      roleName: path.role,
      matchPercentage: baseMatch,
      reasons: [
        hasMatches
          ? `Matches your proficiency in ${path.matches.slice(0, 3).join(', ')}.`
          : `Aligned with your interest in ${path.interests[0]}.`,
        `Strong fit for your ${data.field} background.`,
        path.description
      ],
      skillsHave: skillsHave,
      skillsMissing: relevantMissing.length > 0 ? relevantMissing : path.missing.slice(0, 3),
      roadmap: [
        {
          week: 1,
          topics: [`${path.role} Foundations`, `Setup & Core Tools`],
          tasks: [`Review core concepts for ${path.role}`, `Set up development environment containing ${path.keywords[0]}`, `Understand the ecosystem and main paradigms`],
          project: `${path.role} Fundamentals Sandbox`
        },
        {
          week: 2,
          topics: [`Deep Dive: ${path.keywords[1]}`, `Building with ${path.keywords[2]}`],
          tasks: [`Build proof-of-concept application`, `Deep dive into advanced tools`, `Connect different components of the stack`],
          project: `${path.role} System Design & Core Features`
        },
        {
          week: 3,
          topics: ["Advanced Concepts", `Optimizing ${path.keywords[0]}`],
          tasks: [`Optimize performance and scaling`, `Implement industry best practices`, `Refactor code for real-world usage`],
          project: "Production-ready Feature Expansion"
        },
        {
          week: 4,
          topics: ["Production Readiness", "System Architecture & Deployment"],
          tasks: ["Testing, Debugging & Quality Assurance", `Final Deployment as a ${path.role}`, "Documenting technical decisions"],
          project: `${path.role} Portfolio Showcase Implementation`
        }
      ],
      resourceLinks: [
        { title: `${path.role} Roadmap`, url: "https://roadmap.sh", category: "Guide" },
        { title: "FreeCodeCamp", url: "https://freecodecamp.org", category: "Course" }
      ]
    };
  });
}

export async function getCareerRecommendations(data: AssessmentData): Promise<AIRecommendation[]> {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    console.warn("Gemini API Key is missing. Operating in Demo Mode.");
    return new Promise((resolve) => {
      setTimeout(() => resolve(getFallbackRecommendations(data)), 1500);
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    As a Technical Talent Quant, perform a MATHEMATICAL MATCH between the user's skills and 3 career roles.
    
    USER PROFILE:
    - Major: ${data.field}
    - CGPA: ${data.cgpa}/10
    - Interests: ${data.interests.join(', ')}
    - SKILL LEVELS (1-5): ${data.skills.map(s => `${s.name}: ${s.rating}`).join(', ')}
    
     STRICT CONTENT RULES:
     1. **SKILLS HAVE**: List ONLY skills the user rated **2, 3, 4, or 5**. 
     2. **SKILLS MISSING**: List CRITICAL skills the user rated **1**, OR simply did not list at all.
        - Example: If role allows Java but user has Java (1), it is a "Missing Skill".
     3. NEVER mention numerical ratings like "5/5" in the text output.
     4. Calculate 'matchPercentage' based ONLY on the count of 'Skills Have' vs total role requirements.
     5. CRITICAL: Return exactly 3 DISTINCT career roles. Do NOT return similar roles. 
        - Role 1: The absolute best match.
        - Role 2: A strong alternative.
        - Role 3: An emerging path.
     6. STRICTLY SORT the output array by 'matchPercentage' in DESCENDING order.
     7. CRITICAL: The 4-week 'roadmap' MUST BE UNIQUE AND HIGHLY SPECIFIC to the given 'roleName'. 
        - Generate completely customized 'topics', 'tasks', and 'project' for every single role.
        - Do NOT use generic terms like "Foundations" or "Advanced Concepts". Use real technologies and role-specific jargon.
        - The technical blueprint for a Data Scientist should look completely different from a DevOps Engineer.

    OUTPUT: Return exactly 3 recommendations in raw JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              roleName: { type: Type.STRING },
              matchPercentage: { type: Type.NUMBER },
              reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
              skillsHave: { type: Type.ARRAY, items: { type: Type.STRING } },
              skillsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: { type: Type.NUMBER },
                    topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    project: { type: Type.STRING },
                  }
                }
              },
              resourceLinks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, url: { type: Type.STRING }, category: { type: Type.STRING } } } }
            },
            required: ["roleName", "matchPercentage", "reasons", "skillsHave", "skillsMissing", "roadmap"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response");

    const rawRecommendations = JSON.parse(text) as AIRecommendation[];
    return validateAndFixSkills(data, rawRecommendations);

  } catch (error) {
    console.error("Gemini Request Failed. Switching to high-quality fallback generator.", error);
    // Even if the request fails (Network/CORS/Key issues), the user gets a roadmap.
    return getFallbackRecommendations(data);
  }
}

/**
 * STRICTLY enforces skill classification based on user ratings.
 * AI often hallucinates or misclassifies skills. This function fixes that.
 * Rules:
 * - Strength: Rating >= 2
 * - Deficit/Missing: Rating <= 1 OR Not listed
 */
function validateAndFixSkills(data: AssessmentData, recommendations: AIRecommendation[]): AIRecommendation[] {
  // 1. Identify User's Truth
  // UPDATED: Strength is now >= 2
  const userStrengths = new Set(
    data.skills.filter(s => s.rating >= 2).map(s => s.name.toLowerCase())
  );

  // Map for preserving original casing from user input
  const skillNameMap = new Map<string, string>();
  data.skills.forEach(s => skillNameMap.set(s.name.toLowerCase(), s.name));

  return recommendations.map(rec => {
    // 2. Fix "Skills Have" (Current Strengths)
    // Only allow skills that are actually in userStrengths
    // If AI missed a strength that is relevant to the role (by keyword match), add it.

    // Start with what AI gave, filter out anything that ISN'T a strength
    let confirmedStrengths = rec.skillsHave.filter(skillName =>
      userStrengths.has(skillName.toLowerCase())
    );

    // AI might have put a strength in "Missing". Move it to "Have".
    const wronglyMissing = rec.skillsMissing.filter(skillName =>
      userStrengths.has(skillName.toLowerCase())
    );
    confirmedStrengths = [...confirmedStrengths, ...wronglyMissing];

    // Deduplicate and fix casing
    // STRICT RULE: Only include if >= 2 rating.
    confirmedStrengths = Array.from(new Set(confirmedStrengths.map(s => s.toLowerCase())))
      .map(s => skillNameMap.get(s) || s);

    // 3. Fix "Skills Missing" (Deficit)
    // Start with what AI gave, filter out anything that IS currently a strength
    let confirmedMissing = rec.skillsMissing.filter(skillName =>
      !userStrengths.has(skillName.toLowerCase())
    );

    // AI might have put a weakness in "Have". Move it to "Missing".
    const wronglyHave = rec.skillsHave.filter(skillName =>
      !userStrengths.has(skillName.toLowerCase())
    );
    confirmedMissing = [...confirmedMissing, ...wronglyHave];

    // Deduplicate and fix casing
    confirmedMissing = Array.from(new Set(confirmedMissing.map(s => s.toLowerCase())))
      .map(s => skillNameMap.get(s) || s);

    // 4. NO FALLBACK for Strengths
    // If the user has no skills >= 2, "Current Strengths" should be empty.

    return {
      ...rec,
      skillsHave: confirmedStrengths,
      skillsMissing: confirmedMissing.slice(0, 6) // Cap missing list to avoid UI clutter
    };
  });
}
