/**
 * AJAYNXT AI Design Studio — Background Removal Provider Adapter
 * Primary: Photoroom API
 * Alternative: remove.bg API
 */

const config = require('../config');

class BgRemovalAdapter {
  constructor() {
    this.photoroomKey = config.providers.photoroom.apiKey;
    this.photoroomEndpoint = config.providers.photoroom.endpoint;
    this.removeBgKey = config.providers.removeBg.apiKey;
    this.removeBgEndpoint = config.providers.removeBg.endpoint;
  }

  /**
   * Cuts out image background using Photoroom Studio API.
   */
  async removeWithPhotoroom({ imageBase64, format = 'png' }) {
    if (!this.photoroomKey) {
      throw new Error('Photoroom API key is unconfigured. Set PHOTOROOM_API_KEY in environment.');
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    // Photoroom expects multipart form data with image_file
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const postData = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image_file"; filename="input.png"\r\nContent-Type: image/png\r\n\r\n`),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const response = await fetch(this.photoroomEndpoint, {
      method: 'POST',
      headers: {
        'x-api-key': this.photoroomKey,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Accept': 'image/png'
      },
      body: postData
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Photoroom API error (${response.status}): ${errText}`);
    }

    const outputBuffer = await response.arrayBuffer();
    const outputBase64 = Buffer.from(outputBuffer).toString('base64');

    return {
      provider: 'photoroom',
      format: 'png',
      hasAlpha: true,
      dataUrl: `data:image/png;base64,${outputBase64}`,
      costEstimatedUSD: config.providers.photoroom.costPerCall
    };
  }

  /**
   * Alternative: remove.bg API
   */
  async removeWithRemoveBg({ imageBase64, size = 'auto' }) {
    if (!this.removeBgKey) {
      throw new Error('remove.bg API key is unconfigured. Set REMOVE_BG_API_KEY in environment.');
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch(this.removeBgEndpoint, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.removeBgKey,
        'Content-Type': 'application/json',
        'Accept': 'image/png'
      },
      body: JSON.stringify({
        image_file_b64: cleanBase64,
        size: size,
        format: 'png'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`remove.bg API error (${response.status}): ${errText}`);
    }

    const outputBuffer = await response.arrayBuffer();
    const outputBase64 = Buffer.from(outputBuffer).toString('base64');

    return {
      provider: 'remove_bg',
      format: 'png',
      hasAlpha: true,
      dataUrl: `data:image/png;base64,${outputBase64}`,
      costEstimatedUSD: config.providers.removeBg.costPerCall
    };
  }
}

module.exports = new BgRemovalAdapter();
