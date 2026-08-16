// AI Service for text improvement.
// Calls the backend proxy (`/api/admin/ai/improve-description`) so no OpenAI
// API key ever reaches the browser. Falls back to a local improvement pass if
// the backend AI is unavailable or not configured.
class AIService {
  async improveDescription(originalDescription: string, productName: string, category: string): Promise<string> {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      const response = await fetch(
        `${this.apiBaseUrl()}/api/admin/ai/improve-description`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ originalDescription, productName, category }),
        },
      );

      if (!response.ok) {
        console.warn(`AI service unavailable (${response.status}), using local fallback`);
        return this.fallbackImprovement(originalDescription, productName, category);
      }

      const data = await response.json();
      const improved = data?.improvedDescription?.trim();

      if (!improved) {
        return this.fallbackImprovement(originalDescription, productName, category);
      }

      this.updateUsageCount();
      return improved;
    } catch (error) {
      console.error('AI improvement failed:', error);
      return this.fallbackImprovement(originalDescription, productName, category);
    }
  }

  private apiBaseUrl(): string {
    const fromEnv = (import.meta as any)?.env?.VITE_API_BASE_URL;
    if (typeof fromEnv === 'string' && fromEnv.trim()) {
      return fromEnv.replace(/\/+$/, '');
    }
    return window.location.origin;
  }

  // Fallback improvement method (local processing)
  private fallbackImprovement(originalDescription: string, productName: string, category: string): string {
    let improved = originalDescription;

    // Basic improvements
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    // Add professional language patterns
    if (!improved.includes('high-quality') && !improved.includes('premium')) {
      improved = `Experience the ${productName}, a high-quality product designed for ${category} enthusiasts. ` + improved;
    }

    // Add benefits-focused language
    if (!improved.includes('perfect') && !improved.includes('ideal')) {
      improved += ` Perfect for everyday use, this product combines style and functionality.`;
    }

    // Ensure proper ending
    if (!improved.endsWith('.') && !improved.endsWith('!')) {
      improved += '.';
    }

    return improved;
  }

  // Update usage count for tracking
  private updateUsageCount() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('ai_user_info') || '{}');
      userInfo.usageCount = (userInfo.usageCount || 0) + 1;
      userInfo.lastUsed = new Date().toISOString();
      localStorage.setItem('ai_user_info', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to update usage count:', error);
    }
  }

  // Get usage statistics
  getUsageStats() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('ai_user_info') || '{}');
      return {
        usageCount: userInfo.usageCount || 0,
        tier: userInfo.tier || 'free',
        createdAt: userInfo.createdAt,
        lastUsed: userInfo.lastUsed,
      };
    } catch (error) {
      return {
        usageCount: 0,
        tier: 'free',
        createdAt: null,
        lastUsed: null,
      };
    }
  }

  async isReady(): Promise<boolean> {
    return true;
  }
}

export const aiService = new AIService();
export default aiService;
