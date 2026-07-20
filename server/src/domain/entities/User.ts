import { UserProps } from "../types/UserType";

export class User {
  constructor(private readonly props: UserProps) { }

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get name() {
    return this.props.name;
  }

  get avatar() {
    return this.props.avatar;
  }

  get googleId() {
    return this.props.googleId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
