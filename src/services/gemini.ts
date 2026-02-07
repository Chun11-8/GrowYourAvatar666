import { GoogleGenAI } from "@google/genai";
import { VOXEL_TEMPLATE } from "../data/voxelTemplate";

// Lazy initialization helper
let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
    if (!genAI) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
        if (!apiKey) {
            throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
        }
        console.log("Initializing Gemini with key:", apiKey ? "Present (Starts with " + apiKey.substring(0, 4) + ")" : "Missing");
        genAI = new GoogleGenAI({ apiKey: apiKey });
    }
    return genAI;
};

// Internal helper for backward compatibility within this file
const ai = {
    get models() {
        return getGenAI().models;
    },
    generateContent: (args: any) => getGenAI().models.generateContent(args),
    generateContentStream: (args: any) => getGenAI().models.generateContentStream(args)
};

export const IMAGE_SYSTEM_PROMPT = "Generate an isolated object/scene on a simple background.";

export const VOXEL_PROMPT = `
I have provided an image. Write the JavaScript code to build a **Voxel Character** using the provided helper function.

### Context
You are writing code inside this function:
\`\`\`javascript
function buildCharacter(createVoxel, rig) {
  // YOUR CODE HERE
}
\`\`\`

### API Definition
1. **createVoxel(color, x, y, z, scaleX, scaleY, scaleZ, parent)**
   - \`color\`: Hex color (e.g. 0xff0000)
   - \`x, y, z\`: Position relative to parent
   - \`scaleX, y, z\`: Scale dimensions
   - \`parent\`: Three.js Group to attach to.

2. **rig Object (The Skeleton)**
   - \`rig.head\`: Attach head voxels here.
   - \`rig.body\`: Attach torso/body voxels here.
   - \`rig.leftArm\`, \`rig.rightArm\`: Attach arms.
   - \`rig.leftLeg\`, \`rig.rightLeg\`: Attach legs.
   - \`rig.tail\`: Attach tail (optional).
   - \`rig.mouth\`: A hidden point for feeding animations. Set its position relative to the head.

### Instructions
1. **Analyze** the image to determine colors and shapes.
2. **Build** the character by calling \`createVoxel\` and attaching parts to the correct \`rig\` group.
3. **Mouth Alignment:** IMPORTANT! You MUST set \`rig.mouth.position.set(x, y, z)\` to where the mouth should be (relative to \`rig.head\`).
4. **Style:** Cute, blocky, voxel art style.

### Output Format
- Return **ONLY** the JavaScript code to go inside the function.
- Do NOT wrap in \`function buildCharacter() { ... }\`.
- Do NOT use markdown code blocks.
`;

export const generateImage = async (prompt: string, optimize: boolean = true): Promise<string> => {

    //Actual implementation
    //export const generateImage = async (prompt: string, aspectRatio: string = '1:1', optimize: boolean = true): Promise<string> => {
    try {
        let finalPrompt = prompt;

        if (optimize) {
            finalPrompt = `${IMAGE_SYSTEM_PROMPT}\n\nSubject: ${prompt}`;
        }

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
            config: {
                responseMimeType: "image/png",
            },
        } as any);

        const part = (result as any).candidates?.[0]?.content?.parts?.[0];

        if (part && part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image generated.");
        }
    } catch (error) {
        console.error("Image generation failed:", error);
        throw error;
    }
};

export const generateVoxelScene = async (
    imageBase64: string,
    onThoughtUpdate?: (thought: string) => void
): Promise<string> => {
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const mimeMatch = imageBase64.match(/^data:(.*?);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    let generatedCode = "";

    try {
        const result = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data
                            }
                        },
                        {
                            text: VOXEL_PROMPT
                        }
                    ]
                }
            ]
        } as any);

        for await (const chunk of (result as any)) {
            const text = (chunk as any).text || "";
            generatedCode += text;

            if (onThoughtUpdate) {
                // Heuristic to show progress/thought if the model starts explaining (though we asked for code only)
                const matches = text.match(/\*\*([^*]+)\*\*/g);
                if (matches) {
                    onThoughtUpdate(matches[matches.length - 1].replace(/\*\*/g, ''));
                }
            }
        }

        // Clean up code block markers if present
        let cleanCode = generatedCode.replace(/```javascript/g, '').replace(/```/g, '').trim();

        // Inject into template
        const finalHtml = VOXEL_TEMPLATE.replace('/*__GEMINI_CHARACTER_CODE__*/', cleanCode);

        return finalHtml;

    } catch (error) {
        console.error("Voxel scene generation failed:", error);
        throw error;
    }
};

