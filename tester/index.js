import { GoogleGenAI, Type } from "@google/genai";
import { exec } from "child_process";
import readlineSync from "readline-sync"
import os from "os"
import util from 'util'

const platform = os.platform();
const execute = util.promisify(exec);
const genAI = new GoogleGenAI({apiKey:process.env.API_KEY});

async function executeCommand({command}){
    try{
        const { stdout, stderr } = await execute(command);
        if(stderr){
            return `Error : ${stderr}`
        }
        return `Success : ${stdout}`
    }catch(err){
        return `Error : ${err}`
    }
}

const conversationHistory=[];
const commandExecuter = {
    name:"executeCommand",
    description:" it take any shell/terminal command and execute it.it will help us to create , update, read , delete any folder and file ",
    parameters:{
        type:Type.OBJECT,
        properties:{
            command:{
                type:Type.STRING,
                description:"It is the terminal/ shell command. for example :mkdir NewFolder, type nul > filename.js"
            }
        },
        required:["command"]
    }
}

async function buildProject(){
    while(true){ 
        const result = await genAI.models.generateContent({
            model: "gemini-3.5-flash",
            systemInstruction:`you are a website builder , which will create frontend part of the website using terminal/shell command . you will give shell/terminal command one by one and our tool will execute it
            
            give command according to the operating system we are using. My current Operating system is ${platform}

            kindly use best practice command .It should handle multine write also efficiently.

            your job:
            1. analyse the query of user
            2. Take the necessary action after analysing the query by giveing proper shell/terminal command according to the user's operating system

            step step guide:
            1. first you have to create the folder for which we have to create calculator. ex : mkdir  calculator
            2. Give shell/terminal command to create html file . ex: type nul > filename.html
            3. Give shell/terminal command to create CSS file . ex: type nul > filename.css
            4. Give shell/terminal command to create Js file . ex: type nul > filename.js
            5. Give shell/terminal command to write on html file .
            6. Give shell/terminal command to write on CSS file .
            7. Give shell/terminal command to write on Js file .
            8. fix the error if they are presernt at any step by writing, updating and deleting
            `,
            contents:conversationHistory,
            config: {
                tools: [
                    {
                        functionDeclarations:[commandExecuter]
                    }
                
            }
        })

        if (result.functionCalls && result.functionCalls.length > 0) {
            constfunctionCall = result.functionCalls[0];
            const { args } = functionCall;
            const toolResponse = await executeCommand(args);

            const functionResponsePart = {
                name: functionCall.name,
                response: {
                    result: toolResponse,
                },
            };

            conversationHistory.push({
                role: "model",
                parts: [
                    {
                        functionCall: functionCall,
                    },
                ],
            });
            conversationHistory.push({
                role: "user",
                parts: [
                    {
                        functionResponse: functionResponsePart,
                    },
                ],
            });

        } else {
            // console.log(result.text); // Removed console.log
            conversationHistory.push({
                role:"model",
                parts:[{text:result.text}]
            });
            break; 
        }
    }
}

while(true){
    const question = readlineSync.question("Ask anything ==> ")

    if(question =='exit'){
        break;
    }

    conversationHistory.push({
        role:"user",
        parts:[{text:question}]
    })
    await buildProject()
}