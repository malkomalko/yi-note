import marked from 'marked';
import { secondsToTime, buildAutoSeekUrl } from '../utils';
import { INSTALLATION_URL } from '../constants';

class Markdown {
  static toText(markdownContent) {
    const div = document.createElement('div');
    div.innerHTML = marked(markdownContent);
    return div.innerText;
  }

  static toHTML(markdownContent) {
    return marked(markdownContent);
  }

  static pagesToMarkdown(pages) {
    const { meta, notes } = pages[0];
    const date = new Date().toISOString().split('T')[0];
    const topics = (meta.keywords || [])
      .map(keyword => keyword.replaceAll(/[^a-zA-Z0-9-_. ]/g, '').trim())
    const title = meta.title.replaceAll(/[^a-zA-Z0-9-_. ]/g, '').trim();
    let data = `---
type: video
tags: video-notes
title: ${title}
createdOn: ${date}
updatedOn: ${date}
---

## Summary
`
    if (meta.image?.length) {
      data += `\n![](${meta.image})\n\n`;
    }
    if (meta.description?.length) {
      data += meta.description.trim() + '\n\n';
    }
    data += `\`\`\`timestamp-url
${meta.url}
\`\`\`

## Notes

`
    for (let note of notes) {
      data += `### ${secondsToTime(note.timestamp)}\n`
      data += `<img src="${note.image}"/>\n`
      data += `\`\`\`timestamp
${secondsToTime(note.timestamp)}
\`\`\`
`
      data += note.content + '\n\n';
    }

    if (topics && topics.length) {
      data += '---\n\n## Topics\n'
      topics.forEach(topic => {
        data += `- ${topic}\n`
      })
    }

    return data;
  }
}

export default Markdown;
