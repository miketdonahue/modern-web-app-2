import { prisma } from '@server/prisma/generated/prisma-client';

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
      await prisma.roles();
    } catch (error) {
      return false;
    }

    return true;
  }

  public setShuttingDown(): any {
    this.isShuttingDown = true;
  }
}
