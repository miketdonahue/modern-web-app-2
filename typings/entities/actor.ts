import { Base } from './base';

export interface Actor extends Base {
  role_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  password: string | null;
}
