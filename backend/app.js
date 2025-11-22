import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/user.routes.js";
import movementRoutes from "./routes/movements.routes.js";
import warehouseRoutes from "./routes/warehouse.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import receiptRoutes from "./routes/receipt.routes.js";
import deliveryOrderRoutes from "./routes/deliveryOrder.routes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "module";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();
const upload = multer();

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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
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
    // 1. Define the schema we want Gemini to follow
    const schemaDescription = `
      Return a strict JSON object with the following structure:
      {
        "executiveSummary": "A professional paragraph summarizing the overall status.",
        "keyInsights": ["Insight 1", "Insight 2", ...],
        "potentialRisks": ["Risk 1", "Risk 2", ...],
        "recommendations": ["Recommendation 1", "Recommendation 2", ...]
      }
    `;

    const prompt = `
      Analyze the following inventory data. 
      ${schemaDescription}
      
      Do not use Markdown formatting (no **bold** or ## headers) inside the JSON values.
      Data: ${JSON.stringify(data)}
    `;

    // 2. Set response MIME type to JSON (Supported in newer Gemini models)
    const generationConfig = {
      temperature: 0.7,
      responseMimeType: "application/json",
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();

    // 3. Parse the JSON string into a JavaScript Object
    return JSON.parse(text);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback object in case AI fails to generate valid JSON
    return {
      executiveSummary: "Error analyzing data.",
      keyInsights: [],
      potentialRisks: [],
      recommendations: []
    };
  }
}

function flattenObject(obj, parentKey = "", result = {}) {
  for (let key in obj) {
    const newKey = parentKey ? `${parentKey}_${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

function convertToCSV(dataArray) {
  if (!dataArray || dataArray.length === 0) return "";

  const flatData = dataArray.map((item) => flattenObject(item));

  const headers = Object.keys(flatData[0]);

  const rows = flatData.map((row) =>
    headers.map((header) => (row[header] !== undefined ? row[header] : "")).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

function generatePdfReport(analysisResult) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Section builder
  const createSection = (title, items, color = "#000000") => {
    if (!items || items.length === 0) return null;

    return [
      { text: title, style: "analysisSubheader" },
      {
        ul: items,
        margin: [10, 0, 0, 10],
        color,
      },
    ];
  };

  const documentDefinition = {
    info: { title: "Inventory Analysis Report" },

    header: (currentPage, pageCount) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: "right",
      margin: [0, 10, 20, 0],
      fontSize: 8,
    }),

    footer: () => ({
      text: `Generated on ${formattedDate}`,
      alignment: "center",
      fontSize: 8,
      margin: [0, 0, 0, 10],
    }),

    content: [
      { text: "Inventory Analysis Report", style: "header", margin: [0, 0, 0, 20] },

      // Summary
      { text: "Executive Summary", style: "subheader" },
      {
        text: analysisResult.executiveSummary || "No summary available.",
        margin: [0, 0, 0, 15],
      },

      // Insights
      createSection("Key Insights", analysisResult.keyInsights),

      // Risks
      createSection("Potential Risks & Issues", analysisResult.potentialRisks, "#C00000"),

      // Recommendations
      createSection("Strategic Recommendations", analysisResult.recommendations),
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
        fontSize: 13,
        bold: true,
        margin: [0, 10, 0, 5],
        color: "#4472C4",
      },
    },

    defaultStyle: { fontSize: 11, lineHeight: 1.2 },
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator.getBuffer((buffer) => resolve(buffer));
    } catch (error) {
      reject(error);
    }
  });
}

app.post(
  "/api/v1/inventory/generate-analysis-report",
  upload.none(),
  async (req, res) => {
    try {
      const inventoryData = req.body.inventoryData;

      if (!inventoryData || !Array.isArray(inventoryData)) {
        return res.status(400).json({ error: "Inventory data required." });
      }

      const analysis = await analyzeDataWithGemini(inventoryData);

      const pdfBuffer = await generatePdfReport(analysis);

      const csvString = convertToCSV(inventoryData);

      res.status(200).set({
        "Content-Type": "multipart/mixed; boundary=Boundary123",
      });

      const responseBody =
        `--Boundary123
Content-Type: application/pdf
Content-Disposition: attachment; filename="inventory_analysis_report.pdf"

` +
        pdfBuffer.toString("binary") +
        `
--Boundary123
Content-Type: text/csv
Content-Disposition: attachment; filename="inventory_export.csv"

` +
        csvString +
        `
--Boundary123--`;

      res.end(responseBody, "binary");
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to generate report",
        details: err.message,
      });
    }
  }
);

// Routes import
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/warehouse", warehouseRoutes);
app.use("/api/v1/movements", movementRoutes);
app.use("/api/v1/alerts", alertsRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/receipts", receiptRoutes);
app.use("/api/v1/delivery-orders", deliveryOrderRoutes);

export default app;
