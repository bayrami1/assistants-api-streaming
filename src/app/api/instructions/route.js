import openai from '@/service/openai';

// Function to create headers for OpenAI API requests
function createOpenAIHeaders() {
    return {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
    };
}

// Handler for POST requests to update instructions
export async function POST(request) {
    const { message } = await request.json();
    const triggerPhrase = "Update Instructions";
    
    const triggerIndex = message.indexOf(triggerPhrase);
    if (triggerIndex === -1) {
        return new Response('No instruction update trigger found in the message.', {
            status: 200,
        });
    }

    const newInstructionsText = message.substring(triggerIndex + triggerPhrase.length).trim();

    try {
        // Retrieve the current assistant's details
        const assistant = await openai.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID, {
            headers: createOpenAIHeaders()
        });
        const currentInstructions = assistant.instructions || "";

        // Append the new instructions to the existing ones
        const updatedInstructions = `${currentInstructions}\n${newInstructionsText}`;

        // Update the assistant with the appended instructions
        const response = await openai.beta.assistants.update(process.env.OPENAI_ASSISTANT_ID, {
            instructions: updatedInstructions
        }, {
            headers: createOpenAIHeaders()
        });

        return new Response(JSON.stringify({
            status: 'success',
            updatedInstructions
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (e) {
        console.error(e);
        return new Response('Error updating assistant instructions.', {
            status: 500,
        });
    }
}

// Handler for GET requests to retrieve current instructions
export async function GET(request) {
    try {
        // Retrieve the current assistant's details
        const assistant = await openai.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID, {
            headers: createOpenAIHeaders()
        });
        const currentInstructions = assistant.instructions || "";

        return new Response(JSON.stringify({
            status: 'success',
            currentInstructions
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (e) {
        console.error(e);
        return new Response('Error retrieving assistant instructions.', {
            status: 500,
        });
    }
}
