import path from "path";

const collegeLogo =
	"https://res.cloudinary.com/dlhjllguo/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1744283787/logo_k3kuwe.png";
export const generateReportHTML = (event) => {
	// Full absolute path to your logo

	const localPath = path.resolve("server/utils/nss logo.jpeg"); // Resolves to full path
	const logoPath = `file://${localPath
		.replace(/\\/g, "/")
		.replace(/ /g, "%20")}`;

	const {
		eventTitle,
		eventDate,
		organizer,
		eventType,
		summary,
		report,
		images,
		venue,
		signatures = [
			{
				name: "Aadesh Patil",
				role: "President, NSS",
				affiliation: "VIIT, Pune",
			},
			{
				name: "Prof. Vikas Kolekar",
				role: "NSS Co-ordinator",
				affiliation: "VIIT, Pune",
			},
			{
				name: "Dr. Nitin Sakhare",
				role: "Program Officer",
				affiliation: "VIIT, Pune",
			},
		],
		photoLink, // optional: link to shared drive or gallery
	} = event;

	const renderSection = (title, items = []) => {
		if (!items.length) return "";
		return `
			<h2 class="section-title">${title}</h2>
			${items
				.map((q) => `<p><strong>${q.question}</strong><br/>${q.answer}</p>`)
				.join("")}
		`;
	};

	const renderSignatures = () => {
		if (!signatures.length) return "";
		return `
			<div class="signature-block">
				${signatures
					.map(
						(sig) => `
						<div class="signature">
							<p><strong>${sig.name}</strong><br/>
							${sig.role}<br/>
							${sig.affiliation}</p>
						</div>`
					)
					.join("")}
			</div>
		`;
	};

	return `
  <html>
    <head>
      <style>
        body {
          font-family: Georgia, serif;
          padding: 50px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .header .accreditation {
          font-size: 13px;
          color: #666;
        }
        .header .nss {
          font-weight: bold;
          font-size: 16px;
          color: #d22;
          margin-top: 8px;
        }
        h2.section-title {
          margin-top: 30px;
          font-size: 20px;
          color: #222;
        }
        .meta {
          font-size: 14px;
          margin: 20px 0;
          padding: 10px;
          background-color: #f5f5f5;
          border-left: 4px solid #ccc;
        }
        .meta p {
          margin: 4px 0;
        }
        img {
          max-width: 100%;
          margin: 15px 0;
          border-radius: 6px;
        }
        .signature-block {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
        }
        .signature {
          width: 30%;
          font-size: 14px;
          text-align: center;
        }
        .photo-link {
          margin-top: 40px;
          font-size: 14px;
          text-align: center;
        }
      </style>
    </head>

    <body>
  <div class="header" style="display: flex; align-items: center; justify-content: space-between; padding: 10px;">
  <img src="${organizer.logo}" alt="nss logo" style="width: 100px;" />

  <div style="text-align: center; flex: 1;">
    <h3><i>Bansilal Ramnath Agarwal Charitable Trust’s</i></h3>
    <h1>Vishwakarma Institute of Information Technology, Pune</h1>
    <div class="accreditation">
      (An Autonomous Institute Affiliated to Savitribai Phule Pune University)<br/>
      NAAC Accredited with ‘A’ Grade, ISO 9001: 2015 Certified Institute
    </div>
    <div class="nss">${organizer.clubName}</div>
  </div>

  <img src="${collegeLogo}" alt="nss logo" style="width: 100px;" />
</div>


      <h2 style="text-align:center;">${eventTitle || "Event Title"}</h2>

      <div class="meta">
        <p><strong>Date:</strong> ${new Date(eventDate).toDateString()}</p>
        <p><strong>Venue:</strong> ${venue || "NSS Camp Location"}</p>
        <p><strong>Organized by:</strong> ${organizer.clubName}</p>
        <p><strong>Event Type:</strong> ${eventType}</p>
      </div>

      <h2 class="section-title">📋 Summary</h2>
      <p>${summary}</p>

      ${renderSection("🧠 Planning", report.planning)}
      ${renderSection("⚙️ Execution", report.execution)}
      ${renderSection("👥 Participation", report.participation)}
      ${renderSection("🤝 Support", report.support)}
      ${renderSection("🏁 Outcome", report.outcome)}
      ${renderSection("🚧 Problems Faced", report.problems)}
      ${renderSection("🗣️ Feedback", report.feedback)}
      ${renderSection("💡 Suggestions", report.suggestions)}

      ${
				images?.group_photo
					? `<h2 class="section-title">📸 Group Photo</h2><img src="${images.group_photo}" />`
					: ""
			}
      ${
				images?.setup_photo
					? `<h2 class="section-title">🧰 Setup Photo</h2><img src="${images.setup_photo}" />`
					: ""
			}
      ${
				photoLink
					? `<div class="photo-link"><strong>More Photos:</strong> <a href="${photoLink}">${photoLink}</a></div>`
					: ""
			}
      ${renderSignatures()}
    </body>
  </html>
  `;
};
