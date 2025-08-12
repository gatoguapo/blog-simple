import { User } from "./user";

export interface Blog {
  'id': number,
  'user_id': number,
  'title': string,
  'description': string,
  'picture_url': string,
  'created_at': string,
  'user'?: User | null
}
