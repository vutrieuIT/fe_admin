interface User {
  id: number;
  name: string;
  avatar: string;
  role: string;
  status: string;
  phone: string;
  address: string;
  addressCode: Array<string>;
}

export default User;
