# Contributing to WebID Search

Thank you for your interest in contributing to WebID Search! This document provides guidelines for contributing WebIDs to our collection.

## How to Contribute a WebID

The easiest way to contribute is through our automated issue-based system:

1. **Go to [Issues](../../issues/new/choose)**
2. **Select "Crawl WebID" template**
3. **Fill in the WebID or URL**
   - Enter a valid HTTP/HTTPS URL
   - Examples:
     - `https://example.com/profile#me`
     - `https://alice.solidcommunity.net/profile/card#me`
     - `https://bob.example/card#i`
4. **Submit the issue**

That's it! The automated crawler will:
- ✅ Fetch and parse the WebID document
- ✅ Discover linked WebIDs
- ✅ Create a pull request if new WebIDs are found
- ✅ Automatically close your issue when the PR is merged

## What Happens Next?

- **Within minutes**: The crawler workflow starts automatically
- **Comment added**: You'll receive a comment on your issue with the status
- **PR created**: If new WebIDs are discovered, a PR is automatically created
- **Issue closed**: Your issue closes automatically when the PR is merged

## Running the Crawler Locally

If you want to test the crawler on your own machine:

```bash
# Clone the repository
git clone https://github.com/jeswr/webid-search.git
cd webid-search

# Install dependencies
npm install

# Run the crawler
npm run crawl -- https://example.com/profile#me
```

## Code Contributions

To contribute code improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Areas for Improvement

- **Crawler enhancements**: Add support for more RDF predicates or formats
- **Performance**: Optimize crawling speed or reduce API calls
- **Documentation**: Improve guides and examples
- **Testing**: Add test coverage for the crawler

## Questions?

Feel free to [open an issue](../../issues/new) with your question!
