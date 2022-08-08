import React from "react";
import { render, getByTestId, fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import TestRenderer from "react-test-renderer";
import { useCounter } from "../hooks/useCounter";
import { useDocumentEventListener } from "../hooks/useDocumentEventListener";

const { act } = TestRenderer;

describe("useDocumentEventListener", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useDocumentEventListener).toBeDefined();
  });
  it("should return a undefined", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useDocumentEventListener("click", () => {
        console.log("clicked");
      })
    );

    expect(typeof result.current).toBe("undefined");
  });
});

describe("useDocumentEventListener jsx", () => {
  let mockCallback = () => {};
  let TestJSX = () => null;
  beforeEach(() => {
    mockCallback = jest.fn(() => {});
    TestJSX = () => {
      useDocumentEventListener("click", mockCallback);

      return null;
    };
  });

  it("should not call callback by default", () => {
    expect.hasAssertions();
    render(<TestJSX />);
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });

  it("should not call callback when event fires", () => {
    expect.hasAssertions();
    render(<TestJSX />);
    act(() => {
      fireEvent.click(document);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    act(() => {
      fireEvent.click(document);
      fireEvent.click(document);
      fireEvent.click(document);
    });
    expect(mockCallback).toHaveBeenCalledTimes(4);
  });
});

describe("useDocumentEventListener state variables", () => {
  let TestJSX = () => <div />;
  beforeEach(() => {
    TestJSX = () => {
      const { increment, value } = useCounter(0);
      useDocumentEventListener("click", increment);

      return <div data-testid="value">{value}</div>;
    };
  });

  it("should not call callback by default", () => {
    expect.hasAssertions();
    const { container } = render(<TestJSX />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(Number.parseInt(valueElement.innerHTML)).toBe(0);
  });

  it("should not call callback when event fires", () => {
    expect.hasAssertions();
    const { container } = render(<TestJSX />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(Number.parseInt(valueElement.innerHTML)).toBe(0);
    act(() => {
      fireEvent.click(document);
      fireEvent.click(document);
      fireEvent.click(document);
    });
    expect(Number.parseInt(valueElement.innerHTML)).toBe(3);
  });
});
