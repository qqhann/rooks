/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  act,
  getByTestId,
} from "@testing-library/react";

import { useKeyBindings } from "../hooks/useKeyBindings";

describe("useKeyBindings", () => {
  let App = () => <div />;
  beforeEach(() => {
    App = () => {
      const inputRef = React.useRef(null);
      const [value, setValue] = React.useState(0);
      useKeyBindings({
        // eslint-disable-next-line id-length
        s: () => {
          setValue(value + 1);
        },
      });
      useKeyBindings(
        {
          // eslint-disable-next-line id-length
          r: () => {
            setValue(value + 1);
          },
          // eslint-disable-next-line id-length
          v: () => {
            setValue(value + 1);
          },
        },
        {
          target: inputRef,
        }
      );

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <div className="grid-container">
            <input
              className="box1"
              data-testid="input"
              ref={inputRef}
              tabIndex={1}
            />
          </div>
        </div>
      );
    };
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useKeyBindings).toBeDefined();
  });

  it("should trigger the calback when pressed on document or target", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    const inputElement = getByTestId(container as HTMLElement, "input");
    act(() => {
      fireEvent.keyDown(window, { charCode: 83, code: "keyS", key: "s" });
    });
    expect(valueElement.innerHTML).toBe("1");
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: "keyR", key: "r" });
    });
    expect(valueElement.innerHTML).toBe("2");
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 86, code: "keyV", key: "v" });
    });
    expect(valueElement.innerHTML).toBe("3");
  });
});
