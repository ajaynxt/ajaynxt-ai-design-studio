/**
 * AJAYNXT AI Design Studio — Image Generation Provider Adapter
 * Supported verified engines:
 * 1. NVIDIA NIM (Microservices on NGC - SDXL Turbo / FLUX)
 * 2. Google Imagen 3 (Vertex AI / Gemini Image Models)
 */

const config = require('../config');

class ImageGenAdapter {
  constructor() {
    this.nvidiaKey = config.providers.nvidiaNim.apiKey;
    this.nvidiaEndpoint = config.providers.nvidiaNim.endpoint;
    this.imagenKey = config.providers.googleImagen.apiKey;
  }

  /**
   * Generates an image using NVIDIA NIM Microservices.
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
   * Generates an image using Google Imagen 3.
   * Model: imagen-3.0-generate-002
   * License: Google Cloud Terms (Paid per generated image).
   */
  async generateWithGoogleImagen({ prompt, aspectRatio = '1:1', sampleCount = 1 }) {
    if (!this.imagenKey) {
      throw new Error('Google Imagen API key is unconfigured. Set IMAGEN_API_KEY in environment.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${this.imagenKey}`;

    const payload = {
      instances: [{ prompt: prompt }],
      parameters: {
        sampleCount: sampleCount,
        aspectRatio: aspectRatio,
        outputOptions: { mimeType: 'image/png' }
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Imagen 3 failed (${response.status}): ${errText}`);
    }

    const result = await response.json();
    const predictions = result.predictions || [];
    const base64Image = predictions[0] ? (predictions[0].bytesBase64Encoded || predictions[0].image) : null;

    if (!base64Image) {
      throw new Error('Imagen 3 response did not contain image data.');
    }

    return {
      provider: 'google_imagen',
      model: 'imagen-3.0-generate-002',
      imageFormat: 'png',
      imageBase64: base64Image,
      costEstimatedUSD: config.providers.googleImagen.costPerImage
    };
  }
}

module.exports = new ImageGenAdapter();
