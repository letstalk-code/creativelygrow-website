# Creatively Grow - Next.js Migration

This project has been migrated to Next.js to support the AI Website Analyzer.

## Setup Instructions

1.  **Navigate to this folder:**
    ```bash
    cd creativelygrow-next
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Envrionment Variables:**
    The `.env.local` file has been created with your API keys.

## Project Structure

-   `app/`: Main application code (App Router).
-   `app/styles/`: CSS modules split by section.
-   `app/api/analyze/`: The API route for the AI Analyzer.
-   `app/components/`: React components.
-   `public/assets/`: Static assets (images, icons).

## Notes

-   The AI Analyzer uses the Anthropic API to generate reports.
-   PageSpeed Insights integration requires a Google API key (currently using mock/heuristics if not provided).
-   The design system is preserved from the original tracking code CSS.
