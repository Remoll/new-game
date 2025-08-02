class GameEventEmitter {
  static emit(type, sender, target, value = null) {
    const evt = new CustomEvent(type, {
      detail: {
        type,
        sender,
        target,
        value,
      },
    });
    document.dispatchEvent(evt);
  }
}

export default GameEventEmitter;