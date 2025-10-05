import { DialogueGraph, DialogueNode, DialogueOption } from './types.ts';

class DialogueParser {
  static parse(rawText: string): DialogueGraph {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    const dialogueGraph: DialogueGraph = {};
    let currentNode: DialogueNode | null = null;

    for (const line of lines) {
      // Nowy węzeł (::id)
      if (line.startsWith('::')) {
        const id = line.substring(2).trim();
        currentNode = { id, text: [], options: [] };
        dialogueGraph[id] = currentNode;
        continue;
      }

      // Opcja dialogowa (* [tekst] { ... } -> target)
      if (line.startsWith('*')) {
        if (!currentNode) throw new Error('Option defined outside of a node.');

        // 1. Tekst opcji
        const baseMatch = line.match(/^\*\s*\[(.+?)\]/);
        const text = baseMatch ? baseMatch[1].trim() : '';

        // 2. Wszystkie bloki { ... }
        const metaBlocks = Array.from(line.matchAll(/\{([^{}]+)\}/g)).map((m) =>
          m[1].trim()
        );

        // 3. Cel (target) po "->" (opcjonalny)
        const targetMatch = line.match(/->\s*(\S+)/);
        const target = targetMatch ? targetMatch[1].trim() : undefined;

        // 4. Parsujemy wszystkie metadane z każdego bloku
        const meta: Record<string, string> = {};
        for (const block of metaBlocks) {
          Object.assign(meta, this.parseMeta(block));
        }

        // 5. Tworzymy obiekt opcji
        const option: DialogueOption = {
          text,
          target,
          conditions: meta.if ? { condition: meta.if } : undefined,
          action: meta.action,
        };

        currentNode.options.push(option);
        continue;
      }

      // Komenda w treści węzła (rzadko używane)
      if (line.startsWith('{') && line.endsWith('}')) {
        if (!currentNode) throw new Error('Command outside of node.');
        const meta = this.parseMeta(line.slice(1, -1));
        currentNode.commands = { ...currentNode.commands, ...meta };
        continue;
      }

      // Tekst NPC
      if (currentNode) {
        currentNode.text.push(line);
      }
    }

    return dialogueGraph;
  }

  private static parseMeta(meta?: string): Record<string, string> {
    if (!meta) return {};
    const result: Record<string, string> = {};

    // Usuń nadmiarowe spacje
    meta = meta.trim();

    // Dopasuj "key: value" z dowolną ilością spacji
    const match = meta.match(/^([a-zA-Z_][\w]*)\s*:\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      result[key.trim()] = value.trim();
    } else {
      console.warn(`Niepoprawny blok meta: {${meta}}`);
    }

    return result;
  }
}

export default DialogueParser;
