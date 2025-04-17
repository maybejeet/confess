

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST() {



try {
    
    const getGroqChatCompletion = async () => {
        return groq.chat.completions.create({
        messages: [
        {
            role: "user",
            content: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||' and also add '||' after last message. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
        },
        ],
        model: "llama-3.3-70b-versatile",
    });
    
    }
    
    const chatCompletion = await getGroqChatCompletion();
    // Print the completion returned by the LLM.
    //console.log(chatCompletion.choices[0]?.message?.content || "");
    return  Response.json({
        message: chatCompletion.choices[0]?.message?.content,
        status: 200,
        success: true
    })

} catch (error) {
    console.log(error);
    
    return  Response.json({
        message: "Message generation erroe",
        status: 500,
        success: false
    })
}
}