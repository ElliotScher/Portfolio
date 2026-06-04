import showdown from "showdown";

const mathExtension = () => {
    let mathBlocks: string[] = [];
    return [
        {
            type: 'lang',
            filter: (text: string) => {
                mathBlocks = [];
                // Find and extract display math $$...$$ or ¨D¨D...¨D¨D
                text = text.replace(/(?:\$\$|¨D¨D)([\s\S]+?)(?:\$\$|¨D¨D)/g, (_, math) => {
                    const placeholder = `<!--MATHBLOCK_${mathBlocks.length}-->`;
                    mathBlocks.push(`$$${math}$$`);
                    return placeholder;
                });
                // Find and extract inline math $...$ or ¨D...¨D
                text = text.replace(/(?:\$|¨D)([^\$\n¨D]+?)(?:\$|¨D)/g, (_, math) => {
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
                    text = text.replace(`<!--MATHBLOCK_${i}-->`, () => mathBlocks[i]);
                }
                return text;
            }
        }
    ];
};

const cleanDetailsExtension = () => {
    return [
        {
            type: 'output',
            filter: (text: string) => {
                // 1. Remove <p> wrapping around <details>
                text = text.replace(/<p><details([^>]*)>(?:\s|<br\s*\/?>)*/gi, '<details$1>');
                
                // 2. Clean up any </p> immediately following </summary>
                text = text.replace(/(<summary>[\s\S]*?<\/summary>)(?:\s|<br\s*\/?>)*<\/p>/gi, '$1');
                
                // 3. Clean up any <p> immediately preceding </details>
                text = text.replace(/<p>(?:\s|<br\s*\/?>)*<\/details>/gi, '</details>');
                
                // 4. Wrap content in a div
                text = text.replace(/(<details[^>]*>)(\s*<summary>[\s\S]*?<\/summary>)([\s\S]*?)(<\/details>)/gi, (match, openTag, summaryTag, content, closeTag) => {
                    if (content.includes('class="details-content"')) {
                        return match;
                    }
                    return `${openTag}${summaryTag}<div class="details-content">${content}</div>${closeTag}`;
                });
                
                // 5. Remove </details></p>
                text = text.replace(/<\/details><\/p>/gi, '</details>');
                
                return text;
            }
        }
    ];
};

export const markdownConverter = new showdown.Converter({
    ghCompatibleHeaderId: true,
    simpleLineBreaks: true,
    tables: true,
    extensions: [mathExtension, cleanDetailsExtension]
});

