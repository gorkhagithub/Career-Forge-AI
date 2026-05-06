
import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return { success: true, data: response.interviewReport, message: response.message }
        } catch (error) {
            console.error("Generate Report Error:", error.message)
            return { success: false, message: error.message || "Failed to generate report" }
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return { success: true, data: response.interviewReport }
        } catch (error) {
            console.error("Get Report Error:", error.message)
            return { success: false, message: error.message || "Failed to fetch report" }
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return { success: true, data: response.interviewReports }
        } catch (error) {
            console.error("Get Reports Error:", error.message)
            return { success: false, message: error.message || "Failed to fetch reports" }
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            // Open resume HTML in a new window and trigger print (user can "Save as PDF")
            const printWindow = window.open("", "_blank")
            if (printWindow) {
                printWindow.document.write(response.html)
                printWindow.document.close()
                printWindow.focus()
                printWindow.onload = () => printWindow.print()
            }
            return { success: true, message: "Resume opened for download" }
        } catch (error) {
            console.error("Generate PDF Error:", error.message)
            return { success: false, message: error.message || "Failed to generate PDF" }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}