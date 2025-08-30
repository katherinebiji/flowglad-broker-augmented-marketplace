import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage, stepCountIs } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4.1'),
    system: `You are a professional product broker and marketplace middleman. Your role is to facilitate transactions between buyers and sellers.

**Your Core Functions:**
1. **For Sellers**: Help them list products with details like condition, flexibility on price/terms, minimum acceptable price, and any special conditions
2. **For Buyers**: Help them find products and negotiate deals within the seller's stated flexibility
3. **As Middleman**: Facilitate negotiations, suggest fair prices, and help both parties reach mutually beneficial agreements

**Your Personality:**
- Professional but friendly
- Expert in product valuation and market trends
- Skilled negotiator who finds win-win solutions
- Trustworthy and transparent about all terms

**When a seller approaches you:**
- Ask for product details (name, condition, asking price, flexibility percentage)
- Understand their timeline and any special conditions
- Help them set realistic expectations

**When a buyer approaches you:**
- Understand what they're looking for
- Present available options that match their needs
- Facilitate negotiations within seller flexibility ranges
- Suggest fair market values

**During negotiations:**
- Help both parties understand the other's perspective
- Work toward closing deals that benefit everyone

**When showing listings:**
- ALWAYS display images of the product if available

Start each conversation by asking if they're looking to buy or sell, and what product category they're interested in.`,
    messages: convertToModelMessages(messages),
    tools: {
        getCurrentUser:{
            description: 'Get the current user id',
            inputSchema: z.object({}),
            execute: async () => {
                const { data: { user } } = await (await createClient()).auth.getUser();
                return user?.id || '';
            },
        },
        getProductInformation: {
          description: 'Get all products available in the marketplace',
          inputSchema: z.object({ query: z.string()}),
          execute: async ({ query }: { query: string }) => {
            const { data: products } = await (await createClient())
              .from('products')
              .select('*');
            return products || [];
          },
        },
        getSellerIntent:{
         description: 'Get the intent of the seller',
         inputSchema: z.object({ query: z.string()}),
         execute: async ({ query }: { query: string }) => {
            //add honcho id and logic here, im adding placeholder random
        
           return 'Seller is willing to sell for 50$ if it has been a week since the product was listed';
         },
       },
               addProduct:{
         description: 'Add a product to the marketplace',
         inputSchema: z.object({ 
           title: z.string(),
           description: z.string(),
           current_price: z.number(),
           image_url: z.string().optional(),
           status: z.string().optional(),
           seller_id: z.string()
         }),
         execute: async ({ title, description, current_price, image_url, status, seller_id }: { 
           title: string, 
           description: string, 
           current_price: number, 
           image_url?: string, 
           status?: string,
           seller_id: string
         }) => {
           const { data: product, error } = await (await createClient())
             .from('products')
             .insert({
               title,
               description,
               current_price,
               image_url: image_url || null,
               status: status || 'active',
               seller_id

             })
             .select()
             .single();
             
           if (error) {
             return `Error adding product: ${error.message}`;
           }
           
           return `Product "${title}" successfully added to marketplace with ID: ${product.id}`;
         },
        }
     },
     stopWhen: stepCountIs(5),
      
  });

  return result.toUIMessageStreamResponse();
}