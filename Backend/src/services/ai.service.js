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

async function generatePdfFromHtml(htmlContent) {
    // Note: Puppeteer implementation would go here
    // For now, returning a placeholder
    return Buffer.from("PDF Generation Placeholder");
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const systemPrompt = `You are a resume generator. Return ONLY valid JSON with a single field "html" containing the HTML of the resume.

The HTML should be well-formatted, professional, ATS-friendly, and 1-2 pages long.

FORMAT:
{
  "html": "<html>...</html>"
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
    const jsonContent = JSON.parse(responseText);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
