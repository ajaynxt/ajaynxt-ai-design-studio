/**
 * AJAYNXT AI Design Studio — Google Cloud Vision OCR Adapter
 * Extracts text, brand typography, and nutritional declarations from packaging & labels.
 */

const config = require('../config');

class CloudVisionAdapter {
  constructor() {
    this.apiKey = config.providers.cloudVision.apiKey;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  /**
   * Performs high-accuracy OCR on packaging images, label artwork, or posters.
   */
  async extractText({ imageBase64 }) {
    if (!this.apiKey) {
      throw new Error('Google Cloud Vision API key is unconfigured. Set GCP_VISION_KEY in environment.');
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const requestBody = {
      requests: [
        {
          image: { content: cleanBase64 },
          features: [
            { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 },
            { type: 'LABEL_DETECTION', maxResults: 5 }
          ]
        }
      ]
    };

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloud Vision OCR error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const result = data.responses && data.responses[0] ? data.responses[0] : {};

    const fullTextAnnotation = result.fullTextAnnotation || {};
    const textAnnotations = result.textAnnotations || [];
    const labels = (result.labelAnnotations || []).map(l => l.description);

    return {
      provider: 'cloud_vision',
      fullText: fullTextAnnotation.text || (textAnnotations[0] ? textAnnotations[0].description : ''),
      blockCount: fullTextAnnotation.pages ? fullTextAnnotation.pages.length : textAnnotations.length,
      detectedLabels: labels,
      detectedBlocks: textAnnotations.slice(1, 15).map(item => ({
        text: item.description,
        bounds: item.boundingPoly ? item.boundingPoly.vertices : []
      })),
      costEstimatedUSD: 0.0015
    };
  }
}

module.exports = new CloudVisionAdapter();
