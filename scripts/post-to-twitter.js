#!/usr/bin/env node
/**
 * Post a tweet using Twitter API v2.
 * Usage: node scripts/post-to-twitter.js "Tweet text"
 * Or reads from stdin: echo "text" | node scripts/post-to-twitter.js
 */

const { TwitterApi } = require('twitter-api-v2');

async function main() {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;

  // Validate environment variables
  const missing = [];
  if (!apiKey) missing.push('X_API_KEY');
  if (!apiSecret) missing.push('X_API_SECRET');
  if (!accessToken) missing.push('X_ACCESS_TOKEN');
  if (!accessTokenSecret) missing.push('X_ACCESS_TOKEN_SECRET');
  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    console.error('Please set them in GitHub Secrets (Actions) or locally.');
    process.exit(1);
  }

  // Read tweet text from command line argument or stdin
  let tweetText = process.argv[2];
  if (!tweetText) {
    // Try reading from stdin (piped input)
    const stdin = process.stdin;
    if (stdin.isTTY) {
      console.error('Usage: node scripts/post-to-twitter.js "Tweet text"');
      console.error('   or: echo "text" | node scripts/post-to-twitter.js');
      process.exit(1);
    }
    tweetText = await new Promise(resolve => {
      let data = '';
      stdin.on('data', chunk => data += chunk);
      stdin.on('end', () => resolve(data.trim()));
    });
  }

  if (!tweetText || tweetText.length === 0) {
    console.error('Tweet text is empty.');
    process.exit(1);
  }

  // Check length (Twitter limit: 280 characters)
  if (tweetText.length > 280) {
    console.error(`Tweet is ${tweetText.length} characters, exceeds 280 limit.`);
    process.exit(1);
  }

  console.log(`Posting tweet: "${tweetText}"`);

  try {
    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    // Post tweet
    const tweet = await client.v2.tweet(tweetText);
    console.log('✅ Tweet posted successfully!');
    console.log(`Tweet ID: ${tweet.data.id}`);
    console.log(`Tweet URL: https://twitter.com/user/status/${tweet.data.id}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to post tweet:', error.message);
    if (error.data) {
      console.error('Error details:', JSON.stringify(error.data, null, 2));
    }
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});