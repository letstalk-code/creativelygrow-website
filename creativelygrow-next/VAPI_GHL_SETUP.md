# VAPI + GoHighLevel Automation Setup

This guide sets up the "Real-Life Scenario" where a VAPI call triggers a GHL Workflow for Internal Notifications and Customer SMS.

## 1. The Strategy
**VAPI (Voice AI)** -> **Next.js Webhook** (Formats Data) -> **GHL Webhook** (Triggers Automation)

We use Next.js in the middle to act as a reliable "Router" that can clean up the data before sending it to GHL, but simple setups can sometimes go direct. Using the app allows you to save the data to your own database later if you want.

## 2. GoHighLevel (GHL) Setup

### Step A: Create the "Incoming Webhook" Trigger
1.  Go to **Automation > Workflows** in GHL.
2.  Create a **New Workflow**.
3.  **Trigger:** Select `Incoming Webhook`.
4.  Copy the **Webhook URL** provided by GHL.
5.  **Save** this URL. You will need it for the Next.js app.

### Step B: Configure the Workflow Actions
Add the following actions after the trigger:

**Action 1: Create/Update Contact**
-   Map the incoming fields from the Webhook:
    -   `phone` -> Phone
    -   `tags` -> Add Contact Tag (e.g. "VAPI Lead")

**Action 2: Internal Notification (To You)**
-   **Type:** Internal Notification (SMS or Email).
-   **User Type:** Assigned User / Custom Number.
-   **Message:**
    ```text
    🔔 New AI Call Summary
    
    Phone: {{contact.phone}}
    Summary: {{webhook_trigger.call_summary}}
    
    Recording: {{webhook_trigger.call_recording_url}}
    ```
    *(Note: You'll map `webhook_trigger.call_summary` using the "Inbound Webhook Trigger" variable picker in GHL).*

**Action 3: Send SMS to Contact (Confirmation)**
-   **Type:** Send SMS.
-   **Message:**
    ```text
    Hi {{contact.first_name}}, thanks for speaking with our AI assistant! 
    
    We've received your request for a demo. We are confirming the details now and will send a calendar invite shortly.
    
    - The Creatively Grow Team
    ```

## 3. Next.js App Configuration

1.  Open your `.env.local` file.
2.  Add the GHL Webhook URL you copied in Step A:
    ```bash
    GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/your-webhook-id
    ```

## 4. VAPI Configuration

1.  Login to your **VAPI Dashboard**.
2.  Go to your **Assistant** settings.
3.  Find **Server URL** (or "Callback URL").
4.  Set it to your live application URL:
    -   `https://your-domain.com/api/webhooks/vapi`
    -   *Note: While testing locally, you must use a tunnel like Ngrok (e.g., `https://random-id.ngrok-free.app/api/webhooks/vapi`) because VAPI cannot reach "localhost".*

## 5. Testing
1.  Call your VAPI phone number.
2.  Have a conversation and simulate booking an appointment.
3.  Hang up.
4.  VAPI will send the report to Next.js.
5.  Next.js will forward it to GHL.
6.  You should receive the Internal SMS, and the "dummy" phone number you called from should get the confirmation text.
