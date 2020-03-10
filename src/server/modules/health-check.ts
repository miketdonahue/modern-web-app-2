/**
 * A class of health check methods
 *
 * @param isShuttingDown - A boolean to determine if server is in shutdown mode
 * @param setShuttingDown - A to switch state of shutdown to true
 * @param isReady - A method to check if application is ready; returns boolean
 * @returns Class
 */
export class HealthCheck {
  private isShuttingDown: boolean;

  public constructor() {
    this.isShuttingDown = false;
  }

  public async isReady(): Promise<any> {
    if (this.isShuttingDown) {
      return false;
    }

    try {
      // FIXME: here
      // await prisma.roles();
    } catch (error) {
      return false;
    }

    return true;
  }

  public setShuttingDown(): any {
    this.isShuttingDown = true;
  }
}
