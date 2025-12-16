# WebID Crawler Configuration

This directory contains the configuration files for the automated WebID crawler system.

## Issue Template

The issue template (`crawl-webid.yml`) is a GitHub form that:
- Provides a user-friendly interface for submitting WebIDs
- Automatically adds the `crawler` label to trigger the workflow
- Validates that a WebID/URL is provided

## Workflow

The workflow (`crawler.yml`) is triggered when:
- A new issue is created with the `crawler` label
- An existing issue with the `crawler` label is edited

### Workflow Steps

1. **Extract WebID**: Parses the issue body to extract the submitted WebID
2. **Run Crawler**: Executes the crawler script to discover new WebIDs
3. **Create PR**: If new WebIDs are found, creates a pull request
4. **Close Issue**: The PR includes "Closes #X" to auto-close the issue when merged

### Security

The workflow uses:
- `GITHUB_TOKEN` with minimal permissions (contents, pull-requests, issues)
- Input validation to ensure WebIDs are valid URLs
- No external dependencies or third-party actions (except official GitHub actions)

## Customization

You can customize the crawler behavior by editing:
- `scripts/crawl.js` - Add/remove RDF predicates to discover more or fewer WebIDs
- `.github/workflows/crawler.yml` - Modify the workflow triggers or PR creation logic
