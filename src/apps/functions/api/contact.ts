import '../_init';
import { z } from 'zod';

const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function onRequest(context: { request: Request }): Promise<Response> {
  if (context.request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await context.request.json();
    const result = contactMessageSchema.safeParse(body);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          error: "Validation failed", 
          details: result.error.flatten() 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log("Contact message received:", result.data);
    
    // In production, you would send this to an email service or save to a database
    // For now, we'll just log it
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message received successfully" 
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing contact:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process contact message' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

