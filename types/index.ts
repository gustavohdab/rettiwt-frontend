// Re-export all types from different files
// This allows for convenient imports like: import { Tweet } from '@/types'

// Re-export API types with namespace to avoid naming conflicts
import * as ApiTypes from "./api";
export { ApiTypes };

// Re-export UI model types
import * as Models from "./models";
export { Models };

// Re-export all types from actions and client
export * from "./actions";
export * from "./client";

// Export specific model types directly
// These are the ones that should be used by default in the app
export type { User, Tweet, Media, TimelineResponse } from "./models";

// Export utility functions
export {
    isUser,
    normalizeUser,
    normalizeTweet,
    normalizeTimelineResponse,
} from "./models";
