import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        // 1. Verify this is an 'end-of-call-report' from VAPI
        // VAPI sends various messages (function-calls, status-updates, etc.)
        // We only care about the final report for this workflow.
        if (payload.message?.type !== 'end-of-call-report') {
            return NextResponse.json({ message: 'Ignored: Not an end-of-call-report' }, { status: 200 });
        }

        const call = payload.message.call;
        const analysis = payload.message.analysis;
        const customerNumber = call?.customer?.number;
        const summary = analysis?.summary || "No summary provided.";

        // Check if appointment details exist in the extracted structure (depends on your VAPI prompt)
        // Often found in analysis.structuredData if you configured a JSON schema, 
        // or we just pass the raw summary for GHL to parse/human reading.

        if (!customerNumber) {
            return NextResponse.json({ error: 'No customer number found' }, { status: 400 });
        }

        console.log(`Processing VAPI call for ${customerNumber}`);

        // 2. Prepare Payload for GoHighLevel Webhook
        // We map VAPI data to a structure GHL's "Incoming Webhook" trigger can use.
        const ghlPayload = {
            phone: customerNumber,
            workflow_trigger: "vapi_call_ended",
            call_summary: summary,
            call_recording_url: payload.message.recordingUrl || "",
            call_status: call.status,
            // You can add more fields here if VAPI extract them (e.g. appointment_time)
            // For now, we assume the summary contains the appointment details for the human agent,
            // or the GHL workflow sends a generic "Appointment Booked" text if the tag is present.
            tags: ["VAPI Lead", "AI Appointment"]
        };

        // 3. Send to GoHighLevel (Trigger Workflow)
        const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;

        if (ghlWebhookUrl) {
            const ghlResponse = await fetch(ghlWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ghlPayload)
            });

            if (!ghlResponse.ok) {
                console.error("Failed to send to GHL", await ghlResponse.text());
                return NextResponse.json({ error: 'Failed to trigger GHL workflow' }, { status: 502 });
            }
        } else {
            console.warn("GHL_WEBHOOK_URL not set. Skipping GHL sync.");
        }

        return NextResponse.json({ success: true, message: "Processed and sent to GHL" });

    } catch (error) {
        console.error("VAPI Webhook Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
