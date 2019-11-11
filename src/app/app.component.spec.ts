import { AppComponent } from './app.component';

describe('AppComponent', () => {

  it('should create the app', () => {
    const app = new AppComponent();
    expect(app).toBeTruthy();
  });

  it('should run', () => {
    let i = 0;
    let count = 0;
    const values = [0];
    for (let j = 0; j < 20000; j++) {
      count++;
      i = (i + 55) % 360;
      values.push(i);
      if (i === 0) {
        break;
      }
    }
    console.log('hello', values.length, values);
    expect(true).toBeTruthy();
  });
});
