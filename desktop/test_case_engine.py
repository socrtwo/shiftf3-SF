"""Smoke tests for the case engine. Run with: python -m desktop.test_case_engine"""

from desktop import case_engine as ce


def expect(name: str, got: str, want: str) -> None:
    status = "ok" if got == want else "FAIL"
    print(f"[{status}] {name}: {got!r}")
    if got != want:
        print(f"        want: {want!r}")
        raise SystemExit(1)


def main() -> None:
    expect("invert", ce.invert("Hello World"), "hELLO wORLD")
    expect("invert idempotent twice", ce.invert(ce.invert("Hello World")), "Hello World")
    expect("lower", ce.lower("Hello World"), "hello world")
    expect("upper", ce.upper("Hello World"), "HELLO WORLD")
    expect("title", ce.title("the quick brown fox"), "The Quick Brown Fox")
    expect("title small words", ce.title("the lord of the rings"), "The Lord of the Rings")
    expect(
        "sentence",
        ce.sentence("hello world. how are you? fine!"),
        "Hello world. How are you? Fine!",
    )
    expect("sentence newline", ce.sentence("hello\nworld"), "Hello\nWorld")
    print("all good.")


if __name__ == "__main__":
    main()
