# Testing Guide

This document explains how to test the WebID crawler system.

## Manual Testing via GitHub UI

1. **Create a Test Issue**
   - Go to the repository's [Issues](../../issues/new/choose) page
   - Select "Crawl WebID" template
   - Enter a test WebID (e.g., `https://timbl.inrupt.net/profile/card#me`)
   - Submit the issue

2. **Verify Workflow Execution**
   - Check the [Actions](../../actions) tab
   - Look for the "WebID Crawler" workflow run
   - Verify it completes successfully

3. **Check the Results**
   - If new WebIDs were found, a PR should be created automatically
   - The PR should reference the issue with "Closes #X"
   - The issue should have a comment from the bot

4. **Merge the PR**
   - Review the PR changes (should only modify `data/webids.json`)
   - Merge the PR
   - Verify the original issue closes automatically

## Local Testing

Test the crawler script locally without triggering the GitHub workflow:

```bash
# Test with a real WebID
npm run crawl -- https://example.com/profile#me

# Check the output
cat data/webids.json
```

## Expected Behavior

### Success Case (New WebIDs Found)
1. Issue created with crawler label
2. Workflow triggers automatically
3. Crawler executes and discovers WebIDs
4. PR created with:
   - Title: "WebIDs discovered from crawling [URL]"
   - Body includes "Closes #X"
   - Modified file: `data/webids.json`
5. Comment added to issue: "✅ Crawler completed! A pull request..."
6. When PR merges → Issue auto-closes

### No New WebIDs Case
1. Issue created with crawler label
2. Workflow triggers automatically
3. Crawler executes but finds no new WebIDs
4. No PR created
5. Comment added to issue: "ℹ️ Crawler completed but no new WebIDs..."
6. Issue auto-closes

### Error Cases
1. **Invalid URL**: Workflow fails with error message
2. **Network Error**: Crawler logs error but continues gracefully
3. **Parse Error**: Crawler logs error but doesn't crash

## Test WebIDs

Here are some test WebIDs you can try:

- Tim Berners-Lee: `https://timbl.inrupt.net/profile/card#me`
- Solid Community profiles (if available)
- Your own WebID (if you have a Solid pod)

## Debugging

If something goes wrong:

1. **Check workflow logs**:
   - Go to Actions tab
   - Click on the failed run
   - Expand each step to see detailed logs

2. **Verify issue body format**:
   - The workflow expects `### WebID or URL` followed by the URL
   - Check that the issue template format matches

3. **Test locally**:
   - Run the crawler script directly
   - Check console output for errors

## Cleanup

After testing, you may want to:
- Close test issues that weren't auto-closed
- Delete test branches
- Reset `data/webids.json` if needed
