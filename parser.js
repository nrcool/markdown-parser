export default function parseMarkdown(markdown) {
  // Convert headers
  markdown = markdown
    .replace(/^######\s(.*)$/gm, "<h6>$1</h6>") // Header level 6
    .replace(/^#####\s(.*)$/gm, "<h5>$1</h5>") // Header level 5
    .replace(/^####\s(.*)$/gm, "<h4>$1</h4>") // Header level 4
    .replace(/^###\s(.*)$/gm, "<h3>$1</h3>") // Header level 3
    .replace(/^##\s(.*)$/gm, "<h2>$1</h2>") // Header level 2
    .replace(/^#\s(.*)$/gm, "<h1>$1</h1>"); // Header level 1

  // Convert bold, italic, and combined
  markdown = markdown
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>") // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italic

  // Convert blockquotes
  markdown = markdown.replace(/^>\s(.*)$/gm, "<blockquote>$1</blockquote>");

  // Convert unordered lists
  markdown = markdown
    .replace(/^\s*-\s(.*)$/gm, "<ul><li>$1</li></ul>")
    .replace(/<\/ul>\s*<ul>/g, ""); // Merge consecutive <ul> tags

  // Convert ordered lists
  markdown = markdown
    .replace(/^\s*\d+\.\s(.*)$/gm, "<ol><li>$1</li></ol>")
    .replace(/<\/ol>\s*<ol>/g, ""); // Merge consecutive <ol> tags

  // Convert inline code
  markdown = markdown.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Convert fenced code blocks
  markdown = markdown.replace(
    /```([\s\S]*?)```/g,
    "<pre><code>$1</code></pre>"
  );

  // Convert links
  markdown = markdown.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Convert images
  markdown = markdown.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1">'
  );

  // Convert tables
  markdown = markdown.replace(
    /^\|(.+)\|\n\|(?:-+\|)+\n((?:\|.*\|\n)+)/gm,
    (match, headerRow, bodyRows) => {
      const headers = headerRow
        .split("|")
        .map((h) => `<th>${h.trim()}</th>`)
        .join("");
      const rows = bodyRows
        .trim()
        .split("\n")
        .map(
          (row) =>
            "<tr>" +
            row
              .split("|")
              .map((cell) => `<td>${cell.trim()}</td>`)
              .join("") +
            "</tr>"
        )
        .join("");
      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  );

  // Convert horizontal rules
  markdown = markdown.replace(/^---$/gm, "<hr>");

  // Convert line breaks
  markdown = markdown.replace(/\n/g, "<br>");

  return markdown;
}
