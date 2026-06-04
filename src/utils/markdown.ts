import showdown from "showdown";

const mathExtension = () => {
    let mathBlocks: string[] = [];
    return [
        {
            type: 'lang',
            filter: (text: string) => {
                mathBlocks = [];
                // Find and extract display math $$...$$
                text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
                    const placeholder = `<!--MATHBLOCK_${mathBlocks.length}-->`;
                    mathBlocks.push(`$$${math}$$`);
                    return placeholder;
                });
                // Find and extract inline math $...$
                text = text.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
                    const placeholder = `<!--MATHBLOCK_${mathBlocks.length}-->`;
                    mathBlocks.push(`$${math}$`);
                    return placeholder;
                });
                return text;
            }
        },
        {
            type: 'output',
            filter: (text: string) => {
                // Restore math blocks in the HTML output
                for (let i = 0; i < mathBlocks.length; i++) {
                    text = text.replace(`<!--MATHBLOCK_${i}-->`, mathBlocks[i]);
                }
                return text;
            }
        }
    ];
};

export const markdownConverter = new showdown.Converter({
    ghCompatibleHeaderId: true,
    simpleLineBreaks: true,
    extensions: [mathExtension]
});
