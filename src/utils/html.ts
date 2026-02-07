/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const extractHtmlFromText = (text: string): string => {
    const htmlMatch = text.match(/<html[\s\S]*?<\/html>/i);
    if (htmlMatch) {
        return htmlMatch[0];
    }

    // If no <html> tags, try to wrap content if it looks like partial HTML
    if (text.includes('<head') || text.includes('<body') || text.includes('<script')) {
        return `<!DOCTYPE html><html>${text}</html>`;
    }

    return text; // Return as is if nothing found
};

export const hideBodyText = (html: string): string => {
    // Simple regex to find body and insert style to hide direct text nodes
    return html.replace(/<body([\s\S]*?)>/i, '<body$1 style="color: transparent; font-size: 0;">');
};

export const zoomCamera = (html: string): string => {
    // Look for camera position/zoom in three.js code and adjust if needed
    // This is a placeholder for logic that would ensure the object is well-framed
    return html;
};
