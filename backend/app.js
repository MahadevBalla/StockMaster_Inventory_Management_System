import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/user.routes.js";
import movementRoutes from "./routes/movements.routes.js";
import warehouseRoutes from "./routes/warehouse.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "module";
import dotenv from "dotenv";
dotenv.config();

// Use require for pdfMake since it doesn't work well with ES modules
const require = createRequire(import.meta.url);
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

// Set the virtual file system (vfs) for pdfMake
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ["http://localhost:8080", "http://localhost:3000"];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" })); // Accept data in JSON format with the specified limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // To handle data that comes from URLs and forms
app.use(express.static("public")); // All static files are in the public folder
app.use(cookieParser());

// Google Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

// Function to analyze data with Gemini
async function analyzeDataWithGemini(data) {
  try {
    const prompt = `Analyze the following inventory data and provide key insights, potential issues, and recommendations: ${JSON.stringify(
      data
    )}`; //
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Function to generate the PDF report using pdfMake
function generatePdfReport(analysisResult, rawData) {
  // Helper function to format inventory data in a more readable way
  function formatInventoryTable(data) {
    // Check if data exists and has the expected structure
    if (!data || data.length === 0) return [];

    // Extract column headers from the first item
    const headers = Object.keys(data[0]);

    // Create the table definition
    return {
      table: {
        headerRows: 1,
        widths: Array(headers.length).fill("*"),
        body: [
          // Header row
          headers.map((header) => ({
            text:
              header.charAt(0).toUpperCase() +
              header.slice(1).replace(/([A-Z])/g, " $1"),
            style: "tableHeader",
          })),
          // Data rows
          ...data.map((item) =>
            headers.map((header) => item[header]?.toString() || "")
          ),
        ],
      },
      layout: {
        fillColor: function (rowIndex) {
          return rowIndex === 0 ? "#CCCCCC" : null;
        },
      },
    };
  }

  // Format the analysis results with bullet points
  function formatAnalysis(text) {
    // Split by lines or potential bullet points
    const sections = text.split(/\n\n|\r\n\r\n/);

    const formattedSections = sections.map((section) => {
      // Check if section already has bullet points
      if (
        section.includes("•") ||
        section.includes("*") ||
        section.includes("-")
      ) {
        return { text: section };
      }

      // Check if section has a title (ends with ':')
      const titleMatch = section.match(/^(.+?):\s*(.*)$/s);
      if (titleMatch) {
        return [
          { text: titleMatch[1] + ":", style: "analysisSubheader" },
          { text: titleMatch[2].trim() },
        ];
      }

      return { text: section };
    });

    return formattedSections.flat();
  }

  // Get current date for the report
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Create the document definition
  const documentDefinition = {
    info: {
      title: "Inventory Analysis Report",
      author: "Inventory Management System",
      subject: "Inventory Analysis",
      keywords: "inventory, analysis, report",
    },
    header: function (currentPage, pageCount) {
      return {
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: "right",
        margin: [0, 10, 20, 0],
        fontSize: 8,
      };
    },
    footer: function (currentPage, pageCount) {
      return {
        text: `Generated on ${formattedDate}`,
        alignment: "center",
        fontSize: 8,
        margin: [0, 0, 0, 10],
      };
    },
    content: [
      // Title
      {
        text: "Inventory Analysis Report",
        style: "header",
        margin: [0, 0, 0, 20],
      },

      // Executive Summary
      {
        text: "Executive Summary",
        style: "subheader",
      },
      {
        text: "This report provides an automated analysis of inventory data using Google's Gemini AI model, highlighting key metrics, trends, and recommendations.",
        margin: [0, 0, 0, 15],
      },

      // Analysis Results
      {
        text: "Analysis Results",
        style: "subheader",
        pageBreak: "before",
      },
      ...formatAnalysis(analysisResult),

      // Raw Data Table
      {
        text: "Inventory Data",
        style: "subheader",
        pageBreak: "before",
        margin: [0, 0, 0, 10],
      },
      {
        text: `Total Items Analyzed: ${rawData.length}`,
        margin: [0, 0, 0, 10],
        bold: true,
      },
      formatInventoryTable(rawData),
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        color: "#2F5496",
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 15, 0, 10],
        color: "#2F5496",
      },
      analysisSubheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
        color: "#2F5496",
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "#000000",
        alignment: "center",
      },
    },
    defaultStyle: {
      fontSize: 11,
      lineHeight: 1.2,
    },
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator.getBuffer((buffer) => {
        resolve(buffer);
      });
    } catch (error) {
      console.error("Error in PDF generation:", error);
      reject(error);
    }
  });
}
// New route for generating the analysis report
app.post("/api/v1/inventory/generate-analysis-report", async (req, res) => {
  try {
    // Assuming you'll send the necessary data in the request body
    const inventoryData = req.body.inventoryData;

    if (
      !inventoryData ||
      !Array.isArray(inventoryData) ||
      inventoryData.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Inventory data is required in the request body." });
    }

    const analysisResult = await analyzeDataWithGemini(inventoryData);
    const pdfBuffer = await generatePdfReport(analysisResult, inventoryData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="inventory_analysis_report.pdf"'
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating inventory analysis report:", error);
    res.status(500).json({
      error: "Failed to generate inventory analysis report",
      details: error.message,
    });
  }
});

// Routes import
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/warehouse", warehouseRoutes);
app.use("/api/v1/movements", movementRoutes);
app.use("/api/v1/alerts", alertsRoutes);
app.use("/api/v1/inventory", inventoryRoutes);

export default app;