export const generateQuizFromText = async (prompt: string): Promise<any[]> => {
    /*
    const systemPrompt = `\
    You are a quiz generator. Create 10 multiple-choice questions based on the following topic or text.
    Return the result strictly as a valid JSON array of objects.
    Each object must have:
    - id: string (unique)
    - question: string
    - options: string[] (array of 4 distinct answers)
    - answer: string (the correct answer, must be exactly one of the options)

    Topic: ${prompt}
    `;
    */

    const systemPrompt = `
    You are a quiz generator for young children aged 3 to 8 years old.

    Generate exactly 10 multiple-choice questions based on the given topic list.

    SUBJECT HANDLING RULES:
    1. Identify the subject of each topic 
    2. Group topics by subject
    3. Distribute questions across subjects as evenly as possible
    4. Each identified subject MUST appear at least once
    5. If exact balance is not possible, prioritize Math, then English, then Science

    SUBJECT-SPECIFIC RULES:

    Math:
    - Go beyond simple counting. Use addition/subtraction up to 100 depending on the age of the child
    - Multiplication limited to age of 3 to 8 years old
    - Include "What comes next in the pattern?" or basic shape properties (e.g., "How many sides does a pentagon have?").

    English:
    - Focus on basic vocabulary, phonics, simple grammar
    - Topics may include nouns, verbs, adjectives, alphabet, or simple sentences
    - Avoid long reading passages
    - Use plurals, past tense (run vs. ran), and basic punctuation concepts.
    - Include phonics: "Which word starts with the same sound as 'Chair'?"

    Science:
    - Focus on everyday science
    - Topics may include animals, plants, weather, body parts, or materials
    - Avoid abstract or technical explanations
    - Include life cycles (tadpole to frog) and basic anatomy (functions of the heart vs. lungs).

    General/Other Topics (e.g., Art, Space, Sports):
    - Identify tools and equipment: "What do you use to hit a baseball?"
    - Basic colors, sizes, and textures: "Is an elephant big or small?"
    - Sequencing: "What do you do first: put on socks or put on shoes?" 
    - Include simple cause and effect: "Why do you need a hat when it rains?"

    AGE & LANGUAGE RULES:
    - Very simple words
    - Short sentences
    - No trick questions
    - One clearly correct answer per question

    CRITICAL OUTPUT RULES:
    - Output ONLY valid JSON
    - No markdown, comments, or explanations
    - No trailing commas
    - Single JSON array only
    - Use double quotes for all strings

    Each object MUST contain ONLY:
    - "id": string (unique)
    - "question": string
    - "options": array of EXACTLY 4 distinct strings
    - "answer": string (must match one option exactly)

    Topic: ${prompt}
    `;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            config: {
                responseMimeType: "application/json",
            },
        } as any);

        const text = (result as any).candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("No quiz generated.");
        return JSON.parse(text);
    } catch (error) {
        console.error("Quiz generation failed:", error);
        throw error;
    }
};

export const generateQuizFromImage = async (imageBase64: string): Promise<any[]> => {
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const mimeMatch = imageBase64.match(/^data:(.*?);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const systemPrompt = `
    Analyze this image/document. Extract key information and generate 10 multiple-choice questions based on it.
    Return the result strictly as a valid JSON array of objects.
    Each object must have:
    - id: string (unique)
    - question: string
    - options: string[] (array of 4 distinct answers)
    - answer: string (the correct answer, must be exactly one of the options)
    `;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data
                            }
                        },
                        {
                            text: systemPrompt
                        }
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json",
            },
        } as any);

        const text = (result as any).candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("No quiz generated from image.");
        return JSON.parse(text);

    } catch (error) {
        console.error("Quiz from image failed:", error);
        throw error;
    }
};
