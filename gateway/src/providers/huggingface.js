/**
 * AJAYNXT AI Design Studio — Hugging Face Inference Provider Adapter
 * For experimental rapid prototyping with open-weights models (FLUX.1 / SDXL).
 */

const config = require('../config');

class HuggingFaceAdapter {
  constructor() {
    this.token = config.providers.huggingFace.apiKey;
    this.defaultModel = config.providers.huggingFace.model;
    this.endpoint = config.providers.huggingFace.endpoint;
  }

  isAvailable() {
    return Boolean(this.token && this.token.length > 5);
  }

  /**
   * Generates creative experimental visual assets via Hugging Face Serverless API.
   */
  async generateExperiment({ prompt, model = null }) {
    if (!this.token) {
      throw new Error('Hugging Face API token is unconfigured. Set HF_TOKEN in environment.');
    }

    const selectedModel = model || this.defaultModel;
    const url = `${this.endpoint}${selectedModel}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'image/jpeg'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Hugging Face inference error (${response.status}): ${errText}`);
    }

    const arrayBuf = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString('base64');

    return {
      provider: 'hugging_face',
      model: selectedModel,
      dataUrl: `data:image/jpeg;base64,${base64}`,
      costEstimatedUSD: 0.0 // Free serverless tier subject to rate limits
    };
  }
}

module.exports = new HuggingFaceAdapter();
