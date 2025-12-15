# Privacy Policy for ASSETO AI Generate

**Last Updated:** December 13, 2025  
**Effective Date:** December 13, 2025  
**Version:** 1.0

---

## Overview

ASSETO AI Generate ("we", "our", "the Plugin") is a Figma plugin that generates images using Google's Gemini AI technology. This privacy policy describes how we handle your data when you use our Plugin.

**Plugin Developer:** Yosep Rendi  
**Contact:** support.asseto@gmail.com  
**Plugin Type:** Figma Desktop Plugin

---

## Data We Collect

### 1. API Keys (Stored Locally Only)
- **What:** Your Google AI Studio API key
- **How Stored:** Locally in your browser's Figma client storage
- **Purpose:** To authenticate your requests to Google AI API
- **Transmission:** Never transmitted to us or any third party (except Google AI API for authentication)
- **Duration:** Stored until you manually delete it or clear plugin data

### 2. User Prompts (Not Stored)
- **What:** Text descriptions you enter to generate images
- **How Used:** Sent directly to Google AI API to generate images
- **Storage:** We do NOT store, log, or retain your prompts
- **Transmission:** Only sent to Google AI API via HTTPS

### 3. Reference Images (Temporary Only)
- **What:** Images you optionally upload as style references
- **How Used:** Temporarily sent to Google AI API for style analysis
- **Storage:** We do NOT store or retain reference images
- **Transmission:** Only sent to Google AI API via HTTPS

### 4. Generated Images (Temporary Display Only)
- **What:** AI-generated images created from your prompts
- **How Used:** Displayed in plugin UI and can be inserted into your Figma file
- **Storage:** We do NOT store generated images on external servers
- **Retention:** Images exist only in your browser session and Figma file

---

## What We DON'T Collect

We do NOT collect, store, or transmit:
- ❌ Personal information (name, email, address, etc.)
- ❌ Payment information
- ❌ Figma file contents
- ❌ Usage analytics or tracking data
- ❌ Device information
- ❌ IP addresses
- ❌ Browsing history

---

## How We Use Your Data

### API Key Usage
Your Google AI API key is used solely to:
1. Authenticate requests to Google AI API
2. Generate images based on your prompts
3. Enable plugin functionality

**We do NOT:**
- Store API keys on external servers
- Share API keys with third parties
- Use API keys for any purpose other than image generation

### Prompt Usage
Your prompts are used solely to:
1. Generate images via Google AI API
2. Display generated images in the plugin

**We do NOT:**
- Store or log prompts
- Analyze prompt content
- Share prompts with third parties (except Google AI)

---

## Data Sharing and Third Parties

### Google AI API (Required)
- **What is shared:** Your prompts, reference images, and API key
- **Purpose:** To generate AI images
- **Privacy Policy:** https://policies.google.com/privacy
- **Terms of Service:** https://ai.google.dev/gemini-api/terms
- **Security:** All data transmitted via HTTPS encryption

### No Other Third Parties
We do NOT share your data with any other third parties, including:
- ❌ Analytics services
- ❌ Advertising networks
- ❌ Marketing platforms
- ❌ Data brokers

---

## Data Security

### Security Measures
1. **Local Storage:** API keys stored securely in Figma's client storage
2. **HTTPS Encryption:** All network requests use HTTPS
3. **No External Servers:** We do not operate servers that store your data
4. **Minimal Access:** Plugin requests only necessary permissions
5. **Network Restrictions:** Network access limited to Google AI API only

### Plugin Security Features
```json
// manifest.json - Network access limited
"networkAccess": {
  "allowedDomains": [
    "https://generativelanguage.googleapis.com"
  ]
}
```

---

## Your Rights and Control

### You Have the Right To:
1. ✅ **Delete your API key** - Clear plugin data anytime
2. ✅ **Stop using the plugin** - Uninstall at any time
3. ✅ **Control what you generate** - Full control over prompts and images
4. ✅ **Access this policy** - Always available in plugin

### How to Exercise Your Rights:

**Delete API Key:**
1. Close the plugin
2. Right-click plugin in Figma menu
3. Select "Remove plugin data"
4. Your API key is deleted

