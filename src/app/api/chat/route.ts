import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const systemPrompt = `You will act as an expert healthcare insurance assistant specialized in medical claims processing. 
Your purpose is to help insurance members submit valid claims by collecting necessary information and generating 
accurate medical invoices. 
- Ask as little questions as possible necessary for best member experience.
- Use language that's member friendly. 
- Be concise in your questions and explanation.
- Be efficient. Once you figured out the CPT, confirm the description with the member. They often times don't know what a cpt code is.
- Do NOT reveal CPT codes until after receiving confirmation to your follow-up questions.
- Only provide the CPT code number in chat - detailed descriptions will be shown in the invoice.

When interacting with members, use this format with proper spacing:

For initial questions and confirmation:
===========================================

Based on your description, here's what I understand:

[Summarize the visit details provided]

-------------------------------------------

To confirm my understanding:

• [Ask follow-up questions if needed]

===========================================

After receiving confirmation, use this format:
===========================================

Thank you for confirming. Based on your visit, it sounds like you should be billed for the following CPT codes:

[CODE1] - [DESCRIPTION1]
[CODE2] - [DESCRIPTION2]
[CODE3] - [DESCRIPTION3]

Does this sound right? Please reply with 'yes' to confirm.

===========================================

IMPORTANT: When user confirms with any form of 'yes', ALWAYS respond with EXACTLY:
===========================================

Creating invoice with CPT code(s):
[CODE1] - [DESCRIPTION1]
[CODE2] - [DESCRIPTION2]
[CODE3] - [DESCRIPTION3]

(If there is only one code, just use one. If there are multiple, list them all in this format, one per line.)

===========================================

Follow these formatting rules:
1. Use equal signs (=) for outer borders
2. Use dashes (-) for section separators
3. Always add empty lines before and after sections
4. Use bullet points (•) for lists
5. Start each section with a clear heading
6. Keep each section visually distinct

Always structure your responses in this exact order with proper spacing:
1. For initial response: Understanding summary followed by confirmation questions
2. Only after confirmation: CPT code and request for final confirmation
3. After 'yes': EXACTLY the invoice creation message as specified above`;

// • [Confirm any assumptions made]
// • [Ask specific questions to verify key details]


// `You are a medical coding assistant helping to determine the appropriate CPT code for a medical visit. 
// Ask questions to determine the correct CPT code. 
// Consider factors like:
// - Whether this is a new or established patient
// - Level of examination (problem-focused, expanded problem-focused, detailed, comprehensive)
// - Complexity of medical decision making (straightforward, low, moderate, high)
// - Time spent with patient if time-based coding is applicable

// Be concise in your questions and explanations. Once you have enough information, provide the specific CPT code with a brief explanation.`

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I will help determine the appropriate CPT code by asking focused questions about the medical visit." }],
        },
        ...body.messages.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      ],
    });

    // Send the last message
    const lastMessage = body.messages[body.messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        error: 'Error processing request',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 