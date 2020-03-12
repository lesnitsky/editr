const page = document.querySelector('#page');
const code = document.querySelector('code');

document.designMode = 'on';

function nextHeading(tagName: String): keyof HTMLElementTagNameMap {
  if (tagName == 'h1') return 'h2';
  if (tagName == 'h2') return 'h3';
  if (tagName == 'h3') return 'h4';
  if (tagName == 'h4') return 'h5';
  if (tagName == 'h5') return 'h6';
  return 'h1';
}

function resolveTagName(key: String, currentTagName: String): keyof HTMLElementTagNameMap {
  switch (key) {
    case 'h':
      return nextHeading(currentTagName);

    case 'p':
      return 'p';

    case 'u':
      return 'ul';

    case 'o':
      return 'ol';

    case 'd':
      return 'div';
  }

  return 'div';
}

var prevAnchorNode: Node;

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && e.key.length == 1) {
    e.preventDefault();
    e.stopPropagation();
    const selection = window.getSelection();
    let anchorNode = selection.anchorNode;

    if (anchorNode instanceof HTMLElement && (selection.anchorNode as HTMLElement).id == 'page') {
      anchorNode = prevAnchorNode;
    } else {
      prevAnchorNode = anchorNode;
    }

    if (selection == null) return;

    if (anchorNode.nodeName == '#text') {
      const tagName = resolveTagName(e.key, anchorNode.parentElement.tagName.toLowerCase());
      const parent = document.createElement(tagName);
      let contentContainer: HTMLElement;

      if (tagName == 'ul' || tagName == 'ol') {
        contentContainer = document.createElement('li');
        parent.appendChild(contentContainer);
      } else {
        contentContainer = parent;
      }

      if (anchorNode.parentElement.id == 'page') {
        page.insertBefore(parent, anchorNode);
        contentContainer.appendChild(anchorNode);
      } else {
        const prevParent = anchorNode.parentElement;
        page.insertBefore(parent, anchorNode.parentElement);
        contentContainer.appendChild(anchorNode);
        prevParent.remove();
      }
    }
  }

  if (!e.shiftKey && e.keyCode == 13) {
    setTimeout(() => {
      const prevNode = window.getSelection().anchorNode.previousSibling;
      if (
        prevNode instanceof HTMLElement &&
        prevNode.childNodes.length == 1 &&
        prevNode.childNodes[0] instanceof HTMLElement &&
        (prevNode.childNodes[0] as HTMLElement).tagName.toLowerCase() == 'br'
      ) {
        const br = prevNode.childNodes[0];
        prevNode.parentNode.insertBefore(br, prevNode);
        prevNode.remove();
      }
    }, 0);
  }
});

document.addEventListener('input', () => {
  let string = '';
  let level = 0;

  function render(node: Element) {
    string += `${' '.repeat(level * 4)}<${node.tagName.toLowerCase()}${node.id != '' ? ` id="${node.id}"` : ''}>\n`;

    if (node.childNodes.length > 0) {
      level++;
      Array.from(node.childNodes).forEach((node) => {
        if (node instanceof HTMLElement) {
          render(node);
        } else {
          string += `${' '.repeat(level * 4)}${node.textContent}\n`;
        }
      });
      level--;
      string += `${' '.repeat(level * 4)}</${node.tagName.toLowerCase()}>\n`;
    } else {
      string = string.substring(0, string.length - node.tagName.length - 3);
      string += `</${node.tagName.toLowerCase()}>\n`;
    }
  }

  render(page);

  code.textContent = string;
});
