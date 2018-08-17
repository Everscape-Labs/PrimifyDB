class Timer {

  constructor(start=true) {
    if (start) {
      this.start();
    }
  }

  start() {
    this.date_start = new Date();
  }

  end() {
    this.date_end = new Date();
    this.duration = this.date_end - this.date_start;
  }

  format() {
    return `${this.duration} ms`;
  }
}

export default Timer;