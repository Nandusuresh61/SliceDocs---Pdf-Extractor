import { DocumentProps } from "../types/DocumentType";

export class Document {
  constructor(private readonly props: DocumentProps) {}

  get id() {
    return this.props.id;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get originalName() {
    return this.props.originalName;
  }

  get storageId() {
    return this.props.storageId;
  }

  get url() {
    return this.props.url;
  }

  get pageCount() {
    return this.props.pageCount;
  }

  get size() {
    return this.props.size;
  }

  get type() {
    return this.props.type;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}