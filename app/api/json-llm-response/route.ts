import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers";
import { JsonOutputParser } from "@langchain/core/output_parsers";



interface ChatSummaryParserInterface {
    summary: string;
    relationship: string;
    currentEmotion: string;
}

export async function POST(request: NextRequest) {

    try {
        const { prompt, payload, type } = await request.json();
        
        let parser = getParser(type);
        if (!parser) {
            return new NextResponse(JSON.stringify({ error: 'No valid parser found' }), { status: 400 });
        }

        // const llm = new ChatGroq({
        //     apiKey: process.env.NEXT_PUBLIC_GROQ_JSONOUTPUT_API_KEY,
        //     // apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        //     model: "llama3-70b-8192",         
        // });

        const llm = new ChatGoogleGenerativeAI({
            apiKey: 'AIzaSyBPJkMmR8m06mgboCz-83bPWaawWmJp46U',
            model: "gemini-2.0-flash",
            temperature: 0,
            maxRetries: 2,
        });
    
        const startingPrompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a professional AI assistant, and you are great following instructions"],
            ["human", prompt],
        ]);
    
        let chain = startingPrompt.pipe(llm).pipe(parser);               
    
        const response = await chain.invoke(payload);
        console.log(response);
        if (!response) {
            return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });            
        }
        return NextResponse.json(response);   
    } catch (error) {
        console.error("Error analyzing LLM response:", error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

const getParser = (type: string) => {
    if (type === "chat-summary") {
        return new JsonOutputParser<ChatSummaryParserInterface>();
        
    }
    
    return null;
} 