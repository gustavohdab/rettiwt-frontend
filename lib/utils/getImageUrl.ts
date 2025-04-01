// Helper function to properly format image URLs
const getImageUrl = (mediaPath: string) => {
    // Check if the URL already contains http:// or https://
    if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
        return mediaPath;
    }
    // Otherwise, prepend the API media URL
    return `${process.env.NEXT_PUBLIC_API_URL_MEDIA}${mediaPath}`;
};

export default getImageUrl;
