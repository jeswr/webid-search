# WebID Search

A Next.js application for searching WebIDs by name (foaf:name) or content using an edge function.

## Features

- **Edge Function API**: Fast, serverless search functionality using Next.js Edge Runtime
- **Text Search**: Search WebIDs by name or content
- **Modern UI**: Clean, responsive search interface built with React and Tailwind CSS
- **Dark Mode Support**: Automatically adapts to system preferences

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
webid-search/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts       # Edge function for WebID search
│   ├── components/
│   │   └── SearchComponent.tsx # Search UI component
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── public/                    # Static assets
└── package.json
```

## API Endpoint

### GET /api/search

Search for WebIDs by name or content.

**Query Parameters:**
- `q` (required): Search query string

**Response:**
```json
{
  "query": "search term",
  "count": 2,
  "results": [
    {
      "webid": "https://example.com/alice",
      "name": "Alice Johnson",
      "content": "Software engineer passionate about web technologies"
    }
  ]
}
```

## Customization

The WebID data is currently stored in-memory in `app/api/search/route.ts`. In a production environment, you would:

1. Replace the mock data with a database connection
2. Fetch WebID data from external sources
3. Implement more sophisticated search algorithms
4. Add authentication and rate limiting

## Technologies Used

- [Next.js 16](https://nextjs.org) - React framework with edge runtime support
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React 19](https://react.dev/) - UI library

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
