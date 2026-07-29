export interface DemoTeam {
  id: string;
  name: string;
  leadName: string;
  memberCount: number;
}

export class TeamFactory {
  public static getTeamsForOrg(orgId: string): DemoTeam[] {
    return [
      {
        id: `${orgId}-team-core`,
        name: 'Core Engine Team',
        leadName: 'Sarah Chen',
        memberCount: 14,
      },
      {
        id: `${orgId}-team-infra`,
        name: 'Infrastructure & SRE',
        leadName: 'Alex Rivera',
        memberCount: 9,
      },
      {
        id: `${orgId}-team-ai`,
        name: 'AI & Data Intelligence',
        leadName: 'Elena Rostova',
        memberCount: 12,
      },
    ];
  }
}
