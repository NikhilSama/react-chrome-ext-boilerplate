import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";  
import { zodToJsonSchema } from "zod-to-json-schema";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { RemoteRunnable } from "@langchain/core/runnables/remote";

export const Body : React.FC<{}> = ({  }) => {
    // const [html, setHtml] = useState<string>('');
    const [summary, setSummary] = useState({headline: '', bullets: ['']});


    function textToHtml(text:string) : string {
        // Split the text into lines
        const lines = text.split('\n');
        let inList = false; // Flag to track if we are currently adding list items
        let html = '';
    
        lines.forEach(line => {
            if (line.startsWith('* ')) { // Check if the line is a bullet point
                if (!inList) {
                    inList = true;
                    html += '<ul>'; // Start a new list
                }
                // Add the list item, removing the '* ' from the start
                html += `<li>${line.substring(2)}</li>`;
            } else {
                if (inList) {
                    inList = false;
                    html += '</ul>'; // Close the list
                }
                // Add the line with a line break, if not empty
                if (line.trim() !== '') {
                    html += `${line}<br>`;
                }
            }
        });
    
        if (inList) {
            html += '</ul>'; // Ensure the list is closed if the text ends in a list
        }
    
        return html;
    }
    function htmlToText(html:string) : string {
        // console.log('htmlToText got: ' + html)
        
        // Use DOMParser to parse the HTML string
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Remove all <script> elements
        doc.querySelectorAll('script').forEach(script => script.remove());

        // Remove all event handler attributes (commonly used for inline JavaScript)
        const events = ['onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onload', 'onerror', 'onchange', 'onsubmit'];
        doc.querySelectorAll('*').forEach(el => {
            events.forEach(event => {
                if (el.hasAttribute(event)) {
                    el.removeAttribute(event);
                }
            });
        });

        // Remove all <style> elements
        doc.querySelectorAll('style').forEach(style => style.remove());

        // Remove all inline styles
        doc.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));

        // Extract the text content
        const text = doc.body.textContent || "";


        // console.log('htmlToText returning: ' + text)
        return text;
    }

    function summarize(html:string) : void  {
        setSummary({
            headline: 'Summarizing ...',
            bullets: ['']
        });

        // const model = new OpenAI({
        //     model: "gpt-3.5-turbo-instruct", // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
        //     temperature: 0
        //   });

        
        // /**
        //  * Bind the function and schema to the OpenAI model.
        //  * Future invocations of the returned model will always use these arguments.
        //  *
        //  * Specifying "function_call" ensures that the provided function will always
        //  * be called by the model.
        //  */
        // const schema = z.object({
        //     headline: z.string().describe("one line to summarize what this article is about, including any results it arrives at"),
        //     bullets: z
        //         .array(z.string())
        //         .describe("Upto 5 bullet points summarizing the most important and relavent information, conslusions or points in the article."),
        //     })

        // const prompt = PromptTemplate.fromTemplate(
        // `

        //  Format your response as follows:
        //  {format_instructions}
        //  <END OF FORMATTING INSTRUCTIONS>
        //  \n
        //  You are an excellent research assistant who is particulary good at eliciting 
        //  the most meaningful information from large documents.Summarize the text that 
        //  follows
        //  \n
        //  {page}`
        
        //  );      
        // // We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
        // const parser = StructuredOutputParser.fromZodSchema(schema);
        // // const parser = new JsonOutputFunctionsParser()
        // const strParser = new StringOutputParser()

        // const chain = RunnableSequence.from([prompt, model, parser])
        // const chain = transformer.pipe(prompt).pipe(model).pipe(parser)
        // console.log("format_instructions: " + parser.getFormatInstructions())
        console.log("INput html: " + htmlToText(html))
        interface Output {
            headline: string;
            bullets: string[];
        }
        const chain = new RemoteRunnable({ url: 'http://127.0.0.1:8000/summarize'});
        try {
            chain.invoke({ 
                // format_instructions: parser.getFormatInstructions(), 
                page: htmlToText(html) }).then((output : Output) => {
                console.log('output: ' + output)
                setSummary({
                    headline: output.headline || '',
                    bullets:  output.bullets || ['']
                })
            }).catch((error) => {
                setSummary({
                    headline: "Error summarizing text",
                    bullets: [error.message || '']
                })                
            });
        } catch (error) {
            setSummary({
                headline: "Error summarizing text",
                bullets: [error.message || '']
            })

        }
    }

    useEffect(() => {
        const listener = (request, sender, sendResponse) => {
            console.log('received message')
            console.log(request)
            summarize(request.html)
        };

        chrome.runtime.onMessage.addListener(listener);

        return () => {
            chrome.runtime.onMessage.removeListener(listener);
        };
    }, []);

    return (
    <>
    {/* <Button variant="contained" onClick={() => summarizeClicked()}>Summarize</Button> */}
        <div>
            <h2>{summary.headline}</h2>
            {summary.bullets.map((bullet, index) => {
                return <p key={index}>{bullet}</p>
            })}
        </div>
        </>)
}