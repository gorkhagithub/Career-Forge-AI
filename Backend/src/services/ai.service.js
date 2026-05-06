const Groq = require("groq-sdk");

// Lazy-init: create the AI client only when first needed,
// so that dotenv.config() in server.js has already run.
let ai = null;
function getAI() {
    if (!ai) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not set in environment variables");
        }
        ai = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return ai;
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const systemPrompt = `You are an expert interview assistant. Return ONLY valid JSON. No explanation.

IMPORTANT RULES:
- Do NOT leave arrays empty
- Generate at least:
  - 5 technicalQuestions
  - 3 behavioralQuestions
  - 3 skillGaps
  - 5 preparationPlan days
- matchScore must be between 60-95
- title must be meaningful job role

FORMAT:
{
  "matchScore": number,
  "technicalQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ],
  "behavioralQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ],
  "skillGaps": [
    { "skill": "", "severity": "low" | "medium" | "high" }
  ],
  "preparationPlan": [
    { "day": number, "focus": "", "tasks": [] }
  ],
  "title": string
}`;

    const userPrompt = `Resume: ${resume}\nSelf Description: ${selfDescription}\nJob Description: ${jobDescription}`;

    const response = await getAI().chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
    });

    const responseText = response.choices[0]?.message?.content || "";
    console.log("RAW AI RESPONSE:", responseText);

    let parsed;
    try {
        parsed = JSON.parse(responseText);
    } catch (error) {
        console.error("JSON Parse Error:", responseText);

        // fallback fix (extract JSON)
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) {
            parsed = JSON.parse(match[0]);
        } else {
            throw new Error("Invalid AI response format");
        }
    }

    return parsed;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const systemPrompt = `You are a professional resume writer. Return ONLY valid JSON with a single field "html" containing a complete, self-contained HTML document for an ATS-friendly resume.

IMPORTANT RULES:
- The HTML must include inline CSS styles (no external stylesheets)
- Use a clean, professional layout with proper spacing
- Include sections: Contact Info, Summary, Skills, Experience, Education
- Use the resume content and job description to tailor the resume
- Make it print-friendly (A4 size, proper margins)
- Use a modern, readable font stack

FORMAT:
{
  "html": "<!DOCTYPE html><html>...</html>"
}`;

    const userPrompt = `Resume: ${resume}\nSelf Description: ${selfDescription}\nJob Description: ${jobDescription}`;

    const response = await getAI().chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
    });

    const responseText = response.choices[0]?.message?.content || "";
    let jsonContent;
    try {
        jsonContent = JSON.parse(responseText);
    } catch (error) {
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) {
            jsonContent = JSON.parse(match[0]);
        } else {
            throw new Error("Invalid AI response format for resume PDF");
        }
    }

    // Return the HTML string directly — the frontend will handle PDF creation
    return jsonContent.html;
}

module.exports = { generateInterviewReport, generateResumePdf };

