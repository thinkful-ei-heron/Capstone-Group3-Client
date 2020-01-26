import { useState } from 'react';

// ended up doing some googling
// learned about using functional components and hooks
// looks very confusing at first, but it makes
// a lot more sense to me once I got it all layed out
export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value);
      },
    },
  };
};
