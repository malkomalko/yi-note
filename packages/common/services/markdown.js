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
    const title = meta.title.replaceAll(/[^a-zA-Z0-9-_. ]/g, '').trim()
    let data = `---
type: video
tags: video-notes
title: ${title}
createdOn: ${date}
updatedOn: ${date}
---

## Notes
\`\`\`timestamp-url
${meta.url}
\`\`\`
---
`
    for (let note of notes) {
      data += `\`\`\`timestamp
${secondsToTime(note.timestamp)}
\`\`\`
`
      data += note.content + '\n';
    }

    return data;
  }
}

export default Markdown;
