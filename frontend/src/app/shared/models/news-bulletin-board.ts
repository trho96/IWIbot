export interface NewsBulletinBoard {
  content: string;
  courseOfStudies: string[];
  deleteOnExpiration: boolean;
  emailOwner: string;
  id: number;
  idOwner: number;
  links: string;
  nameOwner: string;
  publicationDate: string;
  publicationTimestamp: string;
  subTitle: string;
  title: string;
  type: string;
}
