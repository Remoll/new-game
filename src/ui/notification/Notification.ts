class GameNotification {
  private static singleton: GameNotification | null = null;

  private notificationContainer: HTMLElement;
  private notificationTitle: HTMLElement;
  private notificationMessage: HTMLElement;
  private notificationCloseButton: HTMLElement;

  private constructor() {
    this.notificationContainer = document.getElementById('notification')!;
    this.notificationTitle = document.getElementById('notification-title')!;
    this.notificationMessage = document.getElementById('notification-message')!;
    this.notificationCloseButton = document.getElementById(
      'notification-close-button'
    );

    if (
      !this.notificationContainer ||
      !this.notificationTitle ||
      !this.notificationMessage
    ) {
      console.error('GameNotification elements not found in DOM.');
    }

    this.notificationCloseButton.addEventListener('click', () => {
      this.closeJNotification();
    });
  }

  static getSingleton(): GameNotification {
    if (!GameNotification.singleton) {
      GameNotification.singleton = new GameNotification();
    }
    return GameNotification.singleton;
  }

  openNotification() {
    this.notificationContainer.style.display = 'block';
  }

  closeJNotification() {
    this.notificationContainer.style.display = 'none';
  }

  displayNewNotification(title: string, message: string) {
    this.notificationTitle.textContent = title;
    this.notificationMessage.textContent = message;
    this.openNotification();
  }
}

export default GameNotification;
