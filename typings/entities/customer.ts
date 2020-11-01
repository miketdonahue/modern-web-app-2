import { Base } from './base';

export interface Customer extends Base {
  actor_id: string;
  vendor_id: string | null;
  phone_country_code: string | null;
  phone: string | null;
  country: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
}
