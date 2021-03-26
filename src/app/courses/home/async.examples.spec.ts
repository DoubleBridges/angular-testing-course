import {fakeAsync, flush, flushMicrotasks, tick} from '@angular/core/testing';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

describe('Asynchronous Testing Examples', () => {
  it('Asynchronous test example with jasmine.done()', (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      console.log('running async example test');
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it('ASync test example - setTimeout()', fakeAsync(() => {
    let test = false;
    setTimeout(() => {
      console.log('fakeAsync timeout');
      test = true;
    }, 500);

    flush();
    expect(test).toBeTruthy();
  }));

  it('Async test example - plain Promise', fakeAsync(() => {
    let test = false;
    console.log('Creating Promise');
    Promise.resolve().then(() => {
      console.log('First Promise resolved');
      return Promise.resolve();
    })
      .then(() => {
        console.log('Second Promise resolved');
        test = true;
      });

    flushMicrotasks();
    console.log('running promise assertions');
    expect(test).toBeTruthy();

  }));

  it('Mixed async test example', fakeAsync(() => {
    let counter = 0;

    Promise.resolve()
      .then(() => {
        counter += 10;
        setTimeout(() => {
          counter += 1;
        }, 100);
      });
    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    flush();
    expect(counter).toBe(11);
  }));

  it('Async test - Observable', fakeAsync(() => {
    let test = false;
    console.log('Creating Observable');
    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => {
      test = true;
    });
    console.log('Running assertions');
    tick(1000);
    expect(test).toBeTruthy();
  }));
});
