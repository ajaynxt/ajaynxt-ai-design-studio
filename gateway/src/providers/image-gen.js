/**
 * AJAYNXT AI Design Studio — Image Generation Provider Adapter
 * Uses currently supported Gemini Multimodal Image Generation & NVIDIA NIM.
 * Note: Legacy Imagen 3 has been phased out in favor of Gemini native multimodal generation.
 */

const config = require('../config');

class ImageGenAdapter {
  constructor() {
    this.nvidiaKey = config.providers.nvidiaNim.apiKey;
    this.nvidiaEndpoint = config.providers.nvidiaNim.endpoint;
    this.geminiKey = config.providers.geminiImage.apiKey;
  }

  /**
   * Generates an image using NVIDIA NIM Microservices.
   * Model: stabilityai/stable-diffusion-xl-turbo
   * License: NVIDIA NGC Developer License (1,000 free prototyping credits).
   */
  async generateWithNvidiaNIM({ prompt, negativePrompt = '', width = 1024, height = 1024, steps = 4 }) {
    if (!this.nvidiaKey) {
      throw new Error('NVIDIA NIM API key is unconfigured. Set NVIDIA_NIM_API_KEY in environment.');
    }

    const payload = {
      prompt: prompt,
      negative_prompt: negativePrompt || 'blurry, low quality, distorted text, ugly edges',
      width: Math.min(width, 1024),
      height: Math.min(height, 1024),
      num_inference_steps: steps
    };

    const response = await fetch(`${this.nvidiaEndpoint}/genai/stabilityai/sdxl-turbo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.nvidiaKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NVIDIA NIM generation failed (${response.status}): ${errText}`);
    }

    const result = await response.json();
    return {
      provider: 'nvidia_nim',
      model: config.providers.nvidiaNim.model,
      imageFormat: 'png',
      imageBase64: result.artifacts && result.artifacts[0] ? result.artifacts[0].base64 : (result.image || result.dataUrl),
      costEstimatedUSD: config.providers.nvidiaNim.costPerCall
    };
  }

  /**
   * Generates an image using Gemini Native Multimodal Image Generation.
   * Model: gemini-2.0-flash / gemini-3.1-flash-image (Nano Banana family)
   * License: Google Cloud Platform Terms (Paid tier with resolution-based metering).
   */
  async generateWithGoogleImagen({ prompt, aspectRatio = '1:1', width = 1024, height = 1024 }) {
    if (!this.geminiKey) {
      throw new Error('Gemini API key is unconfigured for image generation. Set GEMINI_API_KEY in environment.');
    }

    const resolutionKey = `${width}x${height}`;
    const dynamicRate = (config.providers.geminiImage.resolutionPricingUSD && config.providers.geminiImage.resolutionPricingUSD[resolutionKey]) || 0.030;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.providers.geminiImage.model}:generateContent?key=${this.geminiKey}`;

    const payload = {
      contents: [{
        parts: [{
          text: `Generate a high quality design image with aspect ratio ${aspectRatio}: ${prompt}`
        }]
      }],
      generationConfig: {
        responseMimeType: 'image/png'
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini Multimodal Image Generation failed (${response.status}): ${errText}`);
    }

    const result = await response.json();
    let base64Image = null;

    if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error('Gemini Image API response did not contain inline image data parts.');
    }

    return {
      provider: 'gemini_image',
      model: config.providers.geminiImage.model,
      imageFormat: 'png',
      imageBase64: base64Image,
      costEstimatedUSD: dynamicRate
    };
  }
}

module.exports = new ImageGenAdapter();
