import { Trie } from '../Trie.js'
function checkIngredient(r, word) {
    let check = false;
    r.ingredients.forEach(({ ingredient }) => {
        if (ingredient.replace(/\s+/g, '').toLowerCase().includes(word)) {
            check = true;
        }
    });
    return check;
}

// A function that check ingredients of a recipe
function checkUstensil(r, word) {
    let check = false;
    r.ustensils.forEach((ustensil) => {
        if (ustensil.replace(/\s+/g, '').toLowerCase().includes(word)) {
            check = true;
        }
    });
    return check;
}

function generateTrigrams(text) {
    const trigrams = new Set();
    const input = text.toLowerCase();

    for (let i = 0; i < input.length - 2; i++) {
        trigrams.add(input.substr(i, 3));
    }

    return trigrams;
}
function buildSuffixTrie(recipes) {
    const trie = new Trie();

    for (const recipe of recipes) {
        const name = recipe.name.toLowerCase();
        for (let i = 0; i < name.length; i++) {
            trie.insert(name.slice(i));
        }
    }

    return trie;
}

// V2) A function that filter by word in searchbar
// function filterBySearching(data, query) {
//     const queryTrigrams = generateTrigrams(query);
//     const threshold = 0.2;

//     return data.filter(item => {
//         const itemTrigrams = generateTrigrams(item.name);
//         const intersection = new Set([...itemTrigrams].filter(x => queryTrigrams.has(x)));
//         const similarity = intersection.size / (itemTrigrams.size + queryTrigrams.size - intersection.size);

//         return similarity >= threshold;
//     });
// }
// function filterBySearching(data, query) {
//     const keywords = query.toLowerCase().split(/\s+/);

//     return data.filter(item => {
//         const itemName = item.name.toLowerCase();
//         return keywords.every(keyword => itemName.includes(keyword));
//     });
// }
function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// function filterBySearching(data, query, trie) {
//     const keywords = query.toLowerCase().split(/\s+/);

//     return data.filter(item => {
//         const itemName = item.name.toLowerCase();
//         const ingredients = item.ingredients.map(i => i.ingredient.toLowerCase());
//         const ustensils = item.ustensils.map(u => u.toLowerCase());

//         return keywords.every(keyword => {
//             return trie.searchSubString(keyword) &&
//                 (itemName.includes(keyword) ||
//                     ingredients.some(ingredient => ingredient.includes(keyword)) ||
//                     ustensils.some(ustensil => ustensil.includes(keyword)));
//         });
//     });
// }
function filterBySearching(data, query) {
    const keywords = query.toLowerCase().split(/\s+/);
    const maxDistance = 3;

    return data.filter(item => {
        const itemName = item.name.toLowerCase();
        const ingredients = item.ingredients.map(i => i.ingredient.toLowerCase());
        const ustensils = item.ustensils.map(u => u.toLowerCase());

        return keywords.every(keyword => {
            return (
                levenshteinDistance(itemName, keyword) <= maxDistance ||
                ingredients.some(
                    ingredient => levenshteinDistance(ingredient, keyword) <= maxDistance
                ) ||
                ustensils.some(
                    ustensil => levenshteinDistance(ustensil, keyword) <= maxDistance
                )
            );
        });
    });
}

// A function tha filter by tags of a recipes
function filterByTag(recipes) {
    const tagselected = document.querySelectorAll('.tag-selected');
    let filteredrecipes = recipes;

    tagselected.forEach((tag) => {
        const word = tag.innerText.replace(/\s+/g, '').toLowerCase();
        filteredrecipes = filteredrecipes.filter(
            (r) => checkIngredient(r, word) || checkUstensil(r, word) || r.appliance.replace(/\s+/g, '').toLowerCase().includes(word),
        );
    });
    return filteredrecipes;
}

export { filterBySearching, filterByTag, buildSuffixTrie };