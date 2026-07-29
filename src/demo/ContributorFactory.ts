export interface DemoContributor {
  id: string;
  name: string;
  avatarUrl: string;
  commitsCount: number;
}

export class ContributorFactory {
  public static getContributors(): DemoContributor[] {
    return [
      {
        id: 'c1',
        name: 'Sarah Chen',
        avatarUrl: '/avatars/sarah.png',
        commitsCount: 340,
      },
      {
        id: 'c2',
        name: 'Alex Rivera',
        avatarUrl: '/avatars/alex.png',
        commitsCount: 280,
      },
      {
        id: 'c3',
        name: 'Elena Rostova',
        avatarUrl: '/avatars/elena.png',
        commitsCount: 195,
      },
    ];
  }
}
