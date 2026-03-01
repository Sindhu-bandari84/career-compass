
import { User, AssessmentData, AIRecommendation } from '../types';

// Replace this with your actual backend URL (e.g., http://localhost:5000/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


export class PersistenceService {
  /**
   * Internal helper to simulate a local database for demo/development
   */
  private static getLocalUsers(): any[] {
    const users = localStorage.getItem('career_compass_mock_db');
    return users ? JSON.parse(users) : [];
  }

  private static saveLocalUser(user: any) {
    const users = this.getLocalUsers();
    users.push(user);
    localStorage.setItem('career_compass_mock_db', JSON.stringify(users));
  }

  /**
   * Registers a new user in the MongoDB database with local fallback
   */
  static async signup(userData: any): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        return await response.json();
      }

      throw new Error("Server error");
    } catch (error) {
      console.warn("MongoDB Signup failed. Saving to local mock DB.");

      // Check if user exists locally
      const users = this.getLocalUsers();
      if (users.find(u => u.email === userData.email)) {
        throw new Error("User with this email already exists.");
      }

      this.saveLocalUser(userData);
      return { fullName: userData.fullName, email: userData.email };
    }
  }

  /**
   * Authenticates user and retrieves profile with local fallback
   */
  static async login(credentials: any): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) return await response.json();

      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid credentials");
    } catch (error: any) {
      if (error.message === "Invalid credentials") throw error;

      console.warn("MongoDB Login connection failed. Checking local mock DB.");

      const users = this.getLocalUsers();
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        throw new Error("No account found with this email.");
      }

      if (user.password !== credentials.password) {
        throw new Error("Incorrect password. Please try again.");
      }

      return { fullName: user.fullName, email: user.email };
    }
  }

  /**
   * Saves the user's assessment data and AI recommendations
   */
  static async saveAssessment(user: User, data: AssessmentData, recommendations: AIRecommendation[]): Promise<boolean> {
    const payload = {
      user, // Saves full user details (email, fullName)
      assessmentDate: new Date().toISOString(),
      inputData: data,
      results: recommendations
    };

    try {
      const response = await fetch(`${API_BASE_URL}/assessment/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) return true;
    } catch (error) {
      console.error("Failed to sync assessment to MongoDB server:", error);
      alert("Note: Your results are saved locally, but cloud sync failed. Check console for details.");
    }

    // Always fallback to local storage for the specific user
    localStorage.setItem(`assessment_history_${user.email}`, JSON.stringify(payload));
    return true;
  }

  /**
   * Retrieves the most recent assessment
   */
  static async getLatestAssessment(email: string): Promise<{ data: AssessmentData, recommendations: AIRecommendation[] } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/assessment/latest?email=${email}`);

      if (response.ok) {
        const result = await response.json();
        return { data: result.inputData, recommendations: result.results };
      }
    } catch (error) {
      console.warn("Could not fetch assessment from server. Checking local storage.");
    }

    // Fallback to local storage record
    const local = localStorage.getItem(`assessment_history_${email}`);
    if (local) {
      const parsed = JSON.parse(local);
      return { data: parsed.inputData, recommendations: parsed.results };
    }

    return null;
  }
}
