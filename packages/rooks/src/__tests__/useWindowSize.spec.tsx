/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { useWindowSize } from "../hooks/useWindowSize";

describe("useWindowSize", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useWindowSize).toBeDefined();
  });

  describe("basic", () => {
    it("should have an initial value on first render", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWindowSize());
      expect(result.current.innerHeight).not.toBeNull();
    });
  });
});
