// import { createHash } from "crypto";

// export const generate = (productName) => {
//   // Create SHA-256 hash from product name
//   const hash = createHash("sha256").update(productName).digest("base64");

//   // Clean and format to match schema requirements
//   return hash
//     .replace(/[+/=]/g, "") // Remove problematic characters
//     .slice(0, 30) // Truncate to max length
//     .padEnd(30, "0") // Ensure minimum length
//     .replace(/(.{5})/g, "$1-") // Add human-readable formatting
//     .slice(0, 29); // Maintain exact 30 characters
// };
// export default generate;
