import type { APIRoute } from 'astro';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export const prerender = false;

const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const context = body.context || 'Sin contexto.';
    const focus = body.focus || 'general';

    let systemPrompt = 'Eres un consultor experto en Gobernanza Institucional (TI, Datos e IA) para la Cruz Roja. Analiza los siguientes datos y proporciona recomendaciones en Markdown.';
    
    if (focus === 'seguridad') {
      systemPrompt = 'Eres un consultor experto en Ciberseguridad, Continuidad de TI y Cumplimiento Legal (Ley 1581). Analiza los datos de la Cruz Roja enfocándote en seguridad, DRP/Ransomware, el rol del CISO y auditorías de seguridad. Proporciona recomendaciones accionables en Markdown.';
    } else if (focus === 'datos') {
      systemPrompt = 'Eres un consultor experto en Gobierno de Datos bajo el estándar DAMA-DMBOK2. Analiza los datos de la Cruz Roja enfocándote en calidad de datos, silos de información de donantes (HeVa, Q-Symphony, Siesa) y glosarios únicos. Proporciona recomendaciones accionables en Markdown.';
    } else if (focus === 'ia') {
      systemPrompt = 'Eres un experto en Gobierno de IA (ISO 42001, EU AI Act y NIST AI RMF). Analiza los datos de la Cruz Roja enfocándote en los sistemas de IA (HemoAI Analytics), riesgos éticos, sesgos demográficos, explicabilidad y supervisión humana clínica. Proporciona recomendaciones accionables en Markdown.';
    } else {
      systemPrompt = 'Eres un consultor estratégico de Gobernanza Institucional (TI, Datos e IA). Analiza los datos del autodiagnóstico de la Cruz Roja Valle y genera un resumen ejecutivo integral y recomendaciones prioritarias en formato Markdown. Sé profesional, conciso y estructurado.';
    }

    const { text } = await generateText({
      model: google('gemini-3.5-flash'),
      system: systemPrompt,
      prompt: `Datos del autodiagnóstico:\n${JSON.stringify(context, null, 2)}\n\nPor favor, genera el reporte enfocado en: ${focus}.`,
    });

    return new Response(JSON.stringify({ text, model: 'gemini-3.5-flash' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error in AI generation:', error);
    const isTokenLimit = error?.message?.includes('429') || error?.message?.toLowerCase().includes('quota');
    const message = isTokenLimit 
      ? 'Tokens agotados o límite de cuota alcanzado. Por favor, intenta más tarde.'
      : 'Error de autenticación o fallo al comunicarse con Gemini. Verifica la API Key.';
    return new Response(JSON.stringify({ error: message, details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
