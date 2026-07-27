export interface CommandItem {
  id: string;
  category:
    | 'Navigation'
    | 'AI & Copilot'
    | 'Simulation'
    | 'Workspace'
    | 'Themes'
    | 'Dashboards';
  title: string;
  description?: string;
  iconName: string;
  shortcut?: string;
  action: () => void;
}

export class CommandRegistry {
  private static commands: CommandItem[] = [];

  public static register(command: CommandItem): void {
    this.commands = this.commands.filter((c) => c.id !== command.id);
    this.commands.push(command);
  }

  public static getAll(): CommandItem[] {
    return this.commands;
  }

  public static search(query: string): CommandItem[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.commands;
    return this.commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }
}
