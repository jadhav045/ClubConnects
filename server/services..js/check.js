const GEMINI_API_KEY = "AIzaSyCErJZb_5q81tOcEEVQbGpKsloWvSJ4Shk";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const qaList = [
    {
        category: "planning",
        question: "What type of event was it?",
        answer:
            "WORKSHOP - Advanced Web Development Workshop focused on modern JavaScript frameworks and responsive design techniques.",
    },
    {
        category: "planning",
        question: "When and where was it held?",
        answer:
            "The workshop was conducted on March 18-19, 2025 at the Computer Science Department's Innovation Lab, which was equipped with high-speed internet and individual workstations for all participants.",
    },
    {
        category: "planning",
        question: "Who organized the event?",
        answer:
            "It was organized by the Computer Science Student Association in collaboration with TechMinds Inc., a leading software development company. Planning included curriculum development, instructor coordination, and preparation of hands-on coding exercises.",
    },
    {
        category: "execution",
        question: "How was the event executed?",
        answer:
            "The workshop followed a blend of theoretical sessions and practical coding exercises. Each module started with a 45-minute presentation followed by a 90-minute guided coding session where participants implemented what they learned with instructor support.",
    },
    {
        category: "execution",
        question: "What was the duration?",
        answer:
            "The workshop ran from 9:00 AM to 5:00 PM over two consecutive days, with structured breaks for networking and refreshments. Each day covered different frameworks with progressive complexity.",
    },
    {
        category: "participation",
        question: "Who participated?",
        answer:
            "The workshop attracted 45 participants, primarily third and fourth-year computer science students, along with a few industry professionals seeking to update their skills. Several faculty members also attended the sessions.",
    },
    {
        category: "participation",
        question: "Was the turnout good?",
        answer:
            "The turnout exceeded expectations, with all available seats filled and a waiting list of 20 additional interested participants. The high demand demonstrated significant interest in advanced web development skills.",
    },
    {
        category: "feedback",
        question: "What was the general feedback?",
        answer:
            "Participant feedback was highly positive, with an average rating of 4.8/5. Attendees particularly appreciated the hands-on approach, the quality of coding exercises, and the expertise of the instructors from TechMinds Inc.",
    },
    {
        category: "problems",
        question: "Were there any problems?",
        answer:
            "Some technical difficulties occurred with the lab's network during peak usage times, causing occasional delays. Additionally, a few beginners found the pace challenging, prompting instructors to provide additional support during breaks.",
    },
    {
        category: "support",
        question: "Who supported the event?",
        answer:
            "TechMinds Inc. provided three senior developers as instructors and contributed learning materials. The department offered technical infrastructure, while the college administration supported with funding for refreshments and workshop materials.",
    },
    {
        category: "suggestions",
        question: "Were there any suggestions?",
        answer:
            "Participants suggested creating separate tracks for beginners and advanced learners, extending the workshop duration, and providing pre-workshop reading materials. Many requested recordings of the sessions for future reference.",
    },
    {
        category: "outcome",
        question: "What was the outcome?",
        answer:
            "Each participant developed a fully functional responsive web application using modern frameworks. Ten exceptional projects were selected for showcase on the department's innovation portal. Several students secured internship interviews with TechMinds Inc. following the workshop.",
    },
];
// Extract event type from the first question's answer
function extractEventType(qaList) {
    const eventTypeAnswer = qaList.find(qa => 
        qa.question === "What type of event was it?")?.answer || "";
    
    if (eventTypeAnswer.includes("WORKSHOP")) return "WORKSHOP";
    if (eventTypeAnswer.includes("SEMINAR")) return "SEMINAR";
    if (eventTypeAnswer.includes("SOCIAL")) return "SOCIAL";
    if (eventTypeAnswer.includes("BLOOD DONATION") || 
        eventTypeAnswer.includes("SOCIAL ACTIVITY")) return "SOCIAL";
    if (eventTypeAnswer.includes("SPORTS")) return "SPORTS";
    if (eventTypeAnswer.includes("EDUCATION")) return "EDUCATION";
    if (eventTypeAnswer.includes("TECH")) return "TECH";
    if (eventTypeAnswer.includes("CULTURAL")) return "CULTURAL";
    
    return "OTHER";
}

