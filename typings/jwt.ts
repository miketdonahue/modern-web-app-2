export type JwtResponse = {
  id: string;
  role: {
    id: string;
    name: string;
    permissions: string[];
    prohibited_routes: string[];
  };
  iat: number;
  exp: number;
};
