import { renderHook } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
import { useMediaMatch } from "../hooks/useMediaMatch";

const { act } = TestRenderer;

type MediaQueryListListener = (
  event_: MediaQueryListEventMap["change"]
) => void;

describe("useMediaMatch", () => {
  afterEach(() => {
    delete (window as any).matchMedia;
  });

  it("should track a boolean", async () => {
    expect.hasAssertions();
    const matchMedia = jest.fn<MediaQueryList, [string]>();
    const addEventListener = jest.fn<
      void,
      [string, (event_: MediaQueryListEventMap["change"]) => void]
    >();
    const removeEventListener = jest.fn<void, [string, () => void]>();
    let listener: MediaQueryListListener | undefined;

    matchMedia.mockReturnValue({
      addEventListener,
      matches: true,
      removeEventListener,
    } as any);
    addEventListener.mockImplementationOnce((_, l) => (listener = l));

    window.matchMedia = matchMedia;

    const { rerender, result, unmount } = renderHook(
      ({ query }) => useMediaMatch(query),
      {
        initialProps: { query: "print" },
      }
    );

    // We call once for the memo initialization
    expect(matchMedia).toHaveBeenCalledTimes(1);
    expect(matchMedia.mock.calls[0][0]).toBe("print");
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
    expect(result.current).toBe(true);

    // Invoking the listener changes the value
    const l =
      expectDefined<(event_: MediaQueryListEventMap["change"]) => void>(
        listener
      );
    act(() => l({ matches: false } as any));
    expect(result.current).toBe(false);

    // Changing the query instantiates a new matchMedia and resets the match value to true
    expect(removeEventListener).not.toHaveBeenCalled();
    matchMedia.mockReturnValue({
      addEventListener,
      matches: true,
      removeEventListener,
    } as any);
    rerender({ query: "(max-width: 640px)" });
    expect(matchMedia).toHaveBeenCalledTimes(2);
    expect(matchMedia.mock.calls[1][0]).toBe("(max-width: 640px)");
    expect(result.current).toBe(true);
    // We should have also cleaned up the old event listener and bound a new one
    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledTimes(2);

    // Unmount, ensuring we unbind the listener
    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(2);
  });
});

function expectDefined<T>(t: T | undefined): T {
  expect(t).toBeDefined();

  return t as T;
}