function formatCategoryTitle(category, eventType) {
    // Base titles that apply to any event type
    const baseTitles = {
        planning: "Planning and Preparation",
        execution: "Execution and Flow",
        feedback: "Feedback and Impressions",
        problems: "Challenges and Obstacles",
        suggestions: "Suggestions for Improvement",
        outcome: "Outcomes and Achievements",
        support: "Support and Contributions",
        participation: "Participation and Involvement",
    };
    
    // Event-specific title overrides
    const eventSpecificTitles = {
        "WORKSHOP": {
            planning: "Workshop Design and Preparation",
            execution: "Workshop Delivery and Activities",
            participation: "Attendee Engagement and Participation",
            outcome: "Skills Acquired and Knowledge Transfer"
        },
        "SEMINAR": {
            planning: "Seminar Organization and Speaker Arrangements",
            execution: "Presentation Flow and Discussion Sessions",
            participation: "Audience Engagement and Questions",
            outcome: "Knowledge Dissemination and Insights Gained"
        },
        "SOCIAL": {
            planning: "Social Initiative Planning and Outreach",
            execution: "Community Service Implementation",
            participation: "Volunteer Engagement and Community Response",
            outcome: "Social Impact and Community Benefit"
        },
        "SPORTS": {
            planning: "Tournament Planning and Logistics",
            execution: "Event Proceedings and Match Management",
            participation: "Player and Team Involvement",
            outcome: "Athletic Achievements and Sportsmanship"
        },
        "EDUCATION": {
            planning: "Educational Program Development",
            execution: "Learning Session Implementation",
            participation: "Student Engagement and Interaction",
            outcome: "Learning Outcomes and Knowledge Acquisition"
        },
        "TECH": {
            planning: "Technical Event Planning and Setup",
            execution: "Technology Demonstration and Proceedings",
            participation: "Tech Enthusiast Engagement",
            outcome: "Innovation Highlights and Technical Accomplishments"
        },
        "CULTURAL": {
            planning: "Cultural Program Curation",
            execution: "Performance Flow and Stage Management",
            participation: "Performer and Audience Engagement",
            outcome: "Cultural Expression and Audience Experience"
        }
    };
    
    // Use event-specific title if available, otherwise fall back to base title
    return (eventSpecificTitles[eventType]?.[category] || 
            baseTitles[category] || 
            category.charAt(0).toUpperCase() + category.slice(1));
}

function groupByCategory(qaList) {
    const grouped = {};
    qaList.forEach(({ category, question, answer }) => {
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push({ question, answer });
    });
    return grouped;
}

function buildStructuredGeminiPrompt(qaList) {
    const eventType = extractEventType(qaList);
    const grouped = groupByCategory(qaList);
    
    const eventTypeTitleMap = {
        WORKSHOP: "Empowering Through Practice: Workshop Summary",
        SEMINAR: "Knowledge Exchange: Seminar Report",
        SOCIAL: "Serving the Community: Social Outreach Report",
        SPORTS: "Unleashing Energy: Sports Event Report",
        EDUCATION: "Shaping Minds: Educational Event Summary",
        TECH: "Innovating Together: Tech Event Report",
        CULTURAL: "Celebrating Culture: Cultural Event Summary",
        OTHER: "Event Summary",
    };

    const mainTitle = eventTypeTitleMap[eventType] || "Event Summary";

    let prompt = `Write a formal event report with the following requirements:\n`;
    prompt += `- Use the main title: "${mainTitle}".\n`;
    prompt += `- For each section (based on category), write a short subheading and convert the Q&A into a complete, professional paragraph.\n`;
    prompt += `- Each section should be contextually relevant to a ${eventType.toLowerCase()} event.\n`;
    prompt += `- Do not use bullet points. Include all provided details.\n\n`;

    Object.entries(grouped).forEach(([category, qas]) => {
        const sectionTitle = formatCategoryTitle(category, eventType);
        prompt += `Section: ${sectionTitle}\n`;
        qas.forEach(({ question, answer }) => {
            prompt += `Q: ${question}\nA: ${answer}\n`;
        });
        prompt += `\n`;
    });

    prompt += `\nGenerate the final report accordingly.`;

    return {
        prompt,
        eventType
    };
}

// Generate the prompt
const { prompt: geminiPrompt, eventType } = buildStructuredGeminiPrompt(qaList);

// Display what would be sent to Gemini
console.log("Event Type Detected:", eventType);
console.log("Structured Prompt:", geminiPrompt);

// Make the API call
fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        contents: [
            {
                parts: [{ text: geminiPrompt }],
            },
        ],
    }),
})
    .then((res) => res.json())
    .then((data) => {
        const responseText = data.candidates[0].content.parts[0].text;
        console.log("Structured Event Summary:\n", responseText);
        
        // Here you would typically update your UI with the response
        // document.getElementById('report').innerHTML = responseText;
    })
    .catch((err) => console.error("Gemini API error:", err));