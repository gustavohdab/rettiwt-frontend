# Timeline Business Rules

## Timeline Content

The Twitter clone timeline includes the following content types:

1. **Original Tweets**

    - Standalone tweets from followed users or the user themselves
    - These appear in chronological order (newest first)

2. **Replies in the Feed**

    - **Rule**: Replies are integrated into the main feed with visual indicators
    - **Rationale**: Showing replies provides context to ongoing conversations and boosts engagement
    - **Implementation**:
        - Replies are tagged with a "Replying to @username" indicator
        - Users can toggle visibility of replies using the filter button at the top of the timeline
        - Default view excludes replies to reduce timeline noise for new users

3. **Retweets**

    - Retweets from followed users are shown in the feed
    - A "User Retweeted" indicator appears above the original tweet content
    - Retweets count as distinct timeline entries

4. **Quote Tweets**
    - Appear as original content with embedded reference to the quoted tweet
    - Both the new content and the quoted content are visible

## User's Own Content

-   **Rule**: Users see their own tweets, replies, and retweets in their timeline
-   **Rationale**: Provides a continuous record of the user's activity and ensures content consistency

## Additional Timeline Rules

-   Content is ordered reverse-chronologically (newest first)
-   Timeline auto-refreshes when new content is posted
-   Infinite scrolling loads older content as the user scrolls down
-   No duplicate tweets are shown (even if multiple followed users retweet the same content)

## UI/UX Considerations

-   Visual indicators clearly distinguish between tweets, replies and retweets
-   The reply filter toggle allows users to customize their timeline experience
-   When users post new content, it appears immediately at the top of their timeline (optimistic updates)