**Uninstall Plugin:**
1. Figma menu → Plugins → Manage plugins
2. Find "ASSETO AI Generate"
3. Click "Remove"

---

## Data Retention

| Data Type | Retention Period | Location |
|-----------|-----------------|----------|
| API Keys | Until manually deleted | Figma client storage (local) |
| Prompts | Not retained | N/A |
| Reference Images | Not retained | N/A |
| Generated Images | Session only | Browser memory |

---

## Children's Privacy

This Plugin is not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with information, please contact us.

---

## International Data Transfers

When you use this Plugin:
- Your data may be sent to Google AI API servers (which may be located internationally)
- Google's data handling practices apply: https://policies.google.com/privacy
- We do not control or store data on international servers

---

## Changes to This Privacy Policy

We may update this privacy policy from time to time. Changes will be:
- Posted with a new "Last Updated" date
- Effective immediately upon posting
- Significant changes will be highlighted in plugin UI

**How to stay informed:**
- Check this policy periodically
- Review version history in our repository
- Contact us with questions

---

## Legal Basis for Processing (GDPR)

If you are in the European Economic Area (EEA), our legal basis for processing your data is:
- **Consent:** You provide your API key voluntarily
- **Legitimate Interest:** To provide plugin functionality
- **Contract:** To fulfill our service to you

---

## California Privacy Rights (CCPA)

If you are a California resident, you have the right to:
- Know what personal information is collected
- Know if personal information is sold or disclosed
- Say no to the sale of personal information
- Access your personal information
- Request deletion of personal information

**Note:** We do NOT sell personal information. We do NOT collect personal information as defined by CCPA.

---

## Contact Information

For privacy-related questions or concerns:

**Email:** support.asseto@gmail.com  
**Response Time:** Within 48 hours  
**Issues/Bugs:** https://github.com/[your-username]/asseto/issues

---

## Third-Party Services

### Google AI API (Gemini)
This Plugin uses Google AI's Gemini API to generate images.

**Google's Policies:**
- Privacy Policy: https://policies.google.com/privacy
- Terms of Service: https://ai.google.dev/gemini-api/terms
- Data Usage: https://ai.google.dev/gemini-api/docs/data-usage

**What Google May Collect:**
- Your prompts (to generate images)
- Your API key (for authentication)
- Usage data (per their policy)

**Important:** Google's privacy practices are independent of ours. Please review their privacy policy.

---

## Data Protection Officer (DPO)

For data protection inquiries in the EEA:

**Contact:** support.asseto@gmail.com  
**Subject Line:** "Data Protection Inquiry - ASSETO"

---

## Cookies and Tracking

**We do NOT use:**
- ❌ Cookies
- ❌ Web beacons
- ❌ Tracking pixels
- ❌ Analytics tools
- ❌ Advertising trackers

---

## Your Consent

By using ASSETO AI Generate, you consent to:
1. This privacy policy
2. Data transmission to Google AI API (for image generation)
3. Local storage of your API key
4. Processing as described in this policy

**You can withdraw consent** by deleting your API key and uninstalling the plugin.

---

## Compliance

This Plugin complies with:
- ✅ Figma Plugin Review Guidelines
- ✅ General Data Protection Regulation (GDPR)
- ✅ California Consumer Privacy Act (CCPA)
- ✅ Google AI API Terms of Service

---

## Disclaimers

### No Affiliation
This Plugin is NOT affiliated with, endorsed by, or sponsored by:
- Figma, Inc.
- Google LLC
- Any other third party

### No Warranty
This Plugin is provided "as is" without warranty of any kind. Use at your own risk.

### Generated Content
- You are responsible for generated content
- Ensure compliance with applicable laws
- Review Google AI's usage policies
- Respect intellectual property rights

---

## Updates and Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 13, 2025 | Initial privacy policy |

---

## Questions or Concerns?

If you have questions about this privacy policy or our data practices:

**Email:** support.asseto@gmail.com  
**Subject:** "Privacy Policy Question"  
**Response Time:** Within 48 hours

---

## Acknowledgment

By clicking "Save and Continue" on the API key setup screen, you acknowledge that you have read and understood this privacy policy.

---

**End of Privacy Policy**

*This document was last updated on December 13, 2025.*
