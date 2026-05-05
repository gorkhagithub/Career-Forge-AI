
const { PDFParse } = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */


async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body

        // Parse resume PDF if uploaded
        let resumeContent = ""
        if (req.file) {
            const parser = new PDFParse({})
            await parser.load(req.file.buffer)
            const totalPages = (await parser.getInfo()).totalPages
            let textParts = []
            for (let i = 1; i <= totalPages; i++) {
                textParts.push(await parser.getText(i))
            }
            resumeContent = textParts.join("\n")
            parser.destroy()
        }

        // Require at least a resume OR self-description
        if (!resumeContent && !selfDescription) {
            return res.status(400).json({ message: "Either a resume file or self description is required" })
        }

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required" })
        }

        // ✅ Call the REAL AI service
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription
        })

        // ✅ CREATE REPORT in database
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            title: interViewReportByAi.title || "Interview Report",
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (err) {
        console.error("Generate Interview Report Error:", err)
        res.status(500).json({ message: err.message })
    }
}




/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Get Interview Report Error:", err)
        res.status(500).json({ message: err.message })
    }
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (err) {
        console.error("Get All Interview Reports Error:", err)
        res.status(500).json({ message: err.message })
    }
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (err) {
        console.error("Generate Resume PDF Error:", err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }