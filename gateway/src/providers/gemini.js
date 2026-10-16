/**
 * AJAYNXT AI Design Studio — Google Gemini Provider Adapter
 * Capabilities: Design Prompt Refinement & Multimodal Image Understanding
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

class GeminiAdapter {
  constructor() {
    this.apiKey = config.providers.gemini.apiKey;
    this.modelName = config.providers.gemini.model;
    this.client = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
  }

  isAvailable() {
    return Boolean(this.client);
  }

  /**
   * Refines a natural-language creative design brief into structured vector/layout specs.
   */
  async refineDesignBrief({ prompt, brand, projectType, audience, exactText, currentStyle }) {
    if (!this.client) {
      throw new Error('Gemini API key is not configured.');
    }

    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4
      }
    });

    const systemPrompt = `You are a World-Class Creative Director and Luxury Packaging Designer specializing in confectionery, heritage branding, and vector typography (e.g. Diamond Bakery Shimla since 2002).
Analyze the user's design intent and produce a structured design brief in strict JSON format.

JSON Schema:
{
  "brand": string,
  "projectType": string,
  "originalPrompt": string,
  "enhancedPrompt": string,
  "suggestedStyle": string,
  "recommendedPalette": {
    "primary": string,
    "secondary": string,
    "accentGold": string,
    "background": string
  },
  "typography": {
    "headlineFont": string,
    "subheadingFont": string,
    "bodyFont": string,
    "notes": string
  },
  "layoutHierarchy": string,
  "preservationGuidance": string,
  "estimatedComplexity": "low" | "medium" | "high"
}`;

    const userMessage = `Brand: ${brand || 'Diamond Bakery'}
Project Type: ${projectType || 'Poster / Packaging'}
User Prompt: ${prompt}
Target Audience: ${audience || 'General luxury confectionery customers'}
Exact Text Required: ${exactText || 'None specified'}
Current Style Context: ${currentStyle || 'Royal Heritage'}`;

    const result = await model.generateContent([systemPrompt, userMessage]);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return {
        provider: 'gemini',
        model: this.modelName,
        data: parsed,
        usage: {
          promptTokens: response.usageMetadata ? response.usageMetadata.promptTokenCount : 150,
          candidatesTokens: response.usageMetadata ? response.usageMetadata.candidatesTokenCount : 250
        }
      };
    } catch (parseErr) {
      return {
        provider: 'gemini',
        model: this.modelName,
        rawText: text,
        error: 'JSON parsing failed from raw model response'
      };
    }
  }

  /**
   * Multimodal Image Understanding & Packaging Analysis
   */
  async understandImage({ imageBase64, mimeType = 'image/png', instruction = 'Analyze visual hierarchy, typography readability, and color harmony.' }) {
    if (!this.client) {
      throw new Error('Gemini API key is not configured.');
    }

    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    const promptText = `Examine this graphic design or packaging image as a senior art director:
${instruction}

Respond in JSON with:
{
  "detectedSubject": string,
  "colorPaletteDetected": [string],
  "typographyCritique": string,
  "edgeQualityAssessment": string,
  "compositionStrengths": [string],
  "recommendedFixes": [string]
}`;

    const result = await model.generateContent([promptText, imagePart]);
    const response = await result.response;
    const text = response.text();

    return {
      provider: 'gemini',
      model: this.modelName,
      analysis: JSON.parse(text)
    };
  }
}

module.exports = new GeminiAdapter();
