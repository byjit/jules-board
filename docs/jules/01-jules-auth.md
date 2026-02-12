Save JUles api key in Local storage.

Eg call -

curl -X POST \
  -H "x-goog-api-key: $JULES_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Add unit tests for the utils module",
    "sourceContext": {
      "source": "sources/github-owner-repo",
      "githubRepoContext": {
        "startingBranch": "main"
      }
    }
  }' \
  https://jules.googleapis.com/v1alpha/sessions
