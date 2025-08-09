// utils/imageMatcher.js

/**
 * Finds the best matching image name for a given submenu
 * @param {string} submenu - The dish name to match (e.g., "Veg Biryani")
 * @param {string[]} imageList - Array of available image names (e.g., ["biryani.jpg", "pizza.jpg"])
 * @returns {string} Best matched image filename or "default.jpg" if no match found
 */
export const findBestImageMatch = (submenu, imageList) => {
    console.log("Finding best image match for submenu:", submenu, imageList);
    if (!imageList || imageList.length === 0) return "default.jpg";

    // Normalize the submenu name (lowercase, no spaces, no special chars)
    const cleanSubmenu = submenu.toLowerCase()
        .replace(/\s+/g, '_')          // Replace spaces with hyphens
        .replace(/[^\w-]/g, '')        // Remove special chars
        .replace(/-+/g, '_')           // Remove duplicate hyphens
        .replace(/(^-|-$)/g, '');      // Trim hyphens

    // Normalize image names (remove .jpg and spaces)
    const normalizedImages = imageList.map(img => 
        img.replace('.jpg', '').replace(/\s+/g, '_')
    );

    console.log("Cleaned submenu:", cleanSubmenu);
    console.log("Normalized images:", normalizedImages);

    // 1. Exact match (biryani => biryani.jpg)
    const exactMatchIndex = normalizedImages.findIndex(img => img === cleanSubmenu);
    if (exactMatchIndex >= 0) {
        return imageList[exactMatchIndex].replace(/\s+/g, '_');
    }

    // 2. Contains match (chicken-biryani => biryani.jpg)
    const containsMatchIndex = normalizedImages.findIndex(img => {
        return cleanSubmenu.includes(img) || img.includes(cleanSubmenu);
    });
    if (containsMatchIndex >= 0) {
        return imageList[containsMatchIndex].replace(/\s+/g, '_');
    }

    // 3. Word-by-word matching (veg-hyderabadi-biryani => biryani.jpg)
    const submenuWords = cleanSubmenu.split('_');
    const wordMatchIndex = normalizedImages.findIndex(img => {
        const imgWords = img.split('_');
        return submenuWords.some(word => imgWords.includes(word));
    });
    if (wordMatchIndex >= 0) {
        return imageList[wordMatchIndex].replace(/\s+/g, '_');
    }

    // 4. Fuzzy match (first 3 letters)
    const fuzzyMatchIndex = normalizedImages.findIndex(img => 
        img.startsWith(cleanSubmenu.substring(0, 3))
    );
    if (fuzzyMatchIndex >= 0) {
        return imageList[fuzzyMatchIndex].replace(/\s+/g, '_');
    }

    // 5. Fallback to default
    return "default.jpg";
};