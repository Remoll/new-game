import { DialogueNode, DialogueOption } from './types.ts';

class DialogueParser {
  static parse(rawText: string): Record<string, DialogueNode> {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#')); // pomijamy komentarze

    const nodes: Record<string, DialogueNode> = {};
    let currentNode: DialogueNode | null = null;

    for (const line of lines) {
      // Nowa sekcja dialogu
      if (line.startsWith('::')) {
        const id = line.substring(2).trim();
        currentNode = { id, text: [], options: [] };
        nodes[id] = currentNode;
        continue;
      }

      // Opcja dialogowa
      if (line.startsWith('*')) {
        if (!currentNode) throw new Error('Option defined outside of a node.');

        const match = line.match(
          /^\*\s*\[(.+?)\](?:\s*\{(.+?)\})?\s*->\s*(\S+)$/
        );
        if (!match) {
          console.warn(`Niepoprawna linia opcji: ${line}`);
          continue;
        }

        const [, text, rawMeta, target] = match;

        const meta = this.parseMeta(rawMeta);
        const option: DialogueOption = {
          text: text.trim(),
          target: target.trim(),
          conditions: meta.if ? { condition: meta.if } : undefined,
          action: meta.action,
        };

        currentNode.options.push(option);
        continue;
      }

      // Komenda (np. { questStart: lost_barrel })
      if (line.startsWith('{') && line.endsWith('}')) {
        if (!currentNode) throw new Error('Command outside of node.');
        const meta = this.parseMeta(line.slice(1, -1));
        currentNode.commands = { ...currentNode.commands, ...meta };
        continue;
      }

      // Normalna linia tekstu dialogu
      if (currentNode) {
        currentNode.text.push(line);
      }
    }

    return nodes;
  }

  private static parseMeta(meta?: string): Record<string, string> {
    if (!meta) return {};
    const result: Record<string, string> = {};
    const parts = meta.split(',').map((s) => s.trim());
    for (const part of parts) {
      const [key, value] = part.split(':').map((x) => x.trim());
      if (key && value) result[key] = value;
    }
    return result;
  }
}

export default DialogueParser;
