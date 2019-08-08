import React, { withGlobal } from 'reactn';
import { Button } from '@material-ui/core'
// A button that displays the value and, when clicked, increments it.
function MyComponent(props) {
  return (
    <>
      My value is{' '}
      <Button
        href='#'
        onClick={props.incrementValue}
      >{props.value}
      </Button>
    </>
  );
}

export default withGlobal(

  // Set the `value` prop equal to the global state's `value` property.
  global => ({
    value: global.n
  }),
  // Important Note: This is not the setGlobal helper function.
  // Set the `incrementValue` prop to a function that increments the global
  //   state's `n` property.
  fun => ({
    incrementValue: () => {
      // Important Note: This is not the fun helper function.
      // This is the parameter referenced 4 lines up.
      fun(g => ({
        n: g.n + 1
      }));
    }
  })
)(MyComponent);