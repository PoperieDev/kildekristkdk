import { generateFirstStep } from "@/components/actions/AiService";

export async function POST(req) {
  const { plan } = await req.json();
  const firstStep = await generateFirstStep(plan);
  return Response.json({ success: true, firstStep });
}
