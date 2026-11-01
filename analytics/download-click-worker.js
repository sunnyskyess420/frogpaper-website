/**
 * Cloudflare Worker for FrogPaper Download Click Tracking
 *
 * This worker receives download click events via navigator.sendBeacon()
 * and writes them to Cloudflare Analytics Engine.
 *
 * Privacy-focused: No cookies, no PII, no fingerprints.
 * Stores only: platform, page, direct/fallback flag, timestamp, device class.
 */

export default {
  async fetch(request, env) {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();

      // Validate required fields
      const required = ['platform', 'page', 'isDirect', 'deviceClass'];
      for (const field of required) {
        if (data[field] === undefined || data[field] === null) {
          return new Response(`Missing required field: ${field}`, { status: 400 });
        }
      }

      // Validate platform
      if (!['windows', 'android'].includes(data.platform)) {
        return new Response('Invalid platform', { status: 400 });
      }

      // Validate device class
      if (!['desktop', 'mobile', 'tablet'].includes(data.deviceClass)) {
        return new Response('Invalid device class', { status: 400 });
      }

      // Validate isDirect is boolean
      if (typeof data.isDirect !== 'boolean') {
        return new Response('isDirect must be boolean', { status: 400 });
      }

      // Write to Analytics Engine
      await env.ANALYTICS.writeDataPoint({
        blobs: [data.platform, data.page, data.deviceClass],
        doubles: [data.isDirect ? 1 : 0],
        indexes: [data.platform],
      });

      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Error processing click event:', error);
      return new Response('Internal server error', { status: 500 });
    }
  },
};
