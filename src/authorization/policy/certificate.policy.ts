import { BasePolicy } from './base.policy';

export class CertificatePolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Certificate";
  }
}
