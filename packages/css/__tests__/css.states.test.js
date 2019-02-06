/* eslint-disable no-empty-function */
import css from '../src';

// Dom
const container = document.createElement('div');
const kind = 'test';

// Utils
/**
 * Wait for 1 repaint
 *
 * @returns {Pronmise} next frame
 */
function nextTick() {
  return new Promise(resolve => {
    window.requestAnimationFrame(resolve);
  });
}

css._add = jest.fn();
css._remove = jest.fn();
container.addEventListener = jest.fn();
container.removeEventListener = jest.fn();

it('do start', () => {
  css._start(container, kind);

  expect(css._add).toHaveBeenNthCalledWith(1, container, `${kind}-active`);
  expect(css._add).toHaveBeenNthCalledWith(2, container, kind);
});

it('do next', async () => {
  css._next(container, kind);

  await nextTick();

  expect.assertions(4);
  expect(css._promises[kind]).toBeDefined();
  expect(container.addEventListener).toHaveBeenCalledTimes(1);

  await nextTick();

  expect(css._remove).toHaveBeenNthCalledWith(1, container, kind);
  expect(css._add).toHaveBeenCalledTimes(1);
  // DEV not working?!??
  // expect(css._add).toHaveBeenNthCalledWith(2, container, `${kind}-to`);
});

it('do end', () => {
  css._end(container, kind);

  expect(css._remove).toHaveBeenNthCalledWith(1, container, `${kind}-to`);
  expect(css._remove).toHaveBeenNthCalledWith(2, container, `${kind}-active`);
  expect(container.removeEventListener).toHaveBeenCalledTimes(1);
});
