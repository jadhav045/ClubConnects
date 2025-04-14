import puppeteer from "puppeteer-core";
import { generateReportHTML } from "./generateReportHTML.js";
import fs from "fs";

const CHROME_PATH =
	"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; // Adjust if yours is different

export const generateReportPDF = async (
	eventData,
	outputPath = "report.pdf"
) => {
	console.log("EventData",eventData);
	const htmlContent = generateReportHTML(eventData);

	const browser = await puppeteer.launch({
		executablePath: CHROME_PATH,
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	const page = await browser.newPage();

	await page.setContent(htmlContent, { waitUntil: "networkidle0" });

	await page.pdf({
		path: outputPath,
		format: "A4",
		printBackground: true,
	});

	await browser.close();

	return outputPath;
};

