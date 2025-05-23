export const initializer = () => {
  let _initialized = false;

  const checkInitialized = (fn) => {
    return function(...args) { // Funzione normale per preservare "this"
      if (!_initialized) {
        console.log(`Cannot execute "${fn.name}" because not initialized`);
        return;
      }
      return fn.apply(this, args);
    };
  };

  const initialized = () => {
    _initialized = true;
  };

  return { checkInitialized, initialized };
};