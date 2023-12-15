import { BasePolicy } from './base.policy';

export class MediaPolicy extends BasePolicy {
  protected setup(): void {
    this.model = 'Media';
  }
  upload() {
    return this.authorize('create', 'Media');
  }
  streamTmpFile() {
    return this.authorize('read', 'Media');
  }
  renameMedia() {
    return this.authorize('update', 'Media');
  }
}
