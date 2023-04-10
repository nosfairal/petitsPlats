class Trie {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }

    insert(word) {
        let node = this;

        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new Trie();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    searchSubString(subString) {
        let node = this;

        for (const char of subString) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }

        return node.isEndOfWord;
    }
}
export { Trie };